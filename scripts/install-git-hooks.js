#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const src = path.join(root, 'githooks/commit-msg')
const dest = path.join(root, '.git/hooks/commit-msg')

if (!fs.existsSync(path.join(root, '.git'))) {
  console.error('Not a git repository — run this from the project root.')
  process.exit(1)
}

fs.copyFileSync(src, dest)
fs.chmodSync(dest, 0o755)
console.log('Installed githooks/commit-msg → .git/hooks/commit-msg')
