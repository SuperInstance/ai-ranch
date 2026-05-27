"""Tests for ai_ranch — comprehensive test suite."""

import pytest

from ai_ranch import Brand, Herd, Pasture, Ranch, RanchAgent
from ai_ranch.agent import _now


# ------------------------------------------------------------------
# RanchAgent tests
# ------------------------------------------------------------------


class TestRanchAgent:
    def test_defaults(self):
        a = RanchAgent(name="bessie")
        assert a.name == "bessie"
        assert a.species == "cattle"
        assert a.fitness == 0.5
        assert a.generation == 0
        assert a.parent_ids == []
        assert a.is_founder()

    def test_trait_access(self):
        a = RanchAgent(name="x", traits={"speed": 0.8, "patience": 0.3})
        assert a.trait("speed") == 0.8
        assert a.trait("patience") == 0.3
        assert a.trait("unknown") == 0.5
        assert a.trait("unknown", default=0.9) == 0.9

    def test_trait_clamped(self):
        a = RanchAgent(name="x", traits={"speed": 1.5, "patience": -0.3})
        assert a.trait("speed") == 1.0
        assert a.trait("patience") == 0.0

    def test_update_fitness(self):
        a = RanchAgent(name="x")
        a.update_fitness(0.9)
        assert a.fitness == 0.9
        a.update_fitness(-0.1)
        assert a.fitness == 0.0
        a.update_fitness(2.0)
        assert a.fitness == 1.0

    def test_is_founder(self):
        f = RanchAgent(name="f")
        assert f.is_founder()
        c = RanchAgent(name="c", generation=1, parent_ids=["a", "b"])
        assert not c.is_founder()

    def test_unique_ids(self):
        ids = {RanchAgent(name="x").id for _ in range(100)}
        assert len(ids) == 100


# ------------------------------------------------------------------
# Brand tests
# ------------------------------------------------------------------


class TestBrand:
    def test_basic(self):
        b = Brand(sigil="⚡", color="#ff0", tags=["fast"])
        assert b.sigil == "⚡"
        assert b.color == "#ff0"
        assert "fast" in b.tags

    def test_matches_sigil(self):
        b = Brand(sigil="⚡")
        assert b.matches(sigil="⚡")
        assert not b.matches(sigil="🔥")

    def test_matches_tags(self):
        b = Brand(sigil="⚡", tags=["fast", "alpha"])
        assert b.matches(tags="fast")
        assert b.matches(tags="alpha")
        assert not b.matches(tags="slow")

    def test_matches_color(self):
        b = Brand(sigil="x", color="red")
        assert b.matches(color="red")
        assert not b.matches(color="blue")

    def test_matches_metadata(self):
        b = Brand(sigil="x", metadata={"team": "a"})
        assert b.matches(team="a")
        assert not b.matches(team="b")

    def test_matches_combined(self):
        b = Brand(sigil="⚡", tags=["fast"], color="#ff0")
        assert b.matches(sigil="⚡", tags="fast")
        assert not b.matches(sigil="⚡", tags="slow")


# ------------------------------------------------------------------
# Herd tests
# ------------------------------------------------------------------


