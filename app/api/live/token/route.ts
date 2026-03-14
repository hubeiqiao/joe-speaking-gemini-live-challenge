import { GoogleGenAI, Modality } from '@google/genai';
import { NextResponse } from 'next/server';
import { liveTokenRequestSchema } from '@/lib/api/live-contracts';
import { consumeRateLimit, getClientIp } from '@/lib/api/rate-limit';

const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';
const LIVE_SYSTEM_INSTRUCTION =
  'You are Joe Speaking, a warm and focused IELTS speaking coach. Ask one question at a time, respond naturally, keep the learner speaking, and stay in English.';

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit({
    key: `live-token:${getClientIp(request)}`,
    limit: 8,
    windowMs: 60_000,
  });

  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: 'Too many live token requests. Please wait and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const payload = liveTokenRequestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured for live token creation.' },
      { status: 503 },
    );
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { apiVersion: 'v1alpha' },
    });

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        liveConnectConstraints: {
          model: LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: LIVE_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        },
      },
    });

    return NextResponse.json({
      token: token.name,
      model: LIVE_MODEL,
      responseModalities: ['AUDIO'],
      userId: payload.data.userId,
    });
  } catch (error) {
    console.error('[live-token] failed', error);
    return NextResponse.json(
      { error: 'Failed to create live token.' },
      { status: 502 },
    );
  }
}
