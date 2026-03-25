/**
 * @fileoverview SuperInstance AI Ranch - Core Type Definitions
 * 
 * This module defines all TypeScript types and interfaces used throughout
 * the AI Ranch system. The types are organized into logical categories:
 * 
 * - Species Types: Agent definitions and capabilities
 * - Breed DNA: Configuration system for agent behavior
 * - Collie Orchestrator: Intent routing and task management
 * - Night School: Evolution and genetic algorithms
 * - Memory Pasture: Distributed memory system
 * - Dashboard: UI state management
 * - API: Request/response types
 * 
 * @module types/ranch
 * @version 0.3.0
 * @author SuperInstance Team
 * @license MIT
 */

// ============================================
// Species Types
// ============================================

/**
 * Enumeration of all available species types in the AI Ranch.
 * 
 * Each species represents a specialized agent type with unique traits
 * and capabilities optimized for specific tasks.
 * 
 * @example
 * ```typescript
 * const speciesName: SpeciesName = 'cattle';
 * ```
 */
export type SpeciesName = 
  | 'cattle'   /** Heavy reasoning, analysis, email processing */
  | 'duck'     /** Network operations, API calls, webhooks */
  | 'goat'     /** Navigation, spatial reasoning, pathfinding */
  | 'sheep'    /** Consensus building, voting, mediation */
  | 'horse'    /** ETL, data pipelines, batch processing */
  | 'falcon'   /** Fast search, reconnaissance, quick lookups */
  | 'hog'      /** Logging, diagnostics, debugging */
  | 'chicken'; /** Monitoring, alerts, health checks */

/**
 * Represents a single species (agent) in the AI Ranch.
 * 
 * Species are the fundamental unit of computation in the Ranch.
 * Each species has unique traits, capabilities, and a fitness score
 * that determines its priority in task routing.
 * 
 * @property name - Unique identifier for the species type
 * @property description - Human-readable description of the species' purpose
 * @property capabilities - List of capability names this species possesses
 * @property modelHint - Recommended model for this species (e.g., 'phi-3-mini')
 * @property loraAdapter - Optional LoRA adapter name for specialized behavior
 * @property traits - Key-value map of trait scores (0-1 scale)
 * @property fitness - Current fitness score (0-1), updated by Night School
 * @property generation - Evolution generation (0 = original, higher = evolved)
 * @property createdAt - Timestamp when species was created
 * @property updatedAt - Timestamp when species was last modified
 * 
 * @example
 * ```typescript
 * const cattle: Species = {
 *   name: 'cattle',
 *   description: 'Heavy reasoning agent for complex analysis',
 *   capabilities: ['reasoning', 'analysis', 'email-processing'],
 *   modelHint: 'phi-3-mini',
 *   loraAdapter: 'cattle-reasoning-v1',
 *   traits: { patience: 0.9, thoroughness: 0.85, creativity: 0.4, speed: 0.3 },
 *   fitness: 0.75,
 *   generation: 2,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * };
 * ```
 */
export interface Species {
  /** Unique species identifier */
  name: SpeciesName;
  /** Human-readable description */
  description: string;
  /** List of capability names */
  capabilities: string[];
  /** Recommended model identifier */
  modelHint: string;
  /** Optional LoRA adapter name */
  loraAdapter?: string;
  /** Trait scores (0-1): patience, thoroughness, creativity, speed */
  traits: Record<string, number>;
  /** Fitness score (0-1), updated by Night School evolution */
  fitness: number;
  /** Evolution generation number */
  generation: number;
  /** Creation timestamp */
  createdAt: Date;
  /** Last modification timestamp */
  updatedAt: Date;
}

// ============================================
// Breed.md DNA System
// ============================================

