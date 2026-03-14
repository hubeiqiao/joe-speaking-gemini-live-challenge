import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import {
  generatedReviewSchema,
  reviewRequestSchema,
} from '@/lib/api/live-contracts';
import { consumeRateLimit, getClientIp } from '@/lib/api/rate-limit';
import { buildFallbackReview } from '@/lib/demo/review-fallback';

function buildPrompt(topic: string, transcriptText: string): string {
  return [
    'You are generating a short speaking-coach recap.',
    'Return strict JSON with keys: summary, strengths, nextSteps.',
    `Topic: ${topic}`,
    `Transcript:\n${transcriptText}`,
  ].join('\n\n');
}

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit({
    key: `live-review:${getClientIp(request)}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: 'Too many review requests. Please wait and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const payload = reviewRequestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const fallback = buildFallbackReview(payload.data.topic, payload.data.transcript);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(fallback);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const transcriptText = payload.data.transcript
      .map((turn) => `${turn.role.toUpperCase()}: ${turn.text}`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildPrompt(payload.data.topic, transcriptText),
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = generatedReviewSchema.safeParse(JSON.parse(response.text || '{}'));

    if (!parsed.success) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({
      ...parsed.data,
      recap: parsed.data.recap ?? parsed.data.summary,
    });
  } catch (error) {
    console.error('[live-review] failed', error);
    return NextResponse.json(fallback);
  }
}
