#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('brand-gate')
  .description('CLI to check for platform string leaks')
  .version('1.0.0');

program
  .argument('<domain>', 'The vanity domain to check against (e.g., www.instylehairboutique.co.za)')
  .action(async (domain) => {
    console.log(`Running Brand-Gate check for domain: ${domain}`);

    const platformString = 'appointmentbooking';
    let leaksFound = 0;

    const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build', 'scripts']; // Directories to exclude
    const excludeFiles = ['package.json', 'package-lock.json', 'yarn.lock', 'scripts/brand-gate.js', '.vercel/project.json']; // Files to exclude

    const searchDirectory = process.cwd(); // Search from the current working directory

    function walkSync(dir, filelist = []) {
      fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);

        if (stat.isDirectory()) {
          if (!excludeDirs.includes(file)) {
            filelist = walkSync(filepath, filelist);
          }
        } else {
          if (!excludeFiles.includes(path.relative(searchDirectory, filepath)) && (filepath.endsWith('.js') || filepath.endsWith('.ts') || filepath.endsWith('.tsx') || filepath.endsWith('.md') || filepath.endsWith('.json'))) { // Only check relevant file types
            filelist.push(filepath);
          }
        }
      });
      return filelist;
    }

    const filesToScan = walkSync(searchDirectory);

    for (const file of filesToScan) {
      const content = fs.readFileSync(file, 'utf8');
      const regex = new RegExp(platformString, 'i'); // Case-insensitive search

      if (regex.test(content)) {
        console.log(`🚫 LEAK: Found "${platformString}" in ${path.relative(searchDirectory, file)}`);
        leaksFound++;
      }
    }

    if (leaksFound === 0) {
      console.log('✅ No platform strings found');
    } else {
      console.log(`❌ FAIL – ${leaksFound} leak(s) detected`);
      process.exit(1);
    }
  });

program.parse(process.argv);