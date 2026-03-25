/**
 * Ranch API Route - Task Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { collieOrchestrator } from '@/lib/collie';
import { APIResponse, Task, Intent } from '@/types/ranch';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('id');
  const active = searchParams.get('active');

  try {
    if (taskId) {
      const task = collieOrchestrator.getTask(taskId);
      if (!task) {
        return NextResponse.json<APIResponse<null>>({
          success: false,
          error: `Task '${taskId}' not found`,
          timestamp: new Date(),
        }, { status: 404 });
      }
      return NextResponse.json<APIResponse<Task>>({
        success: true,
        data: task,
        timestamp: new Date(),
      });
    }

    if (active === 'true') {
      const tasks = collieOrchestrator.getActiveTasks();
      return NextResponse.json<APIResponse<Task[]>>({
        success: true,
        data: tasks,
        timestamp: new Date(),
      });
    }

    const tasks = collieOrchestrator.getRecentTasks(20);
    return NextResponse.json<APIResponse<Task[]>>({
      success: true,
      data: tasks,
      timestamp: new Date(),
    });
  } catch (error) {
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, source } = body;

    if (!content) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Content is required',
        timestamp: new Date(),
      }, { status: 400 });
    }

    // Create intent
    const intent: Intent = {
      id: `intent_${Date.now()}`,
      content,
      source: source || {
        type: 'api',
        channelId: 'default',
        userId: 'system',
      },
      metadata: {},
      timestamp: new Date(),
    };

    // Create and process task
    const task = collieOrchestrator.createTask(intent);
    
    // Process asynchronously (don't await to allow streaming)
    collieOrchestrator.processTask(task.id).catch(console.error);

    return NextResponse.json<APIResponse<Task>>({
      success: true,
      data: task,
      timestamp: new Date(),
    });
  } catch (error) {
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    }, { status: 500 });
  }
}
