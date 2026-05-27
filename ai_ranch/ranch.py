"""Ranch — top-level orchestrator managing herd, pastures, and evolution."""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Any, ClassVar

from ai_ranch.agent import RanchAgent
from ai_ranch.brand import Brand
from ai_ranch.herd import Herd
from ai_ranch.pasture import Pasture


@dataclass
class EvolutionReport:
    """Summary of a single evolution cycle."""

    generation: int
    culled: int
    bred: int
    avg_fitness_before: float
    avg_fitness_after: float
    diversity_before: float
    diversity_after: float


@dataclass
class Ranch:
    """The top-level ranch that owns herds, pastures, and runs evolution.

    Attributes:
        name: Ranch name.
        herd: The main herd of agents.
        pastures: Named pastures for resource management.
        fitness_threshold: Minimum fitness to survive culling.
        mutation_rate: Mutation noise during breeding.
        elite_count: Number of top agents preserved unchanged each cycle.
        generation: Current evolution generation.
    """

    name: str = "ai-ranch"
    herd: Herd = field(default_factory=Herd)
    pastures: dict[str, Pasture] = field(default_factory=dict)
    fitness_threshold: float = 0.3
    mutation_rate: float = 0.1
    elite_count: int = 2
    generation: int = 0

    # ------------------------------------------------------------------
    # Convenience constructors
    # ------------------------------------------------------------------

    @classmethod
    def create(cls, name: str = "ai-ranch", capacity: int = 50) -> Ranch:
        """Create a ranch with a default herd and pasture."""
        ranch = cls(name=name)
        ranch.pastures["main"] = Pasture(name="main", capacity=capacity)
        return ranch

    # ------------------------------------------------------------------
    # Agent management
    # ------------------------------------------------------------------

    def add_agent(
        self,
        name: str,
        species: str = "cattle",
        fitness: float = 0.5,
        traits: dict[str, float] | None = None,
        brand: Brand | None = None,
        capabilities: list[str] | None = None,
    ) -> RanchAgent:
        """Create and add an agent to the herd (and main pasture if exists)."""
        agent = RanchAgent(
            name=name,
            species=species,
            fitness=fitness,
            traits=traits or {},
            brand=brand,
            capabilities=capabilities or [],
        )
        self.herd.add(agent)
        if "main" in self.pastures:
            self.pastures["main"].add_agent(agent)
        return agent

    def remove_agent(self, agent_id: str) -> RanchAgent | None:
        """Remove an agent from herd and all pastures."""
        agent = self.herd.remove(agent_id)
        if agent:
            for p in self.pastures.values():
                p.remove_agent(agent_id)
        return agent

    # ------------------------------------------------------------------
    # Routing (Collie-inspired)
    # ------------------------------------------------------------------

    ROUTING_KEYWORDS: ClassVar[dict[str, list[str]]] = {
        "cattle": ["analyze", "explain", "review", "email", "reasoning"],
        "duck": ["api", "fetch", "request", "http", "webhook"],
        "goat": ["navigate", "path", "route", "find", "location"],
        "sheep": ["consensus", "vote", "agree", "decide", "group"],
        "horse": ["process", "transform", "batch", "pipeline", "etl"],
        "falcon": ["search", "quick", "lookup", "retrieve", "scan"],
        "hog": ["debug", "log", "diagnose", "error", "trace"],
        "chicken": ["monitor", "watch", "alert", "notify", "status"],
    }

    def route(self, intent: str) -> tuple[RanchAgent | None, str, float]:
        """Route an intent string to the best-fit agent.

        Returns (agent, species, confidence).
        """
        words = set(intent.lower().split())
        scores: dict[str, float] = {}
        for species, keywords in self.ROUTING_KEYWORDS.items():
            overlap = words & set(keywords)
            if overlap:
                scores[species] = len(overlap) / len(keywords)

        if not scores:
            # Default: pick the fittest agent
            best = self.herd.top(1)
            if best:
                return best[0], best[0].species, best[0].fitness * 0.5
            return None, "", 0.0

        best_species = max(scores, key=lambda s: scores[s])
        candidates = self.herd.by_species(best_species)
        if not candidates:
            candidates = self.herd.agents

        if not candidates:
            return None, best_species, scores[best_species]

        # Prefer higher fitness among candidates
        best_agent = max(candidates, key=lambda a: a.fitness)
        confidence = scores[best_species] * best_agent.fitness
        return best_agent, best_species, confidence

    # ------------------------------------------------------------------
    # Evolution (Night School)
    # ------------------------------------------------------------------

    def evolve(self) -> EvolutionReport:
        """Run one evolution cycle: cull → breed → (optionally) promote.

        1. Record before-state.
        2. Cull agents below fitness threshold (protect elites).
        3. Breed replacements from top performers.
        4. Increment generation counter.
        """
        avg_before = self.herd.average_fitness()
        div_before = self.herd.diversity_index()

        # Protect elites
        elites = self.herd.top(self.elite_count)
        elite_ids = {a.id for a in elites}

        # Cull (skip elites)
        to_cull = [
            a for a in self.herd.agents
            if a.fitness < self.fitness_threshold and a.id not in elite_ids
        ]
        for a in to_cull:
            self.remove_agent(a.id)

        # Breed to replace (up to original losses)
        bred = 0
        target_pop = len(self.herd.agents) + len(to_cull)
        attempts = 0
        while len(self.herd.agents) < target_pop and attempts < len(to_cull) * 3:
            attempts += 1
            if len(self.herd.agents) < 2:
                break
            try:
                p1, p2 = self.herd.select_breeding_pair()
                child = self.herd.breed(p1, p2, mutation_rate=self.mutation_rate)
                self.herd.add(child)
                if "main" in self.pastures:
                    self.pastures["main"].add_agent(child)
                bred += 1
            except ValueError:
                break

        self.generation += 1

        return EvolutionReport(
            generation=self.generation,
            culled=len(to_cull),
            bred=bred,
            avg_fitness_before=avg_before,
            avg_fitness_after=self.herd.average_fitness(),
            diversity_before=div_before,
            diversity_after=self.herd.diversity_index(),
        )

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------

    def summary(self) -> dict[str, Any]:
        """Return a summary dict of ranch state."""
        return {
            "name": self.name,
            "generation": self.generation,
            "herd_size": self.herd.size,
            "avg_fitness": round(self.herd.average_fitness(), 3),
            "diversity": round(self.herd.diversity_index(), 3),
            "species_counts": self.herd.species_counts(),
            "pastures": {
                k: {"occupancy": p.occupancy, "resources": round(p.resource_level, 2)}
                for k, p in self.pastures.items()
            },
        }

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"Ranch(name={self.name!r}, herd={self.herd.size}, "
            f"gen={self.generation})"
        )
