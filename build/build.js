/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Build script
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { name, version } = require('../package.json');

// Paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const buildDir = path.resolve(rootDir, 'build');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build steps
function build() {
  console.log('Building PicoZot...');
  
  try {
    // Clean dist directory
    console.log('Cleaning dist directory...');
    if (fs.existsSync(distDir)) {
      fs.readdirSync(distDir).forEach(file => {
        const filePath = path.join(distDir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmdirSync(filePath, { recursive: true });
        } else {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    // Run webpack
    console.log('Running webpack...');
    execSync('npx webpack --config build/webpack.config.js --mode production', {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    console.log('Build completed successfully!');
    console.log(`Output: ${path.resolve(rootDir, `${name}-${version}.xpi`)}`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();
