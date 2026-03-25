/**
 * breed.md Parser - DNA Configuration System
 * Parses breed.md files to define agent behavior
 */

import { BreedDNA, Capability, Personality, ModelConfig, EvolutionConfig, SpeciesName } from '@/types/ranch';
import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';

// ============================================
// Parser Types
// ============================================

export interface ParseResult {
  success: boolean;
  dna?: BreedDNA;
  errors: string[];
  warnings: string[];
}

// ============================================
// breed.md Parser Class
// ============================================

export class BreedParser {
  private watchers: Map<string, chokidar.FSWatcher> = new Map();
  private listeners: Set<(dna: BreedDNA, path: string) => void> = new Set();

  // ============================================
  // Parsing Logic
  // ============================================

  parse(content: string): ParseResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Extract sections
      const sections = this.extractSections(content);
      
      // Validate required sections
      if (!sections.species) {
        errors.push('Missing required section: species');
      }
      if (!sections.name) {
        errors.push('Missing required section: name');
      }

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

      const dna: BreedDNA = {
        species,
        name,
        description,
        capabilities,
        personality,
        constraints: [], // TODO: Parse constraints
        modelConfig,
        evolution,
      };

      return { success: true, dna, errors, warnings };

    } catch (error) {
      errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, errors, warnings };
    }
  }

  parseFile(filePath: string): ParseResult {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
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

  private extractSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      const headerMatch = line.match(/^#+\s+(.+)$/);
      
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections[currentSection.toLowerCase()] = currentContent.join('\n').trim();
        }
        
        currentSection = headerMatch[1];
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      sections[currentSection.toLowerCase()] = currentContent.join('\n').trim();
    }

    return sections;
  }

  // ============================================
  // Section Parsers
  // ============================================

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

    errors.push(`Unknown species: ${content.trim()}`);
    return 'cattle'; // Default fallback
  }

  private parseName(content: string): string {
    return content.trim() || 'Unnamed Agent';
  }

  private parseCapabilities(content: string): Capability[] {
    const capabilities: Capability[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Match: - capability_name (weight: 0.8)
      const match = line.match(/[-*]\s+(\w+)(?:\s*\(weight:\s*([\d.]+)\))?/);
      
      if (match) {
        capabilities.push({
          name: match[1],
          weight: match[2] ? parseFloat(match[2]) : 1.0,
          examples: [],
        });
      }
    }

    return capabilities;
  }

  private parsePersonality(content: string, warnings: string[]): Personality {
    const personality: Personality = {
      tone: 'neutral' as Personality['tone'],
      verbosity: 'normal',
      creativity: 0.5,
      riskTolerance: 0.5,
    };

    const lines = content.split('\n');
    
    for (const line of lines) {
      const toneMatch = line.match(/tone:\s*(formal|casual|technical|friendly)/i);
      if (toneMatch) {
        personality.tone = toneMatch[1].toLowerCase() as Personality['tone'];
      }

      const verbosityMatch = line.match(/verbosity:\s*(concise|normal|detailed)/i);
      if (verbosityMatch) {
        personality.verbosity = verbosityMatch[1].toLowerCase() as Personality['verbosity'];
      }

      const creativityMatch = line.match(/creativity:\s*([\d.]+)/i);
      if (creativityMatch) {
        const val = parseFloat(creativityMatch[1]);
        if (val >= 0 && val <= 1) {
          personality.creativity = val;
        } else {
          warnings.push(`Creativity value ${val} out of range, using 0.5`);
        }
      }

      const riskMatch = line.match(/risk[_\s]*tolerance:\s*([\d.]+)/i);
      if (riskMatch) {
        const val = parseFloat(riskMatch[1]);
        if (val >= 0 && val <= 1) {
          personality.riskTolerance = val;
        }
      }
    }

    return personality;
  }

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
      const baseModelMatch = line.match(/base[_\s]*model:\s*(.+)/i);
      if (baseModelMatch) {
        config.baseModel = baseModelMatch[1].trim();
      }

      const loraMatch = line.match(/lora:\s*(.+)/i);
      if (loraMatch) {
        config.loraAdapters = loraMatch[1].split(',').map(s => s.trim());
      }

      const tempMatch = line.match(/temperature:\s*([\d.]+)/i);
      if (tempMatch) {
        config.temperature = parseFloat(tempMatch[1]);
      }

      const maxTokensMatch = line.match(/max[_\s]*tokens:\s*(\d+)/i);
      if (maxTokensMatch) {
        config.maxTokens = parseInt(maxTokensMatch[1]);
      }

      const topPMatch = line.match(/top[_\s]*p:\s*([\d.]+)/i);
      if (topPMatch) {
        config.topP = parseFloat(topPMatch[1]);
      }
    }

    return config;
  }

  private parseEvolution(content: string, warnings: string[]): EvolutionConfig {
    const config: EvolutionConfig = {
      mutationRate: 0.1,
      crossoverRate: 0.7,
      selectionPressure: 0.3,
      eliteCount: 2,
    };

    const lines = content.split('\n');

    for (const line of lines) {
      const mutationMatch = line.match(/mutation[_\s]*rate:\s*([\d.]+)/i);
      if (mutationMatch) {
        config.mutationRate = parseFloat(mutationMatch[1]);
      }

      const crossoverMatch = line.match(/crossover[_\s]*rate:\s*([\d.]+)/i);
      if (crossoverMatch) {
        config.crossoverRate = parseFloat(crossoverMatch[1]);
      }

      const pressureMatch = line.match(/selection[_\s]*pressure:\s*([\d.]+)/i);
      if (pressureMatch) {
        config.selectionPressure = parseFloat(pressureMatch[1]);
      }

      const eliteMatch = line.match(/elite[_\s]*count:\s*(\d+)/i);
      if (eliteMatch) {
        config.eliteCount = parseInt(eliteMatch[1]);
      }
    }

    return config;
  }

  // ============================================
  // Hot Reload System
  // ============================================

  watch(filePath: string): void {
    if (this.watchers.has(filePath)) {
      return; // Already watching
    }

    const watcher = chokidar.watch(filePath, {
      persistent: true,
      ignoreInitial: false,
    });

    watcher.on('change', (path) => {
      const result = this.parseFile(path);
      if (result.success && result.dna) {
        this.notifyListeners(result.dna, path);
      }
    });

    this.watchers.set(filePath, watcher);
  }

  unwatch(filePath: string): void {
    const watcher = this.watchers.get(filePath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(filePath);
    }
  }

  subscribe(listener: (dna: BreedDNA, path: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(dna: BreedDNA, path: string): void {
    this.listeners.forEach(listener => listener(dna, path));
  }
}

// ============================================
// Example breed.md Template
// ============================================

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
- forbidden: Do not send emails without approval
- required: Always include a summary
- preferred: Use bullet points for clarity
`;

// Singleton instance
export const breedParser = new BreedParser();
