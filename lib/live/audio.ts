function decodeBase64(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export function encodePcm16Chunk(inputData: Float32Array): string {
  const int16 = new Int16Array(inputData.length);

  for (let index = 0; index < inputData.length; index += 1) {
    int16[index] = Math.max(-32_768, Math.min(32_767, Math.floor(inputData[index] * 32_768)));
  }

  const bytes = new Uint8Array(int16.buffer);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index] ?? 0);
  }

  return window.btoa(binary);
}

function decodePcm16(bytes: Uint8Array, audioContext: AudioContext): AudioBuffer {
  const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
  const buffer = audioContext.createBuffer(1, pcm.length, 24_000);
  const channelData = buffer.getChannelData(0);

  for (let index = 0; index < pcm.length; index += 1) {
    channelData[index] = pcm[index] / 32_768;
  }

  return buffer;
}

export async function playPcm16Chunk({
  audioContext,
  base64Data,
  nextStartTime,
}: {
  audioContext: AudioContext;
  base64Data: string;
  nextStartTime: number;
}): Promise<number> {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const bytes = decodeBase64(base64Data);
  const buffer = decodePcm16(bytes, audioContext);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);

  const startAt = Math.max(audioContext.currentTime, nextStartTime);
  source.start(startAt);

  return startAt + buffer.duration;
}
