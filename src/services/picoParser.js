/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * PICO Parser for extracting and processing PICO elements
 */

import { logger } from '../utils/logger.js';
import { extractPicoElements } from './aiService.js';
import { getItemContent, saveItemAnnotation } from '../utils/zoteroApi.js';

/**
 * Analyze PICO elements for a collection of Zotero items
 * @param {Array} items - Array of Zotero items
 * @returns {Promise<Array>} - Array of items with their PICO elements
 */
export async function analyzePico(items) {
  try {
    logger.info(`Analyzing PICO elements for ${items.length} items`);
    
    const results = [];
    
    for (const item of items) {
      try {
        logger.debug(`Processing item: ${item.getField('title')}`);
        
        // Get item content (abstract, notes, etc.)
        const content = await getItemContent(item);
        
        if (!content) {
          logger.warn(`No content found for item: ${item.getField('title')}`);
          continue;
        }
        
        // Extract PICO elements using AI
        const picoElements = await extractPicoElements(content);
        
        // Save PICO elements as item annotation
        await savePicoElements(item, picoElements);
        
        results.push({
          item: item,
          picoElements: picoElements
        });
        
        logger.debug(`Successfully processed item: ${item.getField('title')}`);
      } catch (error) {
        logger.error(`Failed to process item: ${item.getField('title')}`, error);
      }
    }
    
    logger.info(`Completed PICO analysis for ${results.length} items`);
    return results;
  } catch (error) {
    logger.error('Failed to analyze PICO elements', error);
    throw error;
  }
}

/**
 * Save PICO elements as an annotation for a Zotero item
 * @param {Object} item - Zotero item
 * @param {Object} picoElements - PICO elements
 */
async function savePicoElements(item, picoElements) {
  try {
    const picoText = formatPicoElements(picoElements);
    
    // Save as item annotation
    await saveItemAnnotation(item, 'PICO Analysis', picoText);
    
    logger.debug(`Saved PICO elements for item: ${item.getField('title')}`);
  } catch (error) {
    logger.error(`Failed to save PICO elements for item: ${item.getField('title')}`, error);
    throw error;
  }
}

/**
 * Format PICO elements as a readable text
 * @param {Object} picoElements - PICO elements
 * @returns {string} - Formatted text
 */
function formatPicoElements(picoElements) {
  return `
    PICO Analysis
    -------------
    
    Population/Problem:
    ${picoElements.population}
    
    Intervention:
    ${picoElements.intervention}
    
    Comparison:
    ${picoElements.comparison || 'N/A'}
    
    Outcome:
    ${picoElements.outcome}
  `;
}

/**
 * Get PICO elements for a Zotero item
 * @param {Object} item - Zotero item
 * @returns {Promise<Object>} - PICO elements
 */
export async function getPicoElements(item) {
  try {
    // Check if item already has PICO analysis
    const existingPico = await getExistingPicoAnalysis(item);
    
    if (existingPico) {
      return existingPico;
    }
    
    // If not, perform new analysis
    const content = await getItemContent(item);
    
    if (!content) {
      throw new Error(`No content found for item: ${item.getField('title')}`);
    }
    
    const picoElements = await extractPicoElements(content);
    
    // Save for future use
    await savePicoElements(item, picoElements);
    
    return picoElements;
  } catch (error) {
    logger.error(`Failed to get PICO elements for item: ${item.getField('title')}`, error);
    throw error;
  }
}

/**
 * Get existing PICO analysis from item annotations
 * @param {Object} item - Zotero item
 * @returns {Promise<Object>} - PICO elements or null if not found
 */
async function getExistingPicoAnalysis(item) {
  try {
    // Implementation depends on Zotero API
    // This is a placeholder
    return null;
  } catch (error) {
    logger.error(`Failed to get existing PICO analysis for item: ${item.getField('title')}`, error);
    return null;
  }
}

/**
 * Compare PICO elements between multiple items
 * @param {Array} items - Array of Zotero items
 * @returns {Promise<Object>} - Comparison results
 */
export async function comparePicoElements(items) {
  try {
    logger.info(`Comparing PICO elements for ${items.length} items`);
    
    const itemsWithPico = [];
    
    // Get PICO elements for each item
    for (const item of items) {
      try {
        const picoElements = await getPicoElements(item);
        
        itemsWithPico.push({
          item: item,
          picoElements: picoElements
        });
      } catch (error) {
        logger.error(`Failed to get PICO elements for item: ${item.getField('title')}`, error);
      }
    }
    
    // Perform comparison
    const comparison = {
      similarities: {
        population: findCommonElements(itemsWithPico, 'population'),
        intervention: findCommonElements(itemsWithPico, 'intervention'),
        comparison: findCommonElements(itemsWithPico, 'comparison'),
        outcome: findCommonElements(itemsWithPico, 'outcome')
      },
      differences: {
        population: findDifferentElements(itemsWithPico, 'population'),
        intervention: findDifferentElements(itemsWithPico, 'intervention'),
        comparison: findDifferentElements(itemsWithPico, 'comparison'),
        outcome: findDifferentElements(itemsWithPico, 'outcome')
      }
    };
    
    logger.info('PICO comparison completed successfully');
    return comparison;
  } catch (error) {
    logger.error('Failed to compare PICO elements', error);
    throw error;
  }
}

/**
 * Find common elements across PICO analyses
 * @param {Array} itemsWithPico - Array of items with PICO elements
 * @param {string} element - PICO element to compare
 * @returns {string} - Common elements description
 */
function findCommonElements(itemsWithPico, element) {
  // This is a simplified implementation
  // A more sophisticated approach would use NLP techniques
  
  // Extract all values for the element
  const values = itemsWithPico.map(item => item.picoElements[element]);
  
  // Find common words or phrases
  // This is a placeholder implementation
  return 'Common elements would be identified here';
}

/**
 * Find different elements across PICO analyses
 * @param {Array} itemsWithPico - Array of items with PICO elements
 * @param {string} element - PICO element to compare
 * @returns {Array} - Array of different elements
 */
function findDifferentElements(itemsWithPico, element) {
  // This is a simplified implementation
  
  // Create an array of differences with item references
  const differences = itemsWithPico.map(item => ({
    itemTitle: item.item.getField('title'),
    value: item.picoElements[element]
  }));
  
  return differences;
}
