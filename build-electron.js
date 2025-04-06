
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building React application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('📦 Packaging with Electron...');
execSync('npx electron-builder --config electron-builder.json', { stdio: 'inherit' });

console.log('✅ Build complete! Check the build folder for your executable.');
