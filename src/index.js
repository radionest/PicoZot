/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Main entry point for the PicoZot plugin
 */

// Import required modules
import { registerAddon } from './addon.js';
import { initServices } from './services/aiService.js';
import { initUI } from './ui/sidebar.js';
import { loadConfig } from './utils/config.js';
import { logger } from './utils/logger.js';

/**
 * Initialize the PicoZot plugin
 */
function init() {
  try {
    logger.info('Initializing PicoZot plugin');
    
    // Load configuration
    const config = loadConfig();
    
    // Initialize services
    initServices(config);
    
    // Initialize UI components
    initUI();
    
    // Register the addon with Zotero
    registerAddon();
    
    logger.info('PicoZot plugin initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize PicoZot plugin', error);
  }
}

// Initialize the plugin when the window loads
window.addEventListener('load', init);

// Expose the plugin to the global scope for Zotero
if (typeof window !== 'undefined') {
  window.PicoZot = {
    init
  };
}

// Export public API
export default {
  init
};