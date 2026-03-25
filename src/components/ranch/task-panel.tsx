'use client';

/**
 * Task Panel - Dashboard component for task management
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, Loader2, CheckCircle2, XCircle, Clock, 
  Zap, ArrowRight, MessageSquare
} from 'lucide-react';

interface Task {
  id: string;
  intent: {
    content: string;
    source: {
      type: string;
      channelId: string;
      userId: string;
    };
  };
  routing: {
    species: string;
    confidence: number;
    reasoning: string;
    alternativeSpecies: string[];
  };
  species: {
    name: string;
    fitness: number;
  };
  status: 'queued' | 'routing' | 'processing' | 'completed' | 'failed';
  result?: {
    success: boolean;
    output: string;
    tokensUsed: number;
    latencyMs: number;
  };
  startedAt: string;
  completedAt?: string;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  queued: <Clock className="h-4 w-4 text-muted-foreground" />,
  routing: <ArrowRight className="h-4 w-4 text-blue-500 animate-pulse" />,
  processing: <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />,
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
};

const STATUS_COLORS: Record<string, string> = {
  queued: 'bg-gray-100 text-gray-800',
  routing: 'bg-blue-100 text-blue-800',
  processing: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export function TaskPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/ranch/tasks');
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/ranch/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });

      const data = await response.json();
      if (data.success) {
        setInput('');
        // Refresh tasks
        setTimeout(fetchTasks, 1000);
      }
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Task Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Enter a task or query for the ranch..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={!input.trim() || submitting}
            className="shrink-0"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Tasks</h4>
          <ScrollArea className="h-[400px] rounded-md border p-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-pulse text-muted-foreground" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No tasks yet. Submit a query above to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{task.intent.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${STATUS_COLORS[task.status]}`}
                          >
                            {STATUS_ICONS[task.status]}
                            <span className="ml-1 capitalize">{task.status}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {task.routing.species}
                          </Badge>
                          {task.result && (
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              {task.result.latencyMs}ms
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {task.result && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        {task.result.output}
                      </div>
                    )}
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
