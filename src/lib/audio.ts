/**
 * Browser audio capture + WAV encoding.
 * We capture raw PCM through the Web Audio API and encode complete 16 kHz mono
 * WAV files so every clip is decodable by any browser and by the transcription
 * models (MediaRecorder fragments and Safari's fragmented MP4 are not).
 */

const TARGET_SAMPLE_RATE = 16000;

export interface RecordingResult {
  blob: Blob;
  durationSeconds: number;
  sampleRate: number;
}

export class WavRecorder {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private chunks: Float32Array[] = [];
  private analyser: AnalyserNode | null = null;

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.source = ctx.createMediaStreamSource(this.stream);
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.processor = ctx.createScriptProcessor(4096, 1, 1);
    this.chunks = [];
    this.processor.onaudioprocess = (e) => {
      this.chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    };
    this.source.connect(this.analyser);
    this.source.connect(this.processor);
    this.processor.connect(ctx.destination);
  }

  /** Current input level 0..1, for the live waveform meter. */
  level(): number {
    if (!this.analyser) return 0;
    const buf = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(buf);
    let peak = 0;
    for (const v of buf) peak = Math.max(peak, Math.abs(v - 128) / 128);
    return peak;
  }

  async stop(): Promise<RecordingResult> {
    const ctx = this.ctx;
    if (!ctx) throw new Error("Recorder was not started");
    const inputRate = ctx.sampleRate;

    this.stream?.getTracks().forEach((t) => t.stop());
    this.processor?.disconnect();
    this.source?.disconnect();
    this.analyser?.disconnect();
    await ctx.close();

    const merged = mergeChunks(this.chunks);
    const resampled = downsample(merged, inputRate, TARGET_SAMPLE_RATE);
    const blob = encodeWav(resampled, TARGET_SAMPLE_RATE);

    this.ctx = null;
    this.stream = null;
    this.processor = null;
    this.source = null;
    this.analyser = null;
    this.chunks = [];

    return {
      blob,
      durationSeconds: resampled.length / TARGET_SAMPLE_RATE,
      sampleRate: TARGET_SAMPLE_RATE,
    };
  }

  cancel() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.processor?.disconnect();
    this.source?.disconnect();
    void this.ctx?.close();
    this.ctx = null;
    this.chunks = [];
  }
}

function mergeChunks(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

function downsample(input: Float32Array, from: number, to: number): Float32Array {
  if (to >= from) return input;
  const ratio = from / to;
  const length = Math.floor(input.length / ratio);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j] ?? 0;
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

export function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/** Reads duration and sample rate from an uploaded audio file. */
export async function inspectAudioFile(file: File): Promise<{
  durationSeconds: number;
  sampleRate: number;
}> {
  const ctx = new AudioContext();
  try {
    const buffer = await ctx.decodeAudioData(await file.arrayBuffer());
    return { durationSeconds: buffer.duration, sampleRate: buffer.sampleRate };
  } finally {
    await ctx.close();
  }
}

/**
 * Objective signal-quality estimate (0–10) from RMS level, clipping ratio and
 * an estimated noise floor. Deterministic — no guesswork, no placeholder data.
 */
export async function estimateQuality(blob: Blob): Promise<number> {
  const ctx = new AudioContext();
  try {
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    const data = buffer.getChannelData(0);
    if (data.length === 0) return 0;

    let sumSquares = 0;
    let clipped = 0;
    const frameSize = 1024;
    const frameEnergies: number[] = [];
    let frameSum = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] ?? 0;
      sumSquares += v * v;
      if (Math.abs(v) > 0.99) clipped++;
      frameSum += v * v;
      if ((i + 1) % frameSize === 0) {
        frameEnergies.push(Math.sqrt(frameSum / frameSize));
        frameSum = 0;
      }
    }

    const rms = Math.sqrt(sumSquares / data.length);
    frameEnergies.sort((a, b) => a - b);
    const noiseFloor = frameEnergies[Math.floor(frameEnergies.length * 0.1)] ?? 1e-6;
    const snrDb = 20 * Math.log10((rms + 1e-9) / (noiseFloor + 1e-9));
    const clipRatio = clipped / data.length;

    const levelScore = Math.max(0, Math.min(1, (rms - 0.005) / 0.12)); // too quiet -> low
    const snrScore = Math.max(0, Math.min(1, snrDb / 30));
    const clipScore = Math.max(0, 1 - clipRatio * 200);

    const score = 10 * (0.35 * levelScore + 0.45 * snrScore + 0.2 * clipScore);
    return Math.round(score * 10) / 10;
  } catch {
    return 0;
  } finally {
    await ctx.close();
  }
}
