/**
 * @fileoverview Night School - Evolution System
 * 
 * The Night School is the evolution engine of the AI Ranch. It runs daily at 02:00 AM
 * to evolve the population of species through a genetic algorithm.
 * 
 * ## Evolution Phases
 * 
 * The Night School follows a 6-phase evolution cycle:
 * 
 * 1. **Evaluate** - Score each species based on task performance
 * 2. **Cull** - Remove species below fitness threshold (0.3)
 * 3. **Breed** - Create offspring from top performers via crossover
 * 4. **Distill** - Send offspring for cloud fine-tuning (simulated)
 * 5. **Quarantine** - Test offspring in sandbox (80% pass rate)
 * 6. **Promote** - Add successful offspring to population
 * 
 * ## Genetic Algorithm
 * 
 * The evolution uses a simple genetic algorithm:
 * 
 * - **Selection**: Top 50% of population becomes breeders
 * - **Crossover**: Combine parent traits with averaging + mutation
 * - **Mutation**: ±0.05 random adjustment to traits
 * - **Elitism**: Top N species are preserved unchanged
 * 
 * ## Fitness Formula
 * 
 * ```
 * compositeScore = 
 *   successRate * 0.4 +    // Task success rate
 *   impactWeight * 0.2 +   // Task importance
 *   latencyScore * 0.2 +   // Response speed
 *   qualityScore * 0.2     // Output quality
 * ```
 * 
 * @module lib/night-school
 * @see {@link types/ranch.EvolutionCycle}
 */

import {
  EvolutionCycle,
  EvolutionPhase,
  EvolutionMetrics,
  FitnessScore,
  Species,
  SpeciesName,
} from '@/types/ranch';
import { speciesRegistry } from './species';

// ============================================
// Evolution Configuration
// ============================================

/**
 * Configuration for the Night School evolution system.
 */
export interface NightSchoolConfig {
  /** Hour to run evolution (0-23, default: 2 for 02:00 AM) */
  scheduleHour: number;
  /** Minimum fitness threshold (species below this are culled) */
  minFitnessThreshold: number;
  /** Maximum fitness cap (prevents overfitting) */
  maxFitnessThreshold: number;
  /** Target population size */
  populationSize: number;
  /** Mutation rate for offspring (0-1) */
  mutationRate: number;
  /** Crossover rate for breeding (0-1) */
  crossoverRate: number;
  /** Number of elite species to preserve unchanged */
  eliteCount: number;
}

/**
 * Default evolution configuration.
 * 
 * These values are based on common genetic algorithm parameters
 * and have been tuned for stable population improvement.
 * 
 * @internal
 */
const DEFAULT_CONFIG: NightSchoolConfig = {
  scheduleHour: 2,              // 02:00 AM - low activity time
  minFitnessThreshold: 0.3,     // 30% minimum fitness
  maxFitnessThreshold: 0.95,    // 95% maximum fitness
  populationSize: 8,            // 8 species in population
  mutationRate: 0.1,            // 10% mutation rate
  crossoverRate: 0.7,           // 70% crossover rate
  eliteCount: 2,                // Top 2 species preserved
};

// ============================================
// Night School Class
// ============================================

/**
 * Singleton class that manages the evolution of species.
 * 
 * The Night School implements a scheduled evolution system that:
 * - Runs automatically at a configured time (default: 02:00 AM)
 * - Evaluates species based on task performance
 * - Removes underperforming species
 * - Creates new offspring through genetic crossover
 * - Tests offspring before promotion
 * 
 * @example
 * ```typescript
 * import { nightSchool } from '@/lib/night-school';
 * 
 * // Start automatic scheduling
 * nightSchool.start();
 * 
 * // Or run manually
 * const cycle = await nightSchool.runCycle();
 * console.log('Evolution complete:', cycle.metrics);
 * 
 * // Subscribe to updates
 * nightSchool.subscribe((cycle) => {
 *   console.log(`Phase: ${cycle.phase}`);
 * });
 * ```
 */
export class NightSchool {
  /** Evolution configuration */
  private config: NightSchoolConfig;
  
  /** Currently running evolution cycle (null if idle) */
  private currentCycle: EvolutionCycle | null = null;
  
  /** History of completed evolution cycles */
  private cycleHistory: EvolutionCycle[] = [];
  
  /** Set of cycle update listeners */
  private listeners: Set<(cycle: EvolutionCycle) => void> = new Set();
  
