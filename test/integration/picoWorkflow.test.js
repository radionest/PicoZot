/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Integration tests for PICO workflow
 */

const { analyzePico, getPicoElements } = require('../../src/services/picoParser');
const { generateLiteratureReview } = require('../../src/services/literatureReview');
const { createMockItem, mockZoteroGlobal, cleanupZoteroGlobal } = require('../test-helpers');
const { mockCitations } = require('../mocks/citations');

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
  extractPicoElements: jest.fn(),
  generateReview: jest.fn()
}));

jest.mock('../../src/utils/zoteroApi', () => ({
  getItemContent: jest.fn(),
  saveItemAnnotation: jest.fn(),
  getItemMetadata: jest.fn(),
  saveDocument: jest.fn()
}));

// Import mocked dependencies
const { extractPicoElements, generateReview } = require('../../src/services/aiService');
const { getItemContent, saveItemAnnotation, getItemMetadata, saveDocument } = require('../../src/utils/zoteroApi');

describe('PICO Workflow Integration', () => {
  // Setup Zotero global object
  let mockZotero;
  
  beforeAll(() => {
    mockZotero = mockZoteroGlobal();
  });
  
  afterAll(() => {
    cleanupZoteroGlobal();
  });
  
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('End-to-end PICO analysis and literature review', () => {
    it('should analyze items and generate a literature review', async () => {
      // Create mock items
      const mockItems = [
        createMockItem({
          id: 1,
          title: mockCitations[0].title,
          authors: mockCitations[0].authors,
          abstract: mockCitations[0].abstract
        }),
        createMockItem({
          id: 2,
          title: mockCitations[1].title,
          authors: mockCitations[1].authors,
          abstract: mockCitations[1].abstract
        })
      ];
      
      // Mock PICO elements
      const mockPicoElements1 = {
        population: 'Patients with type 2 diabetes',
        intervention: 'High-intensity interval training (HIIT)',
        comparison: 'Moderate-intensity continuous training (MICT)',
        outcome: 'Cardiovascular health parameters, VO2max, insulin sensitivity'
      };
      
      const mockPicoElements2 = {
        population: 'Adults with type 2 diabetes',
        intervention: 'Aerobic exercise, resistance training, or combined exercise',
        comparison: 'Between exercise modalities',
        outcome: 'Glycemic control, HbA1c levels'
      };
      
      // Mock combined PICO elements
      const mockCombinedPicoElements = {
        population: 'Patients with type 2 diabetes',
        intervention: 'Exercise training (HIIT, aerobic, resistance)',
        comparison: 'Different exercise modalities',
        outcome: 'Cardiovascular health and glycemic control'
      };
      
      // Mock review content
      const mockReviewContent = 'This is a mock literature review content.';
      
      // Setup mocks
      getItemContent.mockImplementation((item) => {
        return Promise.resolve(item.getField('abstractNote'));
      });
      
      extractPicoElements.mockImplementation((text) => {
        if (text.includes('HIIT')) {
          return Promise.resolve(mockPicoElements1);
        } else {
          return Promise.resolve(mockPicoElements2);
        }
      });
      
      saveItemAnnotation.mockResolvedValue(true);
      
      getItemMetadata.mockImplementation((item) => {
        return Promise.resolve({
          title: item.getField('title'),
          authors: item.getField('creators'),
          year: item.getField('year'),
          journal: item.getField('publicationTitle'),
          abstract: item.getField('abstractNote')
        });
      });
      
      generateReview.mockResolvedValue(mockReviewContent);
      
      saveDocument.mockResolvedValue(true);
      
      // Step 1: Analyze PICO elements
      const analysisResults = await analyzePico(mockItems);
      
      // Verify analysis results
      expect(analysisResults.length).toBe(2);
      expect(getItemContent).toHaveBeenCalledTimes(2);
      expect(extractPicoElements).toHaveBeenCalledTimes(2);
      expect(saveItemAnnotation).toHaveBeenCalledTimes(2);
      
      expect(analysisResults[0].picoElements).toEqual(mockPicoElements1);
      expect(analysisResults[1].picoElements).toEqual(mockPicoElements2);
      
      // Step 2: Generate literature review
      const review = await generateLiteratureReview(mockItems, {
        combinePico: true,
        saveToFile: true,
        filename: 'Test Review.docx'
      });
      
      // Verify review generation
      expect(getItemMetadata).toHaveBeenCalledTimes(2);
      expect(generateReview).toHaveBeenCalledTimes(1);
      expect(saveDocument).toHaveBeenCalledTimes(1);
      expect(saveDocument).toHaveBeenCalledWith(mockReviewContent, 'Test Review.docx');
      
      expect(review).toBe(mockReviewContent);
    });
  });
});
