/**
 * Sobe os PDFs EXCLUSIVOS da Biblioteca para o Vercel Blob privado.
 *
 * Lê de site/api/_data/library/files/ (preparado por build-library.sh) e envia
 * cada arquivo com pathname "biblioteca/<arquivo>.pdf", acesso private. O
 * api/file lê de volta com get('biblioteca/<arquivo>.pdf', {access:'private'}).
 *
 * Requer BLOB_READ_WRITE_TOKEN (em site/.env.local). Idempotente (sobrescreve).
 *   node scripts/upload-blob.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const SITE = fileURLToPath(new URL('..', import.meta.url));
const DIR = SITE + 'api/_data/library/files/';
const ENV = SITE + '.env.local';

// token do .env.local
if (!process.env.BLOB_READ_WRITE_TOKEN && existsSync(ENV)) {
  const m = readFileSync(ENV, 'utf8').match(/^BLOB_READ_WRITE_TOKEN=(.+)$/m);
  if (m) process.env.BLOB_READ_WRITE_TOKEN = m[1].trim().replace(/^["']|["']$/g, '');
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Falta BLOB_READ_WRITE_TOKEN em site/.env.local (pegue no dashboard do store).');
  process.exit(1);
}

const files = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.pdf')).sort();
console.log(`Subindo ${files.length} PDFs privados para o Blob…`);

let ok = 0, fail = 0;
for (const f of files) {
  const buf = readFileSync(DIR + f);
  try {
    const r = await put('biblioteca/' + f, buf, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/pdf'
    });
    ok++;
    console.log(`  ✓ ${f}  (${(buf.length / 1e6).toFixed(1)} MB) → ${r.pathname}`);
  } catch (e) {
    fail++;
    console.error(`  ✗ ${f}: ${e.message}`);
  }
}
console.log(`\nConcluído: ${ok} enviados, ${fail} falhas, de ${files.length}.`);
if (fail) process.exit(1);
