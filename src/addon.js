/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Addon registration and Zotero integration
 */

import { logger } from './utils/logger.js';
import { createSidebar } from './ui/sidebar.js';
import { showDialog } from './ui/dialog.js';
import { analyzePico } from './services/picoParser.js';
import { generateLiteratureReview } from './services/literatureReview.js';

// Zotero preferences
const PREF_BRANCH = 'extensions.picozot.';

/**
 * Register the addon with Zotero
 */
export function registerAddon() {
  try {
    logger.info('Registering PicoZot addon with Zotero');
    
    // Register preferences
    registerPreferences();
    
    // Register menu items
    registerMenuItems();
    
    // Register event listeners
    registerEventListeners();
    
    logger.info('PicoZot addon registered successfully');
  } catch (error) {
    logger.error('Failed to register PicoZot addon', error);
  }
}

/**
 * Register preferences for the addon
 */
function registerPreferences() {
  if (!Zotero.Prefs.get(PREF_BRANCH + 'initialized')) {
    // Set default preferences
    Zotero.Prefs.set(PREF_BRANCH + 'aiModel', 'gpt-4');
    Zotero.Prefs.set(PREF_BRANCH + 'showSidebar', true);
    Zotero.Prefs.set(PREF_BRANCH + 'initialized', true);
  }
}

/**
 * Register menu items for the addon
 */
function registerMenuItems() {
  // Add to Tools menu
  const toolsMenu = document.getElementById('menu_ToolsPopup');
  if (toolsMenu) {
    const separator = document.createElement('menuseparator');
    toolsMenu.appendChild(separator);
    
    const menuItem = document.createElement('menuitem');
    menuItem.setAttribute('id', 'picozot-menu');
    menuItem.setAttribute('label', 'PicoZot');
    menuItem.addEventListener('command', () => {
      showDialog('main');
    });
    toolsMenu.appendChild(menuItem);
  }
  
  // Add to context menu for items
  const itemContextMenu = document.getElementById('zotero-itemmenu');
  if (itemContextMenu) {
    const separator = document.createElement('menuseparator');
    itemContextMenu.appendChild(separator);
    
    const analyzeMenuItem = document.createElement('menuitem');
    analyzeMenuItem.setAttribute('id', 'picozot-analyze-menu');
    analyzeMenuItem.setAttribute('label', 'Analyze PICO Elements');
    analyzeMenuItem.addEventListener('command', () => {
      const items = ZoteroPane.getSelectedItems();
      if (items.length > 0) {
        analyzePico(items);
      }
    });
    itemContextMenu.appendChild(analyzeMenuItem);
    
    const reviewMenuItem = document.createElement('menuitem');
    reviewMenuItem.setAttribute('id', 'picozot-review-menu');
    reviewMenuItem.setAttribute('label', 'Generate Literature Review');
    reviewMenuItem.addEventListener('command', () => {
      const items = ZoteroPane.getSelectedItems();
      if (items.length > 0) {
        generateLiteratureReview(items);
      }
    });
    itemContextMenu.appendChild(reviewMenuItem);
  }
}

/**
 * Register event listeners for Zotero events
 */
function registerEventListeners() {
  // Listen for Zotero startup complete
  Zotero.addInitEventListener(onStartupComplete);
  
  // Listen for item selection changes
  const itemsView = ZoteroPane.itemsView;
  if (itemsView) {
    itemsView.addEventListener('select', onItemsSelected);
  }
}

/**
 * Handler for Zotero startup complete
 */
function onStartupComplete() {
  // Initialize sidebar if enabled in preferences
  if (Zotero.Prefs.get(PREF_BRANCH + 'showSidebar')) {
    createSidebar();
  }
}

/**
 * Handler for item selection changes
 */
function onItemsSelected() {
  const items = ZoteroPane.getSelectedItems();
  if (items.length > 0) {
    // Update sidebar with selected items if sidebar is open
    const sidebar = document.getElementById('picozot-sidebar');
    if (sidebar) {
      updateSidebar(items);
    }
  }
}

/**
 * Update the sidebar with selected items
 */
function updateSidebar(items) {
  // Implementation will be in sidebar.js
}