/**
 * Complete DNA configuration parsed from a breed.md file.
 * 
 * BreedDNA represents the complete genetic makeup of an agent,
 * defining its species type, capabilities, personality, and behavior.
 * 
 * @property species - The species type this DNA configures
 * @property name - Display name for the agent
 * @property description - Purpose and role description
 * @property capabilities - Weighted list of capabilities
 * @property personality - Behavioral personality settings
 * @property constraints - Behavioral constraints (required/forbidden/preferred)
 * @property modelConfig - Model and inference settings
 * @property evolution - Evolution algorithm parameters
 * 
 * @example
 * ```typescript
 * const dna: BreedDNA = {
 *   species: 'cattle',
 *   name: 'Email Analyst',
 *   description: 'Specialized email processing agent',
 *   capabilities: [
 *     { name: 'email_processing', weight: 1.0, examples: [] },
 *     { name: 'analysis', weight: 0.9, examples: [] }
 *   ],
 *   personality: { tone: 'professional', verbosity: 'concise', creativity: 0.3, riskTolerance: 0.2 },
 *   constraints: [
 *     { type: 'required', content: 'Always include a summary' }
 *   ],
 *   modelConfig: { baseModel: 'phi-3-mini', loraAdapters: [], temperature: 0.5, maxTokens: 1024, topP: 0.9 },
 *   evolution: { mutationRate: 0.1, crossoverRate: 0.7, selectionPressure: 0.3, eliteCount: 2 }
 * };
 * ```
 */
export interface BreedDNA {
  /** Target species type */
  species: SpeciesName;
  /** Display name */
  name: string;
  /** Description of purpose */
  description: string;
  /** Weighted capabilities */
  capabilities: Capability[];
  /** Personality settings */
  personality: Personality;
  /** Behavioral constraints */
  constraints: Constraint[];
  /** Model configuration */
  modelConfig: ModelConfig;
  /** Evolution parameters */
  evolution: EvolutionConfig;
}

/**
 * A single capability with weight and examples.
 * 
 * Capabilities define what an agent can do. The weight (0-1) indicates
 * the relative importance of this capability.
 */
export interface Capability {
  /** Capability name (kebab-case) */
  name: string;
  /** Weight/importance (0-1) */
  weight: number;
  /** Example prompts demonstrating the capability */
  examples: string[];
}

/**
 * Personality settings that influence agent behavior.
 * 
 * Personality traits affect how an agent communicates and approaches problems.
 */
export interface Personality {
  /** Communication tone */
  tone: 'formal' | 'casual' | 'technical' | 'friendly';
  /** Output verbosity level */
  verbosity: 'concise' | 'normal' | 'detailed';
  /** Creativity level (0 = deterministic, 1 = highly creative) */
  creativity: number;
  /** Risk tolerance (0 = conservative, 1 = adventurous) */
  riskTolerance: number;
}

/**
 * A behavioral constraint for an agent.
 * 
 * Constraints define hard or soft rules for agent behavior.
 */
export interface Constraint {
  /** Constraint type */
  type: 'forbidden' | 'required' | 'preferred';
  /** Constraint description */
  content: string;
}

/**
 * Model configuration for LLM inference.
 * 
 * Defines which model to use and how to configure inference parameters.
 */
export interface ModelConfig {
  /** Base model identifier */
  baseModel: string;
  /** LoRA adapter names to apply */
  loraAdapters: string[];
  /** Sampling temperature (0-2) */
  temperature: number;
  /** Maximum tokens to generate */
  maxTokens: number;
  /** Top-p sampling parameter */
  topP: number;
}

/**
 * Evolution algorithm configuration.
 * 
 * These parameters control the genetic algorithm used in Night School evolution.
 */
export interface EvolutionConfig {
  /** Mutation rate (0-1) */
  mutationRate: number;
  /** Crossover rate (0-1) */
  crossoverRate: number;
  /** Selection pressure (0-1) */
  selectionPressure: number;
  /** Number of elite individuals to preserve */
  eliteCount: number;
}

// ============================================
// Collie Orchestrator
// ============================================

