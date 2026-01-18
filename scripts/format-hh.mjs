#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exclusions standard
const EXCLUDE_PATTERNS = [
  'node_modules',
  'build',
  'dist',
  '.git',
  'backup',
  'bitwig',
  'client/archive',
  'Processing',
];

async function getFiles(globPattern) {
  // Récupère tous les fichiers *.hh.js de manière récursive
  const root = process.cwd();
  const out = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      const relPath = path.relative(root, p);
      
      // Vérifier les exclusions
      if (e.isDirectory()) {
        const shouldExclude = EXCLUDE_PATTERNS.some(pat => 
          relPath.includes(pat) || relPath.startsWith(pat)
        );
        if (!shouldExclude) {
          await walk(p);
        }
      } else if (p.endsWith('.hh.js')) {
        out.push(p);
      }
    }
  }
  await walk(root);
  return out;
}

/**
 * Détecte si un fichier contient de la syntaxe HipHop
 * Cherche les mots-clés HipHop typiques
 */
function isHipHopFile(content) {
  const hiphopKeywords = [
    /hiphop\s+module\s*\(/,
    /hiphop\s+fork/,
    /hiphop\s+\{/,
    /await\s*\(/,
    /emit\s+\w+/,
    /signal\s+\w+/,
    /abort\s*\{/,
    /every\s*\(/,
  ];
  return hiphopKeywords.some(regex => regex.test(content));
}

/**
 * Normalize HipHop syntax avant le formatage Prettier
 * Preserve structure and indentation of HipHop blocks
 */
function normalizeHipHopSyntax(source) {
  // Trim trailing spaces mais preserve l'indentation
  let lines = source.split(/\r?\n/);
  lines = lines.map((l) => l.replace(/\s+$/g, ''));
  
  // Normalize tabs to spaces (2 spaces)
  lines = lines.map((l) => l.replace(/^\t+/g, (m) => '  '.repeat(m.length)));
  
  // Collapse multiple blank lines (max 2)
  const normalized = [];
  let blankCount = 0;
  for (const line of lines) {
    if (line.trim() === '') {
      blankCount++;
      if (blankCount <= 2) {
        normalized.push('');
      }
    } else {
      blankCount = 0;
      normalized.push(line);
    }
  }
  
  return normalized.join('\n');
}

/**
 * Fallback robuste pour les fichiers avec syntaxe HipHop
 * que Prettier ne peut pas parser complètement
 */
async function fallbackFormat(raw, filePath) {
  const normalized = normalizeHipHopSyntax(raw);
  
  // Si le fichier est détecté comme HipHop, faire un formatage minimaliste
  if (isHipHopFile(raw)) {
    console.log(`  ℹ️  Using HipHop-safe fallback for: ${path.basename(filePath)}`);
  }
  
  return normalized;
}

/**
 * Format un fichier avec Prettier, fallback sur normalize si nécessaire
 */
async function formatFile(filePath) {
  try {
    const input = await fs.readFile(filePath, 'utf8');
    
    // Résoudre la config Prettier pour ce fichier
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
      // Essayer avec Prettier d'abord
      output = await prettier.format(input, options);
    } catch (prettierError) {
      // Si Prettier échoue, utiliser le fallback
      console.log(
        `  ⚠️  Prettier parse failed, using fallback for: ${path.basename(filePath)}`
      );
      output = await fallbackFormat(input, filePath);
    }
    
    // Comparer et écrire si changement
    if (output !== input) {
      await fs.writeFile(filePath, output, 'utf8');
      return { filePath, changed: true, error: null };
    }
    return { filePath, changed: false, error: null };
  } catch (error) {
    return { filePath, changed: false, error: error.message };
  }
}

async function main() {
  console.log('🎵 HipHop File Formatter v1.1\n');
  console.log('Searching for *.hh.js files...\n');
  
  const files = await getFiles('**/*.hh.js');
  
  if (files.length === 0) {
    console.log('❌ No *.hh.js files found.');
    return;
  }
  
  console.log(`📂 Found ${files.length} file(s) to format:\n`);
  
  let changed = 0;
  let errors = 0;
  const results = [];
  
  for (const f of files) {
    const res = await formatFile(f);
    results.push(res);
    
    const relPath = path.relative(process.cwd(), f);
    if (res.error) {
      console.log(`❌ Error: ${relPath}`);
      console.log(`   ${res.error}`);
      errors++;
    } else if (res.changed) {
      console.log(`✓ Formatted: ${relPath}`);
      changed++;
    } else {
      console.log(`✓ Checked:   ${relPath}`);
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Summary:`);
  console.log(`   Total files:    ${files.length}`);
  console.log(`   Modified:       ${changed}`);
  console.log(`   Errors:         ${errors}`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (errors > 0) {
    process.exitCode = 1;
  }
}

main();
