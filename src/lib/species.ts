/**
 * @fileoverview Species Registry - Core Species Implementation
 * 
 * This module implements the Species Registry, which manages all agent species
 * in the AI Ranch. Each species represents a specialized AI agent type with
 * unique traits, capabilities, and behaviors.
 * 
 * ## Architecture
 * 
 * The Species Registry follows the Singleton pattern, providing a single
 * source of truth for all species data. It supports:
 * 
 * - CRUD operations on species
 * - Event-based subscription for UI updates
 * - DNA-based loading from breed.md files
 * - Evolutionary offspring creation
 * 
 * ## Species Types
 * 
 * | Species | Role | Traits |
 * |---------|------|--------|
 * | Cattle | Heavy reasoning | patience: 0.9, speed: 0.3 |
 * | Duck | Network/API | speed: 0.8 |
 * | Goat | Navigation | balanced |
 * | Sheep | Consensus | patience: 0.9 |
 * | Horse | ETL/Data | thoroughness: 0.9 |
 * | Falcon | Search | speed: 0.95 |
 * | Hog | Diagnostics | thoroughness: 0.95 |
 * | Chicken | Monitoring | speed: 0.9 |
 * 
 * @module lib/species
 * @see {@link types/ranch.Species}
 */

import { Species, SpeciesName, BreedDNA, Personality, Capability } from '@/types/ranch';

// ============================================
// Species Definitions
// ============================================

/**
 * Default configurations for all species types.
 * 
 * These defaults are loaded when the SpeciesRegistry is instantiated.
 * Each species has optimized traits for its intended purpose.
 * 
 * @internal
 */
