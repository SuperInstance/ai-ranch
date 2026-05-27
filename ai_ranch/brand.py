"""Brand — identification and tracking for ranch agents."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class Brand:
    """A brand marks an agent for tracking and identification.

    Think of it like a cattle brand — a unique sigil burned into
    (metaphorically) each agent so you can tell them apart, group
    them, and trace their history.

    Attributes:
        sigil: Short unique symbol or tag (e.g. "⚡", "ALPHA").
        color: Display color hint (hex or named).
        tags: Free-form tags for filtering.
        metadata: Arbitrary extra data.
    """

    sigil: str
    color: str = "#000000"
    tags: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    def matches(self, **criteria: Any) -> bool:
        """Check if this brand matches all given criteria.

        Supports matching on sigil, color, and tags (checks tag membership).

        >>> b = Brand(sigil="⚡", tags=["fast", "alpha"])
        >>> b.matches(sigil="⚡")
        True
        >>> b.matches(tags="alpha")
        True
        >>> b.matches(tags="slow")
        False
        """
        for key, value in criteria.items():
            if key == "tags":
                if value not in self.tags:
                    return False
            elif key == "sigil" and self.sigil != value:
                return False
            elif key == "color" and self.color != value:
                return False
            elif key in self.metadata and self.metadata[key] != value:
                return False
        return True

    def __repr__(self) -> str:  # pragma: no cover
        return f"Brand(sigil={self.sigil!r}, tags={self.tags!r})"
