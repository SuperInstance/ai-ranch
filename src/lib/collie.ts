/**
 * @fileoverview Collie Orchestrator - Intent Routing System
 * 
 * The Collie Orchestrator is the brain of the AI Ranch, responsible for:
 * - Analyzing incoming intents (user requests)
 * - Routing intents to the most appropriate species
 * - Managing the task lifecycle
 * - Broadcasting task updates to listeners
 * 
 * ## Routing Algorithm
 * 
 * The routing algorithm uses a weighted keyword matching system:
 * 
 * 1. **Keyword Extraction**: The intent content is tokenized and matched
 *    against species-specific keyword dictionaries.
 * 
 * 2. **Scoring**: Each species receives a score based on:
 *    - Number of keyword matches
 *    - Keyword weights (some keywords are more important)
 *    - Species fitness (higher fitness = higher priority)
 * 
 * 3. **Selection**: The highest-scoring species is selected, with
 *    alternatives kept for fallback.
 * 
 * ## Task Lifecycle
 * 
 * ```
 * Intent → Route → Create Task → Process → Complete/Fail
 *    │        │         │           │          │
 *    ▼        ▼         ▼           ▼          ▼
 * Content  Species   Queued    Processing  Result
 * ```
 * 
 * @module lib/collie
 * @see {@link types/ranch.Task}
 * @see {@link types/ranch.RoutingDecision}
 */

import { 
  Intent, 
  RoutingDecision, 
  SpeciesName, 
  Task, 
  TaskResult,
  TaskStatus,
  Species 
} from '@/types/ranch';
import { speciesRegistry } from './species';

// ============================================
// Routing Configuration
// ============================================

/**
 * Keyword configuration for each species type.
 * 
 * Each entry defines:
 * - `keywords`: Words/phrases that indicate this species should handle the intent
 * - `weight`: Importance multiplier for matches (0-1)
 * 
 * Higher weight = more confident routing when keywords match.
 * 
 * @internal
 */
const ROUTING_KEYWORDS: Record<SpeciesName, { keywords: string[]; weight: number }> = {
  /**
   * Cattle keywords: Analysis, reasoning, documentation
   * High weight: Heavy reasoning is cattle's specialty
   */
  cattle: {
    keywords: [
      'analyze', 'explain', 'review', 'email', 'document', 
      'reasoning', 'think', 'consider', 'evaluate', 'assess',
      'examine', 'investigate', 'summarize', 'report', 'detail'
    ],
    weight: 1.0,
  },
  
  /**
   * Duck keywords: APIs, networking, webhooks
   * High weight: Network is duck's specialty
   */
  duck: {
    keywords: [
      'api', 'fetch', 'request', 'http', 'webhook', 
      'call', 'connect', 'endpoint', 'rest', 'graphql',
      'response', 'json', 'status', 'server', 'client'
    ],
    weight: 0.9,
  },
  
  /**
   * Goat keywords: Navigation, paths, spatial
   */
  goat: {
    keywords: [
      'navigate', 'path', 'route', 'find', 'location', 
      'spatial', 'map', 'direction', 'waypoint', 'journey',
      'traverse', 'explore', 'where', 'location'
    ],
    weight: 0.85,
  },
  
  /**
   * Sheep keywords: Consensus, voting, mediation
   */
  sheep: {
    keywords: [
      'consensus', 'vote', 'agree', 'decide', 'together', 
      'group', 'opinion', 'mediation', 'collaborate', 'unanimous',
      'agree', 'compromise', 'settle', 'resolve'
    ],
    weight: 0.8,
  },
  
  /**
   * Horse keywords: ETL, data, pipelines
   */
  horse: {
    keywords: [
      'process', 'transform', 'batch', 'pipeline', 'etl', 
      'data', 'stream', 'extract', 'load', 'convert',
      'migrate', 'sync', 'export', 'import', 'transfer'
    ],
    weight: 0.85,
  },
  
  /**
   * Falcon keywords: Search, quick, fast
   * Very high weight: Speed is falcon's specialty
   */
  falcon: {
    keywords: [
      'search', 'find', 'quick', 'lookup', 'retrieve', 
      'fast', 'scan', 'index', 'query', 'search',
      'instant', 'immediate', 'rapid', 'swift'
    ],
    weight: 0.95,
  },
  
  /**
   * Hog keywords: Debugging, logs, diagnostics
   */
  hog: {
    keywords: [
      'debug', 'log', 'diagnose', 'error', 'trace', 
      'investigate', 'issue', 'problem', 'bug', 'fix',
      'troubleshoot', 'inspect', 'analyze'
    ],
    weight: 0.75,
  },
  
  /**
   * Chicken keywords: Monitoring, alerts, health
   */
  chicken: {
    keywords: [
      'monitor', 'watch', 'alert', 'notify', 'status', 
      'health', 'check', 'observe', 'track', 'supervise',
      'surveillance', 'detect', 'warn'
    ],
    weight: 0.8,
  },
};

