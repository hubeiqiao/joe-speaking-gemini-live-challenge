'use client';

import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai';
import { Button, Spinner } from '@heroui/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { encodePcm16Chunk, playPcm16Chunk } from '@/lib/live/audio';
import type { TranscriptTurn } from '@/lib/types/challenge';
import { Orb, type AgentState } from '@/components/live/Orb';
import { PartIndicator } from '@/components/live/PartIndicator';
import { SimulatorControls } from '@/components/live/SimulatorControls';
import { WebGLErrorBoundary } from '@/components/live/WebGLErrorBoundary';
import { cn } from '@/lib/utils';

type GeminiLiveSession = Awaited<
  ReturnType<InstanceType<typeof GoogleGenAI>['live']['connect']>
>;

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';
type ConnectionStep = 'authenticating' | 'connecting_ai' | 'preparing' | 'starting';
type SessionPhase = 'idle' | 'connecting' | 'part1' | 'ready';

function normalizeTranscriptChunk(text?: string): string {
  return text?.replace(/\s+/g, ' ').trim() ?? '';
}

function createAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextCtor =
    window.AudioContext ??
    ((window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? null);

  return AudioContextCtor ? new AudioContextCtor({ sampleRate: 24_000 }) : null;
}

function ConnectionProgressStep({
  label,
  status,
}: {
  label: string;
  status: 'active' | 'done' | 'pending';
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 text-sm transition-opacity duration-300',
        status === 'pending' ? 'opacity-40' : 'opacity-100',
      )}
    >
      {status === 'done' ? (
        <svg className="h-4 w-4 flex-shrink-0 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z"
            fillRule="evenodd"
          />
        </svg>
      ) : null}
      {status === 'active' ? (
        <div className="h-4 w-4 flex-shrink-0">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : null}
      {status === 'pending' ? <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-default-300" /> : null}
      <span className={status === 'active' ? 'font-medium text-foreground' : 'text-default-500'}>{label}</span>
    </div>
  );
}

