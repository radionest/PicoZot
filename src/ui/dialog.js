/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Dialog UI components
 */

import { logger } from '../utils/logger.js';
import { getConfig } from '../utils/config.js';
import { analyzePico } from '../services/picoParser.js';
import { generateLiteratureReview, getReviewTemplate } from '../services/literatureReview.js';
import { renderTemplate } from './templates.js';

// Dialog types
const DIALOG_TYPES = {
  MAIN: 'main',
  PICO_ANALYSIS: 'pico-analysis',
  LITERATURE_REVIEW: 'literature-review',
  SETTINGS: 'settings'
};

// Active dialogs
const activeDialogs = new Map();

/**
 * Show a dialog of the specified type
 * @param {string} type - Dialog type
 * @param {Object} options - Additional options for the dialog
 * @returns {Promise<Object>} - Dialog window and document
 */
export async function showDialog(type, options = {}) {
  try {
    logger.info(`Showing dialog: ${type}`);
    
    // Check if dialog is already open
    if (activeDialogs.has(type)) {
      const existingDialog = activeDialogs.get(type);
      existingDialog.window.focus();
      return existingDialog;
    }
    
    // Get dialog configuration
    const dialogConfig = getDialogConfig(type);
    
    // Create dialog window
    const dialogWindow = openDialogWindow(dialogConfig);
    
    // Wait for window to load
    await new Promise(resolve => {
      dialogWindow.addEventListener('load', resolve, { once: true });
    });
    
    // Initialize dialog content
    const dialogDoc = dialogWindow.document;
    initializeDialogContent(dialogDoc, type, options);
    
    // Add event listeners
    addDialogEventListeners(dialogWindow, dialogDoc, type, options);
    
    // Store active dialog
    const dialog = { window: dialogWindow, document: dialogDoc };
    activeDialogs.set(type, dialog);
    
    // Add close event to remove from active dialogs
    dialogWindow.addEventListener('unload', () => {
      activeDialogs.delete(type);
    });
    
    logger.info(`Dialog shown successfully: ${type}`);
    return dialog;
  } catch (error) {
    logger.error(`Failed to show dialog: ${type}`, error);
    throw error;
  }
}

/**
 * Get dialog configuration based on type
 * @param {string} type - Dialog type
 * @returns {Object} - Dialog configuration
 */
function getDialogConfig(type) {
  const config = getConfig();
  
  const dialogConfigs = {
    [DIALOG_TYPES.MAIN]: {
      title: 'PicoZot',
      url: 'chrome://picozot/content/main.xul',
      width: 600,
      height: 400,
      resizable: true
    },
    [DIALOG_TYPES.PICO_ANALYSIS]: {
      title: 'PICO Analysis',
      url: 'chrome://picozot/content/pico-analysis.xul',
      width: 700,
      height: 500,
      resizable: true
    },
    [DIALOG_TYPES.LITERATURE_REVIEW]: {
      title: 'Generate Literature Review',
      url: 'chrome://picozot/content/literature-review.xul',
      width: 800,
      height: 600,
      resizable: true
    },
    [DIALOG_TYPES.SETTINGS]: {
      title: 'PicoZot Settings',
      url: 'chrome://picozot/content/settings.xul',
      width: 500,
      height: 400,
      resizable: false
    }
  };
  
  return dialogConfigs[type] || dialogConfigs[DIALOG_TYPES.MAIN];
}

/**
 * Open a dialog window
 * @param {Object} config - Dialog configuration
 * @returns {Window} - Dialog window
 */
function openDialogWindow(config) {
  // For development, we'll create a dialog using HTML
  // In a real Zotero plugin, this would use Zotero's dialog API
  
  const dialogWindow = window.open(
    '',
    '',
    `width=${config.width},height=${config.height},resizable=${config.resizable},scrollbars=yes`
  );
  
  dialogWindow.document.title = config.title;
  
  return dialogWindow;
}

/**
 * Initialize dialog content
 * @param {Document} doc - Dialog document
 * @param {string} type - Dialog type
 * @param {Object} options - Additional options for the dialog
 */
