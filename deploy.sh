#!/bin/bash
# deploy.sh — commit and push all changes to GitHub
# Usage: ./deploy.sh "your commit message"
#        ./deploy.sh          (uses a default timestamped message)

MSG="${1:-update $(date '+%Y-%m-%d %H:%M')}"

echo ""
echo "📦 Staging all changes..."
git add .

echo "💬 Committing: \"$MSG\""
git commit -m "$MSG"

echo "🚀 Pushing to GitHub..."
git push

echo ""
echo "✅ Done! Live at: https://elisendarius.github.io/packup/"
echo ""