#!/usr/bin/env node
// Post-build: flatten TanStack Start SPA output so `dist/` contains
// index.html + assets/ at the root (drop-in for any static host).
import { existsSync, renameSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const client = join(dist, "client");
const server = join(dist, "server");

if (existsSync(server)) rmSync(server, { recursive: true, force: true });

if (existsSync(client)) {
  for (const entry of readdirSync(client)) {
    renameSync(join(client, entry), join(dist, entry));
  }
  rmSync(client, { recursive: true, force: true });
}

const shell = join(dist, "_shell.html");
const index = join(dist, "index.html");
if (existsSync(shell) && !existsSync(index)) {
  renameSync(shell, index);
} else if (existsSync(shell) && existsSync(index)) {
  // prerendered index.html already exists — drop the shell duplicate
  rmSync(shell);
}

console.log("[flatten-dist] dist/ ready for static hosting.");
