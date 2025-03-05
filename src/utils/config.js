/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Configuration utilities
 */

import { logger } from './logger.js';

// Default configuration
const DEFAULT_CONFIG = {
  aiApiKey: '',
  aiModel: 'gpt-4',
  aiApiEndpoint: 'https://api.openai.com/v1/chat/completions',
  showSidebar: true,
  logLevel: 'info'
};

// Configuration cache
let configCache = null;

/**
 * Load configuration from Zotero preferences
 * @returns {Object} - Configuration object
 */
export function loadConfig() {
  try {
    logger.debug('Loading configuration');
    
    // If config is already loaded, return from cache
    if (configCache) {
      return configCache;
    }
    
    const config = { ...DEFAULT_CONFIG };
    
    // Load from Zotero preferences
    try {
      // Check if Zotero preferences API is available
      if (typeof Zotero !== 'undefined' && Zotero.Prefs) {
        const branch = 'extensions.picozot.';
        
        // Load each config property from preferences
        for (const key of Object.keys(DEFAULT_CONFIG)) {
          const prefKey = branch + key;
          
          if (Zotero.Prefs.prefHasUserValue(prefKey)) {
            const prefType = typeof DEFAULT_CONFIG[key];
            
            if (prefType === 'boolean') {
              config[key] = Zotero.Prefs.get(prefKey, DEFAULT_CONFIG[key]);
            } else if (prefType === 'number') {
              config[key] = parseInt(Zotero.Prefs.get(prefKey, DEFAULT_CONFIG[key]));
            } else {
              config[key] = Zotero.Prefs.get(prefKey, DEFAULT_CONFIG[key]);
            }
          }
        }
      } else {
        // For development or testing outside of Zotero
        logger.warn('Zotero preferences API not available, using default configuration');
        
        // Try to load from localStorage if available (for development)
        if (typeof localStorage !== 'undefined') {
          const storedConfig = localStorage.getItem('picozot.config');
          
          if (storedConfig) {
            try {
              const parsedConfig = JSON.parse(storedConfig);
              Object.assign(config, parsedConfig);
            } catch (error) {
              logger.error('Failed to parse stored configuration', error);
            }
          }
        }
      }
    } catch (error) {
      logger.error('Failed to load configuration from preferences', error);
    }
    
    // Cache the loaded config
    configCache = config;
    
    logger.debug('Configuration loaded successfully');
    return config;
  } catch (error) {
    logger.error('Failed to load configuration', error);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Get the current configuration
 * @returns {Object} - Configuration object
 */
export function getConfig() {
  return configCache || loadConfig();
}

/**
 * Save configuration to Zotero preferences
 * @param {Object} config - Configuration object to save
 * @returns {boolean} - True if successful, false otherwise
 */
export function saveConfig(config) {
  try {
    logger.debug('Saving configuration');
    
    // Merge with existing config
    const currentConfig = getConfig();
    const newConfig = { ...currentConfig, ...config };
    
    // Save to Zotero preferences
    try {
      // Check if Zotero preferences API is available
      if (typeof Zotero !== 'undefined' && Zotero.Prefs) {
        const branch = 'extensions.picozot.';
        
        // Save each config property to preferences
        for (const [key, value] of Object.entries(newConfig)) {
          const prefKey = branch + key;
          Zotero.Prefs.set(prefKey, value);
        }
      } else {
        // For development or testing outside of Zotero
        logger.warn('Zotero preferences API not available, saving to localStorage');
        
        // Try to save to localStorage if available (for development)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('picozot.config', JSON.stringify(newConfig));
        }
      }
    } catch (error) {
      logger.error('Failed to save configuration to preferences', error);
      return false;
    }
    
    // Update cache
    configCache = newConfig;
    
    logger.debug('Configuration saved successfully');
    return true;
  } catch (error) {
    logger.error('Failed to save configuration', error);
    return false;
  }
}

/**
 * Reset configuration to defaults
 * @returns {boolean} - True if successful, false otherwise
 */
export function resetConfig() {
  try {
    logger.debug('Resetting configuration to defaults');
    
    // Save default config
    const result = saveConfig(DEFAULT_CONFIG);
    
    if (result) {
      logger.debug('Configuration reset successfully');
    } else {
      logger.error('Failed to reset configuration');
    }
    
    return result;
  } catch (error) {
    logger.error('Failed to reset configuration', error);
    return false;
  }
}

/**
 * Get a specific configuration value
 * @param {string} key - Configuration key
 * @param {any} defaultValue - Default value if key is not found
 * @returns {any} - Configuration value
 */
export function getConfigValue(key, defaultValue = null) {
  const config = getConfig();
  return key in config ? config[key] : defaultValue;
}

/**
 * Set a specific configuration value
 * @param {string} key - Configuration key
 * @param {any} value - Configuration value
 * @returns {boolean} - True if successful, false otherwise
 */
export function setConfigValue(key, value) {
  const config = getConfig();
  config[key] = value;
  return saveConfig(config);
}
