/**
 * Ranch API Route - Evolution Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { nightSchool } from '@/lib/night-school';
import { APIResponse, EvolutionCycle } from '@/types/ranch';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const current = searchParams.get('current');

  try {
    if (current === 'true') {
      const cycle = nightSchool.getCurrentCycle();
      return NextResponse.json<APIResponse<EvolutionCycle | null>>({
        success: true,
        data: cycle,
        timestamp: new Date(),
      });
    }

    const history = nightSchool.getCycleHistory();
    return NextResponse.json<APIResponse<EvolutionCycle[]>>({
      success: true,
      data: history,
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
    // Trigger manual evolution cycle
    const cycle = await nightSchool.runCycle();

    return NextResponse.json<APIResponse<EvolutionCycle>>({
      success: true,
      data: cycle,
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
