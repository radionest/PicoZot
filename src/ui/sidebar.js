/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Sidebar UI components
 */

import { logger } from '../utils/logger.js';
import { getConfig } from '../utils/config.js';
import { analyzePico, getPicoElements, comparePicoElements } from '../services/picoParser.js';
import { generateLiteratureReview } from '../services/literatureReview.js';
import { showDialog } from './dialog.js';
import { renderTemplate } from './templates.js';

// Sidebar state
let sidebarInitialized = false;
let sidebarVisible = false;
let sidebarElement = null;

/**
 * Create and initialize the sidebar
 * @returns {Promise<Element>} - The sidebar element
 */
export async function createSidebar() {
  try {
    logger.info('Creating sidebar');
    
    if (sidebarInitialized && sidebarElement) {
      logger.debug('Sidebar already initialized');
      return sidebarElement;
    }
    
    // Create sidebar element
    sidebarElement = document.createElement('div');
    sidebarElement.id = 'picozot-sidebar';
    sidebarElement.className = 'sidebar';
    sidebarElement.style.width = '300px';
    sidebarElement.style.height = '100%';
    sidebarElement.style.position = 'fixed';
    sidebarElement.style.top = '0';
    sidebarElement.style.right = '0';
    sidebarElement.style.backgroundColor = '#f5f5f5';
    sidebarElement.style.borderLeft = '1px solid #ccc';
    sidebarElement.style.zIndex = '1000';
    sidebarElement.style.overflowY = 'auto';
    sidebarElement.style.transition = 'transform 0.3s ease-in-out';
    sidebarElement.style.transform = 'translateX(100%)';
    sidebarElement.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';
    
    // Initialize sidebar content
    initializeSidebarContent();
    
    // Add to document
    document.body.appendChild(sidebarElement);
    
    // Add toggle button to Zotero UI
    addSidebarToggleButton();
    
    sidebarInitialized = true;
    logger.info('Sidebar created successfully');
    
    return sidebarElement;
  } catch (error) {
    logger.error('Failed to create sidebar', error);
    throw error;
  }
}

/**
 * Initialize sidebar content
 */
function initializeSidebarContent() {
  if (!sidebarElement) {
    return;
  }
  
  // Header
  const header = document.createElement('div');
  header.className = 'sidebar-header';
  header.style.padding = '10px';
  header.style.borderBottom = '1px solid #ccc';
  header.style.backgroundColor = '#e0e0e0';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  
  const title = document.createElement('h3');
  title.textContent = 'PicoZot';
  title.style.margin = '0';
  
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0 5px';
  closeButton.onclick = toggleSidebar;
  
  header.appendChild(title);
  header.appendChild(closeButton);
  sidebarElement.appendChild(header);
  
  // Content
  const content = document.createElement('div');
  content.className = 'sidebar-content';
  content.style.padding = '10px';
  
  // Tools section
  const toolsSection = document.createElement('div');
  toolsSection.className = 'sidebar-section';
  toolsSection.style.marginBottom = '20px';
  
  const toolsTitle = document.createElement('h4');
  toolsTitle.textContent = 'Tools';
  toolsTitle.style.borderBottom = '1px solid #ccc';
  toolsTitle.style.paddingBottom = '5px';
  toolsSection.appendChild(toolsTitle);
  
  const toolsList = document.createElement('div');
  toolsList.className = 'tools-list';
  toolsList.style.display = 'flex';
  toolsList.style.flexDirection = 'column';
  toolsList.style.gap = '10px';
  toolsList.style.marginTop = '10px';
  
  const picoButton = createToolButton('PICO Analysis', () => {
    showDialog('pico-analysis', { items: ZoteroPane.getSelectedItems() });
  });
  
  const reviewButton = createToolButton('Generate Literature Review', () => {
    showDialog('literature-review', { items: ZoteroPane.getSelectedItems() });
  });
  
  const compareButton = createToolButton('Compare PICO Elements', () => {
    comparePicoForSelectedItems();
  });
  
  toolsList.appendChild(picoButton);
  toolsList.appendChild(reviewButton);
  toolsList.appendChild(compareButton);
  toolsSection.appendChild(toolsList);
  
  content.appendChild(toolsSection);
  
  // Selected items section
  const itemsSection = document.createElement('div');
  itemsSection.className = 'sidebar-section';
  itemsSection.style.marginBottom = '20px';
  
  const itemsTitle = document.createElement('h4');
  itemsTitle.textContent = 'Selected Items';
  itemsTitle.style.borderBottom = '1px solid #ccc';
  itemsTitle.style.paddingBottom = '5px';
  itemsSection.appendChild(itemsTitle);
  
  const itemsList = document.createElement('div');
  itemsList.id = 'picozot-selected-items';
  itemsList.className = 'items-list';
  itemsList.style.marginTop = '10px';
  itemsList.style.fontSize = '12px';
  itemsList.textContent = 'No items selected';
  
  itemsSection.appendChild(itemsList);
  content.appendChild(itemsSection);
  
  // PICO results section (initially hidden)
  const resultsSection = document.createElement('div');
  resultsSection.id = 'picozot-results-section';
  resultsSection.className = 'sidebar-section';
  resultsSection.style.display = 'none';
  
  const resultsTitle = document.createElement('h4');
  resultsTitle.textContent = 'PICO Analysis';
  resultsTitle.style.borderBottom = '1px solid #ccc';
  resultsTitle.style.paddingBottom = '5px';
  resultsSection.appendChild(resultsTitle);
  
  const resultsContent = document.createElement('div');
  resultsContent.id = 'picozot-results-content';
  resultsContent.className = 'results-content';
  resultsContent.style.marginTop = '10px';
  resultsContent.style.fontSize = '12px';
  
  resultsSection.appendChild(resultsContent);
  content.appendChild(resultsSection);
  
  sidebarElement.appendChild(content);
  
  // Footer
  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.style.padding = '10px';
  footer.style.borderTop = '1px solid #ccc';
  footer.style.backgroundColor = '#e0e0e0';
  footer.style.textAlign = 'center';
  footer.style.fontSize = '12px';
  
  const settingsButton = document.createElement('button');
  settingsButton.textContent = 'Settings';
  settingsButton.style.marginRight = '10px';
  settingsButton.onclick = () => showDialog('settings');
  
  const helpButton = document.createElement('button');
  helpButton.textContent = 'Help';
  helpButton.onclick = showHelp;
  
  footer.appendChild(settingsButton);
  footer.appendChild(helpButton);
  sidebarElement.appendChild(footer);
}

