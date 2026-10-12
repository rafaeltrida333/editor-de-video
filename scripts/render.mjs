// Renders a project JSON to an .mp4.
// Usage: node scripts/render.mjs <project.json> <saída.mp4> [pasta-de-arquivos]
// Video and audio items whose src is a plain file name are read from the files folder
// (default: public/, which has the sound effects in public/sfx/).
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [projectPath, outPath, publicDir] = process.argv.slice(2);
if (!projectPath || !outPath) {
  console.error('Uso: node scripts/render.mjs <project.json> <saída.mp4> [pasta-de-arquivos]');
  process.exit(1);
}

const inputProps = JSON.parse(fs.readFileSync(projectPath, 'utf8'));

const serveUrl = await bundle({
  entryPoint: path.resolve('src/remotion/index.ts'),
  publicDir: path.resolve(publicDir ?? 'public'),
});

// Optional: point REMOTION_BROWSER at an existing Chrome Headless Shell instead of downloading one.
const browserExecutable = process.env.REMOTION_BROWSER ?? null;

const composition = await selectComposition({
  serveUrl,
  id: 'Editor',
  inputProps,
  browserExecutable,
});

let lastPercent = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: outPath,
  inputProps,
  browserExecutable,
  onProgress: ({progress}) => {
    const percent = Math.floor(progress * 100);
    if (percent % 10 === 0 && percent !== lastPercent) {
      lastPercent = percent;
      console.log(`${percent}%`);
    }
  },
});

console.log(`Pronto: ${outPath}`);
