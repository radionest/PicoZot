/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Unit tests for PICO parser
 */

const { analyzePico, getPicoElements, comparePicoElements } = require('../../src/services/picoParser');

// Mock dependencies
jest.mock('../../src/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../../src/services/aiService', () => ({
  extractPicoElements: jest.fn()
}));

jest.mock('../../src/utils/zoteroApi', () => ({
  getItemContent: jest.fn(),
  saveItemAnnotation: jest.fn()
}));

// Import mocked dependencies
const { extractPicoElements } = require('../../src/services/aiService');
const { getItemContent, saveItemAnnotation } = require('../../src/utils/zoteroApi');

describe('PICO Parser', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('analyzePico', () => {
    it('should analyze PICO elements for a collection of items', async () => {
      // Mock data
      const mockItems = [
        { id: 1, getField: jest.fn().mockReturnValue('Item 1') },
        { id: 2, getField: jest.fn().mockReturnValue('Item 2') }
      ];
      
      const mockContent = 'Sample content for PICO analysis';
      const mockPicoElements = {
        population: 'Test population',
        intervention: 'Test intervention',
        comparison: 'Test comparison',
        outcome: 'Test outcome'
      };
      
      // Setup mocks
      getItemContent.mockResolvedValue(mockContent);
      extractPicoElements.mockResolvedValue(mockPicoElements);
      saveItemAnnotation.mockResolvedValue(true);
      
      // Call the function
      const results = await analyzePico(mockItems);
      
      // Assertions
      expect(results.length).toBe(2);
      expect(getItemContent).toHaveBeenCalledTimes(2);
      expect(extractPicoElements).toHaveBeenCalledTimes(2);
      expect(saveItemAnnotation).toHaveBeenCalledTimes(2);
      
      expect(results[0].item).toBe(mockItems[0]);
      expect(results[0].picoElements).toEqual(mockPicoElements);
      expect(results[1].item).toBe(mockItems[1]);
      expect(results[1].picoElements).toEqual(mockPicoElements);
    });
    
    it('should handle items with no content', async () => {
      // Mock data
      const mockItems = [
        { id: 1, getField: jest.fn().mockReturnValue('Item 1') }
      ];
      
      // Setup mocks
      getItemContent.mockResolvedValue('');
      
      // Call the function
      const results = await analyzePico(mockItems);
      
      // Assertions
      expect(results.length).toBe(0);
      expect(getItemContent).toHaveBeenCalledTimes(1);
      expect(extractPicoElements).not.toHaveBeenCalled();
      expect(saveItemAnnotation).not.toHaveBeenCalled();
    });
    
    it('should handle errors during analysis', async () => {
      // Mock data
      const mockItems = [
        { id: 1, getField: jest.fn().mockReturnValue('Item 1') }
      ];
      
      // Setup mocks
      getItemContent.mockResolvedValue('Sample content');
      extractPicoElements.mockRejectedValue(new Error('AI service error'));
      
      // Call the function
      const results = await analyzePico(mockItems);
      
      // Assertions
      expect(results.length).toBe(0);
      expect(getItemContent).toHaveBeenCalledTimes(1);
      expect(extractPicoElements).toHaveBeenCalledTimes(1);
      expect(saveItemAnnotation).not.toHaveBeenCalled();
    });
  });
  
  describe('getPicoElements', () => {
    // Add tests for getPicoElements function
  });
  
  describe('comparePicoElements', () => {
    // Add tests for comparePicoElements function
  });
});
