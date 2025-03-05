/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * AI Service for interacting with AI models
 */

import { logger } from '../utils/logger.js';
import { getConfig } from '../utils/config.js';

// Default AI model settings
const DEFAULT_MODEL = 'gpt-4';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 4000;

// Service state
let initialized = false;
let apiKey = null;
let model = DEFAULT_MODEL;
let apiEndpoint = 'https://api.openai.com/v1/chat/completions';

/**
 * Initialize the AI service
 * @param {Object} config - Configuration object
 */
export function initServices(config) {
  try {
    logger.info('Initializing AI service');
    
    // Get API key from config
    apiKey = config.aiApiKey;
    if (!apiKey) {
      throw new Error('AI API key not found in configuration');
    }
    
    // Get model from config or use default
    model = config.aiModel || DEFAULT_MODEL;
    
    // Get API endpoint from config or use default
    apiEndpoint = config.aiApiEndpoint || apiEndpoint;
    
    initialized = true;
    logger.info('AI service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize AI service', error);
    throw error;
  }
}

/**
 * Generate text using the AI model
 * @param {string} prompt - The prompt to send to the AI model
 * @param {Object} options - Additional options for the AI model
 * @returns {Promise<string>} - The generated text
 */
export async function generateText(prompt, options = {}) {
  if (!initialized) {
    throw new Error('AI service not initialized');
  }
  
  try {
    logger.debug('Generating text with AI model', { model, prompt: prompt.substring(0, 100) + '...' });
    
    const temperature = options.temperature || DEFAULT_TEMPERATURE;
    const maxTokens = options.maxTokens || DEFAULT_MAX_TOKENS;
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant specializing in medical research and PICO analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`AI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    logger.debug('Text generated successfully');
    return generatedText;
  } catch (error) {
    logger.error('Failed to generate text with AI model', error);
    throw error;
  }
}

/**
 * Extract PICO elements from text using AI
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} - The extracted PICO elements
 */
export async function extractPicoElements(text) {
  const prompt = `
    Analyze the following text and extract the PICO elements:
    
    Population/Problem: The specific patient population or problem being addressed
    Intervention: The intervention or exposure being considered
    Comparison: The comparison intervention or exposure (if applicable)
    Outcome: The outcome measures
    
    Text to analyze:
    ${text}
    
    Please return the results in JSON format with the following structure:
    {
      "population": "description",
      "intervention": "description",
      "comparison": "description",
      "outcome": "description"
    }
  `;
  
  try {
    const result = await generateText(prompt);
    return JSON.parse(result);
  } catch (error) {
    logger.error('Failed to extract PICO elements', error);
    throw new Error('Failed to extract PICO elements: ' + error.message);
  }
}

/**
 * Generate a literature review based on PICO elements and citations
 * @param {Object} picoElements - The PICO elements
 * @param {Array} citations - Array of citation objects
 * @param {Object} options - Additional options for the review
 * @returns {Promise<string>} - The generated literature review
 */
export async function generateReview(picoElements, citations, options = {}) {
  const citationsText = citations.map(citation => 
    `Title: ${citation.title}
    Authors: ${citation.authors}
    Abstract: ${citation.abstract}
    Year: ${citation.year}
    Journal: ${citation.journal}`
  ).join('\n\n');
  
  const prompt = `
    Generate a comprehensive literature review based on the following PICO elements and citations:
    
    PICO Elements:
    Population/Problem: ${picoElements.population}
    Intervention: ${picoElements.intervention}
    Comparison: ${picoElements.comparison || 'N/A'}
    Outcome: ${picoElements.outcome}
    
    Citations:
    ${citationsText}
    
    ${options.additionalInstructions || ''}
    
    Please structure the literature review with the following sections:
    1. Introduction
    2. Methods
    3. Results
    4. Discussion
    5. Conclusion
  `;
  
  try {
    return await generateText(prompt, { maxTokens: 8000 });
  } catch (error) {
    logger.error('Failed to generate literature review', error);
    throw new Error('Failed to generate literature review: ' + error.message);
  }
}
