// Transcribes the speech of a video into captions (word timestamps) with Whisper.
// Usage: node scripts/transcribe.mjs <vídeo> <legendas.json> [modelo]
// The first run downloads whisper.cpp and the model into ./whisper.cpp. Needs ffmpeg.
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from '@remotion/install-whisper-cpp';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const [videoPath, outPath, model = 'medium'] = process.argv.slice(2);
if (!videoPath || !outPath) {
  console.error('Uso: node scripts/transcribe.mjs <vídeo> <legendas.json> [modelo]');
  process.exit(1);
}

const whisperPath = path.resolve('whisper.cpp');
const whisperCppVersion = '1.5.5';

await installWhisperCpp({to: whisperPath, version: whisperCppVersion});
await downloadWhisperModel({model, folder: whisperPath});

// Whisper needs 16 kHz wav audio.
const wavPath = path.join(os.tmpdir(), `audio-${Date.now()}.wav`);
execFileSync('ffmpeg', ['-y', '-i', videoPath, '-ar', '16000', '-ac', '1', wavPath], {stdio: 'ignore'});

const whisperCppOutput = await transcribe({
  inputPath: wavPath,
  whisperPath,
  whisperCppVersion,
  model,
  tokenLevelTimestamps: true,
  language: 'pt',
});
fs.rmSync(wavPath);

const {captions} = toCaptions({whisperCppOutput});
fs.writeFileSync(outPath, JSON.stringify(captions, null, 2));
console.log(`Pronto: ${captions.length} palavras em ${outPath}`);