export function GeminiLivePanel({
  topicPrompt,
  userId,
  onStatusChange,
  onTranscriptChange,
}: {
  topicPrompt: string;
  userId: string;
  onStatusChange?: (status: string | null) => void;
  onTranscriptChange?: (transcript: TranscriptTurn[]) => void;
}) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>('preparing');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<TranscriptTurn[]>([]);
  const [panelStatus, setPanelStatus] = useState<string | null>('The examiner will start shortly...');
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('idle');
  const [agentState, setAgentState] = useState<AgentState>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const sessionRef = useRef<GeminiLiveSession | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextPlaybackTimeRef = useRef(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const updateStatus = useCallback(
    (status: string | null) => {
      setPanelStatus(status);
      onStatusChange?.(status);
    },
    [onStatusChange],
  );

  const appendMessage = useCallback((role: TranscriptTurn['role'], text: string) => {
    const normalized = normalizeTranscriptChunk(text);

    if (!normalized) {
      return;
    }

    setMessages((current) => {
      const latest = current[current.length - 1];

      if (latest?.role === role && latest.text === normalized) {
        return current;
      }

      return [...current, { role, text: normalized }];
    });
  }, []);

  const stopMicrophone = useCallback(async () => {
    const session = sessionRef.current;
    const processor = inputProcessorRef.current;
    const stream = mediaStreamRef.current;
    const audioContext = inputAudioContextRef.current;

    inputProcessorRef.current = null;
    mediaStreamRef.current = null;
    inputAudioContextRef.current = null;
    setIsRecording(false);

    processor?.disconnect();
    stream?.getTracks().forEach((track) => track.stop());

    if (session) {
      try {
        session.sendRealtimeInput({ activityEnd: {} });
      } catch {
        // Ignore errors during teardown.
      }
    }

    if (audioContext && audioContext.state !== 'closed') {
      await audioContext.close();
    }
  }, []);

  const closeOutputAudioContext = useCallback(async () => {
    const audioContext = outputAudioContextRef.current;
    outputAudioContextRef.current = null;
    nextPlaybackTimeRef.current = 0;

    if (audioContext && audioContext.state !== 'closed') {
      await audioContext.close();
    }
  }, []);

  const disconnect = useCallback(
    async (status: string | null = 'Gemini Live session closed.') => {
      await stopMicrophone();
      sessionRef.current?.close();
      sessionRef.current = null;
      setConnectionState('idle');
      setSessionPhase('idle');
      setAgentState(null);
      setIsSending(false);
      setIsMuted(true);
      await closeOutputAudioContext();
      updateStatus(status);
    },
    [closeOutputAudioContext, stopMicrophone, updateStatus],
  );

  const handleServerMessage = useCallback(
    async (message: LiveServerMessage) => {
      const inputTranscript = message.serverContent?.inputTranscription?.text;
      const transcriptText =
        message.serverContent?.outputTranscription?.text ??
        message.serverContent?.modelTurn?.parts
          ?.map((part) => ('text' in part ? part.text : ''))
          .filter(Boolean)
          .join(' ') ??
        message.text;

      if (inputTranscript) {
        appendMessage('user', inputTranscript);
      }

      if (transcriptText) {
        appendMessage('assistant', transcriptText);
      }

      if (message.data) {
        setSessionPhase('part1');
        setAgentState('talking');
        const audioContext = outputAudioContextRef.current ?? createAudioContext();

        if (audioContext) {
          outputAudioContextRef.current = audioContext;
          nextPlaybackTimeRef.current = await playPcm16Chunk({
            audioContext,
            base64Data: message.data,
            nextStartTime: nextPlaybackTimeRef.current,
          });
        }
      }

      if (message.serverContent?.interrupted) {
        setAgentState('thinking');
        updateStatus('Gemini interrupted the current turn. Continue the conversation with a shorter answer.');
      } else if (message.serverContent?.turnComplete) {
        setIsSending(false);
        setSessionPhase('part1');
        setAgentState('listening');
        updateStatus('Your turn to speak');
      }
    },
    [appendMessage, updateStatus],
  );

  const connect = useCallback(async () => {
    if (sessionRef.current) {
      return;
    }

    setMessages([]);
    setConnectionState('connecting');
    setSessionPhase('connecting');
    setConnectionStep('preparing');
    setAgentState(null);
    setIsMuted(true);
    updateStatus('Preparing session');

    try {
      setConnectionStep('authenticating');
      const response = await fetch('/api/live/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const payload = (await response.json()) as {
        error?: string;
        model?: string;
        token?: string;
      };

      if (!response.ok || !payload.model || !payload.token) {
        throw new Error(payload.error ?? 'Failed to create a Gemini Live token.');
      }

      setConnectionStep('connecting_ai');
      const ai = new GoogleGenAI({
        apiKey: payload.token,
        apiVersion: 'v1alpha',
      });

      const liveSession = await ai.live.connect({
        model: payload.model,
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setConnectionState('connected');
            setSessionPhase('ready');
            setConnectionStep('starting');
            setAgentState('thinking');
            updateStatus('The examiner will start shortly...');
          },
          onmessage: (message) => {
            void handleServerMessage(message);
          },
          onerror: (event) => {
            setConnectionState('error');
            setIsSending(false);
            setSessionPhase('idle');
            setAgentState(null);
            setIsMuted(true);
            updateStatus(event.error?.message ?? 'Gemini Live reported a connection error.');
          },
          onclose: () => {
            sessionRef.current = null;
            setConnectionState('idle');
            setIsSending(false);
            setSessionPhase('idle');
            setAgentState(null);
            setIsRecording(false);
            setIsMuted(true);
            void stopMicrophone();
            void closeOutputAudioContext();
            updateStatus('Gemini Live disconnected.');
          },
        },
      });

      sessionRef.current = liveSession;
      setConnectionStep('starting');
      liveSession.sendClientContent({
        turns: [
          {
            role: 'user',
            parts: [
              {
                text: `Start a short IELTS speaking practice about "${topicPrompt}". Ask only the first question, then wait for the learner's answer.`,
              },
            ],
          },
        ],
        turnComplete: true,
      });
      setIsSending(true);
    } catch (error) {
      sessionRef.current = null;
      setConnectionState('error');
      setIsSending(false);
      await stopMicrophone();
      await closeOutputAudioContext();
      updateStatus(error instanceof Error ? error.message : 'Failed to connect to Gemini Live.');
    }
  }, [closeOutputAudioContext, handleServerMessage, stopMicrophone, topicPrompt, updateStatus, userId]);

  const startMicrophone = useCallback(async () => {
    const session = sessionRef.current;

    if (!session || isRecording) {
      return false;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      updateStatus('This browser does not support microphone capture.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const audioContext = new AudioContext({ sampleRate: 16_000 });
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event) => {
        if (!sessionRef.current) {
          return;
        }

        const pcmBlob = {
          data: encodePcm16Chunk(event.inputBuffer.getChannelData(0)),
          mimeType: 'audio/pcm;rate=16000',
        };

        sessionRef.current.sendRealtimeInput({ media: pcmBlob });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      session.sendRealtimeInput({ activityStart: {} });
      mediaStreamRef.current = stream;
      inputAudioContextRef.current = audioContext;
      inputProcessorRef.current = processor;
      setIsRecording(true);
      setIsMuted(false);
      setAgentState('listening');
      updateStatus('Your turn to speak');
      return true;
    } catch (error) {
      await stopMicrophone();
      updateStatus(error instanceof Error ? error.message : 'Failed to start microphone capture.');
      return false;
    }
  }, [isRecording, stopMicrophone, updateStatus]);

  const handleMuteToggle = useCallback(async () => {
    if (connectionState !== 'connected') {
      return;
    }

    if (isRecording) {
      await stopMicrophone();
      setIsMuted(true);
      setIsSending(true);
      setAgentState('thinking');
      updateStatus('Answer captured. Joe Speaking is preparing the next response.');
      return;
    }

    const started = await startMicrophone();
    if (!started) {
      setIsMuted(true);
    }
  }, [connectionState, isRecording, startMicrophone, stopMicrophone, updateStatus]);

  const sendTurn = useCallback(() => {
    const session = sessionRef.current;
    const messageText = normalizeTranscriptChunk(inputValue);

    if (!session || !messageText) {
      return;
    }

    appendMessage('user', messageText);
    session.sendClientContent({
      turns: [
        {
          role: 'user',
          parts: [{ text: messageText }],
        },
      ],
      turnComplete: true,
    });
    setInputValue('');
    setIsSending(true);
    setAgentState('thinking');
    setIsMuted(true);
    updateStatus('Answer captured. Joe Speaking is preparing the next response.');
  }, [appendMessage, inputValue, updateStatus]);

  const handleTextModeKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();
      sendTurn();
    },
    [sendTurn],
  );

  useEffect(() => {
    onTranscriptChange?.(messages);
  }, [messages, onTranscriptChange]);

  useEffect(() => {
    if (connectionState !== 'connected' || agentState !== 'listening' || isRecording) {
      return;
    }

    void startMicrophone();
  }, [agentState, connectionState, isRecording, startMicrophone]);

  useEffect(() => {
    return () => {
      void disconnect(null);
    };
  }, [disconnect]);

  return (
    <div className="surface-card rounded-[2rem] border border-default-100 bg-background/80 p-6 shadow-[var(--landing-shadow-md)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-default-500">Live Speaking Exam</p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground">
            Practice with Real Conversation
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-default-500">
            Joe Speaking now runs the same IELTS-style live session surface on Gemini. Start the exam, answer aloud,
            and keep the same topic grouped for versioned retries.
          </p>
        </div>
        <PartIndicator currentPart={1} />
      </div>

      <main className="flex flex-col items-center justify-center px-2 py-8 sm:px-4">
        {sessionPhase === 'connecting' ? (
          <div className="mx-auto max-w-xs text-center">
            <Spinner color="primary" size="lg" />
            <div className="mt-6 space-y-3">
              <ConnectionProgressStep
                label="Preparing session"
                status={connectionStep === 'preparing' ? 'active' : 'done'}
              />
              <ConnectionProgressStep
                label="Authenticating"
                status={
                  connectionStep === 'preparing'
                    ? 'pending'
                    : connectionStep === 'authenticating'
                      ? 'active'
                      : 'done'
                }
              />
              <ConnectionProgressStep
                label="Connecting to examiner"
                status={
                  connectionStep === 'preparing' || connectionStep === 'authenticating'
                    ? 'pending'
                    : connectionStep === 'connecting_ai'
                      ? 'active'
                      : 'done'
                }
              />
              <ConnectionProgressStep label="Starting exam" status={connectionStep === 'starting' ? 'active' : 'pending'} />
            </div>
          </div>
        ) : null}

        {sessionPhase === 'idle' ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
              <svg className="h-10 w-10 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Ready to Begin</h2>
            <p className="text-default-500">The examiner will start shortly...</p>
            <Button
              className="mt-6 font-medium"
              color="primary"
              onPress={() => void connect()}
              size="lg"
              startContent={connectionState === 'connecting' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            >
              Start live exam
            </Button>
          </div>
        ) : null}

        {(sessionPhase === 'ready' || sessionPhase === 'part1') && connectionState === 'connected' ? (
          <div className="flex w-full max-w-2xl flex-col items-center gap-6">
            <div className="h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80">
              <WebGLErrorBoundary className="h-full w-full">
                <Orb agentState={agentState} className="h-full w-full" colors={['#3B82F6', '#8B5CF6']} />
              </WebGLErrorBoundary>
            </div>

            <div className="text-center">
              <p className="text-sm text-default-500">{panelStatus}</p>
              {isMuted ? <p className="mt-1 text-xs text-warning">Microphone is muted</p> : null}
            </div>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-default-200 bg-background/80 py-4 backdrop-blur-sm">
        {connectionState === 'connected' ? (
          <SimulatorControls
            isEnding={false}
            isMuted={isMuted}
            onEndTest={() => void disconnect()}
            onMuteToggle={() => void handleMuteToggle()}
          />
        ) : null}

        <div className={cn('container mx-auto max-w-4xl px-4', connectionState === 'connected' ? 'mt-4' : '')}>
          <div className="flex items-center gap-2 rounded-lg border border-warning-200 bg-warning-50 p-3 dark:border-warning-800 dark:bg-warning-900/20">
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-warning-700 dark:text-warning-300">
              Text mode
            </span>
            <input
              className="flex-1 rounded-md border border-default-300 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-default-600 dark:bg-default-100"
              disabled={isSending}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleTextModeKeyDown}
              placeholder="Type your response here (Enter to send)..."
              type="text"
              value={inputValue}
            />
            <Button
              color="primary"
              isDisabled={connectionState !== 'connected' || !normalizeTranscriptChunk(inputValue) || isSending}
              isLoading={isSending}
              onPress={sendTurn}
              size="sm"
            >
              Send
            </Button>
          </div>
          <p className="mt-1 text-center text-xs text-default-400">
            Text is sent to the real Gemini live session as your spoken response
          </p>
        </div>
      </footer>
    </div>
  );
}
