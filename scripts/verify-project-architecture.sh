#!/bin/bash
# scripts/verify-project-architecture.sh

echo "🔍 VERCEL PROJECT ARCHITECTURE ANALYSIS"
echo "========================================"

# 1. Check current project context
echo "Current Project Context:"
vercel ls --scope team
pwd
cat package.json | grep -E '"name"|"scripts"'

# 2. Verify domain assignments across ALL projects
echo -e "
🌐 DOMAIN ASSIGNMENTS ACROSS ALL PROJECTS:"
vercel projects ls | while read project; do
  echo "Project: $project"
  vercel domains ls --scope "$project" 2>/dev/null || echo "  No domains found"
  echo "---"
done

# 3. Check specific domain assignment
echo -e "
🎯 SPECIFIC DOMAIN ANALYSIS:"
vercel domains inspect www.instylehairboutique.co.za 2>/dev/null || echo "Domain not found in current scope"

# 4. Check for conflicting projects
echo -e "
⚠️  CONFLICT CHECK:"
for project in $(vercel projects ls); do
  domains=$(vercel domains ls --scope "$project" 2>/dev/null | grep instyle || true)
  if [[ -n "$domains" ]]; then
    echo "FOUND: $project has instyle domains"
    echo "$domains"
  fi
done