class TestHerd:
    def _make_agent(self, name: str, fitness: float = 0.5, species: str = "cattle") -> RanchAgent:
        return RanchAgent(name=name, fitness=fitness, species=species)

    def test_add_and_get(self):
        h = Herd()
        a = self._make_agent("a")
        h.add(a)
        assert h.size == 1
        assert h.get(a.id) is a
        assert h.get("nonexistent") is None

    def test_remove(self):
        h = Herd()
        a = self._make_agent("a")
        h.add(a)
        removed = h.remove(a.id)
        assert removed is a
        assert h.size == 0
        assert h.remove("nonexistent") is None

    def test_by_species(self):
        h = Herd()
        h.add(self._make_agent("a", species="cattle"))
        h.add(self._make_agent("b", species="duck"))
        h.add(self._make_agent("c", species="cattle"))
        cattle = h.by_species("cattle")
        assert len(cattle) == 2

    def test_by_fitness(self):
        h = Herd()
        h.add(self._make_agent("a", fitness=0.9))
        h.add(self._make_agent("b", fitness=0.2))
        h.add(self._make_agent("c", fitness=0.5))
        strong = h.by_fitness(minimum=0.5)
        assert len(strong) == 2

    def test_by_tag(self):
        h = Herd()
        brand = Brand(sigil="x", tags=["alpha"])
        h.add(RanchAgent(name="a", brand=brand))
        h.add(RanchAgent(name="b"))
        assert len(h.by_tag("alpha")) == 1
        assert len(h.by_tag("beta")) == 0

    def test_species_counts(self):
        h = Herd()
        h.add(self._make_agent("a", species="cattle"))
        h.add(self._make_agent("b", species="cattle"))
        h.add(self._make_agent("c", species="duck"))
        counts = h.species_counts()
        assert counts == {"cattle": 2, "duck": 1}

    def test_cull(self):
        h = Herd()
        h.add(self._make_agent("a", fitness=0.9))
        h.add(self._make_agent("b", fitness=0.2))
        h.add(self._make_agent("c", fitness=0.1))
        culled = h.cull(threshold=0.3)
        assert len(culled) == 2
        assert h.size == 1
        assert h.agents[0].name == "a"

    def test_top(self):
        h = Herd()
        for i in range(5):
            h.add(self._make_agent(f"a{i}", fitness=i / 10))
        top2 = h.top(2)
        assert len(top2) == 2
        assert top2[0].fitness >= top2[1].fitness

    def test_select_breeding_pair(self):
        h = Herd()
        for i in range(5):
            h.add(self._make_agent(f"a{i}", fitness=0.5 + i * 0.1))
        p1, p2 = h.select_breeding_pair()
        assert p1.id != p2.id

    def test_select_breeding_pair_too_few(self):
        h = Herd()
        h.add(self._make_agent("a"))
        with pytest.raises(ValueError):
            h.select_breeding_pair()

    def test_breed(self):
        h = Herd()
        p1 = RanchAgent(name="dad", traits={"speed": 0.8, "patience": 0.2}, capabilities=["a", "b"])
        p2 = RanchAgent(name="mom", traits={"speed": 0.4, "patience": 0.9}, capabilities=["b", "c"])
        child = h.breed(p1, p2, mutation_rate=0.0)  # deterministic without mutation
        assert child.generation == 1
        assert len(child.parent_ids) == 2
        assert set(child.capabilities) == {"a", "b", "c"}
        # Averaged traits
        assert abs(child.traits["speed"] - 0.6) < 0.01
        assert abs(child.traits["patience"] - 0.55) < 0.01

    def test_breed_with_mutation(self):
        h = Herd()
        p1 = RanchAgent(name="dad", traits={"speed": 0.5})
        p2 = RanchAgent(name="mom", traits={"speed": 0.5})
        # With mutation, at least some children should differ (probabilistic)
        children = [h.breed(p1, p2, mutation_rate=1.0) for _ in range(20)]
        speeds = [c.traits["speed"] for c in children]
        assert max(speeds) > 0.5 or min(speeds) < 0.5  # not all identical

    def test_average_fitness(self):
        h = Herd()
        assert h.average_fitness() == 0.0
        h.add(self._make_agent("a", fitness=0.4))
        h.add(self._make_agent("b", fitness=0.8))
        assert abs(h.average_fitness() - 0.6) < 0.001

    def test_diversity_index(self):
        h = Herd()
        assert h.diversity_index() == 0.0
        h.add(self._make_agent("a", species="cattle"))
        assert h.diversity_index() == 0.0  # only 1 agent
        h.add(self._make_agent("b", species="duck"))
        assert h.diversity_index() == 0.5  # perfect 50/50

    def test_len_and_iter(self):
        h = Herd()
        h.add(self._make_agent("a"))
        h.add(self._make_agent("b"))
        assert len(h) == 2
        assert list(h) == h.agents


# ------------------------------------------------------------------
# Pasture tests
# ------------------------------------------------------------------


class TestPasture:
    def test_basic(self):
        p = Pasture(name="green", capacity=10)
        assert p.name == "green"
        assert p.capacity == 10
        assert p.occupancy == 0
        assert p.available_slots == 10

    def test_add_agent(self):
        p = Pasture(capacity=2)
        a = RanchAgent(name="a")
        assert p.add_agent(a)
        assert p.occupancy == 1
        assert not p.is_full()

    def test_full(self):
        p = Pasture(capacity=2)
        p.add_agent(RanchAgent(name="a"))
        p.add_agent(RanchAgent(name="b"))
        assert p.is_full()
        assert not p.add_agent(RanchAgent(name="c"))

    def test_remove_agent(self):
        p = Pasture(capacity=5)
        a = RanchAgent(name="a")
        p.add_agent(a)
        assert p.remove_agent(a.id)
        assert p.occupancy == 0
        assert not p.remove_agent("nonexistent")

    def test_consume_and_regen(self):
        p = Pasture(capacity=10, resource_level=1.0, regen_rate=0.1)
        for _ in range(5):
            p.add_agent(RanchAgent(name="x"))
        p.consume(0.05)  # 5 * 0.05 = 0.25 consumed
        assert abs(p.resource_level - 0.75) < 0.001
        p.regenerate()
        assert abs(p.resource_level - 0.85) < 0.001

    def test_tick(self):
        p = Pasture(capacity=10, resource_level=0.5, regen_rate=0.1)
        for _ in range(10):
            p.add_agent(RanchAgent(name="x"))
        level = p.tick(consumption=0.02)
        # consumed 10*0.02=0.2, then +0.1 regen
        assert abs(level - 0.4) < 0.001

    def test_utilization(self):
        p = Pasture(capacity=10)
        assert p.utilization() == 0.0
        p.add_agent(RanchAgent(name="a"))
        assert abs(p.utilization() - 0.1) < 0.001

    def test_stress_levels(self):
        p = Pasture(resource_level=0.9)
        assert p.stress_level() == "healthy"
        p.resource_level = 0.5
        assert p.stress_level() == "stressed"
        p.resource_level = 0.2
        assert p.stress_level() == "critical"
        p.resource_level = 0.1
        assert p.stress_level() == "depleted"

    def test_can_accept(self):
        p = Pasture(capacity=3)
        assert p.can_accept(3)
        p.add_agent(RanchAgent(name="a"))
        p.add_agent(RanchAgent(name="b"))
        assert p.can_accept(1)
        assert not p.can_accept(2)


