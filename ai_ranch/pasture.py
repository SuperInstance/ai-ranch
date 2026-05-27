"""Pasture — resource management with carrying capacity."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from ai_ranch.agent import RanchAgent


@dataclass
class Pasture:
    """A bounded area where agents graze (consume resources).

    Each pasture has a carrying capacity — the maximum number of
    agents it can support. Agents consume resources over time, and
    the pasture regenerates.

    Attributes:
        name: Pasture name.
        capacity: Maximum agent slots.
        resource_level: Current resources (0–1). Agents consume from this.
        regen_rate: How fast resources regenerate per tick (0–1).
    """

    name: str = "main-pasture"
    capacity: int = 50
    resource_level: float = 1.0
    regen_rate: float = 0.05
    _occupants: list[str] = field(default_factory=list)

    # ------------------------------------------------------------------
    # Occupancy
    # ------------------------------------------------------------------

    @property
    def occupancy(self) -> int:
        return len(self._occupants)

    @property
    def available_slots(self) -> int:
        return max(0, self.capacity - self.occupancy)

    def is_full(self) -> bool:
        return self.occupancy >= self.capacity

    def can_accept(self, n: int = 1) -> bool:
        """Whether *n* more agents can be added."""
        return self.occupancy + n <= self.capacity

    # ------------------------------------------------------------------
    # Grazing
    # ------------------------------------------------------------------

    def add_agent(self, agent: RanchAgent) -> bool:
        """Place an agent in the pasture. Returns False if full."""
        if self.is_full():
            return False
        self._occupants.append(agent.id)
        return True

    def remove_agent(self, agent_id: str) -> bool:
        """Remove an agent from the pasture."""
        try:
            self._occupants.remove(agent_id)
            return True
        except ValueError:
            return False

    def consume(self, amount: float = 0.01) -> float:
        """Each occupant consumes resources. Returns remaining level."""
        total = amount * self.occupancy
        self.resource_level = max(0.0, self.resource_level - total)
        return self.resource_level

    def regenerate(self) -> float:
        """Regenerate resources by *regen_rate*. Returns new level."""
        self.resource_level = min(1.0, self.resource_level + self.regen_rate)
        return self.resource_level

    def tick(self, consumption: float = 0.01) -> float:
        """One time step: consume then regenerate. Returns new resource level."""
        self.consume(consumption)
        self.regenerate()
        return self.resource_level

    # ------------------------------------------------------------------
    # Metrics
    # ------------------------------------------------------------------

    def utilization(self) -> float:
        """Fraction of capacity used (0–1)."""
        if self.capacity == 0:
            return 0.0
        return self.occupancy / self.capacity

    def stress_level(self) -> str:
        """Qualitative stress indicator based on resource level."""
        if self.resource_level > 0.7:
            return "healthy"
        if self.resource_level > 0.4:
            return "stressed"
        if self.resource_level > 0.15:
            return "critical"
        return "depleted"

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"Pasture(name={self.name!r}, occupancy={self.occupancy}/{self.capacity}, "
            f"resources={self.resource_level:.2f})"
        )