/**
 * Create a tool button
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @returns {Element} - Button element
 */
function createToolButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.padding = '8px';
  button.style.backgroundColor = '#f0f0f0';
  button.style.border = '1px solid #ccc';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.width = '100%';
  button.style.textAlign = 'left';
  
  button.onmouseover = () => {
    button.style.backgroundColor = '#e0e0e0';
  };
  
  button.onmouseout = () => {
    button.style.backgroundColor = '#f0f0f0';
  };
  
  button.onclick = onClick;
  
  return button;
}

/**
 * Add sidebar toggle button to Zotero UI
 */
function addSidebarToggleButton() {
  try {
    // Find a suitable location in Zotero UI
    const toolbar = document.getElementById('zotero-toolbar');
    
    if (!toolbar) {
      logger.warn('Could not find Zotero toolbar');
      return;
    }
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'picozot-toggle-button';
    toggleButton.className = 'zotero-toolbar-button';
    toggleButton.title = 'Toggle PicoZot Sidebar';
    toggleButton.textContent = 'PicoZot';
    toggleButton.style.marginLeft = '5px';
    toggleButton.onclick = toggleSidebar;
    
    // Add to toolbar
    toolbar.appendChild(toggleButton);
    
    logger.debug('Sidebar toggle button added to Zotero UI');
  } catch (error) {
    logger.error('Failed to add sidebar toggle button', error);
  }
}

/**
 * Toggle sidebar visibility
 */
export function toggleSidebar() {
  try {
    if (!sidebarElement) {
      logger.warn('Sidebar element not found');
      return;
    }
    
    sidebarVisible = !sidebarVisible;
    
    if (sidebarVisible) {
      sidebarElement.style.transform = 'translateX(0)';
      updateSelectedItems();
    } else {
      sidebarElement.style.transform = 'translateX(100%)';
    }
    
    logger.debug(`Sidebar visibility toggled: ${sidebarVisible}`);
  } catch (error) {
    logger.error('Failed to toggle sidebar', error);
  }
}

/**
 * Update selected items in the sidebar
 */
export function updateSelectedItems() {
  try {
    if (!sidebarElement || !sidebarVisible) {
      return;
    }
    
    const itemsList = document.getElementById('picozot-selected-items');
    
    if (!itemsList) {
      return;
    }
    
    // Get selected items
    const items = ZoteroPane.getSelectedItems();
    
    // Clear current list
    itemsList.innerHTML = '';
    
    if (!items || items.length === 0) {
      itemsList.textContent = 'No items selected';
      return;
    }
    
    // Create list of items
    const list = document.createElement('ul');
    list.style.margin = '0';
    list.style.padding = '0 0 0 20px';
    
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item.getField('title');
      listItem.style.marginBottom = '5px';
      list.appendChild(listItem);
    });
    
    itemsList.appendChild(list);
    
    logger.debug(`Updated selected items: ${items.length} items`);
  } catch (error) {
    logger.error('Failed to update selected items', error);
  }
}

