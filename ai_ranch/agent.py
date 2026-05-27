"""RanchAgent — an individual AI agent with traits, fitness, and lineage."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


def _now() -> datetime:
    return datetime.now(timezone.utc)


@dataclass
class RanchAgent:
    """A single AI agent in the ranch.

    Attributes:
        name: Human-readable name (e.g. "bessie").
        species: Agent type — cattle, duck, falcon, etc.
        traits: Numeric trait scores (0–1) like patience, speed, creativity.
        fitness: Composite fitness score (0–1), updated by evolution.
        generation: Evolution generation (0 = founder).
        brand: Optional :class:`Brand` for identification.
        parent_ids: IDs of parent agents (empty for founders).
        capabilities: Things this agent can do.
        created_at: When the agent was created.
    """

    name: str
    species: str = "cattle"
    traits: dict[str, float] = field(default_factory=dict)
    fitness: float = 0.5
    generation: int = 0
    brand: Any | None = None  # Brand typed, but avoid circular import
    parent_ids: list[str] = field(default_factory=list)
    capabilities: list[str] = field(default_factory=list)
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    created_at: datetime = field(default_factory=_now)

    # ------------------------------------------------------------------
    # Convenience
    # ------------------------------------------------------------------

    def trait(self, key: str, default: float = 0.5) -> float:
        """Return a single trait value, clamped to [0, 1]."""
        return max(0.0, min(1.0, self.traits.get(key, default)))

    def update_fitness(self, score: float) -> None:
        """Set fitness, clamped to [0, 1]."""
        self.fitness = max(0.0, min(1.0, score))

    def is_founder(self) -> bool:
        """True if this agent has no parents (generation 0)."""
        return self.generation == 0 and len(self.parent_ids) == 0

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"RanchAgent(id={self.id!r}, name={self.name!r}, "
            f"species={self.species!r}, fitness={self.fitness:.2f}, "
            f"gen={self.generation})"
        )
