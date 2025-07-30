import esbuild from 'esbuild';
import fs from 'fs';

const result = await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/main.cjs',
  mainFields: ['module', 'main'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  minify: true,
  sourcemap: false,
  external: [],
  packages: 'bundle',
  metafile: true,
});

fs.writeFileSync('dist/meta.json', JSON.stringify(result.metafile));