function initializeDialogContent(doc, type, options) {
  // Set up basic HTML structure
  doc.body.innerHTML = '';
  doc.body.style.fontFamily = 'Arial, sans-serif';
  doc.body.style.margin = '0';
  doc.body.style.padding = '0';
  
  // Add CSS
  const style = doc.createElement('style');
  style.textContent = `
    .dialog-header {
      background-color: #f0f0f0;
      padding: 10px;
      border-bottom: 1px solid #ccc;
    }
    .dialog-content {
      padding: 20px;
    }
    .dialog-footer {
      background-color: #f0f0f0;
      padding: 10px;
      border-top: 1px solid #ccc;
      text-align: right;
    }
    button {
      padding: 5px 10px;
      margin-left: 5px;
    }
    input, select, textarea {
      width: 100%;
      padding: 5px;
      margin-bottom: 10px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-group {
      margin-bottom: 15px;
    }
  `;
  doc.head.appendChild(style);
  
  // Create dialog structure
  const header = doc.createElement('div');
  header.className = 'dialog-header';
  
  const content = doc.createElement('div');
  content.className = 'dialog-content';
  
  const footer = doc.createElement('div');
  footer.className = 'dialog-footer';
  
  doc.body.appendChild(header);
  doc.body.appendChild(content);
  doc.body.appendChild(footer);
  
  // Add dialog-specific content
  switch (type) {
    case DIALOG_TYPES.MAIN:
      initializeMainDialog(doc, header, content, footer, options);
      break;
    case DIALOG_TYPES.PICO_ANALYSIS:
      initializePicoAnalysisDialog(doc, header, content, footer, options);
      break;
    case DIALOG_TYPES.LITERATURE_REVIEW:
      initializeLiteratureReviewDialog(doc, header, content, footer, options);
      break;
    case DIALOG_TYPES.SETTINGS:
      initializeSettingsDialog(doc, header, content, footer, options);
      break;
    default:
      initializeMainDialog(doc, header, content, footer, options);
  }
}

/**
 * Initialize main dialog content
 * @param {Document} doc - Dialog document
 * @param {Element} header - Dialog header element
 * @param {Element} content - Dialog content element
 * @param {Element} footer - Dialog footer element
 * @param {Object} options - Additional options for the dialog
 */
function initializeMainDialog(doc, header, content, footer, options) {
  // Header
  const title = doc.createElement('h2');
  title.textContent = 'PicoZot';
  title.style.margin = '0';
  header.appendChild(title);
  
  // Content
  const description = doc.createElement('p');
  description.textContent = 'PicoZot helps you analyze medical research papers using the PICO framework and generate literature reviews.';
  content.appendChild(description);
  
  const buttonContainer = doc.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.flexDirection = 'column';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '20px';
  
  const picoButton = doc.createElement('button');
  picoButton.textContent = 'PICO Analysis';
  picoButton.style.padding = '10px';
  picoButton.onclick = () => showDialog(DIALOG_TYPES.PICO_ANALYSIS);
  
  const reviewButton = doc.createElement('button');
  reviewButton.textContent = 'Generate Literature Review';
  reviewButton.style.padding = '10px';
  reviewButton.onclick = () => showDialog(DIALOG_TYPES.LITERATURE_REVIEW);
  
  buttonContainer.appendChild(picoButton);
  buttonContainer.appendChild(reviewButton);
  content.appendChild(buttonContainer);
  
  // Footer
  const settingsButton = doc.createElement('button');
  settingsButton.textContent = 'Settings';
  settingsButton.onclick = () => showDialog(DIALOG_TYPES.SETTINGS);
  
  const closeButton = doc.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.onclick = () => doc.defaultView.close();
  
  footer.appendChild(settingsButton);
  footer.appendChild(closeButton);
}

/**
 * Initialize PICO analysis dialog content
 * @param {Document} doc - Dialog document
 * @param {Element} header - Dialog header element
 * @param {Element} content - Dialog content element
 * @param {Element} footer - Dialog footer element
 * @param {Object} options - Additional options for the dialog
 */
