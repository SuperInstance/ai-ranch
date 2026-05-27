"""AI Ranch — Managing a herd of AI agents.

A Python library for evolving, managing, and orchestrating
populations of AI agents using ranching metaphors.

Usage::

    from ai_ranch import Ranch, RanchAgent, Herd, Pasture, Brand

    ranch = Ranch(name="my-ranch")
    agent = RanchAgent(name="bessie", species="cattle", traits={"patience": 0.9})
    ranch.herd.add(agent)
"""

from ai_ranch.agent import RanchAgent
from ai_ranch.brand import Brand
from ai_ranch.herd import Herd
from ai_ranch.pasture import Pasture
from ai_ranch.ranch import Ranch

__all__ = ["Ranch", "RanchAgent", "Herd", "Pasture", "Brand"]
__version__ = "0.1.0"
