"""Herd — a collection of agents with grouping, culling, and breeding selection."""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Sequence

from ai_ranch.agent import RanchAgent


@dataclass
class Herd:
    """A managed group of :class:`RanchAgent` instances.

    Supports grouping by species/tags, culling underperformers,
    and selecting breeding pairs.

    Attributes:
        name: Herd name.
        agents: The agents in this herd.
    """

    name: str = "main"
    agents: list[RanchAgent] = field(default_factory=list)

    # ------------------------------------------------------------------
    # Basic operations
    # ------------------------------------------------------------------

    def add(self, agent: RanchAgent) -> None:
        """Add an agent to the herd."""
        self.agents.append(agent)

    def remove(self, agent_id: str) -> RanchAgent | None:
        """Remove and return an agent by id. Returns None if not found."""
        for i, a in enumerate(self.agents):
            if a.id == agent_id:
                return self.agents.pop(i)
        return None

    def get(self, agent_id: str) -> RanchAgent | None:
        """Look up an agent by id."""
        for a in self.agents:
            if a.id == agent_id:
                return a
        return None

    @property
    def size(self) -> int:
        return len(self.agents)

    # ------------------------------------------------------------------
    # Grouping / filtering
    # ------------------------------------------------------------------

    def by_species(self, species: str) -> list[RanchAgent]:
        """Return all agents of a given species."""
        return [a for a in self.agents if a.species == species]

    def by_fitness(self, minimum: float = 0.0) -> list[RanchAgent]:
        """Return agents with fitness >= minimum."""
        return [a for a in self.agents if a.fitness >= minimum]

    def by_tag(self, tag: str) -> list[RanchAgent]:
        """Return agents whose brand has the given tag."""
        return [a for a in self.agents if a.brand and tag in a.brand.tags]

    def species_counts(self) -> dict[str, int]:
        """Count agents per species."""
        counts: dict[str, int] = {}
        for a in self.agents:
            counts[a.species] = counts.get(a.species, 0) + 1
        return counts

    # ------------------------------------------------------------------
    # Culling
    # ------------------------------------------------------------------

    def cull(self, threshold: float = 0.3) -> list[RanchAgent]:
        """Remove and return agents below *threshold* fitness.

        Returns the culled agents (they are removed from the herd).
        """
        surviving: list[RanchAgent] = []
        culled: list[RanchAgent] = []
        for a in self.agents:
            (surviving if a.fitness >= threshold else culled).append(a)
        self.agents = surviving
        return culled

    # ------------------------------------------------------------------
    # Breeding selection
    # ------------------------------------------------------------------

    def top(self, n: int = 2) -> list[RanchAgent]:
        """Return the top *n* agents by fitness (descending)."""
        return sorted(self.agents, key=lambda a: a.fitness, reverse=True)[:n]

    def select_breeding_pair(self) -> tuple[RanchAgent, RanchAgent]:
        """Select two agents for breeding using fitness-weighted selection.

        Raises ValueError if fewer than 2 agents in the herd.
        """
        if len(self.agents) < 2:
            raise ValueError("Need at least 2 agents to select a breeding pair")

        weights = [max(a.fitness, 0.01) for a in self.agents]
        pair = random.choices(self.agents, weights=weights, k=2)
        # Ensure two distinct agents if possible
        if len(self.agents) > 2:
            while pair[0].id == pair[1].id:
                pair = random.choices(self.agents, weights=weights, k=2)
        return pair[0], pair[1]

    # ------------------------------------------------------------------
    # Breeding
    # ------------------------------------------------------------------

    def breed(
        self,
        parent1: RanchAgent,
        parent2: RanchAgent,
        name: str | None = None,
        mutation_rate: float = 0.1,
    ) -> RanchAgent:
        """Create a child agent from two parents via trait crossover + mutation.

        Each trait is averaged from parents with optional Gaussian noise
        (mutation). The child inherits capabilities from both parents.
        """
        all_traits = set(parent1.traits) | set(parent2.traits)
        child_traits: dict[str, float] = {}
        for t in all_traits:
            v1 = parent1.traits.get(t, 0.5)
            v2 = parent2.traits.get(t, 0.5)
            value = (v1 + v2) / 2.0
            if random.random() < mutation_rate:
                value += random.gauss(0, 0.05)
            child_traits[t] = max(0.0, min(1.0, value))

        child = RanchAgent(
            name=name or f"{parent1.name}-{parent2.name}-calf",
            species=parent1.species if random.random() < 0.5 else parent2.species,
            traits=child_traits,
            fitness=(parent1.fitness + parent2.fitness) / 2.0,
            generation=max(parent1.generation, parent2.generation) + 1,
            parent_ids=[parent1.id, parent2.id],
            capabilities=list(set(parent1.capabilities) | set(parent2.capabilities)),
        )
        return child

    # ------------------------------------------------------------------
    # Stats
    # ------------------------------------------------------------------

    def average_fitness(self) -> float:
        """Mean fitness across the herd. Returns 0.0 if empty."""
        if not self.agents:
            return 0.0
        return sum(a.fitness for a in self.agents) / len(self.agents)

    def diversity_index(self) -> float:
        """Simpson's diversity index based on species distribution.

        0 = all same species, approaching 1 = highly diverse.
        Returns 0.0 if fewer than 2 agents.
        """
        if len(self.agents) < 2:
            return 0.0
        counts = self.species_counts()
        n = len(self.agents)
        return 1.0 - sum((c / n) ** 2 for c in counts.values())

    def __len__(self) -> int:
        return self.size

    def __iter__(self):  # pragma: no cover
        return iter(self.agents)

    def __repr__(self) -> str:  # pragma: no cover
        return f"Herd(name={self.name!r}, size={self.size})"
