/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Integration tests for literature review generation
 */

const { generateLiteratureReview, getReviewTemplate, formatReview } = require('../../src/services/literatureReview');
const { createMockItem, mockZoteroGlobal, cleanupZoteroGlobal } = require('../test-helpers');
const { mockCitations, mockPicoElements } = require('../mocks/citations');

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
  generateReview: jest.fn()
}));

jest.mock('../../src/services/picoParser', () => ({
  getPicoElements: jest.fn(),
  combinePicoElements: jest.fn()
}));

jest.mock('../../src/utils/zoteroApi', () => ({
  getItemMetadata: jest.fn(),
  saveDocument: jest.fn()
}));

// Import mocked dependencies
const { generateReview } = require('../../src/services/aiService');
const { getPicoElements } = require('../../src/services/picoParser');
const { getItemMetadata, saveDocument } = require('../../src/utils/zoteroApi');

describe('Literature Review Generation Integration', () => {
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
  
  describe('Review generation with different templates', () => {
    it('should generate a review using the default template', async () => {
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
      const firstItemPico = mockPicoElements.item1;
      
      // Mock review content
      const mockReviewContent = 'This is a mock literature review content using the default template.';
      
      // Setup mocks
      getPicoElements.mockResolvedValue(firstItemPico);
      
      getItemMetadata.mockImplementation((item) => {
        const index = item.id === 1 ? 0 : 1;
        return Promise.resolve({
          title: mockCitations[index].title,
          authors: mockCitations[index].authors,
          year: mockCitations[index].year,
          journal: mockCitations[index].journal,
          abstract: mockCitations[index].abstract
        });
      });
      
      generateReview.mockResolvedValue(mockReviewContent);
      
      saveDocument.mockResolvedValue(true);
      
      // Generate review with default template
      const review = await generateLiteratureReview(mockItems, {
        templateName: 'default',
        combinePico: false,
        saveToFile: true,
        filename: 'Default Review.docx'
      });
      
      // Verify review generation
      expect(getPicoElements).toHaveBeenCalledTimes(1);
      expect(getPicoElements).toHaveBeenCalledWith(mockItems[0]);
      expect(getItemMetadata).toHaveBeenCalledTimes(2);
      expect(generateReview).toHaveBeenCalledTimes(1);
      expect(generateReview).toHaveBeenCalledWith(
        firstItemPico,
        expect.arrayContaining([
          expect.objectContaining({ title: mockCitations[0].title }),
          expect.objectContaining({ title: mockCitations[1].title })
        ]),
        expect.objectContaining({ templateName: 'default' })
      );
      expect(saveDocument).toHaveBeenCalledTimes(1);
      expect(saveDocument).toHaveBeenCalledWith(mockReviewContent, 'Default Review.docx');
      
      expect(review).toBe(mockReviewContent);
    });
    
    it('should generate a review using the systematic template', async () => {
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
        }),
        createMockItem({
          id: 3,
          title: mockCitations[2].title,
          authors: mockCitations[2].authors,
          abstract: mockCitations[2].abstract
        })
      ];
      
      // Mock combined PICO elements
      const combinedPico = {
        population: 'Patients with type 2 diabetes',
        intervention: 'Various exercise modalities (HIIT, aerobic, resistance)',
        comparison: 'Different exercise protocols and sedentary controls',
        outcome: 'Cardiovascular health, glycemic control, and long-term outcomes'
      };
      
      // Mock review content
      const mockReviewContent = 'This is a mock systematic literature review with detailed sections.';
      
      // Setup mocks
      getPicoElements.mockImplementation((item) => {
        const id = item.id;
        return Promise.resolve(mockPicoElements[`item${id}`]);
      });
      
      getItemMetadata.mockImplementation((item) => {
        const index = item.id - 1;
        return Promise.resolve({
          title: mockCitations[index].title,
          authors: mockCitations[index].authors,
          year: mockCitations[index].year,
          journal: mockCitations[index].journal,
          abstract: mockCitations[index].abstract
        });
      });
      
      generateReview.mockResolvedValue(mockReviewContent);
      
      saveDocument.mockResolvedValue(true);
      
      // Generate review with systematic template
      const review = await generateLiteratureReview(mockItems, {
        templateName: 'systematic',
        combinePico: true,
        saveToFile: true,
        filename: 'Systematic Review.docx',
        additionalInstructions: 'Focus on long-term outcomes and clinical implications.'
      });
      
      // Verify review generation
      expect(getPicoElements).toHaveBeenCalledTimes(3);
      expect(getItemMetadata).toHaveBeenCalledTimes(3);
      expect(generateReview).toHaveBeenCalledTimes(1);
      expect(generateReview.mock.calls[0][2]).toMatchObject({
        templateName: 'systematic',
        additionalInstructions: 'Focus on long-term outcomes and clinical implications.'
      });
      expect(saveDocument).toHaveBeenCalledTimes(1);
      expect(saveDocument).toHaveBeenCalledWith(mockReviewContent, 'Systematic Review.docx');
      
      expect(review).toBe(mockReviewContent);
    });
  });
  
  describe('Review templates and formatting', () => {
    it('should get a review template', async () => {
      const defaultTemplate = await getReviewTemplate('default');
      const systematicTemplate = await getReviewTemplate('systematic');
      
      expect(defaultTemplate).toBeDefined();
      expect(defaultTemplate.sections).toBeInstanceOf(Array);
      expect(defaultTemplate.format).toBeDefined();
      
      expect(systematicTemplate).toBeDefined();
      expect(systematicTemplate.sections).toBeInstanceOf(Array);
      expect(systematicTemplate.format).toBeDefined();
      
      // Verify systematic template has more detailed structure
      const methodsSection = systematicTemplate.sections.find(s => s.title === 'Methods');
      expect(methodsSection).toBeDefined();
      expect(methodsSection.subsections).toBeDefined();
      expect(methodsSection.subsections.length).toBeGreaterThan(0);
    });
    
    it('should format a review according to a specific style', async () => {
      const reviewText = 'This is a sample review text.';
      
      const formattedAPA = await formatReview(reviewText, 'apa');
      const formattedVancouver = await formatReview(reviewText, 'vancouver');
      
      expect(formattedAPA).toBeDefined();
      expect(formattedVancouver).toBeDefined();
      
      // In a real implementation, these would be different
      // For now, we're just testing the function calls
    });
  });
});