export const SPECIES_DEFAULTS: Record<SpeciesName, Omit<Species, 'createdAt' | 'updatedAt'>> = {
  /**
   * Cattle - Heavy reasoning agent for complex analysis
   * 
   * Best for: Email processing, document review, deep analysis
   * Key traits: High patience, high thoroughness, low speed
   */
  cattle: {
    name: 'cattle',
    description: 'Heavy reasoning agent for complex analysis, email processing, and detailed work',
    capabilities: ['reasoning', 'analysis', 'email-processing', 'document-review', 'research'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'cattle-reasoning-v1',
    traits: {
      patience: 0.9,      // Willing to work on complex problems
      thoroughness: 0.85, // Detailed, comprehensive responses
      creativity: 0.4,    // Moderate creativity for analysis
      speed: 0.3,         // Slower but more accurate
    },
    fitness: 0.5,
    generation: 0,
  },
  
  /**
   * Duck - Network and API specialist
   * 
   * Best for: API calls, webhooks, HTTP requests
   * Key traits: High speed, moderate thoroughness
   */
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
      speed: 0.8,         // Fast for quick API responses
    },
    fitness: 0.5,
    generation: 0,
  },
  
  /**
   * Goat - Navigation and spatial reasoning
   * 
   * Best for: Pathfinding, mapping, optimization
   * Key traits: Balanced for flexibility
   */
  goat: {
    name: 'goat',
    description: 'Navigation and spatial reasoning for complex pathfinding',
    capabilities: ['navigation', 'spatial-reasoning', 'pathfinding', 'mapping', 'optimization'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'goat-spatial-v1',
    traits: {
      patience: 0.7,
      thoroughness: 0.6,
      creativity: 0.5,    // Moderate creativity for novel paths
      speed: 0.7,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  /**
   * Sheep - Consensus and voting agent
   * 
   * Best for: Group decisions, mediation, summarization
   * Key traits: High patience, low creativity (for neutrality)
   */
  sheep: {
    name: 'sheep',
    description: 'Consensus and voting agent for group decision-making',
    capabilities: ['consensus', 'voting', 'mediation', 'summarization', 'agreement'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'sheep-consensus-v1',
    traits: {
      patience: 0.9,      // Patient mediator
      thoroughness: 0.8,
      creativity: 0.2,    // Low creativity for fairness
      speed: 0.5,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  /**
   * Horse - ETL and data pipeline specialist
   * 
   * Best for: Data transformation, batch processing, streaming
   * Key traits: High thoroughness for data integrity
   */
  horse: {
    name: 'horse',
    description: 'ETL and data pipeline specialist for heavy data processing',
    capabilities: ['etl', 'data-pipeline', 'transformation', 'batch-processing', 'streaming'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'horse-etl-v1',
    traits: {
      patience: 0.8,
      thoroughness: 0.9,  // Critical for data accuracy
      creativity: 0.3,
      speed: 0.6,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  /**
   * Falcon - Fast search and reconnaissance
   * 
   * Best for: Quick lookups, indexing, caching
   * Key traits: Very high speed, lower thoroughness
   */
  falcon: {
    name: 'falcon',
    description: 'Fast search and reconnaissance for quick information retrieval',
    capabilities: ['search', 'reconnaissance', 'quick-lookup', 'indexing', 'caching'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'falcon-search-v1',
    traits: {
      patience: 0.3,      // Quick, not thorough
      thoroughness: 0.5,
      creativity: 0.4,
      speed: 0.95,        // Very fast
    },
    fitness: 0.5,
    generation: 0,
  },
  
  /**
   * Hog - Logging and diagnostics
   * 
   * Best for: Debugging, monitoring, alerting
   * Key traits: Very high thoroughness, low creativity
   */
  hog: {
    name: 'hog',
    description: 'Logging and diagnostics for system health monitoring',
    capabilities: ['logging', 'diagnostics', 'debugging', 'monitoring', 'alerting'],
    modelHint: 'phi-3-mini',
    loraAdapter: 'hog-diagnostics-v1',
    traits: {
      patience: 0.9,
      thoroughness: 0.95, // Must be thorough for diagnostics
      creativity: 0.1,    // Low creativity for accuracy
      speed: 0.4,
    },
    fitness: 0.5,
    generation: 0,
  },
  
  /**
   * Chicken - Monitoring and alerts
   * 
   * Best for: Health checks, notifications, watchdog
   * Key traits: High speed for quick alerts
   */
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
      speed: 0.9,         // Fast for real-time alerts
    },
    fitness: 0.5,
    generation: 0,
  },
};

// ============================================
// Species Registry Class
// ============================================

/**
 * Singleton registry for managing all species in the AI Ranch.
 * 
 * The SpeciesRegistry provides:
 * - Centralized species storage and retrieval
 * - Real-time updates via subscription pattern
 * - DNA-based species loading from breed.md files
 * - Evolutionary offspring creation with genetic crossover
 * 
 * @example
 * ```typescript
 * import { speciesRegistry } from '@/lib/species';
 * 
 * // Get all species
 * const allSpecies = speciesRegistry.getAll();
 * 
 * // Get specific species
 * const cattle = speciesRegistry.get('cattle');
 * 
 * // Update species fitness
 * speciesRegistry.updateFitness('cattle', 0.85);
 * 
 * // Subscribe to changes
 * const unsubscribe = speciesRegistry.subscribe((species) => {
 *   console.log('Species updated:', species);
 * });
 * ```
 */
export class SpeciesRegistry {
  /** Internal map storing all species */
  private species: Map<SpeciesName, Species> = new Map();
  
  /** Set of change listeners */
  private listeners: Set<(species: Species[]) => void> = new Set();

  /**
   * Creates a new SpeciesRegistry and initializes with defaults.
   */
  constructor() {
    this.initializeDefaults();
  }

  /**
   * Initializes the registry with default species configurations.
   * 
   * Called automatically during construction.
   * 
   * @private
   */
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

  /**
   * Retrieves a single species by name.
   * 
   * @param name - The species name to look up
   * @returns The species if found, undefined otherwise
   * 
   * @example
   * ```typescript
   * const cattle = speciesRegistry.get('cattle');
   * if (cattle) {
   *   console.log('Cattle fitness:', cattle.fitness);
   * }
   * ```
   */
  get(name: SpeciesName): Species | undefined {
    return this.species.get(name);
  }

  /**
   * Retrieves all species from the registry.
   * 
   * @returns Array of all registered species
   * 
   * @example
   * ```typescript
   * const allSpecies = speciesRegistry.getAll();
   * console.log(`Registry has ${allSpecies.length} species`);
   * ```
   */
  getAll(): Species[] {
    return Array.from(this.species.values());
  }

  /**
   * Updates a species with partial data.
   * 
   * Only provided fields are updated; others remain unchanged.
   * The updatedAt timestamp is automatically set.
   * 
   * @param name - The species name to update
   * @param updates - Partial species data to merge
   * @returns The updated species, or undefined if not found
   * 
   * @example
   * ```typescript
   * const updated = speciesRegistry.update('cattle', {
   *   fitness: 0.85,
   *   generation: 1,
   * });
   * ```
   */
  update(name: SpeciesName, updates: Partial<Species>): Species | undefined {
    const existing = this.species.get(name);
    if (!existing) {
      console.warn(`[SpeciesRegistry] Attempted to update unknown species: ${name}`);
      return undefined;
    }

    const updated: Species = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.species.set(name, updated);
    this.notifyListeners();
    return updated;
  }

  /**
   * Updates the fitness score for a species.
   * 
   * Fitness is clamped to the valid range [0, 1].
   * 
   * @param name - The species name to update
   * @param fitness - New fitness value (will be clamped to 0-1)
   * 
   * @example
   * ```typescript
   * // After successful task completion
   * speciesRegistry.updateFitness('cattle', 0.82);
   * ```
   */
  updateFitness(name: SpeciesName, fitness: number): void {
    // Clamp fitness to valid range [0, 1]
    const clampedFitness = Math.max(0, Math.min(1, fitness));
    this.update(name, { fitness: clampedFitness });
  }

  /**
   * Subscribes to species changes.
   * 
   * The listener is called immediately when subscribe is called,
   * and subsequently whenever any species is updated.
   * 
   * @param listener - Callback function receiving all species
   * @returns Unsubscribe function
   * 
   * @example
   * ```typescript
   * const unsubscribe = speciesRegistry.subscribe((species) => {
   *   console.log('Species updated:', species.map(s => s.name));
   * });
   * 
   * // Later: stop listening
   * unsubscribe();
   * ```
   */
  subscribe(listener: (species: Species[]) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current state
    listener(this.getAll());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifies all subscribers of a state change.
   * 
   * @private
   */
  private notifyListeners(): void {
    const allSpecies = this.getAll();
    this.listeners.forEach(listener => {
      try {
        listener(allSpecies);
      } catch (error) {
        console.error('[SpeciesRegistry] Listener error:', error);
      }
    });
  }

  /**
   * Loads a species from breed.md DNA configuration.
   * 
   * This creates or updates a species based on a parsed breed.md file.
   * 
   * @param dna - Parsed breed.md configuration
   * @returns The created/updated species
   * 
   * @example
   * ```typescript
   * import { breedParser } from '@/lib/breed-parser';
   * 
   * const result = breedParser.parse(breedMdContent);
   * if (result.success && result.dna) {
   *   const species = speciesRegistry.loadFromDNA(result.dna);
   *   console.log('Loaded species:', species.name);
   * }
   * ```
   */
  loadFromDNA(dna: BreedDNA): Species {
    // Get base configuration for this species type
    const base = SPECIES_DEFAULTS[dna.species];
    if (!base) {
      throw new Error(`Unknown species type in DNA: ${dna.species}`);
    }

    // Extract personality settings
    const personality = dna.personality;
    
    // Map personality to traits
    const traits = {
      patience: personality.verbosity === 'detailed' ? 0.9 : 
                 personality.verbosity === 'concise' ? 0.5 : 0.7,
      thoroughness: dna.constraints.filter(c => c.type === 'required').length > 2 ? 0.85 : 0.6,
      creativity: Math.max(0, Math.min(1, personality.creativity)),
      speed: personality.tone === 'casual' ? 0.8 : 
             personality.tone === 'technical' ? 0.5 : 0.6,
    };

    const species: Species = {
      ...base,
      name: dna.species,
      description: dna.description || base.description,
      capabilities: dna.capabilities.map(c => c.name),
      traits,
      fitness: 0.5, // Start with neutral fitness
      generation: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.species.set(dna.species, species);
    this.notifyListeners();
    
    console.log(`[SpeciesRegistry] Loaded species from DNA: ${dna.species}`);
    return species;
  }

  /**
   * Creates an offspring species through genetic crossover.
   * 
   * This method combines two parent species to create an offspring with
   * mixed traits. Used by Night School evolution.
   * 
   * The offspring inherits:
   * - Name from primary parent (parent1)
   * - Capabilities from both parents (union)
   * - Traits as average of parents with random mutation
   * - Generation as max(parents) + 1
   * 
   * @param parent1 - Primary parent species name
   * @param parent2 - Secondary parent species name
   * @returns The created offspring species
   * @throws Error if either parent is not found
   * 
   * @example
   * ```typescript
   * const offspring = speciesRegistry.createOffspring('cattle', 'falcon');
   * console.log('Created:', offspring.name, 'Gen:', offspring.generation);
   * ```
   */
  createOffspring(parent1: SpeciesName, parent2: SpeciesName): Species {
    const p1 = this.species.get(parent1);
    const p2 = this.species.get(parent2);
    
    if (!p1) {
      throw new Error(`Parent species not found: ${parent1}`);
    }
    if (!p2) {
      throw new Error(`Parent species not found: ${parent2}`);
    }

    const maxGen = Math.max(p1.generation, p2.generation);
    const newGeneration = maxGen + 1;
    
    // Mutation rate: small random adjustment to traits
    const mutate = (value: number): number => {
      const mutation = (Math.random() - 0.5) * 0.1; // ±0.05
      return value + mutation;
    };
    
    // Crossover: average parent traits with mutation
    const offspring: Species = {
      name: p1.name, // Keep primary parent's role
      description: `Evolved ${p1.name} (generation ${newGeneration})`,
      capabilities: Array.from(new Set([...p1.capabilities, ...p2.capabilities])),
      modelHint: p1.modelHint,
      loraAdapter: `evolved-${p1.name}-v${newGeneration}`,
      traits: {
        patience: mutate((p1.traits.patience + p2.traits.patience) / 2),
        thoroughness: mutate((p1.traits.thoroughness + p2.traits.thoroughness) / 2),
        creativity: mutate((p1.traits.creativity + p2.traits.creativity) / 2),
        speed: mutate((p1.traits.speed + p2.traits.speed) / 2),
      },
      fitness: 0.5, // Start with neutral fitness
      generation: newGeneration,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Clamp all traits to valid range [0, 1]
    for (const key of Object.keys(offspring.traits) as Array<keyof typeof offspring.traits>) {
      offspring.traits[key] = Math.max(0, Math.min(1, offspring.traits[key]));
    }

    // Replace the existing species with the evolved version
    this.species.set(offspring.name, offspring);
    this.notifyListeners();
    
    console.log(`[SpeciesRegistry] Created offspring: ${offspring.name} gen ${newGeneration}`);
    return offspring;
  }

  /**
   * Resets a species to its default configuration.
   * 
   * @param name - The species name to reset
   * @returns The reset species, or undefined if not found
   */
  reset(name: SpeciesName): Species | undefined {
    const defaults = SPECIES_DEFAULTS[name];
    if (!defaults) return undefined;
    
    return this.update(name, {
      ...defaults,
      createdAt: new Date(),
    });
  }

  /**
   * Gets the total population count.
   * 
   * @returns Number of registered species
   */
  get populationSize(): number {
    return this.species.size;
  }

  /**
   * Gets the average fitness across all species.
   * 
   * @returns Average fitness score (0-1)
   */
  get averageFitness(): number {
    const all = this.getAll();
    if (all.length === 0) return 0;
    return all.reduce((sum, s) => sum + s.fitness, 0) / all.length;
  }

  /**
   * Gets the best performing species.
   * 
   * @returns The species with highest fitness, or undefined if empty
   */
  get bestSpecies(): Species | undefined {
    const all = this.getAll();
    if (all.length === 0) return undefined;
    return all.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
  }
}

// ============================================
// Singleton Export
// ============================================

/**
 * Singleton instance of the Species Registry.
 * 
 * Import this to interact with species throughout the application.
 * 
 * @example
 * ```typescript
 * import { speciesRegistry } from '@/lib/species';
 * 
 * const cattle = speciesRegistry.get('cattle');
 * ```
 */
export const speciesRegistry = new SpeciesRegistry();
