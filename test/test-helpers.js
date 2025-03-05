/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Test helpers
 */

/**
 * Create a mock Zotero item
 * @param {Object} data - Item data
 * @returns {Object} - Mock Zotero item
 */
function createMockItem(data = {}) {
  const defaultData = {
    id: Math.floor(Math.random() * 10000),
    title: 'Mock Item Title',
    authors: 'Mock Author',
    year: '2023',
    journal: 'Mock Journal',
    abstract: 'Mock abstract text for testing purposes.',
    itemType: 'journalArticle',
    tags: []
  };
  
  const itemData = { ...defaultData, ...data };
  
  // Create mock item with Zotero-like API
  return {
    id: itemData.id,
    itemType: itemData.itemType,
    
    // Mock Zotero item methods
    getField: (field) => {
      switch (field) {
        case 'title':
          return itemData.title;
        case 'creators':
        case 'author':
          return itemData.authors;
        case 'year':
        case 'date':
          return itemData.year;
        case 'publicationTitle':
        case 'publisher':
          return itemData.journal;
        case 'abstractNote':
          return itemData.abstract;
        default:
          return '';
      }
    },
    
    getNotes: () => [],
    getAttachments: () => [],
    getTags: () => itemData.tags.map(tag => ({ tag }))
  };
}

/**
 * Create a mock Zotero collection
 * @param {Array} items - Collection items
 * @returns {Object} - Mock Zotero collection
 */
function createMockCollection(items = []) {
  return {
    id: Math.floor(Math.random() * 10000),
    name: 'Mock Collection',
    
    // Mock Zotero collection methods
    getChildItems: () => items,
    getName: () => 'Mock Collection'
  };
}

/**
 * Mock the Zotero global object
 * @returns {Object} - Mock Zotero object
 */
function mockZoteroGlobal() {
  global.Zotero = {
    Prefs: {
      get: jest.fn((pref, defaultValue) => defaultValue),
      set: jest.fn(),
      prefHasUserValue: jest.fn(() => false)
    },
    Items: {
      get: jest.fn(id => null)
    },
    debug: jest.fn(),
    getZoteroDirectory: jest.fn(() => ({
      append: jest.fn(),
      exists: jest.fn(() => false),
      create: jest.fn()
    })),
    launchURL: jest.fn(),
    PDFWorker: jest.fn(() => ({
      extractText: jest.fn().mockResolvedValue({ text: 'Extracted PDF text' })
    }))
  };
  
  return global.Zotero;
}

/**
 * Clean up the Zotero global object
 */
function cleanupZoteroGlobal() {
  delete global.Zotero;
}

/**
 * Wait for a specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after the specified time
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  createMockItem,
  createMockCollection,
  mockZoteroGlobal,
  cleanupZoteroGlobal,
  wait
};
