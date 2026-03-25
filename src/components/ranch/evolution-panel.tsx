'use client';

/**
 * Evolution Panel - Dashboard component for Night School evolution
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Moon, Sparkles, TrendingUp, TrendingDown, Minus,
  RefreshCw, Dna, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';

interface EvolutionCycle {
  id: string;
  startedAt: string;
  completedAt?: string;
  phase: string;
  population: Array<{
    name: string;
    fitness: number;
    generation: number;
  }>;
  offspring: Array<{
    name: string;
    fitness: number;
    generation: number;
  }>;
  graveyard: Array<{
    name: string;
    fitness: number;
    generation: number;
  }>;
  metrics: {
    averageFitness: number;
    bestFitness: number;
    worstFitness: number;
    diversityIndex: number;
    improvementRate: number;
  };
}

const PHASE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  evaluate: { label: 'Evaluating', icon: <Clock className="h-4 w-4 animate-pulse" /> },
  cull: { label: 'Culling', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
  breed: { label: 'Breeding', icon: <Dna className="h-4 w-4 text-purple-500" /> },
  distill: { label: 'Distilling', icon: <Sparkles className="h-4 w-4 text-blue-500" /> },
  quarantine: { label: 'Quarantine', icon: <AlertCircle className="h-4 w-4 text-amber-500" /> },
  promote: { label: 'Promoting', icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
  complete: { label: 'Complete', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
};

export function EvolutionPanel() {
  const [currentCycle, setCurrentCycle] = useState<EvolutionCycle | null>(null);
  const [history, setHistory] = useState<EvolutionCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchEvolution();
    const interval = setInterval(fetchEvolution, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvolution = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        fetch('/api/ranch/evolution?current=true'),
        fetch('/api/ranch/evolution'),
      ]);
      
      const currentData = await currentRes.json();
      const historyData = await historyRes.json();
      
      if (currentData.success) {
        setCurrentCycle(currentData.data);
      }
      if (historyData.success) {
        setHistory(historyData.data);
      }
    } catch (error) {
      console.error('Failed to fetch evolution:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerEvolution = async () => {
    setTriggering(true);
    try {
      await fetch('/api/ranch/evolution', { method: 'POST' });
      setTimeout(fetchEvolution, 1000);
    } catch (error) {
      console.error('Failed to trigger evolution:', error);
    } finally {
      setTriggering(false);
    }
  };

  const getTrendIcon = (rate: number) => {
    if (rate > 0.01) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (rate < -0.01) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Night School
          </CardTitle>
          <Button
            onClick={triggerEvolution}
            disabled={triggering || (currentCycle !== null && currentCycle.phase !== 'complete')}
            variant="outline"
            size="sm"
          >
            {triggering ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Run Evolution
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Cycle */}
        {currentCycle && currentCycle.phase !== 'complete' && (
          <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="flex items-center gap-2 mb-2">
              {PHASE_LABELS[currentCycle.phase]?.icon}
              <span className="font-medium">
                Phase: {PHASE_LABELS[currentCycle.phase]?.label || currentCycle.phase}
              </span>
            </div>
            <Progress 
              value={
                currentCycle.phase === 'evaluate' ? 15 :
                currentCycle.phase === 'cull' ? 30 :
                currentCycle.phase === 'breed' ? 50 :
                currentCycle.phase === 'distill' ? 65 :
                currentCycle.phase === 'quarantine' ? 80 :
                currentCycle.phase === 'promote' ? 95 : 100
              } 
              className="h-2"
            />
          </div>
        )}

        {/* Metrics */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Avg Fitness</div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold">
                  {(history[history.length - 1].metrics.averageFitness * 100).toFixed(1)}%
                </span>
                {getTrendIcon(history[history.length - 1].metrics.improvementRate)}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Best Fitness</div>
              <div className="text-lg font-bold">
                {(history[history.length - 1].metrics.bestFitness * 100).toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Diversity</div>
              <div className="text-lg font-bold">
                {history[history.length - 1].metrics.diversityIndex.toFixed(3)}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Total Cycles</div>
              <div className="text-lg font-bold">{history.length}</div>
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Evolution History</h4>
          <ScrollArea className="h-[200px] rounded-md border p-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-pulse text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No evolution cycles yet. Click &quot;Run Evolution&quot; to start.
              </div>
            ) : (
              <div className="space-y-2">
                {history.slice().reverse().map((cycle) => (
                  <div
                    key={cycle.id}
                    className="p-2 rounded border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {PHASE_LABELS[cycle.phase]?.icon}
                        <span className="text-sm font-medium capitalize">
                          {cycle.phase}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(cycle.startedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>Offspring: {cycle.offspring.length}</span>
                      <span>•</span>
                      <span>Culled: {cycle.graveyard.length}</span>
                      <span>•</span>
                      <span>Improvement: {(cycle.metrics.improvementRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
