#!/bin/sh
set -eu
cd /workspaces/ChickenDoom
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://localhost:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
