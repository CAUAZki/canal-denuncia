import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './pool.js';

const here = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const schema = await readFile(path.join(here, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('[db] esquema aplicado');
  await pool.end();
}

main().catch((error) => {
  console.error('[db] falha ao aplicar esquema:', error.message);
  process.exit(1);
});
