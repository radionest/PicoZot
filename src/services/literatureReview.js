/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Literature Review generation service
 */

import { logger } from '../utils/logger.js';
import { generateReview } from './aiService.js';
import { getPicoElements } from './picoParser.js';
import { getItemMetadata, saveDocument } from '../utils/zoteroApi.js';

/**
 * Generate a literature review for a collection of Zotero items
 * @param {Array} items - Array of Zotero items
 * @param {Object} options - Additional options for the review
 * @returns {Promise<string>} - The generated literature review
 */
export async function generateLiteratureReview(items, options = {}) {
  try {
    logger.info(`Generating literature review for ${items.length} items`);
    
    // Extract PICO elements from the first item or combine from all items
    const picoElements = options.combinePico 
      ? await combinePicoElements(items)
      : await getPicoElements(items[0]);
    
    // Get citation data for all items
    const citations = await Promise.all(
      items.map(async (item) => {
        try {
          return await getItemMetadata(item);
        } catch (error) {
          logger.error(`Failed to get metadata for item: ${item.getField('title')}`, error);
          return null;
        }
      })
    );
    
    // Filter out null values
    const validCitations = citations.filter(citation => citation !== null);
    
    if (validCitations.length === 0) {
      throw new Error('No valid citations found');
    }
    
    // Generate the review
    const review = await generateReview(picoElements, validCitations, options);
    
    // Save the review if requested
    if (options.saveToFile) {
      const filename = options.filename || 'Literature Review.docx';
      await saveDocument(review, filename);
      logger.info(`Literature review saved to ${filename}`);
    }
    
    logger.info('Literature review generated successfully');
    return review;
  } catch (error) {
    logger.error('Failed to generate literature review', error);
    throw error;
  }
}

/**
 * Combine PICO elements from multiple items
 * @param {Array} items - Array of Zotero items
 * @returns {Promise<Object>} - Combined PICO elements
 */
async function combinePicoElements(items) {
  try {
    logger.info(`Combining PICO elements from ${items.length} items`);
    
    const allPicoElements = [];
    
    // Get PICO elements for each item
    for (const item of items) {
      try {
        const picoElements = await getPicoElements(item);
        allPicoElements.push({
          item: item.getField('title'),
          elements: picoElements
        });
      } catch (error) {
        logger.error(`Failed to get PICO elements for item: ${item.getField('title')}`, error);
      }
    }
    
    if (allPicoElements.length === 0) {
      throw new Error('No PICO elements found');
    }
    
    // Combine elements
    // This is a simplified implementation
    const combined = {
      population: combineElementValues(allPicoElements, 'population'),
      intervention: combineElementValues(allPicoElements, 'intervention'),
      comparison: combineElementValues(allPicoElements, 'comparison'),
      outcome: combineElementValues(allPicoElements, 'outcome')
    };
    
    logger.info('PICO elements combined successfully');
    return combined;
  } catch (error) {
    logger.error('Failed to combine PICO elements', error);
    throw error;
  }
}

/**
 * Combine values for a specific PICO element from multiple analyses
 * @param {Array} allPicoElements - Array of PICO analyses
 * @param {string} element - PICO element to combine
 * @returns {string} - Combined value
 */
function combineElementValues(allPicoElements, element) {
  // Extract all values for the element
  const values = allPicoElements.map(item => item.elements[element]);
  
  // Filter out undefined or null values
  const validValues = values.filter(value => value);
  
  if (validValues.length === 0) {
    return '';
  }
  
  // If there's only one value, return it
  if (validValues.length === 1) {
    return validValues[0];
  }
  
  // Otherwise, combine the values
  // This is a simplified implementation
  // A more sophisticated approach would use NLP techniques to merge similar concepts
  return validValues.join(' | ');
}

/**
 * Generate a literature review template
 * @param {string} templateName - Name of the template to use
 * @returns {Promise<Object>} - Template structure
 */
export async function getReviewTemplate(templateName = 'default') {
  try {
    logger.info(`Loading literature review template: ${templateName}`);
    
    // This would typically load a template from a file or database
    // For now, we'll return a hardcoded template
    
    const templates = {
      default: {
        sections: [
          {
            title: 'Introduction',
            content: 'Provide background information and context for the review.'
          },
          {
            title: 'Methods',
            content: 'Describe the search strategy, inclusion criteria, and analysis methods.'
          },
          {
            title: 'Results',
            content: 'Present the findings from the included studies.'
          },
          {
            title: 'Discussion',
            content: 'Interpret the results and discuss implications.'
          },
          {
            title: 'Conclusion',
            content: 'Summarize the main findings and their significance.'
          }
        ],
        format: {
          headingStyle: 'Title Case',
          citationStyle: 'APA'
        }
      },
      systematic: {
        sections: [
          {
            title: 'Abstract',
            content: 'Provide a structured summary of the review.'
          },
          {
            title: 'Introduction',
            content: 'Provide background information and rationale for the review.'
          },
          {
            title: 'Methods',
            subsections: [
              {
                title: 'Search Strategy',
                content: 'Describe the search strategy and databases used.'
              },
              {
                title: 'Inclusion and Exclusion Criteria',
                content: 'Specify the criteria for including and excluding studies.'
              },
              {
                title: 'Data Extraction',
                content: 'Describe how data was extracted from the included studies.'
              },
              {
                title: 'Quality Assessment',
                content: 'Describe how the quality of the included studies was assessed.'
              }
            ]
          },
          {
            title: 'Results',
            content: 'Present the findings from the included studies.'
          },
          {
            title: 'Discussion',
            content: 'Interpret the results and discuss implications.'
          },
          {
            title: 'Conclusion',
            content: 'Summarize the main findings and their significance.'
          }
        ],
        format: {
          headingStyle: 'Title Case',
          citationStyle: 'Vancouver'
        }
      }
    };
    
    const template = templates[templateName] || templates.default;
    
    logger.info(`Template loaded successfully: ${templateName}`);
    return template;
  } catch (error) {
    logger.error(`Failed to load literature review template: ${templateName}`, error);
    throw error;
  }
}

/**
 * Format a literature review according to a specific style
 * @param {string} review - The literature review text
 * @param {string} style - The formatting style
 * @returns {Promise<string>} - The formatted review
 */
export async function formatReview(review, style = 'apa') {
  try {
    logger.info(`Formatting literature review with style: ${style}`);
    
    // This would typically apply formatting rules based on the style
    // For now, we'll return the review as is
    
    logger.info('Literature review formatted successfully');
    return review;
  } catch (error) {
    logger.error(`Failed to format literature review with style: ${style}`, error);
    throw error;
  }
}
