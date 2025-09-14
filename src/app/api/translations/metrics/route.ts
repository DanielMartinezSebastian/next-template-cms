import { NextRequest, NextResponse } from 'next/server';
import { translationManager } from '@/lib/translations/translation-manager';

export async function GET() {
  try {
    const metrics = await translationManager.getMetrics();
    const healthCheck = await translationManager.healthCheck();

    const response = {
      timestamp: new Date().toISOString(),
      metrics,
      health: healthCheck,
      version: '1.0.0',
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error getting translation metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get metrics', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

// POST endpoint to reset metrics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'reset') {
      await translationManager.invalidateCache();
      return NextResponse.json({
        success: true,
        message: 'Cache invalidated',
        timestamp: new Date().toISOString(),
      });
    }

    if (body.action === 'warmup' && body.locale) {
      await translationManager.preloadCriticalTranslations(body.locale);
      return NextResponse.json({
        success: true,
        message: `Cache warmed up for locale: ${body.locale}`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: reset, warmup' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing metrics request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