function initializePicoAnalysisDialog(doc, header, content, footer, options) {
  // Header
  const title = doc.createElement('h2');
  title.textContent = 'PICO Analysis';
  title.style.margin = '0';
  header.appendChild(title);
  
  // Content
  const description = doc.createElement('p');
  description.textContent = 'Analyze selected items using the PICO framework.';
  content.appendChild(description);
  
  const form = doc.createElement('form');
  form.id = 'pico-form';
  
  // Selected items section
  const itemsGroup = doc.createElement('div');
  itemsGroup.className = 'form-group';
  
  const itemsLabel = doc.createElement('label');
  itemsLabel.textContent = 'Selected Items';
  itemsGroup.appendChild(itemsLabel);
  
  const itemsList = doc.createElement('div');
  itemsList.id = 'selected-items';
  itemsList.style.border = '1px solid #ccc';
  itemsList.style.padding = '10px';
  itemsList.style.maxHeight = '150px';
  itemsList.style.overflowY = 'auto';
  
  // Populate with selected items if available
  if (options.items && options.items.length > 0) {
    options.items.forEach(item => {
      const itemElement = doc.createElement('div');
      itemElement.textContent = item.getField('title');
      itemsList.appendChild(itemElement);
    });
  } else {
    itemsList.textContent = 'No items selected';
  }
  
  itemsGroup.appendChild(itemsList);
  form.appendChild(itemsGroup);
  
  // Options section
  const optionsGroup = doc.createElement('div');
  optionsGroup.className = 'form-group';
  
  const optionsLabel = doc.createElement('label');
  optionsLabel.textContent = 'Analysis Options';
  optionsGroup.appendChild(optionsLabel);
  
  const saveOption = doc.createElement('div');
  saveOption.style.marginBottom = '5px';
  
  const saveCheckbox = doc.createElement('input');
  saveCheckbox.type = 'checkbox';
  saveCheckbox.id = 'save-analysis';
  saveCheckbox.checked = true;
  saveCheckbox.style.width = 'auto';
  saveCheckbox.style.marginRight = '5px';
  
  const saveLabel = doc.createElement('label');
  saveLabel.htmlFor = 'save-analysis';
  saveLabel.textContent = 'Save analysis as item annotation';
  saveLabel.style.display = 'inline';
  saveLabel.style.fontWeight = 'normal';
  
  saveOption.appendChild(saveCheckbox);
  saveOption.appendChild(saveLabel);
  optionsGroup.appendChild(saveOption);
  
  form.appendChild(optionsGroup);
  content.appendChild(form);
  
  // Results section (initially hidden)
  const resultsSection = doc.createElement('div');
  resultsSection.id = 'results-section';
  resultsSection.style.display = 'none';
  resultsSection.style.marginTop = '20px';
  
  const resultsTitle = doc.createElement('h3');
  resultsTitle.textContent = 'Analysis Results';
  resultsSection.appendChild(resultsTitle);
  
  const resultsContent = doc.createElement('div');
  resultsContent.id = 'results-content';
  resultsSection.appendChild(resultsContent);
  
  content.appendChild(resultsSection);
  
  // Footer
  const analyzeButton = doc.createElement('button');
  analyzeButton.textContent = 'Analyze';
  analyzeButton.id = 'analyze-button';
  analyzeButton.disabled = !options.items || options.items.length === 0;
  analyzeButton.onclick = async (e) => {
    e.preventDefault();
    
    if (!options.items || options.items.length === 0) {
      alert('No items selected for analysis');
      return;
    }
    
    try {
      analyzeButton.disabled = true;
      analyzeButton.textContent = 'Analyzing...';
      
      const saveAnalysis = doc.getElementById('save-analysis').checked;
      
      // Perform PICO analysis
      const results = await analyzePico(options.items, { saveAnnotation: saveAnalysis });
      
      // Display results
      displayPicoResults(doc, results);
      
      analyzeButton.textContent = 'Analyze';
      analyzeButton.disabled = false;
    } catch (error) {
      alert(`Error: ${error.message}`);
      analyzeButton.textContent = 'Analyze';
      analyzeButton.disabled = false;
    }
  };
  
  const closeButton = doc.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.onclick = () => doc.defaultView.close();
  
  footer.appendChild(analyzeButton);
  footer.appendChild(closeButton);
}

