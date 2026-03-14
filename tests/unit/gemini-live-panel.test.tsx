import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GeminiLivePanel } from '@/components/live/GeminiLivePanel';

const { liveConnectMock, sessionMock, googleGenAiMock } = vi.hoisted(() => {
  const session = {
    close: vi.fn(),
    sendClientContent: vi.fn(),
    sendRealtimeInput: vi.fn(),
  };

  return {
    liveConnectMock: vi.fn(async () => session),
    sessionMock: session,
    googleGenAiMock: vi.fn(() => ({
      live: {
        connect: liveConnectMock,
      },
    })),
  };
});

vi.mock('@google/genai', () => ({
  GoogleGenAI: googleGenAiMock,
  Modality: {
    AUDIO: 'AUDIO',
  },
}));

vi.mock('@/components/live/Orb', () => ({
  Orb: () => <div data-testid="joe-orb">Joe Orb</div>,
}));

vi.mock('@/components/live/WebGLErrorBoundary', () => ({
  WebGLErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('GeminiLivePanel', () => {
  beforeEach(() => {
    liveConnectMock.mockClear();
    googleGenAiMock.mockClear();
    sessionMock.close.mockClear();
    sessionMock.sendClientContent.mockClear();
    sessionMock.sendRealtimeInput.mockClear();

    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            token: 'ephemeral-token',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      ),
    );
  });

  it('renders the Joe simulator-style live session scaffold', () => {
    render(
      <GeminiLivePanel
        topicPrompt="Describe a recent trip."
        userId="judge-demo"
      />,
    );

    expect(screen.getByText(/part 1/i)).toBeInTheDocument();
    expect(screen.getByText(/introduction/i)).toBeInTheDocument();
    expect(screen.getByText(/ready to begin/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start live exam/i })).toBeInTheDocument();
    expect(screen.getByText(/text mode/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type your response here \(enter to send\)\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/text is sent to the real gemini live session as your spoken response/i)).toBeInTheDocument();
  });

  it('connects with empty transcription config objects for Gemini Live', async () => {
    render(
      <GeminiLivePanel
        topicPrompt="Describe a recent trip."
        userId="judge-demo"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /start live exam/i }));

    await waitFor(() => {
      expect(liveConnectMock).toHaveBeenCalledTimes(1);
    });

    const config = liveConnectMock.mock.calls[0]?.[0]?.config;

    expect(config?.responseModalities).toEqual(['AUDIO']);
    expect(config?.inputAudioTranscription).toEqual({});
    expect(config?.outputAudioTranscription).toEqual({});
    expect(config?.outputAudioTranscription).not.toHaveProperty('languageCodes');
  });
});
