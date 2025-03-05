/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * HTML templates for UI components
 */

import { logger } from '../utils/logger.js';

/**
 * Template types
 */
const TEMPLATE_TYPES = {
  PICO_ANALYSIS: 'pico-analysis',
  LITERATURE_REVIEW: 'literature-review',
  COMPARISON: 'comparison',
  SETTINGS: 'settings'
};

/**
 * Render a template with the provided data
 * @param {string} type - Template type
 * @param {Object} data - Data to render in the template
 * @returns {string} - Rendered HTML
 */
export function renderTemplate(type, data = {}) {
  try {
    logger.debug(`Rendering template: ${type}`);
    
    let template = '';
    
    switch (type) {
      case TEMPLATE_TYPES.PICO_ANALYSIS:
        template = renderPicoAnalysisTemplate(data);
        break;
      case TEMPLATE_TYPES.LITERATURE_REVIEW:
        template = renderLiteratureReviewTemplate(data);
        break;
      case TEMPLATE_TYPES.COMPARISON:
        template = renderComparisonTemplate(data);
        break;
      case TEMPLATE_TYPES.SETTINGS:
        template = renderSettingsTemplate(data);
        break;
      default:
        throw new Error(`Unknown template type: ${type}`);
    }
    
    return template;
  } catch (error) {
    logger.error(`Failed to render template: ${type}`, error);
    return `<div class="error">Error rendering template: ${error.message}</div>`;
  }
}

/**
 * Render PICO analysis template
 * @param {Object} data - PICO analysis data
 * @returns {string} - Rendered HTML
 */
function renderPicoAnalysisTemplate(data) {
  const { item, picoElements } = data;
  
  if (!item || !picoElements) {
    return '<div class="error">Missing required data for PICO analysis template</div>';
  }
  
  return `
    <div class="pico-analysis">
      <h3 class="item-title">${escapeHtml(item.getField('title'))}</h3>
      
      <table class="pico-table">
        <tr>
          <th>Element</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>Population/Problem</td>
          <td>${escapeHtml(picoElements.population || 'N/A')}</td>
        </tr>
        <tr>
          <td>Intervention</td>
          <td>${escapeHtml(picoElements.intervention || 'N/A')}</td>
        </tr>
        <tr>
          <td>Comparison</td>
          <td>${escapeHtml(picoElements.comparison || 'N/A')}</td>
        </tr>
        <tr>
          <td>Outcome</td>
          <td>${escapeHtml(picoElements.outcome || 'N/A')}</td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Render literature review template
 * @param {Object} data - Literature review data
 * @returns {string} - Rendered HTML
 */
function renderLiteratureReviewTemplate(data) {
  const { title, content, citations } = data;
  
  if (!content) {
    return '<div class="error">Missing required data for literature review template</div>';
  }
  
  let citationsHtml = '';
  
  if (citations && citations.length > 0) {
    citationsHtml = `
      <div class="citations">
        <h3>Citations</h3>
        <ol>
          ${citations.map(citation => `
            <li>
              ${escapeHtml(citation.authors)}. 
              ${escapeHtml(citation.title)}. 
              <em>${escapeHtml(citation.journal)}</em>. 
              ${escapeHtml(citation.year)}.
            </li>
          `).join('')}
        </ol>
      </div>
    `;
  }
  
  return `
    <div class="literature-review">
      <h2 class="review-title">${escapeHtml(title || 'Literature Review')}</h2>
      
      <div class="review-content">
        ${formatContent(content)}
      </div>
      
      ${citationsHtml}
    </div>
  `;
}

/**
 * Render comparison template
 * @param {Object} data - Comparison data
 * @returns {string} - Rendered HTML
 */
function renderComparisonTemplate(data) {
  const { items, comparison } = data;
  
  if (!items || !comparison) {
    return '<div class="error">Missing required data for comparison template</div>';
  }
  
  let itemsHtml = '';
  
  if (items.length > 0) {
    itemsHtml = `
      <div class="compared-items">
        <h3>Compared Items</h3>
        <ul>
          ${items.map(item => `
            <li>${escapeHtml(item.getField('title'))}</li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  let similaritiesHtml = '';
  
  if (comparison.similarities) {
    similaritiesHtml = `
      <div class="similarities">
        <h3>Similarities</h3>
        <table class="comparison-table">
          <tr>
            <th>Element</th>
            <th>Description</th>
          </tr>
          ${Object.entries(comparison.similarities).map(([element, value]) => `
            <tr>
              <td>${escapeHtml(element)}</td>
              <td>${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }
  
  let differencesHtml = '';
  
  if (comparison.differences) {
    differencesHtml = `
      <div class="differences">
        <h3>Differences</h3>
        
        ${Object.entries(comparison.differences).map(([element, values]) => `
          <div class="difference-element">
            <h4>${escapeHtml(element)}</h4>
            <table class="comparison-table">
              <tr>
                <th>Item</th>
                <th>Description</th>
              </tr>
              ${values.map(item => `
                <tr>
                  <td>${escapeHtml(item.itemTitle)}</td>
                  <td>${escapeHtml(item.value)}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  return `
    <div class="comparison">
      ${itemsHtml}
      ${similaritiesHtml}
      ${differencesHtml}
    </div>
  `;
}

/**
 * Render settings template
 * @param {Object} data - Settings data
 * @returns {string} - Rendered HTML
 */
function renderSettingsTemplate(data) {
  const { config } = data;
  
  if (!config) {
    return '<div class="error">Missing required data for settings template</div>';
  }
  
  return `
    <div class="settings">
      <form id="settings-form">
        <div class="settings-section">
          <h3>AI Settings</h3>
          
          <div class="form-group">
            <label for="api-key">API Key</label>
            <input type="password" id="api-key" value="${escapeHtml(config.aiApiKey || '')}" placeholder="Enter your AI API key">
          </div>
          
          <div class="form-group">
            <label for="model-select">AI Model</label>
            <select id="model-select">
              <option value="gpt-4" ${config.aiModel === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
              <option value="gpt-3.5-turbo" ${config.aiModel === 'gpt-3.5-turbo' ? 'selected' : ''}>GPT-3.5 Turbo</option>
            </select>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>UI Settings</h3>
          
          <div class="form-group">
            <label>
              <input type="checkbox" id="show-sidebar" ${config.showSidebar ? 'checked' : ''}>
              Show sidebar on startup
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="primary-button">Save</button>
          <button type="button" class="secondary-button">Cancel</button>
        </div>
      </form>
    </div>
  `;
}

/**
 * Format content with proper HTML
 * @param {string} content - Content to format
 * @returns {string} - Formatted HTML
 */
function formatContent(content) {
  if (!content) {
    return '';
  }
  
  // Convert newlines to paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map(paragraph => {
    // Skip empty paragraphs
    if (!paragraph.trim()) {
      return '';
    }
    
    // Check if paragraph is a heading
    if (/^#+\s+/.test(paragraph)) {
      const level = paragraph.match(/^(#+)/)[1].length;
      const text = paragraph.replace(/^#+\s+/, '');
      return `<h${level + 1}>${escapeHtml(text)}</h${level + 1}>`;
    }
    
    // Convert single newlines to <br>
    const formattedParagraph = paragraph.replace(/\n/g, '<br>');
    
    return `<p>${formattedParagraph}</p>`;
  }).join('');
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  if (!text) {
    return '';
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
