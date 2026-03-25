/**
 * @fileoverview breed.md Parser - DNA Configuration System
 * 
 * The breed.md parser converts markdown configuration files into structured
 * BreedDNA objects that define agent behavior. This enables "DNA-driven"
 * agent configuration without code changes.
 * 
 * ## breed.md Format
 * 
 * breed.md files use markdown headers to define sections:
 * 
 * ```markdown
 * # species
 * cattle
 * 
 * # name
 * Email Analyst
 * 
 * # capabilities
 * - email_processing (weight: 1.0)
 * - analysis (weight: 0.9)
 * 
 * # personality
 * tone: professional
 * creativity: 0.3
 * ```
 * 
 * ## Sections
 * 
 * | Section | Required | Description |
 * |---------|----------|-------------|
 * | species | Yes | Agent type (cattle, duck, etc.) |
 * | name | Yes | Display name |
 * | description | No | Purpose description |
 * | capabilities | No | Weighted skill list |
 * | personality | No | Behavior settings |
 * | model | No | LLM configuration |
 * | evolution | No | Genetic algorithm params |
 * | constraints | No | Behavioral rules |
 * 
 * ## Hot Reload
 * 
 * The parser supports file watching for live configuration updates:
 * 
 * ```typescript
 * breedParser.watch('./templates/agent.md');
 * breedParser.subscribe((dna, path) => {
 *   speciesRegistry.loadFromDNA(dna);
 * });
 * ```
 * 
 * @module lib/breed-parser
 * @see {@link types/ranch.BreedDNA}
 */

import { 
  BreedDNA, 
  Capability, 
  Personality, 
  ModelConfig, 
  EvolutionConfig, 
  SpeciesName,
  Constraint 
} from '@/types/ranch';
import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';

// ============================================
// Parser Types
// ============================================

/**
 * Result of parsing a breed.md file.
 * 
 * @property success - Whether parsing succeeded
 * @property dna - Parsed DNA configuration (on success)
 * @property errors - Fatal error messages
 * @property warnings - Non-fatal warning messages
 */
export interface ParseResult {
  /** Whether parsing completed without fatal errors */
  success: boolean;
  /** Parsed DNA (only present on success) */
  dna?: BreedDNA;
  /** Fatal error messages that prevented parsing */
  errors: string[];
  /** Non-fatal warnings (e.g., using defaults) */
  warnings: string[];
}

// ============================================
// breed.md Parser Class
// ============================================

/**
 * Parser for breed.md configuration files.
 * 
 * The BreedParser converts markdown files to structured BreedDNA objects.
 * It supports:
 * - Synchronous parsing from strings or files
 * - File watching with hot reload
 * - Comprehensive error and warning reporting
 * 
 * @example
 * ```typescript
 * import { breedParser } from '@/lib/breed-parser';
 * 
 * // Parse a file
 * const result = breedParser.parseFile('./templates/agent.md');
 * if (result.success) {
 *   console.log('Loaded:', result.dna.name);
 * } else {
 *   console.error('Errors:', result.errors);
 * }
 * 
 * // Watch for changes
 * breedParser.watch('./templates/agent.md');
 * breedParser.subscribe((dna, path) => {
 *   console.log('Updated:', dna.name);
 * });
 * ```
 */
export class BreedParser {
  /** Active file watchers by path */
  private watchers: Map<string, chokidar.FSWatcher> = new Map();
  
  /** Subscribers notified on successful parse */
  private listeners: Set<(dna: BreedDNA, path: string) => void> = new Set();

  // ============================================
  // Parsing Logic
  // ============================================

  /**
   * Parses breed.md content from a string.
   * 
   * @param content - Markdown content to parse
   * @returns Parse result with DNA or errors
   * 
   * @example
   * ```typescript
   * const result = parser.parse(`
   * # species
   * cattle
   * 
   * # name
   * Test Agent
   * `);
   * ```
   */
  parse(content: string): ParseResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Extract all sections from markdown
      const sections = this.extractSections(content);
      
      // Validate required sections
      if (!sections.species) {
        errors.push('Missing required section: # species');
      }
      if (!sections.name) {
        errors.push('Missing required section: # name');
      }

      // Return early on fatal errors
      if (errors.length > 0) {
        return { success: false, errors, warnings };
      }

      // Parse each section
      const species = this.parseSpecies(sections.species || '', errors);
      const name = this.parseName(sections.name || '');
      const description = sections.description || '';
      const capabilities = this.parseCapabilities(sections.capabilities || '');
      const personality = this.parsePersonality(sections.personality || '', warnings);
      const modelConfig = this.parseModelConfig(sections.model || '', warnings);
      const evolution = this.parseEvolution(sections.evolution || '', warnings);
      const constraints = this.parseConstraints(sections.constraints || '', warnings);

