/**
 * Species Registry - Core Species Implementation
 * Each species represents a specialized AI agent type
 */

import { Species, SpeciesName, BreedDNA } from '@/types/ranch';

// ============================================
// Species Definitions
// ============================================

export const SPECIES_DEFAULTS: Record<SpeciesName, Omit<Species, 'createdAt' | 'updatedAt'>> = {
  cattle: {
    name: 'cattle',
    description: 'Heavy reasoning agent for complex analysis, email processing, and detailed work',
    capabilities: ['reasoning', 'analysis', 'email-processing', 'document-review', 'research'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'cattle-reasoning-v1',
    traits: {
      patience: 0.9,
      thoroughness: 0.85,
      creativity: 0.4,
      speed: 0.3,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  duck: {
    name: 'duck',
    description: 'Network and API specialist for external service integration',
    capabilities: ['api-calls', 'webhooks', 'http-requests', 'json-parsing', 'rate-limiting'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'duck-network-v1',
    traits: {
      patience: 0.6,
      thoroughness: 0.7,
      creativity: 0.3,
      speed: 0.8,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  goat: {
    name: 'goat',
    description: 'Navigation and spatial reasoning for complex pathfinding',
    capabilities: ['navigation', 'spatial-reasoning', 'pathfinding', 'mapping', 'optimization'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'goat-spatial-v1',
    traits: {
      patience: 0.7,
      thoroughness: 0.6,
      creativity: 0.5,
      speed: 0.7,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  sheep: {
    name: 'sheep',
    description: 'Consensus and voting agent for group decision-making',
    capabilities: ['consensus', 'voting', 'mediation', 'summarization', 'agreement'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'sheep-consensus-v1',
    traits: {
      patience: 0.9,
      thoroughness: 0.8,
      creativity: 0.2,
      speed: 0.5,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  horse: {
    name: 'horse',
    description: 'ETL and data pipeline specialist for heavy data processing',
    capabilities: ['etl', 'data-pipeline', 'transformation', 'batch-processing', 'streaming'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'horse-etl-v1',
    traits: {
      patience: 0.8,
      thoroughness: 0.9,
      creativity: 0.3,
      speed: 0.6,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  falcon: {
    name: 'falcon',
    description: 'Fast search and reconnaissance for quick information retrieval',
    capabilities: ['search', 'reconnaissance', 'quick-lookup', 'indexing', 'caching'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'falcon-search-v1',
    traits: {
      patience: 0.3,
      thoroughness: 0.5,
      creativity: 0.4,
      speed: 0.95,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  hog: {
    name: 'hog',
    description: 'Logging and diagnostics for system health monitoring',
    capabilities: ['logging', 'diagnostics', 'debugging', 'monitoring', 'alerting'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'hog-diagnostics-v1',
    traits: {
      patience: 0.9,
      thoroughness: 0.95,
      creativity: 0.1,
      speed: 0.4,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  chicken: {
    name: 'chicken',
    description: 'Monitoring and alerts for real-time system oversight',
    capabilities: ['monitoring', 'alerts', 'health-checks', 'notifications', 'watchdog'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'chicken-monitor-v1',
    traits: {
      patience: 0.7,
      thoroughness: 0.6,
      creativity: 0.2,
      speed: 0.9,
    },
    fitness: 0.5,
    generation: 0,
  },
};

// ============================================
// Species Registry Class
// ============================================

export class SpeciesRegistry {
  private species: Map<SpeciesName, Species> = new Map();
  private listeners: Set<(species: Species[]) => void> = new Set();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    const now = new Date();
    for (const [name, config] of Object.entries(SPECIES_DEFAULTS)) {
      this.species.set(name as SpeciesName, {
        ...config,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  get(name: SpeciesName): Species | undefined {
    return this.species.get(name);
  }

  getAll(): Species[] {
    return Array.from(this.species.values());
  }

  update(name: SpeciesName, updates: Partial<Species>): Species | undefined {
    const existing = this.species.get(name);
    if (!existing) return undefined;

    const updated: Species = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.species.set(name, updated);
    this.notifyListeners();
    return updated;
  }

  updateFitness(name: SpeciesName, fitness: number): void {
    this.update(name, { fitness: Math.max(0, Math.min(1, fitness)) });
  }

  subscribe(listener: (species: Species[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const allSpecies = this.getAll();
    this.listeners.forEach(listener => listener(allSpecies));
  }

  // Load from breed.md DNA
  loadFromDNA(dna: BreedDNA): Species {
    const base = SPECIES_DEFAULTS[dna.species];
    const species: Species = {
      ...base,
      name: dna.species,
      description: dna.description,
      capabilities: dna.capabilities.map(c => c.name),
      traits: {
        patience: dna.personality.verbosity === 'detailed' ? 0.9 : 0.5,
        thoroughness: dna.constraints.length > 2 ? 0.85 : 0.5,
        creativity: dna.personality.creativity,
        speed: dna.personality.tone === 'casual' ? 0.8 : 0.5,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.species.set(dna.species, species);
    this.notifyListeners();
    return species;
  }

  // Evolution: create offspring
  createOffspring(parent1: SpeciesName, parent2: SpeciesName): Species {
    const p1 = this.species.get(parent1);
    const p2 = this.species.get(parent2);
    
    if (!p1 || !p2) {
      throw new Error('Parent species not found');
    }

    const maxGen = Math.max(p1.generation, p2.generation);
    
    // Combine traits with crossover
    const offspring: Species = {
      name: p1.name, // Keep primary parent's role
      description: `Evolved ${p1.name} (gen ${maxGen + 1})`,
      capabilities: Array.from(new Set([...p1.capabilities, ...p2.capabilities])),
      modelHint: p1.modelHint,
      loraAdapter: `evolved-${p1.name}-v${maxGen + 1}`,
      traits: {
        patience: (p1.traits.patience + p2.traits.patience) / 2 + (Math.random() - 0.5) * 0.1,
        thoroughness: (p1.traits.thoroughness + p2.traits.thoroughness) / 2 + (Math.random() - 0.5) * 0.1,
        creativity: (p1.traits.creativity + p2.traits.creativity) / 2 + (Math.random() - 0.5) * 0.1,
        speed: (p1.traits.speed + p2.traits.speed) / 2 + (Math.random() - 0.5) * 0.1,
      },
      fitness: 0.5, // Start neutral
      generation: maxGen + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Clamp traits to valid range
    for (const key of Object.keys(offspring.traits) as Array<keyof typeof offspring.traits>) {
      offspring.traits[key] = Math.max(0, Math.min(1, offspring.traits[key]));
    }

    this.species.set(offspring.name, offspring);
    this.notifyListeners();
    return offspring;
  }
}

// Singleton instance
export const speciesRegistry = new SpeciesRegistry();