/**
 * Display PICO analysis results
 * @param {Document} doc - Dialog document
 * @param {Array} results - Analysis results
 */
function displayPicoResults(doc, results) {
  const resultsSection = doc.getElementById('results-section');
  const resultsContent = doc.getElementById('results-content');
  
  resultsContent.innerHTML = '';
  
  if (results.length === 0) {
    resultsContent.textContent = 'No results found';
    resultsSection.style.display = 'block';
    return;
  }
  
  results.forEach(result => {
    const itemResult = doc.createElement('div');
    itemResult.style.marginBottom = '20px';
    itemResult.style.padding = '10px';
    itemResult.style.border = '1px solid #ccc';
    
    const itemTitle = doc.createElement('h4');
    itemTitle.textContent = result.item.getField('title');
    itemTitle.style.margin = '0 0 10px 0';
    itemResult.appendChild(itemTitle);
    
    const picoTable = doc.createElement('table');
    picoTable.style.width = '100%';
    picoTable.style.borderCollapse = 'collapse';
    
    const addRow = (label, value) => {
      const row = doc.createElement('tr');
      
      const labelCell = doc.createElement('td');
      labelCell.textContent = label;
      labelCell.style.padding = '5px';
      labelCell.style.fontWeight = 'bold';
      labelCell.style.width = '120px';
      labelCell.style.verticalAlign = 'top';
      
      const valueCell = doc.createElement('td');
      valueCell.textContent = value || 'N/A';
      valueCell.style.padding = '5px';
      
      row.appendChild(labelCell);
      row.appendChild(valueCell);
      picoTable.appendChild(row);
    };
    
    addRow('Population', result.picoElements.population);
    addRow('Intervention', result.picoElements.intervention);
    addRow('Comparison', result.picoElements.comparison);
    addRow('Outcome', result.picoElements.outcome);
    
    itemResult.appendChild(picoTable);
    resultsContent.appendChild(itemResult);
  });
  
  resultsSection.style.display = 'block';
}

/**
 * Initialize literature review dialog content
 * @param {Document} doc - Dialog document
 * @param {Element} header - Dialog header element
 * @param {Element} content - Dialog content element
 * @param {Element} footer - Dialog footer element
 * @param {Object} options - Additional options for the dialog
 */