# ------------------------------------------------------------------
# Ranch tests
# ------------------------------------------------------------------


class TestRanch:
    def test_create(self):
        r = Ranch.create("test")
        assert r.name == "test"
        assert "main" in r.pastures

    def test_add_agent(self):
        r = Ranch.create()
        a = r.add_agent("bessie", species="cattle", traits={"patience": 0.9})
        assert a.name == "bessie"
        assert r.herd.size == 1
        assert r.pastures["main"].occupancy == 1

    def test_remove_agent(self):
        r = Ranch.create()
        a = r.add_agent("bessie")
        removed = r.remove_agent(a.id)
        assert removed is a
        assert r.herd.size == 0
        assert r.pastures["main"].occupancy == 0

    def test_route_by_keyword(self):
        r = Ranch.create()
        r.add_agent("thinker", species="cattle", fitness=0.8)
        agent, species, conf = r.route("analyze this email please")
        assert species == "cattle"
        assert conf > 0

    def test_route_default_to_fittest(self):
        r = Ranch.create()
        r.add_agent("fast", species="falcon", fitness=0.95)
        agent, species, conf = r.route("something completely random with no keywords")
        assert agent is not None
        assert agent.name == "fast"

    def test_route_empty_herd(self):
        r = Ranch.create()
        agent, species, conf = r.route("gibberish xyz no keywords")
        assert agent is None
        assert conf == 0.0

    def test_evolve_culls_weak(self):
        r = Ranch.create(capacity=20)
        r.fitness_threshold = 0.3
        r.elite_count = 1  # only protect the absolute best
        r.add_agent("strong", species="cattle", fitness=0.9)
        r.add_agent("weak1", species="duck", fitness=0.1)
        r.add_agent("weak2", species="duck", fitness=0.15)
        report = r.evolve()
        assert report.culled == 2
        assert r.generation == 1

    def test_evolve_protects_elites(self):
        r = Ranch.create(capacity=20)
        r.fitness_threshold = 0.5
        r.elite_count = 2
        r.add_agent("elite1", fitness=0.4)  # below threshold but elite
        r.add_agent("elite2", fitness=0.45)  # below threshold but elite
        r.add_agent("weak", fitness=0.1)
        report = r.evolve()
        # elite1 and elite2 should survive (top 2), only 'weak' culled
        assert report.culled == 1
        assert r.herd.size >= 2

    def test_evolve_breeds_replacements(self):
        r = Ranch.create(capacity=20)
        r.fitness_threshold = 0.3
        for i in range(6):
            r.add_agent(f"agent{i}", species="cattle", fitness=0.5 + i * 0.05)
        # Add some weaklings
        r.add_agent("w1", fitness=0.1)
        r.add_agent("w2", fitness=0.15)
        report = r.evolve()
        assert report.culled == 2
        assert report.bred > 0

    def test_evolve_empty_herd(self):
        r = Ranch.create()
        report = r.evolve()
        assert report.culled == 0
        assert report.bred == 0

    def test_evolution_report_metrics(self):
        r = Ranch.create(capacity=20)
        r.add_agent("a", fitness=0.8)
        r.add_agent("b", fitness=0.2)
        r.add_agent("c", fitness=0.7)
        r.add_agent("d", fitness=0.5)
        report = r.evolve()
        assert report.avg_fitness_before > 0
        assert report.generation == 1

    def test_summary(self):
        r = Ranch.create()
        r.add_agent("a", species="cattle", fitness=0.8)
        s = r.summary()
        assert s["name"] == "ai-ranch"
        assert s["herd_size"] == 1
        assert "cattle" in s["species_counts"]

    def test_full_lifecycle(self):
        """End-to-end: create ranch, populate, evolve multiple generations."""
        r = Ranch.create("big-ranch", capacity=100)
        r.fitness_threshold = 0.25
        species_list = ["cattle", "duck", "falcon", "horse", "hog"]
        for i in range(20):
            r.add_agent(
                f"agent-{i}",
                species=species_list[i % len(species_list)],
                fitness=0.3 + (i % 7) * 0.1,
                traits={"speed": 0.5, "patience": 0.5},
                capabilities=["general"],
            )

        for gen in range(3):
            report = r.evolve()
            assert report.generation == gen + 1

        assert r.herd.size > 0
        assert r.herd.average_fitness() > 0
        assert r.generation == 3