/**
 * An incoming intent from a user or system.
 * 
 * Intents represent user requests that need to be routed to an appropriate species.
 */
export interface Intent {
  /** Unique intent identifier */
  id: string;
  /** The user's request content */
  content: string;
  /** Source channel information */
  source: Channel;
  /** Additional metadata */
  metadata: Record<string, unknown>;
  /** Creation timestamp */
  timestamp: Date;
}

/**
 * Information about the source channel of an intent.
 */
export interface Channel {
  /** Channel type */
  type: 'discord' | 'telegram' | 'slack' | 'web' | 'api';
  /** Channel identifier */
  channelId: string;
  /** User identifier */
  userId: string;
}

/**
 * Routing decision made by the Collie orchestrator.
 * 
 * Contains the selected species and routing confidence.
 */
export interface RoutingDecision {
  /** Selected species */
  species: SpeciesName;
  /** Confidence score (0-1) */
  confidence: number;
  /** Explanation for the routing decision */
  reasoning: string;
  /** Alternative species that could handle this intent */
  alternativeSpecies: SpeciesName[];
}

/**
 * A task being processed by the AI Ranch.
 * 
 * Tasks are created from intents and processed by species.
 */
export interface Task {
  /** Unique task identifier */
  id: string;
  /** Original intent */
  intent: Intent;
  /** Routing decision */
  routing: RoutingDecision;
  /** Species handling this task */
  species: Species;
  /** Current task status */
  status: TaskStatus;
  /** Task result (when complete) */
  result?: TaskResult;
  /** Task start time */
  startedAt: Date;
  /** Task completion time */
  completedAt?: Date;
}

/**
 * Task lifecycle status.
 */
export type TaskStatus = 
  | 'queued'      /** Waiting to be processed */
  | 'routing'     /** Collie is determining species */
  | 'processing'  /** Species is handling the task */
  | 'completed'   /** Task finished successfully */
  | 'failed';     /** Task encountered an error */

/**
 * Result of a completed task.
 */
export interface TaskResult {
  /** Whether the task succeeded */
  success: boolean;
  /** Output/response content */
  output: string;
  /** Number of tokens used */
  tokensUsed: number;
  /** Processing time in milliseconds */
  latencyMs: number;
  /** Additional metadata */
  metadata: Record<string, unknown>;
}

// ============================================
// Night School Evolution
// ============================================

/**
 * A single evolution cycle run by Night School.
 * 
 * Evolution cycles run daily at 02:00 AM to improve the population.
 */
export interface EvolutionCycle {
  /** Unique cycle identifier */
  id: string;
  /** Cycle start time */
  startedAt: Date;
  /** Cycle completion time */
  completedAt?: Date;
  /** Current phase */
  phase: EvolutionPhase;
  /** Current population */
  population: Species[];
  /** Created offspring */
  offspring: Species[];
  /** Removed species */
  graveyard: Species[];
  /** Evolution metrics */
  metrics: EvolutionMetrics;
}

/**
 * Phases of the evolution cycle.
 */
export type EvolutionPhase = 
  | 'evaluate'    /** Score species fitness */
  | 'cull'        /** Remove underperformers */
  | 'breed'       /** Create offspring */
  | 'distill'     /** Cloud training */
  | 'quarantine'  /** Test offspring */
  | 'promote'     /** Promote successful offspring */
  | 'complete';   /** Cycle finished */

/**
 * Metrics from an evolution cycle.
 */
export interface EvolutionMetrics {
  /** Average fitness of population */
  averageFitness: number;
  /** Highest fitness score */
  bestFitness: number;
  /** Lowest fitness score */
  worstFitness: number;
  /** Genetic diversity measure */
  diversityIndex: number;
  /** Rate of improvement from previous cycle */
  improvementRate: number;
}

/**
 * Fitness score for a single species.
 */
