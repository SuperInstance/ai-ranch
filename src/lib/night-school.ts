/**
 * Night School - Evolution System
 * Runs at 02:00 to evolve agents through selection, breeding, and promotion
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

export interface NightSchoolConfig {
  scheduleHour: number; // Hour to run (0-23)
  minFitnessThreshold: number;
  maxFitnessThreshold: number;
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  eliteCount: number;
}

const DEFAULT_CONFIG: NightSchoolConfig = {
  scheduleHour: 2, // 02:00
  minFitnessThreshold: 0.3,
  maxFitnessThreshold: 0.95,
  populationSize: 8,
  mutationRate: 0.1,
  crossoverRate: 0.7,
  eliteCount: 2,
};

// ============================================
// Night School Class
// ============================================

export class NightSchool {
  private config: NightSchoolConfig;
  private currentCycle: EvolutionCycle | null = null;
  private cycleHistory: EvolutionCycle[] = [];
  private listeners: Set<(cycle: EvolutionCycle) => void> = new Set();
  private schedulerTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<NightSchoolConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================
  // Scheduling
  // ============================================

  start(): void {
    this.scheduleNext();
  }

  stop(): void {
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  private scheduleNext(): void {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(this.config.scheduleHour, 0, 0, 0);

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delay = nextRun.getTime() - now.getTime();

    this.schedulerTimer = setTimeout(() => {
      this.runCycle();
      this.scheduleNext();
    }, delay);
  }

  // ============================================
  // Evolution Cycle
  // ============================================

  async runCycle(): Promise<EvolutionCycle> {
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

    // Phase 1: Evaluate
    await this.runPhase(cycle, 'evaluate', this.evaluate.bind(this));

    // Phase 2: Cull
    await this.runPhase(cycle, 'cull', this.cull.bind(this));

    // Phase 3: Breed
    await this.runPhase(cycle, 'breed', this.breed.bind(this));

    // Phase 4: Distill (cloud training simulation)
    await this.runPhase(cycle, 'distill', this.distill.bind(this));

    // Phase 5: Quarantine (testing)
    await this.runPhase(cycle, 'quarantine', this.quarantine.bind(this));

    // Phase 6: Promote
    await this.runPhase(cycle, 'promote', this.promote.bind(this));

    // Complete
    cycle.phase = 'complete';
    cycle.completedAt = new Date();
    cycle.metrics = this.calculateFinalMetrics(cycle);

    this.cycleHistory.push(cycle);
    this.currentCycle = null;
    this.notifyListeners(cycle);

    return cycle;
  }

  private async runPhase(
    cycle: EvolutionCycle,
    phase: EvolutionPhase,
    handler: (cycle: EvolutionCycle) => Promise<void>
  ): Promise<void> {
    cycle.phase = phase;
    this.notifyListeners(cycle);
    await handler(cycle);
  }

  // ============================================
  // Phase Implementations
  // ============================================

  private async evaluate(cycle: EvolutionCycle): Promise<void> {
    // Simulate evaluation by scoring each species
    for (const species of cycle.population) {
      const score = this.calculateFitness(species);
      speciesRegistry.updateFitness(species.name, score.compositeScore);
    }

    // Small delay to simulate work
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async cull(cycle: EvolutionCycle): Promise<void> {
    const toRemove: Species[] = [];

    for (const species of cycle.population) {
      if (species.fitness < this.config.minFitnessThreshold) {
        toRemove.push(species);
        cycle.graveyard.push(species);
      }
    }

    // In a real system, we'd archive to graveyard
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private async breed(cycle: EvolutionCycle): Promise<void> {
    // Sort by fitness
    const sorted = [...cycle.population].sort((a, b) => b.fitness - a.fitness);
    
    // Select top performers for breeding
    const breeders = sorted.slice(0, Math.ceil(this.config.populationSize / 2));
    
    // Create offspring through crossover
    for (let i = 0; i < breeders.length - 1; i += 2) {
      if (Math.random() < this.config.crossoverRate) {
        try {
          const child = speciesRegistry.createOffspring(
            breeders[i].name,
            breeders[i + 1].name
          );
          cycle.offspring.push(child);
        } catch {
          // Breeding failed (e.g., same parent)
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async distill(cycle: EvolutionCycle): Promise<void> {
    // Simulate cloud training for offspring
    // In real implementation, this would send to cloud for fine-tuning
    
    for (const offspring of cycle.offspring) {
      // Simulate training progress
      offspring.fitness = 0.5 + Math.random() * 0.2;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async quarantine(cycle: EvolutionCycle): Promise<void> {
    // Test offspring in sandbox
    for (const offspring of cycle.offspring) {
      // Simulate test results
      const testSuccess = Math.random() > 0.2; // 80% pass rate
      
      if (!testSuccess) {
        // Move failed offspring to graveyard
        const index = cycle.offspring.indexOf(offspring);
        if (index > -1) {
          cycle.offspring.splice(index, 1);
          cycle.graveyard.push(offspring);
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private async promote(cycle: EvolutionCycle): Promise<void> {
    // Promote successful offspring to main population
    for (const offspring of cycle.offspring) {
      speciesRegistry.update(offspring.name, {
        fitness: offspring.fitness,
        generation: offspring.generation,
      });
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // ============================================
  // Fitness Calculation
  // ============================================

  private calculateFitness(species: Species): FitnessScore {
    // Simulate fitness metrics
    // In real implementation, this would use actual task history
    const baseFitness = species.fitness;
    const traitBonus = Object.values(species.traits).reduce((a, b) => a + b, 0) / 4;
    
    const score: FitnessScore = {
      speciesId: species.name,
      successRate: baseFitness * 0.7 + 0.15,
      impactWeight: species.generation > 0 ? 0.1 : 0.05,
      latencyScore: species.traits.speed * 0.8 + 0.1,
      qualityScore: (species.traits.thoroughness + species.traits.patience) / 2,
      compositeScore: 0,
    };

    // Calculate composite
    score.compositeScore =
      score.successRate * 0.4 +
      score.impactWeight * 0.2 +
      score.latencyScore * 0.2 +
      score.qualityScore * 0.2;

    // Clamp
    score.compositeScore = Math.max(0, Math.min(1, score.compositeScore));

    return score;
  }

  // ============================================
  // Metrics
  // ============================================

  private calculateInitialMetrics(): EvolutionMetrics {
    const population = speciesRegistry.getAll();
    const fitnesses = population.map(s => s.fitness);

    return {
      averageFitness: fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length,
      bestFitness: Math.max(...fitnesses),
      worstFitness: Math.min(...fitnesses),
      diversityIndex: this.calculateDiversity(population),
      improvementRate: 0,
    };
  }

  private calculateFinalMetrics(cycle: EvolutionCycle): EvolutionMetrics {
    const population = speciesRegistry.getAll();
    const fitnesses = population.map(s => s.fitness);
    const previousMetrics = this.cycleHistory.length > 0
      ? this.cycleHistory[this.cycleHistory.length - 1].metrics
      : null;

    const currentAvg = fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length;
    const previousAvg = previousMetrics?.averageFitness || currentAvg;

    return {
      averageFitness: currentAvg,
      bestFitness: Math.max(...fitnesses),
      worstFitness: Math.min(...fitnesses),
      diversityIndex: this.calculateDiversity(population),
      improvementRate: previousAvg > 0 ? (currentAvg - previousAvg) / previousAvg : 0,
    };
  }

  private calculateDiversity(population: Species[]): number {
    // Simple diversity measure based on trait variance
    const traitKeys = ['patience', 'thoroughness', 'creativity', 'speed'] as const;
    let totalVariance = 0;

    for (const key of traitKeys) {
      const values = population.map(s => s.traits[key]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
      totalVariance += variance;
    }

    return Math.sqrt(totalVariance / traitKeys.length);
  }

  // ============================================
  // Query Methods
  // ============================================

  getCurrentCycle(): EvolutionCycle | null {
    return this.currentCycle;
  }

  getCycleHistory(): EvolutionCycle[] {
    return this.cycleHistory;
  }

  // ============================================
  // Event Handling
  // ============================================

  subscribe(listener: (cycle: EvolutionCycle) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(cycle: EvolutionCycle): void {
    this.listeners.forEach(listener => listener(cycle));
  }
}

// Singleton instance
export const nightSchool = new NightSchool();
