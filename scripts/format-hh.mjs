#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getFiles(globPattern) {
  // Minimal glob: recursively collect *.hh.js from cwd
  const root = process.cwd();
  const out = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(p);
      } else if (p.endsWith('.hh.js')) {
        out.push(p);
      }
    }
  }
  await walk(root);
  return out;
}

function customTransforms(source) {
  // Placeholder for HipHop/DSL-specific tweaks if needed later.
  // Example: normalize spaces around ';;;', etc.
  return source;
}

async function fallbackFormat(raw) {
  // Safe fallback: keep content, trim trailing spaces, normalize indentation to 2 spaces where tabs are used, collapse >2 blank lines.
  const lines = raw.split(/\r?\n/);
  const out = lines.map((l) => l.replace(/\s+$/g, '').replace(/^\t+/g, (m) => '  '.repeat(m.length)));
  // collapse sequences of more than 2 blank lines
  const res = [];
  let blankRun = 0;
  for (const l of out) {
    if (l.trim() === '') {
      blankRun += 1;
      if (blankRun <= 2) res.push('');
    } else {
      blankRun = 0;
      res.push(l);
    }
  }
  return res.join('\n');
}

async function formatFile(filePath) {
  const input = await fs.readFile(filePath, 'utf8');
  const transformed = customTransforms(input);
  const config = await prettier.resolveConfig(filePath).catch(() => null);
  const options = {
    ...config,
    filepath: filePath,
    parser: 'babel',
    tabWidth: 2,
    useTabs: false,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 100,
  };
  let output;
  try {
    output = await prettier.format(transformed, options);
  } catch (e) {
    // Fallback for HipHop DSL sections not parseable by Babel
    output = await fallbackFormat(transformed);
  }
  if (output !== input) {
    await fs.writeFile(filePath, output, 'utf8');
    return { filePath, changed: true };
  }
  return { filePath, changed: false };
}

async function main() {
  const files = await getFiles('**/*.hh.js');
  let changed = 0;
  for (const f of files) {
    try {
      const res = await formatFile(f);
      if (res.changed) changed++;
      console.log(`${res.changed ? 'Formatted' : 'Checked'}: ${path.relative(process.cwd(), f)}`);
    } catch (e) {
      console.error(`Error formatting ${f}:`, e.message);
      process.exitCode = 1;
    }
  }
  console.log(`Done. ${changed} file(s) updated.`);
}

main();