      const dna: BreedDNA = {
        species,
        name,
        description,
        capabilities,
        personality,
        constraints,
        modelConfig,
        evolution,
      };

      return { success: true, dna, errors, warnings };

    } catch (error) {
      errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, errors, warnings };
    }
  }

  /**
   * Parses a breed.md file from disk.
   * 
   * @param filePath - Path to the breed.md file
   * @returns Parse result with DNA or errors
   */
  parseFile(filePath: string): ParseResult {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      console.log(`[BreedParser] Parsing file: ${filePath}`);
      return this.parse(content);
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
      };
    }
  }

  // ============================================
  // Section Extraction
  // ============================================

  /**
   * Extracts named sections from markdown content.
   * 
   * Sections are defined by markdown headers (# Header).
   * Content follows until the next header.
   * 
   * @param content - Markdown content
   * @returns Map of section name to content
   * @private
   */
  private extractSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      // Match markdown headers: # Header or ## Header
      const headerMatch = line.match(/^#+\s+(.+)$/);
      
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections[currentSection.toLowerCase()] = currentContent.join('\n').trim();
        }
        
        // Start new section
        currentSection = headerMatch[1];
        currentContent = [];
      } else {
        // Add content to current section
        currentContent.push(line);
      }
    }

    // Save final section
    if (currentSection) {
      sections[currentSection.toLowerCase()] = currentContent.join('\n').trim();
    }

    return sections;
  }

  // ============================================
  // Section Parsers
  // ============================================

  /**
   * Parses the species section.
   * 
   * @param content - Section content
   * @param errors - Error array to append to
   * @returns Validated species name
   * @private
   */
  private parseSpecies(content: string, errors: string[]): SpeciesName {
    const speciesMap: Record<string, SpeciesName> = {
      'cattle': 'cattle',
      'duck': 'duck',
      'goat': 'goat',
      'sheep': 'sheep',
      'horse': 'horse',
      'falcon': 'falcon',
      'hog': 'hog',
      'chicken': 'chicken',
    };

    const normalized = content.trim().toLowerCase();
    
    if (speciesMap[normalized]) {
      return speciesMap[normalized];
    }

    errors.push(`Unknown species '${content.trim()}'. Valid options: ${Object.keys(speciesMap).join(', ')}`);
    return 'cattle'; // Default fallback
  }

  /**
   * Parses the name section.
   * 
   * @param content - Section content
   * @returns Agent name
   * @private
   */
  private parseName(content: string): string {
    const name = content.trim();
    return name || 'Unnamed Agent';
  }

  /**
   * Parses the capabilities section.
   * 
   * Format:
   * - capability_name (weight: 0.9)
   * - another_capability
   * 
   * @param content - Section content
   * @returns Array of capabilities
   * @private
   */
  private parseCapabilities(content: string): Capability[] {
    const capabilities: Capability[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Match: - capability_name (weight: 0.8) or just - capability_name
      const match = line.match(/[-*]\s+([\w-]+)(?:\s*\([^)]*weight:\s*([\d.]+)[^)]*\))?/i);
      
      if (match) {
        const name = match[1];
        const weight = match[2] ? parseFloat(match[2]) : 1.0;
        
        capabilities.push({
          name,
          weight: Math.max(0, Math.min(1, weight)),
          examples: [],
        });
      }
    }

    return capabilities;
  }

  /**
   * Parses the personality section.
   * 
   * Format:
   * tone: professional
   * verbosity: concise
   * creativity: 0.3
   * risk_tolerance: 0.2
   * 
   * @param content - Section content
   * @param warnings - Warning array
   * @returns Personality configuration
   * @private
   */
  private parsePersonality(content: string, warnings: string[]): Personality {
    const personality: Personality = {
      tone: 'friendly',
      verbosity: 'normal',
      creativity: 0.5,
      riskTolerance: 0.5,
    };

    const lines = content.split('\n');
    
    for (const line of lines) {
      // Parse tone
      const toneMatch = line.match(/tone:\s*(formal|casual|technical|friendly)/i);
      if (toneMatch) {
        personality.tone = toneMatch[1].toLowerCase() as Personality['tone'];
      }

      // Parse verbosity
      const verbosityMatch = line.match(/verbosity:\s*(concise|normal|detailed)/i);
      if (verbosityMatch) {
        personality.verbosity = verbosityMatch[1].toLowerCase() as Personality['verbosity'];
      }

      // Parse creativity (0-1)
      const creativityMatch = line.match(/creativity:\s*([\d.]+)/i);
      if (creativityMatch) {
        const val = parseFloat(creativityMatch[1]);
        if (val >= 0 && val <= 1) {
          personality.creativity = val;
        } else {
          warnings.push(`Creativity ${val} out of range [0-1], using default 0.5`);
        }
      }

      // Parse risk tolerance (0-1)
      const riskMatch = line.match(/risk[_\s]*tolerance:\s*([\d.]+)/i);
      if (riskMatch) {
        const val = parseFloat(riskMatch[1]);
        if (val >= 0 && val <= 1) {
          personality.riskTolerance = val;
        } else {
          warnings.push(`Risk tolerance ${val} out of range [0-1], using default 0.5`);
        }
      }
    }

    return personality;
  }

  /**
   * Parses the model configuration section.
   * 
   * Format:
   * base_model: phi-3-mini
   * lora: adapter-v1, adapter-v2
   * temperature: 0.7
   * max_tokens: 1024
   * top_p: 0.9
   * 
   * @param content - Section content
   * @param warnings - Warning array
   * @returns Model configuration
   * @private
   */
  private parseModelConfig(content: string, warnings: string[]): ModelConfig {
    const config: ModelConfig = {
      baseModel: 'phi-3-mini',
      loraAdapters: [],
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
    };

    const lines = content.split('\n');

    for (const line of lines) {
      // Parse base model
      const baseModelMatch = line.match(/base[_\s]*model:\s*(.+)/i);
      if (baseModelMatch) {
        config.baseModel = baseModelMatch[1].trim();
      }

      // Parse LoRA adapters (comma-separated)
      const loraMatch = line.match(/lora:\s*(.+)/i);
      if (loraMatch) {
        config.loraAdapters = loraMatch[1]
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      }

      // Parse temperature
      const tempMatch = line.match(/temperature:\s*([\d.]+)/i);
      if (tempMatch) {
        const val = parseFloat(tempMatch[1]);
        if (val >= 0 && val <= 2) {
          config.temperature = val;
        } else {
          warnings.push(`Temperature ${val} unusual (expected 0-2)`);
        }
      }

      // Parse max tokens
      const maxTokensMatch = line.match(/max[_\s]*tokens:\s*(\d+)/i);
      if (maxTokensMatch) {
        config.maxTokens = parseInt(maxTokensMatch[1]);
      }

      // Parse top-p
      const topPMatch = line.match(/top[_\s]*p:\s*([\d.]+)/i);
      if (topPMatch) {
        const val = parseFloat(topPMatch[1]);
        if (val >= 0 && val <= 1) {
          config.topP = val;
        }
      }
    }

    return config;
  }

  /**
   * Parses the evolution configuration section.
   * 
   * Format:
   * mutation_rate: 0.1
   * crossover_rate: 0.7
   * selection_pressure: 0.3
   * elite_count: 2
   * 
   * @param content - Section content
   * @param warnings - Warning array
   * @returns Evolution configuration
   * @private
   */
  private parseEvolution(content: string, warnings: string[]): EvolutionConfig {
    const config: EvolutionConfig = {
      mutationRate: 0.1,
      crossoverRate: 0.7,
      selectionPressure: 0.3,
      eliteCount: 2,
    };

    const lines = content.split('\n');

    for (const line of lines) {
      // Parse mutation rate
      const mutationMatch = line.match(/mutation[_\s]*rate:\s*([\d.]+)/i);
      if (mutationMatch) {
        config.mutationRate = parseFloat(mutationMatch[1]);
      }

      // Parse crossover rate
      const crossoverMatch = line.match(/crossover[_\s]*rate:\s*([\d.]+)/i);
      if (crossoverMatch) {
        config.crossoverRate = parseFloat(crossoverMatch[1]);
      }

      // Parse selection pressure
      const pressureMatch = line.match(/selection[_\s]*pressure:\s*([\d.]+)/i);
      if (pressureMatch) {
        config.selectionPressure = parseFloat(pressureMatch[1]);
      }

      // Parse elite count
      const eliteMatch = line.match(/elite[_\s]*count:\s*(\d+)/i);
      if (eliteMatch) {
        config.eliteCount = parseInt(eliteMatch[1]);
      }
    }

    return config;
  }

  /**
   * Parses the constraints section.
   * 
   * Format:
   * - required: Always do X
   * - forbidden: Never do Y
   * - preferred: Prefer Z when possible
   * 
   * @param content - Section content
   * @param warnings - Warning array
   * @returns Array of constraints
   * @private
   */
  private parseConstraints(content: string, warnings: string[]): Constraint[] {
    const constraints: Constraint[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Match: - type: content
      const match = line.match(/[-*]\s*(required|forbidden|preferred):\s*(.+)/i);
      
      if (match) {
        const type = match[1].toLowerCase() as Constraint['type'];
        const constraintContent = match[2].trim();
        
        constraints.push({
          type,
          content: constraintContent,
        });
      }
    }

    return constraints;
  }

  // ============================================
  // Hot Reload System
  // ============================================

  /**
   * Starts watching a breed.md file for changes.
   * 
   * When the file changes, it is automatically parsed and
   * subscribers are notified.
   * 
   * @param filePath - Path to the file to watch
   * 
   * @example
   * ```typescript
   * breedParser.watch('./templates/agent.md');
   * ```
   */
  watch(filePath: string): void {
    if (this.watchers.has(filePath)) {
      console.log(`[BreedParser] Already watching: ${filePath}`);
      return;
    }

    console.log(`[BreedParser] Watching: ${filePath}`);

    const watcher = chokidar.watch(filePath, {
      persistent: true,
      ignoreInitial: false,
    });

    watcher.on('change', (changedPath) => {
      console.log(`[BreedParser] File changed: ${changedPath}`);
      const result = this.parseFile(changedPath);
      
      if (result.success && result.dna) {
        console.log(`[BreedParser] Successfully parsed: ${result.dna.name}`);
        this.notifyListeners(result.dna, changedPath);
      } else {
        console.error(`[BreedParser] Parse failed:`, result.errors);
      }
    });

    watcher.on('error', (error) => {
      console.error(`[BreedParser] Watcher error:`, error);
    });

    this.watchers.set(filePath, watcher);
  }

  /**
   * Stops watching a file.
   * 
   * @param filePath - Path to stop watching
   */
  unwatch(filePath: string): void {
    const watcher = this.watchers.get(filePath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(filePath);
      console.log(`[BreedParser] Stopped watching: ${filePath}`);
    }
  }

  /**
   * Stops all file watchers.
   */
  unwatchAll(): void {
    for (const [path, watcher] of this.watchers) {
      watcher.close();
    }
    this.watchers.clear();
    console.log(`[BreedParser] Stopped all watchers`);
  }

  /**
   * Subscribes to breed.md updates.
   * 
   * @param listener - Callback receiving parsed DNA and file path
   * @returns Unsubscribe function
   * 
   * @example
   * ```typescript
   * const unsub = breedParser.subscribe((dna, path) => {
   *   console.log(`Updated ${dna.name} from ${path}`);
   *   speciesRegistry.loadFromDNA(dna);
   * });
   * ```
   */
  subscribe(listener: (dna: BreedDNA, path: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifies all subscribers of a parsed DNA update.
   * 
   * @param dna - Parsed DNA configuration
   * @param filePath - Source file path
   * @private
   */
  private notifyListeners(dna: BreedDNA, filePath: string): void {
    this.listeners.forEach(listener => {
      try {
        listener(dna, filePath);
      } catch (error) {
        console.error('[BreedParser] Listener error:', error);
      }
    });
  }

  /**
   * Gets the number of active watchers.
   * 
   * @returns Number of watched files
   */
  getWatcherCount(): number {
    return this.watchers.size;
  }
}

// ============================================
// breed.md Template
// ============================================

/**
 * Example breed.md template for documentation.
 */
export const BREED_TEMPLATE = `# species
cattle

# name
Email Analyst

# description
An agent specialized in processing and analyzing emails with careful reasoning.

# capabilities
- email_processing (weight: 1.0)
- analysis (weight: 0.9)
- summarization (weight: 0.7)
- priority_detection (weight: 0.8)

# personality
tone: professional
verbosity: concise
creativity: 0.3
risk_tolerance: 0.2

# model
base_model: phi-3-mini
lora: cattle-reasoning-v1
temperature: 0.5
max_tokens: 1024
top_p: 0.9

# evolution
mutation_rate: 0.1
crossover_rate: 0.7
selection_pressure: 0.3
elite_count: 2

# constraints
- required: Always include a summary at the end
- forbidden: Never send emails without user approval
- preferred: Use bullet points for clarity
`;

// ============================================
// Singleton Export
// ============================================

/**
 * Singleton instance of the breed.md parser.
 * 
 * @example
 * ```typescript
 * import { breedParser } from '@/lib/breed-parser';
 * 
 * const result = breedParser.parseFile('./agent.md');
 * ```
 */
export const breedParser = new BreedParser();
