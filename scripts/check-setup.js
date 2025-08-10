#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking DevConnect setup...\n');

// Check if required files exist
const requiredFiles = [
  '.env',
  'server/.env',
  'client/.env',
  'server/package.json',
  'client/package.json',
  'docker-compose.yml'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} is missing`);
    allFilesExist = false;
  }
});

// Check node_modules
const nodeModulesPaths = [
  'server/node_modules',
  'client/node_modules'
];

nodeModulesPaths.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} exists`);
  } else {
    console.log(`❌ ${dir} is missing - run 'npm run install-all'`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 Setup looks good! You can run:');
  console.log('   npm run dev (for development)');
  console.log('   npm run docker:up (for Docker)');
} else {
  console.log('⚠️  Some files are missing. Please:');
  console.log('   1. Copy .env.example files to .env');
  console.log('   2. Run npm run install-all');
  console.log('   3. Update environment variables');
}

console.log('='.repeat(50));