/**
 * Collie Orchestrator - Intent Routing System
 * Routes incoming intents to appropriate species
 */

import { 
  Intent, 
  RoutingDecision, 
  SpeciesName, 
  Task, 
  TaskResult,
  TaskStatus 
} from '@/types/ranch';
import { speciesRegistry, SPECIES_DEFAULTS } from './species';

// ============================================
// Intent Keywords for Routing
// ============================================

const ROUTING_KEYWORDS: Record<SpeciesName, { keywords: string[]; weight: number }> = {
  cattle: {
    keywords: ['analyze', 'explain', 'review', 'email', 'document', 'reasoning', 'think', 'consider', 'evaluate'],
    weight: 1.0,
  },
  duck: {
    keywords: ['api', 'fetch', 'request', 'http', 'webhook', 'call', 'connect', 'endpoint'],
    weight: 0.9,
  },
  goat: {
    keywords: ['navigate', 'path', 'route', 'find', 'location', 'spatial', 'map', 'direction'],
    weight: 0.85,
  },
  sheep: {
    keywords: ['consensus', 'vote', 'agree', 'decide', 'together', 'group', 'opinion', 'mediation'],
    weight: 0.8,
  },
  horse: {
    keywords: ['process', 'transform', 'batch', 'pipeline', 'etl', 'data', 'stream', 'extract'],
    weight: 0.85,
  },
  falcon: {
    keywords: ['search', 'find', 'quick', 'lookup', 'retrieve', 'fast', 'scan', 'index'],
    weight: 0.95,
  },
  hog: {
    keywords: ['debug', 'log', 'diagnose', 'error', 'trace', 'investigate', 'issue', 'problem'],
    weight: 0.75,
  },
  chicken: {
    keywords: ['monitor', 'watch', 'alert', 'notify', 'status', 'health', 'check', 'observe'],
    weight: 0.8,
  },
};

// ============================================
// Collie Orchestrator Class
// ============================================

export class CollieOrchestrator {
  private tasks: Map<string, Task> = new Map();
  private taskQueue: string[] = [];
  private listeners: Set<(task: Task) => void> = new Set();

  constructor() {
    // Initialize
  }

  // ============================================
  // Routing Logic
  // ============================================

  route(intent: Intent): RoutingDecision {
    const content = intent.content.toLowerCase();
    const scores: Array<{ species: SpeciesName; score: number; matches: string[] }> = [];

    // Score each species based on keyword matches
    for (const [speciesName, config] of Object.entries(ROUTING_KEYWORDS)) {
      const matches: string[] = [];
      let score = 0;

      for (const keyword of config.keywords) {
        if (content.includes(keyword)) {
          matches.push(keyword);
          score += config.weight;
        }
      }

      // Consider species fitness
      const species = speciesRegistry.get(speciesName as SpeciesName);
      if (species) {
        score *= (0.5 + species.fitness * 0.5); // Fitness multiplier
      }

      if (score > 0) {
        scores.push({ species: speciesName as SpeciesName, score, matches });
      }
    }

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    if (scores.length === 0) {
      // Default to cattle for general reasoning
      return {
        species: 'cattle',
        confidence: 0.3,
        reasoning: 'No specific keywords matched, defaulting to general reasoning agent',
        alternativeSpecies: ['falcon', 'horse'],
      };
    }

    const top = scores[0];
    const alternatives = scores.slice(1, 4).map(s => s.species);

    return {
      species: top.species,
      confidence: Math.min(1, top.score / 5), // Normalize confidence
      reasoning: `Matched keywords: ${top.matches.join(', ')}. Species fitness considered.`,
      alternativeSpecies: alternatives,
    };
  }

  // ============================================
  // Task Management
  // ============================================

  createTask(intent: Intent): Task {
    const routing = this.route(intent);
    const species = speciesRegistry.get(routing.species);
    
    if (!species) {
      throw new Error(`Species ${routing.species} not found in registry`);
    }

    const task: Task = {
      id: this.generateId(),
      intent,
      routing,
      species,
      status: 'queued',
      startedAt: new Date(),
    };

    this.tasks.set(task.id, task);
    this.taskQueue.push(task.id);
    this.notifyListeners(task);

    return task;
  }