// ============================================
// Collie Orchestrator Class
// ============================================

/**
 * Singleton orchestrator that routes intents to species and manages tasks.
 * 
 * The Collie is the central coordinator of the AI Ranch. It:
 * - Receives intents from various channels (Discord, API, Web)
 * - Routes each intent to the most appropriate species
 * - Tracks task progress and updates listeners
 * - Collects feedback to improve future routing
 * 
 * @example
 * ```typescript
 * import { collieOrchestrator } from '@/lib/collie';
 * 
 * // Create an intent
 * const intent: Intent = {
 *   id: 'intent_123',
 *   content: 'Analyze this email and extract action items',
 *   source: { type: 'api', channelId: 'default', userId: 'user_1' },
 *   metadata: {},
 *   timestamp: new Date(),
 * };
 * 
 * // Create and process a task
 * const task = collieOrchestrator.createTask(intent);
 * const result = await collieOrchestrator.processTask(task.id);
 * 
 * console.log('Result:', result.output);
 * ```
 */
export class CollieOrchestrator {
  /** Map of all tasks by ID */
  private tasks: Map<string, Task> = new Map();
  
  /** Queue of pending task IDs (FIFO order) */
  private taskQueue: string[] = [];
  
  /** Set of task update listeners */
  private listeners: Set<(task: Task) => void> = new Set();
  
  /** Counter for generating unique IDs */
  private idCounter: number = 0;

  /**
   * Creates a new Collie Orchestrator instance.
   * 
   * The constructor is private to enforce singleton pattern.
   * Use the exported `collieOrchestrator` instance instead.
   */
  constructor() {
    // Initialize with any required setup
    console.log('[Collie] Orchestrator initialized');
  }

  // ============================================
  // Routing Logic
  // ============================================

  /**
   * Routes an intent to the most appropriate species.
   * 
   * The routing algorithm:
   * 1. Normalize intent content to lowercase
   * 2. Check each species' keywords against the content
   * 3. Calculate scores based on matches and weights
   * 4. Apply species fitness multiplier
   * 5. Return highest-scoring species with alternatives
   * 
   * @param intent - The intent to route
   * @returns Routing decision with species, confidence, and alternatives
   * 
   * @example
   * ```typescript
   * const decision = collie.route(intent);
   * console.log(`Routing to ${decision.species} with ${decision.confidence} confidence`);
   * console.log(`Reasoning: ${decision.reasoning}`);
   * ```
   */
  route(intent: Intent): RoutingDecision {
    // Normalize content for matching
    const content = intent.content.toLowerCase();
    
    // Score tracking for each species
    const scores: Array<{ 
      species: SpeciesName; 
      score: number; 
      matches: string[] 
    }> = [];

    // Evaluate each species
    for (const [speciesName, config] of Object.entries(ROUTING_KEYWORDS)) {
      const matches: string[] = [];
      let score = 0;

      // Count keyword matches
      for (const keyword of config.keywords) {
        if (content.includes(keyword)) {
          matches.push(keyword);
          score += config.weight;
        }
      }

      // Apply species fitness multiplier
      // Higher fitness = higher priority when scores are similar
      const species = speciesRegistry.get(speciesName as SpeciesName);
      if (species) {
        const fitnessMultiplier = 0.5 + (species.fitness * 0.5);
        score *= fitnessMultiplier;
      }

      // Only include species with matches
      if (score > 0) {
        scores.push({ 
          species: speciesName as SpeciesName, 
          score, 
          matches 
        });
      }
    }

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    // No matches: default to cattle (general reasoning)
    if (scores.length === 0) {
      return {
        species: 'cattle',
        confidence: 0.3,
        reasoning: 'No specific keywords matched. Defaulting to cattle for general reasoning.',
        alternativeSpecies: ['falcon', 'horse'],
      };
    }

    // Top match
    const top = scores[0];
    
    // Calculate confidence (normalized to 0-1)
    // Max score would be ~5 (5 keywords with weight 1.0)
    const confidence = Math.min(1, top.score / 5);
    
    // Collect alternatives (next 3 species)
    const alternatives = scores
      .slice(1, 4)
      .map(s => s.species);

    return {
      species: top.species,
      confidence,
      reasoning: `Matched keywords: ${top.matches.join(', ')}. Fitness considered.`,
      alternativeSpecies: alternatives,
    };
  }

  // ============================================
  // Task Management
  // ============================================