export interface FitnessScore {
  /** Species identifier */
  speciesId: string;
  /** Task success rate */
  successRate: number;
  /** Impact weight based on task importance */
  impactWeight: number;
  /** Latency score (higher = faster) */
  latencyScore: number;
  /** Output quality score */
  qualityScore: number;
  /** Composite fitness score */
  compositeScore: number;
}

// ============================================
// Memory Pasture (CRDT-like)
// ============================================

/**
 * A single memory entry in the Memory Pasture.
 * 
 * Memories are stored with CRDT-style metadata for distributed sync.
 */
export interface Memory {
  /** Unique memory identifier */
  id: string;
  /** Memory content */
  content: string;
  /** Optional embedding vector */
  embedding?: number[];
  /** Source identifier */
  source: string;
  /** Creation timestamp */
  timestamp: Date;
  /** Vector clock for CRDT merge */
  vectorClock: Record<string, number>;
  /** Deletion marker */
  tombstone: boolean;
}

/**
 * The Memory Pasture - distributed memory storage.
 */
export interface MemoryPasture {
  /** Pasture identifier */
  id: string;
  /** Stored memories */
  memories: Map<string, Memory>;
  /** Current vector clock */
  vectorClock: Record<string, number>;
  /** Synchronization status */
  syncStatus: SyncStatus;
}

/**
 * Memory synchronization status.
 */
export interface SyncStatus {
  /** Last sync time */
  lastSync: Date;
  /** Pending operations */
  pendingOps: number;
  /** Conflict count */
  conflicts: number;
}

// ============================================
// Reflex Cache
// ============================================

/**
 * An entry in the reflex cache for fast response caching.
 */
export interface ReflexEntry {
  /** Hash of the prompt */
  promptHash: string;
  /** Cached response */
  response: string;
  /** Embedding for similarity matching */
  embedding: number[];
  /** Number of cache hits */
  hitCount: number;
  /** Last access time */
  lastUsed: Date;
  /** Creation time */
  createdAt: Date;
}

// ============================================
// Dashboard Types
// ============================================

/**
 * Complete dashboard state for the UI.
 */
export interface DashboardState {
  /** All species in the ranch */
  species: Species[];
  /** Currently active tasks */
  activeTasks: Task[];
  /** Recent activity log entries */
  recentActivity: ActivityLog[];
  /** System metrics */
  metrics: SystemMetrics;
  /** Current evolution cycle (if running) */
  evolutionStatus: EvolutionCycle | null;
}

/**
 * A single activity log entry.
 */
export interface ActivityLog {
  /** Entry identifier */
  id: string;
  /** Entry timestamp */
  timestamp: Date;
  /** Activity type */
  type: 'task' | 'evolution' | 'system' | 'error';
  /** Activity message */
  message: string;
  /** Additional details */
  details?: Record<string, unknown>;
}

/**
 * System performance metrics.
 */
export interface SystemMetrics {
  /** Total requests processed */
  totalRequests: number;
  /** Success rate (0-1) */
  successRate: number;
  /** Average response latency (ms) */
  averageLatency: number;
  /** Token generation rate */
  tokensPerSecond: number;
  /** VRAM usage percentage */
  vramUsage: number;
  /** Number of active species */
  activeSpecies: number;
  /** Last evolution time */
  lastEvolution: Date | null;
}

// ============================================
// API Types
// ============================================

/**
 * Generic API response wrapper.
 * 
 * All API endpoints return responses in this format.
 * 
 * @template T - Type of the response data
 */
export interface APIResponse<T> {
  /** Whether the request succeeded */
  success: boolean;
  /** Response data (on success) */
  data?: T;
  /** Error message (on failure) */
  error?: string;
  /** Response timestamp */
  timestamp: Date;
}

/**
 * WebSocket message format for real-time updates.
 */
export interface WebSocketMessage {
  /** Message type */
  type: 'task_update' | 'evolution' | 'metrics' | 'log';
  /** Message payload */
  payload: unknown;
  /** Message timestamp */
  timestamp: Date;
}
