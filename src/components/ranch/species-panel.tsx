'use client';

/**
 * Species Panel - Dashboard component for viewing and managing species
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Bird, Compass, Cloud, Zap, Eye, Bug, Egg,
  Activity, Dna, Clock
} from 'lucide-react';

interface Species {
  name: string;
  description: string;
  capabilities: string[];
  modelHint: string;
  loraAdapter?: string;
  traits: {
    patience: number;
    thoroughness: number;
    creativity: number;
    speed: number;
  };
  fitness: number;
  generation: number;
  createdAt: string;
  updatedAt: string;
}

const SPECIES_ICONS: Record<string, React.ReactNode> = {
  cattle: <Brain className="h-5 w-5" />,
  duck: <Bird className="h-5 w-5" />,
  goat: <Compass className="h-5 w-5" />,
  sheep: <Cloud className="h-5 w-5" />,
  horse: <Zap className="h-5 w-5" />,
  falcon: <Eye className="h-5 w-5" />,
  hog: <Bug className="h-5 w-5" />,
  chicken: <Egg className="h-5 w-5" />,
};

const SPECIES_COLORS: Record<string, string> = {
  cattle: 'bg-amber-100 text-amber-800 border-amber-200',
  duck: 'bg-sky-100 text-sky-800 border-sky-200',
  goat: 'bg-stone-100 text-stone-800 border-stone-200',
  sheep: 'bg-slate-100 text-slate-800 border-slate-200',
  horse: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  falcon: 'bg-violet-100 text-violet-800 border-violet-200',
  hog: 'bg-rose-100 text-rose-800 border-rose-200',
  chicken: 'bg-orange-100 text-orange-800 border-orange-200',
};

export function SpeciesPanel() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  useEffect(() => {
    fetchSpecies();
    const interval = setInterval(fetchSpecies, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSpecies = async () => {
    try {
      const response = await fetch('/api/ranch/species');
      const data = await response.json();
      if (data.success) {
        setSpecies(data.data);
        if (!selectedSpecies && data.data.length > 0) {
          setSelectedSpecies(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch species:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-pulse text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading species...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Species List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna className="h-5 w-5" />
            Species Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {species.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedSpecies(s)}
                className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                  selectedSpecies?.name === s.name
                    ? 'ring-2 ring-primary border-primary'
                    : ''
                } ${SPECIES_COLORS[s.name] || 'bg-gray-100'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {SPECIES_ICONS[s.name]}
                    <span className="font-medium capitalize">{s.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Gen {s.generation}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    <span>Fitness: {(s.fitness * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={s.fitness * 100} className="h-1 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Species Details */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 capitalize">
            {selectedSpecies && SPECIES_ICONS[selectedSpecies.name]}
            {selectedSpecies?.name || 'Select a Species'} Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSpecies ? (
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="traits">Traits</TabsTrigger>
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <p className="text-muted-foreground">
                  {selectedSpecies.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Model</div>
                    <div className="font-mono text-sm">{selectedSpecies.modelHint}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">LoRA Adapter</div>
                    <div className="font-mono text-sm">
                      {selectedSpecies.loraAdapter || 'None'}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Generation</div>
                    <div className="font-mono text-sm">{selectedSpecies.generation}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Fitness Score</div>
                    <div className="font-mono text-sm">
                      {(selectedSpecies.fitness * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="traits" className="space-y-4">
                {Object.entries(selectedSpecies.traits).map(([trait, value]) => (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{trait}</span>
                      <span>{(value * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="capabilities">
                <div className="flex flex-wrap gap-2">
                  {selectedSpecies.capabilities.map((cap) => (
                    <Badge key={cap} variant="secondary">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Select a species from the list to view details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
