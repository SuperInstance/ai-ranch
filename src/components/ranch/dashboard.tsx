'use client';

/**
 * Ranch Dashboard - Main dashboard page
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, Cpu, HardDrive, Zap, Clock, 
  RefreshCw, Moon, Sun, BarChart3
} from 'lucide-react';
import { SpeciesPanel } from '@/components/ranch/species-panel';
import { TaskPanel } from '@/components/ranch/task-panel';
import { EvolutionPanel } from '@/components/ranch/evolution-panel';

interface SystemMetrics {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  tokensPerSecond: number;
  vramUsage: number;
  activeSpecies: number;
  lastEvolution: string | null;
}

export default function RanchDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalRequests: 0,
    successRate: 0,
    averageLatency: 0,
    tokensPerSecond: 0,
    vramUsage: 0,
    activeSpecies: 8,
    lastEvolution: null,
  });
  const [isEvolutionRunning, setIsEvolutionRunning] = useState(false);

  // Simulate metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 3),
        successRate: 0.95 + Math.random() * 0.05,
        averageLatency: 150 + Math.random() * 100,
        tokensPerSecond: 12 + Math.random() * 8,
        vramUsage: 45 + Math.random() * 20,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Ranch</h1>
                <p className="text-sm text-muted-foreground">
                  Self-Evolving Agent System
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Online
              </Badge>
              <Badge variant="secondary">
                v0.3.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Requests</div>
                <div className="font-medium">{metrics.totalRequests}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-xs text-muted-foreground">Success</div>
                <div className="font-medium">{(metrics.successRate * 100).toFixed(1)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <div>
                <div className="text-xs text-muted-foreground">Latency</div>
                <div className="font-medium">{metrics.averageLatency.toFixed(0)}ms</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Tokens/s</div>
                <div className="font-medium">{metrics.tokensPerSecond.toFixed(1)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-xs text-muted-foreground">VRAM</div>
                <div className="font-medium">{metrics.vramUsage.toFixed(0)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-rose-500" />
              <div>
                <div className="text-xs text-muted-foreground">Species</div>
                <div className="font-medium">{metrics.activeSpecies}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="species">Species</TabsTrigger>
            <TabsTrigger value="evolution">Evolution</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <TaskPanel />
          </TabsContent>

          <TabsContent value="species" className="space-y-4">
            <SpeciesPanel />
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4">
            <EvolutionPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Night School runs at 02:00</span>
            </div>
            <div className="flex items-center gap-4">
              <span>breed.md DNA System</span>
              <span>•</span>
              <span>Jetson Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