function initializeLiteratureReviewDialog(doc, header, content, footer, options) {
  // Header
  const title = doc.createElement('h2');
  title.textContent = 'Generate Literature Review';
  title.style.margin = '0';
  header.appendChild(title);
  
  // Content
  const description = doc.createElement('p');
  description.textContent = 'Generate a literature review based on selected items.';
  content.appendChild(description);
  
  const form = doc.createElement('form');
  form.id = 'review-form';
  
  // Selected items section
  const itemsGroup = doc.createElement('div');
  itemsGroup.className = 'form-group';
  
  const itemsLabel = doc.createElement('label');
  itemsLabel.textContent = 'Selected Items';
  itemsGroup.appendChild(itemsLabel);
  
  const itemsList = doc.createElement('div');
  itemsList.id = 'selected-items';
  itemsList.style.border = '1px solid #ccc';
  itemsList.style.padding = '10px';
  itemsList.style.maxHeight = '150px';
  itemsList.style.overflowY = 'auto';
  
  // Populate with selected items if available
  if (options.items && options.items.length > 0) {
    options.items.forEach(item => {
      const itemElement = doc.createElement('div');
      itemElement.textContent = item.getField('title');
      itemsList.appendChild(itemElement);
    });
  } else {
    itemsList.textContent = 'No items selected';
  }
  
  itemsGroup.appendChild(itemsList);
  form.appendChild(itemsGroup);
  
  // Template selection
  const templateGroup = doc.createElement('div');
  templateGroup.className = 'form-group';
  
  const templateLabel = doc.createElement('label');
  templateLabel.textContent = 'Review Template';
  templateLabel.htmlFor = 'template-select';
  templateGroup.appendChild(templateLabel);
  
  const templateSelect = doc.createElement('select');
  templateSelect.id = 'template-select';
  
  const defaultOption = doc.createElement('option');
  defaultOption.value = 'default';
  defaultOption.textContent = 'Default Template';
  templateSelect.appendChild(defaultOption);
  
  const systematicOption = doc.createElement('option');
  systematicOption.value = 'systematic';
  systematicOption.textContent = 'Systematic Review';
  templateSelect.appendChild(systematicOption);
  
  templateGroup.appendChild(templateSelect);
  form.appendChild(templateGroup);
  
  // Additional options
  const optionsGroup = doc.createElement('div');
  optionsGroup.className = 'form-group';
  
  const optionsLabel = doc.createElement('label');
  optionsLabel.textContent = 'Additional Options';
  optionsGroup.appendChild(optionsLabel);
  
  const combineOption = doc.createElement('div');
  combineOption.style.marginBottom = '5px';
  
  const combineCheckbox = doc.createElement('input');
  combineCheckbox.type = 'checkbox';
  combineCheckbox.id = 'combine-pico';
  combineCheckbox.checked = true;
  combineCheckbox.style.width = 'auto';
  combineCheckbox.style.marginRight = '5px';
  
  const combineLabel = doc.createElement('label');
  combineLabel.htmlFor = 'combine-pico';
  combineLabel.textContent = 'Combine PICO elements from all items';
  combineLabel.style.display = 'inline';
  combineLabel.style.fontWeight = 'normal';
  
  combineOption.appendChild(combineCheckbox);
  combineOption.appendChild(combineLabel);
  optionsGroup.appendChild(combineOption);
  
  const saveOption = doc.createElement('div');
  saveOption.style.marginBottom = '5px';
  
  const saveCheckbox = doc.createElement('input');
  saveCheckbox.type = 'checkbox';
  saveCheckbox.id = 'save-review';
  saveCheckbox.checked = true;
  saveCheckbox.style.width = 'auto';
  saveCheckbox.style.marginRight = '5px';
  
  const saveLabel = doc.createElement('label');
  saveLabel.htmlFor = 'save-review';
  saveLabel.textContent = 'Save review as a document';
  saveLabel.style.display = 'inline';
  saveLabel.style.fontWeight = 'normal';
  
  saveOption.appendChild(saveCheckbox);
  saveOption.appendChild(saveLabel);
  optionsGroup.appendChild(saveOption);
  
  form.appendChild(optionsGroup);
  
  // Additional instructions
  const instructionsGroup = doc.createElement('div');
  instructionsGroup.className = 'form-group';
  
  const instructionsLabel = doc.createElement('label');
  instructionsLabel.textContent = 'Additional Instructions';
  instructionsLabel.htmlFor = 'additional-instructions';
  instructionsGroup.appendChild(instructionsLabel);
  
  const instructionsTextarea = doc.createElement('textarea');
  instructionsTextarea.id = 'additional-instructions';
  instructionsTextarea.rows = 4;
  instructionsTextarea.placeholder = 'Enter any additional instructions for the review generation...';
  instructionsGroup.appendChild(instructionsTextarea);
  
  form.appendChild(instructionsGroup);
  content.appendChild(form);
  
  // Results section (initially hidden)
  const resultsSection = doc.createElement('div');
  resultsSection.id = 'results-section';
  resultsSection.style.display = 'none';
  resultsSection.style.marginTop = '20px';
  
  const resultsTitle = doc.createElement('h3');
  resultsTitle.textContent = 'Generated Review';
  resultsSection.appendChild(resultsTitle);
  
  const resultsContent = doc.createElement('div');
  resultsContent.id = 'results-content';
  resultsContent.style.border = '1px solid #ccc';
  resultsContent.style.padding = '10px';
  resultsContent.style.maxHeight = '300px';
  resultsContent.style.overflowY = 'auto';
  resultsSection.appendChild(resultsContent);
  
  content.appendChild(resultsSection);
  
  // Footer
  const generateButton = doc.createElement('button');
  generateButton.textContent = 'Generate Review';
  generateButton.id = 'generate-button';
  generateButton.disabled = !options.items || options.items.length === 0;
  generateButton.onclick = async (e) => {
    e.preventDefault();
    
    if (!options.items || options.items.length === 0) {
      alert('No items selected for review');
      return;
    }
    
    try {
      generateButton.disabled = true;
      generateButton.textContent = 'Generating...';
      
      const templateName = doc.getElementById('template-select').value;
      const combinePico = doc.getElementById('combine-pico').checked;
      const saveToFile = doc.getElementById('save-review').checked;
      const additionalInstructions = doc.getElementById('additional-instructions').value;
      
      // Generate literature review
      const review = await generateLiteratureReview(options.items, {
        templateName,
        combinePico,
        saveToFile,
        additionalInstructions
      });
      
      // Display results
      displayReviewResults(doc, review);
      
      generateButton.textContent = 'Generate Review';
      generateButton.disabled = false;
    } catch (error) {
      alert(`Error: ${error.message}`);
      generateButton.textContent = 'Generate Review';
      generateButton.disabled = false;
    }
  };
  
  const closeButton = doc.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.onclick = () => doc.defaultView.close();
  
  footer.appendChild(generateButton);
  footer.appendChild(closeButton);
}

