#!/usr/bin/env node
'use strict';

// Simple CLI to drive the Skini websocket server like controleurHH
// Sequence: loadHHFile -> loadSession -> [compileHHEditionFile] -> setDAWON -> startAutomate

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
//import wsPkg from 'ws';
const WebSocket = require('ws');

function parseArgs(argv) {
  const args = {
    host: 'localhost',
    port: 8383,
    prog: undefined,
    csv: undefined,
    recompile: false,
    setdawon: true,
    start: true,
    wait: 4000,
    trace: true,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--host' && argv[i + 1]) { args.host = argv[++i]; continue; }
    if (a === '--port' && argv[i + 1]) { args.port = parseInt(argv[++i], 10); continue; }
    if (a === '--prog' && argv[i + 1]) { args.prog = argv[++i]; continue; }
    if (a === '--csv' && argv[i + 1]) { args.csv = argv[++i]; continue; }
    if (a === '--recompile') { args.recompile = true; continue; }
    if (a === '--no-setdawon') { args.setdawon = false; continue; }
    if (a === '--no-start') { args.start = false; continue; }
    if (a === '--wait' && argv[i + 1]) { args.wait = parseInt(argv[++i], 10); continue; }
    if (a === '--no-trace') { args.trace = false; continue; }
  }
  return args;
}

function usageAndExit(msg) {
  console.error(msg || '');
  console.error('Usage: node scripts/contrhh-cli.mjs --prog <file.hh.js> --csv <file.csv> [--host localhost] [--port 8080] [--recompile] [--no-setdawon] [--no-start] [--wait 4000]');
  process.exit(2);
}

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const args = parseArgs(process.argv);
  if (!args.prog) usageAndExit('Missing --prog <file.hh.js>');
  if (!args.csv) usageAndExit('Missing --csv <file.csv>');

  const url = `ws://${args.host}:${args.port}`;
  const ws = new WebSocket(url);

  let opened = false;

  const waitForOpen = new Promise((resolve, reject) => {
    ws.on('open', () => { opened = true; if (args.trace) console.log('WS open', url); resolve(); });
    ws.on('error', (e) => { if (!opened) reject(e); else console.error('WS error:', e?.message || e); });
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (args.trace) console.log('WS <=', msg);
    } catch (e) {
      if (args.trace) console.log('WS <= (raw)', data.toString());
    }
  });

  ws.on('close', (code, reason) => {
    if (args.trace) console.log('WS closed', code, reason?.toString?.() || '');
  });

  await waitForOpen;

  // Send controller identification like controleurHH does (optional)
  const id = Math.floor((Math.random() * 1000000) + 1);
  ws.send(JSON.stringify({ type: 'startSpectateur', text: 'controleurHH', id }));

  // 1) loadHHFile
  ws.send(JSON.stringify({ type: 'loadHHFile', fileName: args.prog }));
  if (args.trace) console.log('WS => loadHHFile', args.prog);

  // 2) loadSession
  ws.send(JSON.stringify({ type: 'loadSession', fileName: args.csv }));
  if (args.trace) console.log('WS => loadSession', args.csv);

  // 3) optional recompile
  if (args.recompile) {
    ws.send(JSON.stringify({ type: 'compileHHEditionFile', fileName: args.prog }));
    if (args.trace) console.log('WS => compileHHEditionFile', args.prog);
  }

  // small delay to let server process
  await delay(500);

  // 4) setDAWON (value 1 like controller does)
  if (args.setdawon) {
    ws.send(JSON.stringify({ type: 'setDAWON', value: 1 }));
    if (args.trace) console.log('WS => setDAWON 1');
  }

  // 5) startAutomate
  if (args.start) {
    ws.send(JSON.stringify({ type: 'startAutomate' }));
    if (args.trace) console.log('WS => startAutomate');
  }

  // keep connection for a while to receive server logs
  await delay(args.wait);
  ws.close();
}

main().catch((e) => {
  console.error('contrhh-cli failed:', e?.stack || e?.message || e);
  process.exit(1);
});