  /**
   * Creates a new task from an intent.
   * 
   * The task is:
   * 1. Routed to determine target species
   * 2. Stored in the task map
   * 3. Added to the processing queue
   * 4. Broadcast to listeners
   * 
   * @param intent - The intent to create a task from
   * @returns The created task (status: 'queued')
   * @throws Error if target species is not found
   * 
   * @example
   * ```typescript
   * const task = collie.createTask({
   *   id: 'intent_123',
   *   content: 'Analyze this data',
   *   source: { type: 'api', channelId: 'default', userId: 'user_1' },
   *   metadata: {},
   *   timestamp: new Date(),
   * });
   * ```
   */
  createTask(intent: Intent): Task {
    // Route the intent
    const routing = this.route(intent);
    
    // Get target species
    const species = speciesRegistry.get(routing.species);
    if (!species) {
      throw new Error(`Species ${routing.species} not found in registry`);
    }

    // Create the task
    const task: Task = {
      id: this.generateId(),
      intent,
      routing,
      species,
      status: 'queued',
      startedAt: new Date(),
    };

    // Store and queue
    this.tasks.set(task.id, task);
    this.taskQueue.push(task.id);
    
    // Notify listeners
    this.notifyListeners(task);
    
    console.log(`[Collie] Created task ${task.id} → ${routing.species}`);

    return task;
  }

  /**
   * Processes a task through the assigned species.
   * 
   * Processing involves:
   * 1. Updating status to 'processing'
   * 2. Executing the species' processing logic
   * 3. Recording the result
   * 4. Updating species fitness based on outcome
   * 
   * @param taskId - The ID of the task to process
   * @returns The task result
   * @throws Error if task is not found
   * 
   * @example
   * ```typescript
   * const task = collie.createTask(intent);
   * const result = await collie.processTask(task.id);
   * 
   * if (result.success) {
   *   console.log('Output:', result.output);
   * }
   * ```
   */
  async processTask(taskId: string): Promise<TaskResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Update status
    task.status = 'processing';
    this.notifyListeners(task);

    const startTime = Date.now();

