/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Packaging script
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { name, version } = require('../package.json');

// Paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const buildDir = path.resolve(rootDir, 'build');
const xpiFile = path.resolve(rootDir, `${name}-${version}.xpi`);

// Package steps
function package() {
  console.log('Packaging PicoZot...');
  
  try {
    // First build the project
    console.log('Building project...');
    execSync('node build/build.js', {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    // Check if XPI file was created
    if (!fs.existsSync(xpiFile)) {
      throw new Error('XPI file was not created during build process');
    }
    
    // Create update manifest
    console.log('Creating update manifest...');
    createUpdateManifest();
    
    console.log('Packaging completed successfully!');
    console.log(`Output: ${xpiFile}`);
  } catch (error) {
    console.error('Packaging failed:', error);
    process.exit(1);
  }
}

// Create update manifest for Zotero plugin repository
function createUpdateManifest() {
  const manifest = require('../manifest.json');
  const updateUrl = manifest.applications.zotero.update_url;
  
  // Skip if no update URL is defined
  if (!updateUrl) {
    console.log('No update URL defined in manifest, skipping update manifest creation');
    return;
  }
  
  const updateManifest = {
    addons: {
      [manifest.applications.zotero.id]: {
        updates: [
          {
            version,
            update_link: updateUrl.replace('updates.json', `${name}-${version}.xpi`),
            update_hash: getFileHash(xpiFile),
            applications: {
              zotero: {
                strict_min_version: manifest.applications.zotero.strict_min_version,
                strict_max_version: manifest.applications.zotero.strict_max_version
              }
            }
          }
        ]
      }
    }
  };
  
  // Write update manifest
  const updateManifestPath = path.resolve(distDir, 'updates.json');
  fs.writeFileSync(updateManifestPath, JSON.stringify(updateManifest, null, 2));
  console.log(`Update manifest created at ${updateManifestPath}`);
}

// Get file hash for update manifest
function getFileHash(filePath) {
  try {
    // Use OpenSSL to generate SHA256 hash
    const hash = execSync(`openssl dgst -sha256 -binary "${filePath}" | openssl base64 -A`).toString().trim();
    return `sha256:${hash}`;
  } catch (error) {
    console.warn('Failed to generate file hash:', error.message);
    return '';
  }
}

// Run package
package();