  async processTask(taskId: string): Promise<TaskResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    task.status = 'processing';
    this.notifyListeners(task);

    const startTime = Date.now();

    try {
      // Simulate processing (in real implementation, this would call LLM)
      const result = await this.executeWithSpecies(task);
      
      task.status = 'completed';
      task.completedAt = new Date();
      task.result = result;

      // Update species fitness based on result
      if (result.success) {
        const currentFitness = task.species.fitness;
        speciesRegistry.updateFitness(task.species.name, currentFitness + 0.01);
      }

      this.notifyListeners(task);
      return result;

    } catch (error) {
      task.status = 'failed';
      task.completedAt = new Date();
      task.result = {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error',
        tokensUsed: 0,
        latencyMs: Date.now() - startTime,
        metadata: {},
      };

      this.notifyListeners(task);
      throw error;
    }
  }

  private async executeWithSpecies(task: Task): Promise<TaskResult> {
    const startTime = Date.now();

    // Simulate LLM processing based on species traits
    const traits = task.species.traits;
    const processingTime = 100 + (1 - traits.speed) * 400; // 100-500ms
    
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Generate a simulated response
    const response = this.generateResponse(task);

    return {
      success: true,
      output: response,
      tokensUsed: Math.floor(50 + Math.random() * 150),
      latencyMs: Date.now() - startTime,
      metadata: {
        species: task.species.name,
        model: task.species.modelHint,
      },
    };
  }

  private generateResponse(task: Task): string {
    const species = task.species;
    const intent = task.intent.content;

    // Generate species-appropriate response
    const responses: Record<SpeciesName, string[]> = {
      cattle: [
        `Analysis complete. After thorough consideration of "${intent.slice(0, 30)}...", here's my detailed assessment...`,
        `Let me break this down systematically. First, examining the core request...`,
        `I've processed your request with careful analysis. The key points are...`,
      ],
      duck: [
        `API integration successful. Response received from endpoint.`,
        `Connection established. Here's the data from your request.`,
        `Network request completed. Status: OK.`,
      ],
      goat: [
        `Optimal path identified. The route has been calculated.`,
        `Navigation complete. I've mapped the most efficient approach.`,
        `Spatial analysis finished. Here's the trajectory.`,
      ],
      sheep: [
        `After considering all perspectives, the consensus is...`,
        `The group decision favors the following approach...`,
        `Mediation complete. All parties agree on...`,
      ],
      horse: [
        `Pipeline execution complete. Transformed 1,024 records.`,
        `Batch processing finished. Data extracted and loaded.`,
        `ETL job done. All transformations applied successfully.`,
      ],
      falcon: [
        `Quick search complete. Found 3 relevant results.`,
        `Scan finished. Target identified in 12ms.`,
        `Retrieved. Here's what I found instantly.`,
      ],
      hog: [
        `Diagnostic report generated. System status: nominal.`,
        `Log analysis complete. No critical errors detected.`,
        `Investigation finished. Root cause identified.`,
      ],
      chicken: [
        `Monitoring active. All systems operational.`,
        `Health check passed. No alerts triggered.`,
        `Status report: Everything looks good.`,
      ],
    };

    const options = responses[species.name] || responses.cattle;
    return options[Math.floor(Math.random() * options.length)];
  }

  // ============================================
  // Task Query Methods
  // ============================================

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getActiveTasks(): Task[] {
    return Array.from(this.tasks.values())
      .filter(t => t.status === 'queued' || t.status === 'processing');
  }

  getRecentTasks(limit: number = 10): Task[] {
    return Array.from(this.tasks.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  // ============================================
  // Event Handling
  // ============================================

  subscribe(listener: (task: Task) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(task: Task): void {
    this.listeners.forEach(listener => listener(task));
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const collieOrchestrator = new CollieOrchestrator();
