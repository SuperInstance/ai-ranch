/**
 * Ranch API Route - Species Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { speciesRegistry } from '@/lib/species';
import { APIResponse, Species } from '@/types/ranch';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  try {
    if (name) {
      const species = speciesRegistry.get(name as any);
      if (!species) {
        return NextResponse.json<APIResponse<null>>({
          success: false,
          error: `Species '${name}' not found`,
          timestamp: new Date(),
        }, { status: 404 });
      }
      return NextResponse.json<APIResponse<Species>>({
        success: true,
        data: species,
        timestamp: new Date(),
      });
    }

    const allSpecies = speciesRegistry.getAll();
    return NextResponse.json<APIResponse<Species[]>>({
      success: true,
      data: allSpecies,
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
    const { name, updates } = body;

    if (!name) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Species name is required',
        timestamp: new Date(),
      }, { status: 400 });
    }

    const updated = speciesRegistry.update(name, updates);
    
    if (!updated) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: `Species '${name}' not found`,
        timestamp: new Date(),
      }, { status: 404 });
    }

    return NextResponse.json<APIResponse<Species>>({
      success: true,
      data: updated,
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