/**
 * Compare PICO elements for selected items
 */
async function comparePicoForSelectedItems() {
  try {
    const items = ZoteroPane.getSelectedItems();
    
    if (!items || items.length < 2) {
      alert('Please select at least two items to compare');
      return;
    }
    
    // Show loading indicator
    const resultsSection = document.getElementById('picozot-results-section');
    const resultsContent = document.getElementById('picozot-results-content');
    
    if (!resultsSection || !resultsContent) {
      return;
    }
    
    resultsContent.innerHTML = 'Comparing PICO elements...';
    resultsSection.style.display = 'block';
    
    // Perform comparison
    const comparison = await comparePicoElements(items);
    
    // Display results
    displayComparisonResults(comparison);
    
    logger.info('PICO comparison completed');
  } catch (error) {
    logger.error('Failed to compare PICO elements', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Display PICO comparison results
 * @param {Object} comparison - Comparison results
 */
function displayComparisonResults(comparison) {
  const resultsContent = document.getElementById('picozot-results-content');
  
  if (!resultsContent) {
    return;
  }
  
  resultsContent.innerHTML = '';
  
  // Create comparison display
  const container = document.createElement('div');
  
  // Similarities section
  const similaritiesSection = document.createElement('div');
  similaritiesSection.style.marginBottom = '15px';
  
  const similaritiesTitle = document.createElement('h5');
  similaritiesTitle.textContent = 'Similarities';
  similaritiesTitle.style.margin = '0 0 5px 0';
  similaritiesSection.appendChild(similaritiesTitle);
  
  const similaritiesList = document.createElement('ul');
  similaritiesList.style.margin = '0';
  similaritiesList.style.padding = '0 0 0 20px';
  
  for (const [element, value] of Object.entries(comparison.similarities)) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${element}:</strong> ${value}`;
    similaritiesList.appendChild(listItem);
  }
  
  similaritiesSection.appendChild(similaritiesList);
  container.appendChild(similaritiesSection);
  
  // Differences section
  const differencesSection = document.createElement('div');
  
  const differencesTitle = document.createElement('h5');
  differencesTitle.textContent = 'Differences';
  differencesTitle.style.margin = '0 0 5px 0';
  differencesSection.appendChild(differencesTitle);
  
  for (const [element, values] of Object.entries(comparison.differences)) {
    const elementSection = document.createElement('div');
    elementSection.style.marginBottom = '10px';
    
    const elementTitle = document.createElement('div');
    elementTitle.innerHTML = `<strong>${element}:</strong>`;
    elementTitle.style.marginBottom = '5px';
    elementSection.appendChild(elementTitle);
    
    const elementList = document.createElement('ul');
    elementList.style.margin = '0';
    elementList.style.padding = '0 0 0 20px';
    
    values.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<em>${item.itemTitle}:</em> ${item.value}`;
      elementList.appendChild(listItem);
    });
    
    elementSection.appendChild(elementList);
    differencesSection.appendChild(elementSection);
  }
  
  container.appendChild(differencesSection);
  resultsContent.appendChild(container);
}

/**
 * Initialize the UI components
 */
export function initUI() {
  try {
    logger.info('Initializing UI components');
    
    // Check if sidebar should be shown on startup
    const config = getConfig();
    
    if (config.showSidebar) {
      // Create sidebar
      createSidebar().then(() => {
        // Show sidebar
        toggleSidebar();
      });
    }
    
    // Add event listeners
    addEventListeners();
    
    logger.info('UI components initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize UI components', error);
  }
}

/**
 * Add event listeners
 */
function addEventListeners() {
  try {
    // Listen for item selection changes
    const itemsView = ZoteroPane.itemsView;
    
    if (itemsView) {
      itemsView.addEventListener('select', () => {
        updateSelectedItems();
      });
    }
    
    logger.debug('Event listeners added');
  } catch (error) {
    logger.error('Failed to add event listeners', error);
  }
}

/**
 * Show help information
 */
function showHelp() {
  const helpUrl = 'https://github.com/radionest/picozot/wiki';
  
  // Open help URL in browser
  Zotero.launchURL(helpUrl);
}
