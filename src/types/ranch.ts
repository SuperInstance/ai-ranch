/**
 * SuperInstance AI Ranch - Core Types
 * Adapted from Rust architecture for Next.js/TypeScript
 */

// ============================================
// Species Types
// ============================================

export type SpeciesName = 
  | 'cattle'   // Heavy reasoning, analysis
  | 'duck'     // Network, API calls
  | 'goat'     // Navigation, spatial
  | 'sheep'    // Consensus, voting
  | 'horse'    // ETL, data pipelines
  | 'falcon'   // Search, reconnaissance
  | 'hog'      // Logging, diagnostics
  | 'chicken'; // Monitoring, alerts

export interface Species {
  name: SpeciesName;
  description: string;
  capabilities: string[];
  modelHint: string;
  loraAdapter?: string;
  traits: Record<string, number>;
  fitness: number;
  generation: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Breed.md DNA System
// ============================================

export interface BreedDNA {
  species: SpeciesName;
  name: string;
  description: string;
  capabilities: Capability[];
  personality: Personality;
  constraints: Constraint[];
  modelConfig: ModelConfig;
  evolution: EvolutionConfig;
}

export interface Capability {
  name: string;
  weight: number;
  examples: string[];
}

export interface Personality {
  tone: 'formal' | 'casual' | 'technical' | 'friendly';
  verbosity: 'concise' | 'normal' | 'detailed';
  creativity: number; // 0-1
  riskTolerance: number; // 0-1
}

export interface Constraint {
  type: 'forbidden' | 'required' | 'preferred';
  content: string;
}

export interface ModelConfig {
  baseModel: string;
  loraAdapters: string[];
  temperature: number;
  maxTokens: number;
  topP: number;
}

export interface EvolutionConfig {
  mutationRate: number;
  crossoverRate: number;
  selectionPressure: number;
  eliteCount: number;
}

// ============================================
// Collie Orchestrator
// ============================================

export interface Intent {
  id: string;
  content: string;
  source: Channel;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

export interface Channel {
  type: 'discord' | 'telegram' | 'slack' | 'web' | 'api';
  channelId: string;
  userId: string;
}

export interface RoutingDecision {
  species: SpeciesName;
  confidence: number;
  reasoning: string;
  alternativeSpecies: SpeciesName[];
}

export interface Task {
  id: string;
  intent: Intent;
  routing: RoutingDecision;
  species: Species;
  status: TaskStatus;
  result?: TaskResult;
  startedAt: Date;
  completedAt?: Date;
}

export type TaskStatus = 
  | 'queued' 
  | 'routing' 
  | 'processing' 
  | 'completed' 
  | 'failed';

export interface TaskResult {
  success: boolean;
  output: string;
  tokensUsed: number;
  latencyMs: number;
  metadata: Record<string, unknown>;
}

// ============================================
// Night School Evolution
// ============================================

export interface EvolutionCycle {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  phase: EvolutionPhase;
  population: Species[];
  offspring: Species[];
  graveyard: Species[];
  metrics: EvolutionMetrics;
}

export type EvolutionPhase = 
  | 'evaluate'
  | 'cull'
  | 'breed'
  | 'distill'
  | 'quarantine'
  | 'promote'
  | 'complete';

export interface EvolutionMetrics {
  averageFitness: number;
  bestFitness: number;
  worstFitness: number;
  diversityIndex: number;
  improvementRate: number;
}

export interface FitnessScore {
  speciesId: string;
  successRate: number;
  impactWeight: number;
  latencyScore: number;
  qualityScore: number;
  compositeScore: number;
}

// ============================================
// Memory Pasture (CRDT-like)
// ============================================

export interface Memory {
  id: string;
  content: string;
  embedding?: number[];
  source: string;
  timestamp: Date;
  vectorClock: Record<string, number>;
  tombstone: boolean;
}

export interface MemoryPasture {
  id: string;
  memories: Map<string, Memory>;
  vectorClock: Record<string, number>;
  syncStatus: SyncStatus;
}

export interface SyncStatus {
  lastSync: Date;
  pendingOps: number;
  conflicts: number;
}

// ============================================
// Reflex Cache
// ============================================

export interface ReflexEntry {
  promptHash: string;
  response: string;
  embedding: number[];
  hitCount: number;
  lastUsed: Date;
  createdAt: Date;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardState {
  species: Species[];
  activeTasks: Task[];
  recentActivity: ActivityLog[];
  metrics: SystemMetrics;
  evolutionStatus: EvolutionCycle | null;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'task' | 'evolution' | 'system' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

export interface SystemMetrics {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  tokensPerSecond: number;
  vramUsage: number;
  activeSpecies: number;
  lastEvolution: Date | null;
}

// ============================================
// API Types
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'task_update' | 'evolution' | 'metrics' | 'log';
  payload: unknown;
  timestamp: Date;
}