    try {
      // Execute species-specific processing
      const result = await this.executeWithSpecies(task);
      
      // Mark complete
      task.status = 'completed';
      task.completedAt = new Date();
      task.result = result;

      // Reward species for successful task
      if (result.success) {
        const fitnessIncrease = 0.01; // Small increment per success
        const currentFitness = task.species.fitness;
        speciesRegistry.updateFitness(
          task.species.name, 
          currentFitness + fitnessIncrease
        );
      }

      this.notifyListeners(task);
      
      console.log(`[Collie] Task ${taskId} completed in ${result.latencyMs}ms`);
      return result;

    } catch (error) {
      // Mark failed
      task.status = 'failed';
      task.completedAt = new Date();
      task.result = {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error occurred',
        tokensUsed: 0,
        latencyMs: Date.now() - startTime,
        metadata: { 
          error: true,
          errorMessage: error instanceof Error ? error.message : 'Unknown',
        },
      };

      // Penalize species for failure
      const fitnessDecrease = 0.005;
      const currentFitness = task.species.fitness;
      speciesRegistry.updateFitness(
        task.species.name, 
        Math.max(0, currentFitness - fitnessDecrease)
      );

      this.notifyListeners(task);
      
      console.error(`[Collie] Task ${taskId} failed:`, error);
      throw error;
    }
  }

  /**
   * Executes processing with the assigned species.
   * 
   * This method simulates LLM processing based on species traits.
   * In production, this would call the actual LLM API.
   * 
   * @param task - The task to execute
   * @returns Processing result
   * @private
   */
  private async executeWithSpecies(task: Task): Promise<TaskResult> {
    const startTime = Date.now();

    // Calculate processing time based on species speed
    const traits = task.species.traits;
    const baseProcessingTime = 100; // Base 100ms
    const maxAdditionalTime = 400;  // Up to 400ms more for slow species
    const processingTime = baseProcessingTime + 
      ((1 - traits.speed) * maxAdditionalTime);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Generate simulated response
    const response = this.generateResponse(task);

    return {
      success: true,
      output: response,
      tokensUsed: Math.floor(50 + Math.random() * 150),
      latencyMs: Date.now() - startTime,
      metadata: {
        species: task.species.name,
        model: task.species.modelHint,
        simulatedProcessingTime: processingTime,
      },
    };
  }

  /**
   * Generates a species-appropriate response.
   * 
   * @param task - The task being processed
   * @returns Generated response string
   * @private
   */
  private generateResponse(task: Task): string {
    const species = task.species;
    const intent = task.intent.content;

    // Species-specific response templates
    const responses: Record<SpeciesName, string[]> = {
      cattle: [
        `Analysis complete. After thorough consideration of "${intent.slice(0, 30)}...", here's my detailed assessment.`,
        `Let me break this down systematically. First, examining the core request: "${intent.slice(0, 50)}..."`,
        `I've processed your request with careful analysis. The key insights are as follows...`,
      ],
      duck: [
        `API integration successful. Response received from the specified endpoint.`,
        `Connection established. Here's the data returned from your request.`,
        `Network request completed successfully. Status: 200 OK.`,
      ],
      goat: [
        `Optimal path identified. The most efficient route has been calculated.`,
        `Navigation complete. I've mapped the trajectory for your request.`,
        `Spatial analysis finished. The coordinates have been determined.`,
      ],
      sheep: [
        `After considering all perspectives, the consensus indicates...`,
        `The group decision favors the following approach based on available input.`,
        `Mediation complete. The parties have reached agreement on the key points.`,
      ],
      horse: [
        `Pipeline execution complete. Successfully transformed the data.`,
        `Batch processing finished. All records have been processed.`,
        `ETL job completed. Transformations applied successfully.`,
      ],
      falcon: [
        `Quick search complete. Found relevant results in ${Math.floor(Math.random() * 50) + 10}ms.`,
        `Scan finished. The target has been identified quickly.`,
        `Retrieved instantly. Here's what I found.`,
      ],
      hog: [
        `Diagnostic report generated. System status analyzed.`,
        `Log analysis complete. Here's what I discovered in the traces.`,
        `Investigation finished. Root cause has been identified.`,
      ],
      chicken: [
        `Monitoring active. All systems are operational.`,
        `Health check passed. No alerts triggered.`,
        `Status report: Systems are functioning within normal parameters.`,
      ],
    };

    // Select a random response for the species
    const options = responses[species.name] || responses.cattle;
    return options[Math.floor(Math.random() * options.length)];
  }

  // ============================================
  // Task Query Methods
  // ============================================

  /**
   * Retrieves a task by ID.
   * 
   * @param taskId - The task ID to look up
   * @returns The task if found, undefined otherwise
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Gets all currently active tasks.
   * 
   * Active tasks are those with status 'queued' or 'processing'.
   * 
   * @returns Array of active tasks
   */
  getActiveTasks(): Task[] {
    return Array.from(this.tasks.values())
      .filter(t => t.status === 'queued' || t.status === 'processing');
  }

  /**
   * Gets the most recent tasks.
   * 
   * @param limit - Maximum number of tasks to return (default: 10)
   * @returns Array of recent tasks, sorted by start time (newest first)
   */
  getRecentTasks(limit: number = 10): Task[] {
    return Array.from(this.tasks.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Gets the count of tasks by status.
   * 
   * @returns Object with counts for each status
   */
  getTaskCounts(): Record<TaskStatus, number> {
    const counts: Record<TaskStatus, number> = {
      queued: 0,
      routing: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    for (const task of this.tasks.values()) {
      counts[task.status]++;
    }

    return counts;
  }

  /**
   * Clears completed and failed tasks from history.
   * 
   * Keeps active tasks intact.
   */
  clearHistory(): void {
    const activeTasks: Task[] = [];
    
    for (const task of this.tasks.values()) {
      if (task.status === 'queued' || task.status === 'processing') {
        activeTasks.push(task);
      }
    }
    
    this.tasks.clear();
    this.taskQueue = [];
    
    for (const task of activeTasks) {
      this.tasks.set(task.id, task);
      if (task.status === 'queued') {
        this.taskQueue.push(task.id);
      }
    }
    
    console.log(`[Collie] Cleared task history. ${activeTasks.length} active tasks retained.`);
  }

  // ============================================
  // Event Handling
  // ============================================

  /**
   * Subscribes to task updates.
   * 
   * The listener is called whenever a task is created or updated.
   * 
   * @param listener - Callback function receiving task updates
   * @returns Unsubscribe function
   * 
   * @example
   * ```typescript
   * const unsubscribe = collie.subscribe((task) => {
   *   console.log(`Task ${task.id} is now ${task.status}`);
   * });
   * 
   * // Later: stop listening
   * unsubscribe();
   * ```
   */
  subscribe(listener: (task: Task) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifies all listeners of a task update.
   * 
   * @param task - The updated task
   * @private
   */
  private notifyListeners(task: Task): void {
    this.listeners.forEach(listener => {
      try {
        listener(task);
      } catch (error) {
        console.error('[Collie] Listener error:', error);
      }
    });
  }

  /**
   * Generates a unique task ID.
   * 
   * Format: `task_{timestamp}_{random}`
   * 
   * @returns Unique task ID string
   * @private
   */
  private generateId(): string {
    this.idCounter++;
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `task_${timestamp}_${random}`;
  }
}

// ============================================
// Singleton Export
// ============================================

/**
 * Singleton instance of the Collie Orchestrator.
 * 
 * Import this to interact with the routing system.
 * 
 * @example
 * ```typescript
 * import { collieOrchestrator as collie } from '@/lib/collie';
 * 
 * const task = collie.createTask(intent);
 * const result = await collie.processTask(task.id);
 * ```
 */
export const collieOrchestrator = new CollieOrchestrator();