/**
 * Display literature review results
 * @param {Document} doc - Dialog document
 * @param {string} review - Generated review
 */
function displayReviewResults(doc, review) {
  const resultsSection = doc.getElementById('results-section');
  const resultsContent = doc.getElementById('results-content');
  
  resultsContent.innerHTML = '';
  
  if (!review) {
    resultsContent.textContent = 'No review generated';
    resultsSection.style.display = 'block';
    return;
  }
  
  // Format the review with basic HTML
  const formattedReview = review
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
  
  resultsContent.innerHTML = formattedReview;
  resultsSection.style.display = 'block';
}

/**
 * Initialize settings dialog content
 * @param {Document} doc - Dialog document
 * @param {Element} header - Dialog header element
 * @param {Element} content - Dialog content element
 * @param {Element} footer - Dialog footer element
 * @param {Object} options - Additional options for the dialog
 */
function initializeSettingsDialog(doc, header, content, footer, options) {
  // Header
  const title = doc.createElement('h2');
  title.textContent = 'PicoZot Settings';
  title.style.margin = '0';
  header.appendChild(title);
  
  // Content
  const form = doc.createElement('form');
  form.id = 'settings-form';
  
  // AI settings
  const aiGroup = doc.createElement('div');
  aiGroup.className = 'form-group';
  
  const aiLabel = doc.createElement('h3');
  aiLabel.textContent = 'AI Settings';
  aiLabel.style.marginTop = '0';
  aiGroup.appendChild(aiLabel);
  
  // API Key
  const apiKeyGroup = doc.createElement('div');
  apiKeyGroup.className = 'form-group';
  
  const apiKeyLabel = doc.createElement('label');
  apiKeyLabel.textContent = 'API Key';
  apiKeyLabel.htmlFor = 'api-key';
  apiKeyGroup.appendChild(apiKeyLabel);
  
  const apiKeyInput = doc.createElement('input');
  apiKeyInput.type = 'password';
  apiKeyInput.id = 'api-key';
  apiKeyInput.placeholder = 'Enter your AI API key';
  apiKeyInput.value = getConfig().aiApiKey || '';
  apiKeyGroup.appendChild(apiKeyInput);
  
  aiGroup.appendChild(apiKeyGroup);
  
  // Model selection
  const modelGroup = doc.createElement('div');
  modelGroup.className = 'form-group';
  
  const modelLabel = doc.createElement('label');
  modelLabel.textContent = 'AI Model';
  modelLabel.htmlFor = 'model-select';
  modelGroup.appendChild(modelLabel);
  
  const modelSelect = doc.createElement('select');
  modelSelect.id = 'model-select';
  
  const gpt4Option = doc.createElement('option');
  gpt4Option.value = 'gpt-4';
  gpt4Option.textContent = 'GPT-4';
  modelSelect.appendChild(gpt4Option);
  
  const gpt35Option = doc.createElement('option');
  gpt35Option.value = 'gpt-3.5-turbo';
  gpt35Option.textContent = 'GPT-3.5 Turbo';
  modelSelect.appendChild(gpt35Option);
  
  // Set selected option based on config
  modelSelect.value = getConfig().aiModel || 'gpt-4';
  
  modelGroup.appendChild(modelSelect);
  aiGroup.appendChild(modelGroup);
  
  form.appendChild(aiGroup);
  
  // UI settings
  const uiGroup = doc.createElement('div');
  uiGroup.className = 'form-group';
  
  const uiLabel = doc.createElement('h3');
  uiLabel.textContent = 'UI Settings';
  uiGroup.appendChild(uiLabel);
  
  // Show sidebar option
  const sidebarOption = doc.createElement('div');
  sidebarOption.style.marginBottom = '5px';
  
  const sidebarCheckbox = doc.createElement('input');
  sidebarCheckbox.type = 'checkbox';
  sidebarCheckbox.id = 'show-sidebar';
  sidebarCheckbox.checked = getConfig().showSidebar !== false;
  sidebarCheckbox.style.width = 'auto';
  sidebarCheckbox.style.marginRight = '5px';
  
  const sidebarLabel = doc.createElement('label');
  sidebarLabel.htmlFor = 'show-sidebar';
  sidebarLabel.textContent = 'Show sidebar on startup';
  sidebarLabel.style.display = 'inline';
  sidebarLabel.style.fontWeight = 'normal';
  
  sidebarOption.appendChild(sidebarCheckbox);
  sidebarOption.appendChild(sidebarLabel);
  uiGroup.appendChild(sidebarOption);
  
  form.appendChild(uiGroup);
  content.appendChild(form);
  
  // Footer
  const saveButton = doc.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.onclick = async (e) => {
    e.preventDefault();
    
    try {
      const apiKey = doc.getElementById('api-key').value;
      const model = doc.getElementById('model-select').value;
      const showSidebar = doc.getElementById('show-sidebar').checked;
      
      // Save settings
      await saveSettings({
        aiApiKey: apiKey,
        aiModel: model,
        showSidebar
      });
      
      alert('Settings saved successfully');
      doc.defaultView.close();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  const cancelButton = doc.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.onclick = () => doc.defaultView.close();
  
  footer.appendChild(saveButton);
  footer.appendChild(cancelButton);
}

/**
 * Save settings to configuration
 * @param {Object} settings - Settings to save
 * @returns {Promise<void>}
 */
async function saveSettings(settings) {
  try {
    logger.info('Saving settings');
    
    // Update configuration
    const config = getConfig();
    const updatedConfig = { ...config, ...settings };
    
    // Save to Zotero preferences
    for (const [key, value] of Object.entries(updatedConfig)) {
      Zotero.Prefs.set(`extensions.picozot.${key}`, value);
    }
    
    logger.info('Settings saved successfully');
  } catch (error) {
    logger.error('Failed to save settings', error);
    throw error;
  }
}

/**
 * Add event listeners to dialog
 * @param {Window} dialogWindow - Dialog window
 * @param {Document} dialogDoc - Dialog document
 * @param {string} type - Dialog type
 * @param {Object} options - Additional options for the dialog
 */
function addDialogEventListeners(dialogWindow, dialogDoc, type, options) {
  // Add common event listeners
  dialogWindow.addEventListener('keydown', (event) => {
    // Close dialog on Escape key
    if (event.key === 'Escape') {
      dialogWindow.close();
    }
  });
  
  // Add dialog-specific event listeners
  switch (type) {
    case DIALOG_TYPES.MAIN:
      // No specific event listeners for main dialog
      break;
    case DIALOG_TYPES.PICO_ANALYSIS:
      // No specific event listeners for PICO analysis dialog
      break;
    case DIALOG_TYPES.LITERATURE_REVIEW:
      // No specific event listeners for literature review dialog
      break;
    case DIALOG_TYPES.SETTINGS:
      // No specific event listeners for settings dialog
      break;
  }
}