  /** Timer for scheduled execution */
  private schedulerTimer: NodeJS.Timeout | null = null;

  /**
   * Creates a new Night School instance.
   * 
   * @param config - Partial configuration (merged with defaults)
   */
  constructor(config: Partial<NightSchoolConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    console.log(`[NightSchool] Initialized with schedule at ${this.config.scheduleHour}:00`);
  }

  // ============================================
  // Scheduling
  // ============================================

  /**
   * Starts the automatic evolution scheduler.
   * 
   * The next evolution will run at the configured scheduleHour.
   * After each cycle, the next one is automatically scheduled.
   * 
   * @example
   * ```typescript
   * nightSchool.start();
   * // Evolution will run at 02:00 AM daily
   * ```
   */
  start(): void {
    this.scheduleNext();
    console.log('[NightSchool] Scheduler started');
  }

  /**
   * Stops the automatic evolution scheduler.
   * 
   * Any scheduled evolution will be cancelled.
   * In-progress cycles will complete.
   */
  stop(): void {
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
      console.log('[NightSchool] Scheduler stopped');
    }
  }

  /**
   * Schedules the next evolution cycle.
   * 
   * @private
   */
  private scheduleNext(): void {
    const now = new Date();
    const nextRun = new Date();
    
    // Set to scheduled hour
    nextRun.setHours(this.config.scheduleHour, 0, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delay = nextRun.getTime() - now.getTime();
    const hoursUntil = Math.round(delay / (1000 * 60 * 60) * 10) / 10;
    
    console.log(`[NightSchool] Next evolution in ${hoursUntil} hours`);

    this.schedulerTimer = setTimeout(() => {
      console.log('[NightSchool] Starting scheduled evolution');
      this.runCycle().catch(error => {
        console.error('[NightSchool] Evolution error:', error);
      });
      this.scheduleNext();
    }, delay);
  }

  // ============================================
  // Evolution Cycle
  // ============================================

  /**
   * Runs a complete evolution cycle.
   * 
   * The cycle executes all 6 phases in sequence:
   * 1. Evaluate - Score species fitness
   * 2. Cull - Remove underperformers
   * 3. Breed - Create offspring
   * 4. Distill - Cloud training
   * 5. Quarantine - Test offspring
   * 6. Promote - Add successful offspring
   * 
   * @returns The completed evolution cycle
   * 
   * @example
   * ```typescript
   * const cycle = await nightSchool.runCycle();
   * console.log(`Improved by ${(cycle.metrics.improvementRate * 100).toFixed(1)}%`);
   * ```
   */
  async runCycle(): Promise<EvolutionCycle> {
    // Create new cycle
    const cycle: EvolutionCycle = {
      id: `evolution_${Date.now()}`,
      startedAt: new Date(),
      phase: 'evaluate',
      population: speciesRegistry.getAll(),
      offspring: [],
      graveyard: [],
      metrics: this.calculateInitialMetrics(),
    };

    this.currentCycle = cycle;
    this.notifyListeners(cycle);

    console.log(`[NightSchool] Starting cycle ${cycle.id}`);
    console.log(`[NightSchool] Initial metrics: avg=${(cycle.metrics.averageFitness * 100).toFixed(1)}%`);

    try {
      // Phase 1: Evaluate fitness
      await this.runPhase(cycle, 'evaluate', this.evaluate.bind(this));

      // Phase 2: Cull underperformers
      await this.runPhase(cycle, 'cull', this.cull.bind(this));

      // Phase 3: Breed new offspring
      await this.runPhase(cycle, 'breed', this.breed.bind(this));

      // Phase 4: Distill (cloud training)
      await this.runPhase(cycle, 'distill', this.distill.bind(this));

      // Phase 5: Quarantine (testing)
      await this.runPhase(cycle, 'quarantine', this.quarantine.bind(this));

      // Phase 6: Promote successful offspring
      await this.runPhase(cycle, 'promote', this.promote.bind(this));

      // Mark complete
      cycle.phase = 'complete';
      cycle.completedAt = new Date();
      cycle.metrics = this.calculateFinalMetrics(cycle);

      // Store in history
      this.cycleHistory.push(cycle);
      this.currentCycle = null;
      this.notifyListeners(cycle);

      console.log(`[NightSchool] Cycle complete in ${this.calculateDuration(cycle)}ms`);
      console.log(`[NightSchool] Final metrics: avg=${(cycle.metrics.averageFitness * 100).toFixed(1)}%, improvement=${(cycle.metrics.improvementRate * 100).toFixed(2)}%`);

      return cycle;

    } catch (error) {
      console.error('[NightSchool] Cycle failed:', error);
      cycle.phase = 'complete';
      cycle.completedAt = new Date();
      this.currentCycle = null;
      throw error;
    }
  }

  /**
   * Runs a single evolution phase.
   * 
   * @param cycle - The current evolution cycle
   * @param phase - The phase to run
   * @param handler - The phase handler function
   * @private
   */
  private async runPhase(
    cycle: EvolutionCycle,
    phase: EvolutionPhase,
    handler: (cycle: EvolutionCycle) => Promise<void>
  ): Promise<void> {
    console.log(`[NightSchool] Phase: ${phase}`);
    cycle.phase = phase;
    this.notifyListeners(cycle);
    await handler(cycle);
  }

  // ============================================
  // Phase Implementations
  // ============================================

  /**
   * Phase 1: Evaluate species fitness.
   * 
   * Scores each species based on:
   * - Task success rate
   * - Task impact weight
   * - Response latency
   * - Output quality
   * 
   * @param cycle - Current evolution cycle
   * @private
   */
  private async evaluate(cycle: EvolutionCycle): Promise<void> {
    console.log(`[NightSchool] Evaluating ${cycle.population.length} species`);

    for (const species of cycle.population) {
      const score = this.calculateFitness(species);
      speciesRegistry.updateFitness(species.name, score.compositeScore);
      
      console.log(`[NightSchool]   ${species.name}: fitness=${(score.compositeScore * 100).toFixed(1)}%`);
    }

    // Simulate evaluation work
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Phase 2: Cull underperforming species.
   * 
   * Species with fitness below minFitnessThreshold are moved
   * to the graveyard. They are not deleted but archived.
   * 
   * @param cycle - Current evolution cycle
   * @private
   */
  private async cull(cycle: EvolutionCycle): Promise<void> {
    const toRemove: Species[] = [];

    for (const species of cycle.population) {
      if (species.fitness < this.config.minFitnessThreshold) {
        toRemove.push(species);
        cycle.graveyard.push(species);
        console.log(`[NightSchool]   Culled ${species.name} (fitness: ${(species.fitness * 100).toFixed(1)}%)`);
      }
    }

    console.log(`[NightSchool] Culled ${toRemove.length} species`);
    
    // In a real system, we'd archive to persistent storage
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Phase 3: Breed new offspring.
   * 
   * Top 50% of population becomes breeders.
   * Offspring are created through genetic crossover with mutation.
   * 
   * @param cycle - Current evolution cycle
   * @private
   */
  private async breed(cycle: EvolutionCycle): Promise<void> {
    // Sort by fitness (descending)
    const sorted = [...cycle.population].sort((a, b) => b.fitness - a.fitness);
    
    // Select top 50% as breeders
    const breeders = sorted.slice(0, Math.ceil(this.config.populationSize / 2));
    
    console.log(`[NightSchool] ${breeders.length} breeders selected`);
    
    // Create offspring through crossover
    for (let i = 0; i < breeders.length - 1; i += 2) {
      if (Math.random() < this.config.crossoverRate) {
        try {
          const child = speciesRegistry.createOffspring(
            breeders[i].name,
            breeders[i + 1].name
          );
          cycle.offspring.push(child);
          console.log(`[NightSchool]   Created offspring from ${breeders[i].name} + ${breeders[i + 1].name}`);
        } catch {
          // Breeding failed (e.g., same parent species)
          console.log(`[NightSchool]   Breeding failed for pair ${i}`);
        }
      }
    }

    console.log(`[NightSchool] Created ${cycle.offspring.length} offspring`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Phase 4: Distill - Cloud training simulation.
   * 
   * In production, this would send offspring to cloud for fine-tuning.
   * Currently simulates training with random fitness improvement.
   * 
   * @param cycle - Current evolution cycle
   * @private
   */
  private async distill(cycle: EvolutionCycle): Promise<void> {
    console.log(`[NightSchool] Distilling ${cycle.offspring.length} offspring`);

    for (const offspring of cycle.offspring) {
      // Simulate training: improve fitness slightly
      const trainingGain = Math.random() * 0.2;
      offspring.fitness = 0.5 + trainingGain;
      console.log(`[NightSchool]   ${offspring.name}: fitness after distillation = ${(offspring.fitness * 100).toFixed(1)}%`);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Phase 5: Quarantine - Test offspring in sandbox.
   * 
   * Offspring are tested with sample tasks. Those that fail
   * are moved to the graveyard.
   * 
   * Pass rate: 80%
   * 
   * @param cycle - Current evolution cycle
   * @private
   */
  private async quarantine(cycle: EvolutionCycle): Promise<void> {
    const passRate = 0.8;
    const initialCount = cycle.offspring.length;
    const failed: Species[] = [];

    for (const offspring of cycle.offspring) {
      // Simulate test: 80% pass rate
      const testSuccess = Math.random() < passRate;
      
      if (!testSuccess) {
        failed.push(offspring);
      }
    }

    // Remove failed offspring
    for (const failed_species of failed) {
      const index = cycle.offspring.indexOf(failed_species);
      if (index > -1) {
        cycle.offspring.splice(index, 1);
        cycle.graveyard.push(failed_species);
      }
    }

    console.log(`[NightSchool] Quarantine: ${cycle.offspring.length}/${initialCount} passed`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Phase 6: Promote successful offspring.
   * 
   * Offspring that passed quarantine are added to the main population.
   * 
   * @param cycle - Current evolution cycle
   * @private
   */
  private async promote(cycle: EvolutionCycle): Promise<void> {
    console.log(`[NightSchool] Promoting ${cycle.offspring.length} offspring`);

    for (const offspring of cycle.offspring) {
      speciesRegistry.update(offspring.name, {
        fitness: offspring.fitness,
        generation: offspring.generation,
      });
      console.log(`[NightSchool]   Promoted ${offspring.name} (gen ${offspring.generation})`);
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // ============================================
  // Fitness Calculation
  // ============================================

  /**
   * Calculates the fitness score for a species.
   * 
   * Fitness is a weighted combination of:
   * - Success rate (40%)
   * - Impact weight (20%)
   * - Latency score (20%)
   * - Quality score (20%)
   * 
   * @param species - The species to evaluate
   * @returns Complete fitness score breakdown
   * @private
   */
  private calculateFitness(species: Species): FitnessScore {
    // Base fitness from current score
    const baseFitness = species.fitness;
    
    // Trait bonus (average of all traits)
    const traitValues = Object.values(species.traits);
    const traitBonus = traitValues.reduce((a, b) => a + b, 0) / traitValues.length;
    
    const score: FitnessScore = {
      speciesId: species.name,
      
      // Success rate: base fitness with some variance
      successRate: Math.min(1, baseFitness * 0.7 + 0.15 + (Math.random() * 0.1 - 0.05)),
      
      // Impact: evolved species have more impact
      impactWeight: species.generation > 0 ? 0.1 : 0.05,
      
      // Latency: faster species score higher
      latencyScore: (species.traits.speed || 0.5) * 0.8 + 0.1,
      
      // Quality: thorough and patient species produce better output
      qualityScore: ((species.traits.thoroughness || 0.5) + (species.traits.patience || 0.5)) / 2,
      
      compositeScore: 0,
    };

    // Calculate weighted composite
    score.compositeScore =
      score.successRate * 0.4 +
      score.impactWeight * 0.2 +
      score.latencyScore * 0.2 +
      score.qualityScore * 0.2;

    // Clamp to valid range
    score.compositeScore = Math.max(0, Math.min(1, score.compositeScore));

    return score;
  }

  // ============================================
  // Metrics Calculation
  // ============================================

  /**
   * Calculates initial metrics for the cycle.
   * 
   * @returns Initial evolution metrics
   * @private
   */
  private calculateInitialMetrics(): EvolutionMetrics {
    const population = speciesRegistry.getAll();
    const fitnesses = population.map(s => s.fitness);

    return {
      averageFitness: this.calculateAverage(fitnesses),
      bestFitness: Math.max(...fitnesses, 0),
      worstFitness: Math.min(...fitnesses, 1),
      diversityIndex: this.calculateDiversity(population),
      improvementRate: 0,
    };
  }

  /**
   * Calculates final metrics after evolution.
   * 
   * @param cycle - The completed evolution cycle
   * @returns Final evolution metrics
   * @private
   */
  private calculateFinalMetrics(cycle: EvolutionCycle): EvolutionMetrics {
    const population = speciesRegistry.getAll();
    const fitnesses = population.map(s => s.fitness);

    // Get previous metrics for comparison
    const previousMetrics = this.cycleHistory.length > 0
      ? this.cycleHistory[this.cycleHistory.length - 1].metrics
      : null;

    const currentAvg = this.calculateAverage(fitnesses);
    const previousAvg = previousMetrics?.averageFitness || currentAvg;

    // Calculate improvement rate
    const improvementRate = previousAvg > 0 
      ? (currentAvg - previousAvg) / previousAvg 
      : 0;

    return {
      averageFitness: currentAvg,
      bestFitness: Math.max(...fitnesses, 0),
      worstFitness: Math.min(...fitnesses, 1),
      diversityIndex: this.calculateDiversity(population),
      improvementRate,
    };
  }

  /**
   * Calculates the average of an array of numbers.
   * 
   * @param values - Array of numbers
   * @returns Average value (0 if empty)
   * @private
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Calculates the genetic diversity index.
   * 
   * Diversity is measured as the standard deviation of traits
   * across the population. Higher diversity = healthier population.
   * 
   * @param population - Array of species
   * @returns Diversity index (0+)
   * @private
   */
  private calculateDiversity(population: Species[]): number {
    const traitKeys = ['patience', 'thoroughness', 'creativity', 'speed'] as const;
    let totalVariance = 0;

    for (const key of traitKeys) {
      const values = population.map(s => s.traits[key] || 0.5);
      const mean = this.calculateAverage(values);
      const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
      totalVariance += variance;
    }

    // Return standard deviation of variance
    return Math.sqrt(totalVariance / traitKeys.length);
  }

  /**
   * Calculates the duration of a cycle in milliseconds.
   * 
   * @param cycle - The evolution cycle
   * @returns Duration in ms
   * @private
   */
  private calculateDuration(cycle: EvolutionCycle): number {
    if (!cycle.completedAt) return 0;
    return cycle.completedAt.getTime() - cycle.startedAt.getTime();
  }

  // ============================================
  // Query Methods
  // ============================================

  /**
   * Gets the currently running evolution cycle.
   * 
   * @returns Current cycle, or null if idle
   */
  getCurrentCycle(): EvolutionCycle | null {
    return this.currentCycle;
  }

  /**
   * Gets the history of all completed evolution cycles.
   * 
   * @returns Array of completed cycles (oldest first)
   */
  getCycleHistory(): EvolutionCycle[] {
    return this.cycleHistory;
  }

  /**
   * Gets the most recent completed cycle.
   * 
   * @returns Last completed cycle, or undefined if none
   */
  getLastCycle(): EvolutionCycle | undefined {
    return this.cycleHistory[this.cycleHistory.length - 1];
  }

  /**
   * Gets the number of completed cycles.
   * 
   * @returns Number of completed cycles
   */
  getCycleCount(): number {
    return this.cycleHistory.length;
  }

  /**
   * Clears the cycle history.
   * 
   * Useful for freeing memory in long-running instances.
   */
  clearHistory(): void {
    this.cycleHistory = [];
    console.log('[NightSchool] History cleared');
  }

  // ============================================
  // Event Handling
  // ============================================

  /**
   * Subscribes to evolution cycle updates.
   * 
   * The listener is called:
   * - When a cycle starts
   * - When each phase completes
   * - When a cycle completes
   * 
   * @param listener - Callback function receiving cycle updates
   * @returns Unsubscribe function
   * 
   * @example
   * ```typescript
   * const unsubscribe = nightSchool.subscribe((cycle) => {
   *   if (cycle.phase === 'complete') {
   *     console.log('Evolution done:', cycle.metrics);
   *   }
   * });
   * ```
   */
  subscribe(listener: (cycle: EvolutionCycle) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifies all listeners of a cycle update.
   * 
   * @param cycle - The updated cycle
   * @private
   */
  private notifyListeners(cycle: EvolutionCycle): void {
    this.listeners.forEach(listener => {
      try {
        listener(cycle);
      } catch (error) {
        console.error('[NightSchool] Listener error:', error);
      }
    });
  }
}

// ============================================
// Singleton Export
// ============================================

/**
 * Singleton instance of the Night School evolution system.
 * 
 * @example
 * ```typescript
 * import { nightSchool } from '@/lib/night-school';
 * 
 * // Start automatic scheduling
 * nightSchool.start();
 * ```
 */
export const nightSchool = new NightSchool();
