/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Zotero API utilities
 */

import { logger } from './logger.js';

/**
 * Get content from a Zotero item (abstract, notes, etc.)
 * @param {Object} item - Zotero item
 * @returns {Promise<string>} - Item content
 */
export async function getItemContent(item) {
  try {
    logger.debug(`Getting content for item: ${item.getField('title')}`);
    
    let content = '';
    
    // Get abstract
    const abstract = item.getField('abstractNote');
    if (abstract) {
      content += abstract + '\n\n';
    }
    
    // Get notes
    const notes = await getNotes(item);
    if (notes.length > 0) {
      content += notes.join('\n\n');
    }
    
    // Get PDF content if available
    const pdfContent = await getPdfContent(item);
    if (pdfContent) {
      content += '\n\n' + pdfContent;
    }
    
    if (!content) {
      logger.warn(`No content found for item: ${item.getField('title')}`);
    } else {
      logger.debug(`Content retrieved for item: ${item.getField('title')}`);
    }
    
    return content;
  } catch (error) {
    logger.error(`Failed to get content for item: ${item.getField('title')}`, error);
    throw error;
  }
}

/**
 * Get notes from a Zotero item
 * @param {Object} item - Zotero item
 * @returns {Promise<Array<string>>} - Array of note contents
 */
async function getNotes(item) {
  try {
    const notes = [];
    
    // Check if Zotero API is available
    if (typeof Zotero === 'undefined') {
      logger.warn('Zotero API not available');
      return notes;
    }
    
    // Get item notes
    const noteIDs = item.getNotes();
    
    if (noteIDs.length === 0) {
      return notes;
    }
    
    // Get note content for each note
    for (const noteID of noteIDs) {
      try {
        const noteItem = Zotero.Items.get(noteID);
        
        if (noteItem) {
          const noteContent = noteItem.getNote();
          
          if (noteContent) {
            // Strip HTML tags
            const plainText = noteContent.replace(/<[^>]*>/g, ' ');
            notes.push(plainText);
          }
        }
      } catch (noteError) {
        logger.warn(`Failed to get note content for note ID: ${noteID}`, noteError);
      }
    }
    
    logger.debug(`Retrieved ${notes.length} notes for item: ${item.getField('title')}`);
    return notes;
  } catch (error) {
    logger.error(`Failed to get notes for item: ${item.getField('title')}`, error);
    return [];
  }
}

/**
 * Get PDF content from a Zotero item
 * @param {Object} item - Zotero item
 * @returns {Promise<string>} - PDF content
 */
async function getPdfContent(item) {
  try {
    // Check if Zotero API is available
    if (typeof Zotero === 'undefined') {
      logger.warn('Zotero API not available');
      return '';
    }
    
    // Get item attachments
    const attachmentIDs = item.getAttachments();
    
    if (attachmentIDs.length === 0) {
      return '';
    }
    
    let pdfContent = '';
    
    // Get PDF content for each attachment
    for (const attachmentID of attachmentIDs) {
      try {
        const attachmentItem = Zotero.Items.get(attachmentID);
        
        if (attachmentItem && attachmentItem.attachmentContentType === 'application/pdf') {
          // Get file path
          const filePath = await attachmentItem.getFilePathAsync();
          
          if (filePath) {
            // Extract text from PDF
            const text = await extractPdfText(filePath);
            
            if (text) {
              pdfContent += text + '\n\n';
            }
          }
        }
      } catch (attachmentError) {
        logger.warn(`Failed to get PDF content for attachment ID: ${attachmentID}`, attachmentError);
      }
    }
    
    if (pdfContent) {
      logger.debug(`Retrieved PDF content for item: ${item.getField('title')}`);
    }
    
    return pdfContent;
  } catch (error) {
    logger.error(`Failed to get PDF content for item: ${item.getField('title')}`, error);
    return '';
  }
}

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
async function extractPdfText(filePath) {
  try {
    // Check if Zotero PDF tools are available
    if (typeof Zotero === 'undefined' || !Zotero.PDFWorker) {
      logger.warn('Zotero PDF tools not available');
      return '';
    }
    
    // Create PDF worker
    const worker = new Zotero.PDFWorker(filePath);
    
    // Extract text
    const result = await worker.extractText();
    
    if (result && result.text) {
      return result.text;
    }
    
    return '';
  } catch (error) {
    logger.error(`Failed to extract text from PDF: ${filePath}`, error);
    return '';
  }
}

/**
 * Save an annotation to a Zotero item
 * @param {Object} item - Zotero item
 * @param {string} title - Annotation title
 * @param {string} content - Annotation content
 * @returns {Promise<boolean>} - True if successful
 */
export async function saveItemAnnotation(item, title, content) {
  try {
    logger.debug(`Saving annotation to item: ${item.getField('title')}`);
    
    // Check if Zotero API is available
    if (typeof Zotero === 'undefined') {
      logger.warn('Zotero API not available');
      return false;
    }
    
    // Create note with annotation
    const noteContent = `<h1>${title}</h1><p>${content.replace(/\n/g, '<br>')}</p>`;
    
    // Create new note
    const noteItem = new Zotero.Item('note');
    noteItem.setNote(noteContent);
    noteItem.parentID = item.id;
    
    // Save note
    await noteItem.saveTx();
    
    logger.debug(`Annotation saved to item: ${item.getField('title')}`);
    return true;
  } catch (error) {
    logger.error(`Failed to save annotation to item: ${item.getField('title')}`, error);
    return false;
  }
}

/**
 * Get metadata for a Zotero item
 * @param {Object} item - Zotero item
 * @returns {Promise<Object>} - Item metadata
 */
export async function getItemMetadata(item) {
  try {
    logger.debug(`Getting metadata for item: ${item.getField('title')}`);
    
    const metadata = {
      title: item.getField('title'),
      authors: item.getField('creators') || item.getField('author') || '',
      year: item.getField('year') || item.getField('date') || '',
      journal: item.getField('publicationTitle') || item.getField('publisher') || '',
      abstract: item.getField('abstractNote') || '',
      itemType: item.itemType,
      tags: item.getTags().map(tag => tag.tag),
      id: item.id
    };
    
    logger.debug(`Metadata retrieved for item: ${item.getField('title')}`);
    return metadata;
  } catch (error) {
    logger.error(`Failed to get metadata for item: ${item.getField('title')}`, error);
    throw error;
  }
}

/**
 * Save a document to a file
 * @param {string} content - Document content
 * @param {string} filename - Filename
 * @returns {Promise<boolean>} - True if successful
 */
export async function saveDocument(content, filename) {
  try {
    logger.debug(`Saving document to file: ${filename}`);
    
    // Check if Zotero API is available
    if (typeof Zotero === 'undefined') {
      logger.warn('Zotero API not available');
      return false;
    }
    
    // Get destination directory
    const destDir = await getDestinationDirectory();
    
    if (!destDir) {
      logger.error('Failed to get destination directory');
      return false;
    }
    
    // Create file
    const file = destDir.clone();
    file.append(filename);
    
    // Ensure unique filename
    if (file.exists()) {
      const baseName = filename.replace(/\.[^/.]+$/, '');
      const extension = filename.substring(filename.lastIndexOf('.'));
      let counter = 1;
      
      do {
        file.leafName = `${baseName} (${counter})${extension}`;
        counter++;
      } while (file.exists());
    }
    
    // Write content to file
    const outputStream = Components.classes['@mozilla.org/network/file-output-stream;1']
      .createInstance(Components.interfaces.nsIFileOutputStream);
    outputStream.init(file, 0x02 | 0x08 | 0x20, 0o666, 0);
    
    const converter = Components.classes['@mozilla.org/intl/converter-output-stream;1']
      .createInstance(Components.interfaces.nsIConverterOutputStream);
    converter.init(outputStream, 'UTF-8', 0, 0);
    converter.writeString(content);
    converter.close();
    
    logger.debug(`Document saved to file: ${file.path}`);
    return true;
  } catch (error) {
    logger.error(`Failed to save document to file: ${filename}`, error);
    return false;
  }
}

/**
 * Get destination directory for saving files
 * @returns {Promise<Object>} - Directory object
 */
async function getDestinationDirectory() {
  try {
    // Check if Zotero API is available
    if (typeof Zotero === 'undefined') {
      logger.warn('Zotero API not available');
      return null;
    }
    
    // Get Zotero directory
    const destDir = Zotero.getZoteroDirectory();
    
    if (!destDir) {
      return null;
    }
    
    // Create PicoZot directory if it doesn't exist
    destDir.append('PicoZot');
    
    if (!destDir.exists()) {
      destDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0o755);
    }
    
    return destDir;
  } catch (error) {
    logger.error('Failed to get destination directory', error);
    return null;
  }
}

/**
 * Search for items in Zotero library
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Array>} - Array of matching items
 */
export async function searchItems(searchParams) {
  try {
    logger.debug('Searching for items', searchParams);
    
    // Check if Zotero API is available
    if (typeof Zotero === 'undefined') {
      logger.warn('Zotero API not available');
      return [];
    }
    
    // Create search
    const search = new Zotero.Search();
    
    // Add search conditions
    for (const [field, value] of Object.entries(searchParams)) {
      search.addCondition(field, 'contains', value);
    }
    
    // Execute search
    const itemIDs = await search.search();
    
    if (itemIDs.length === 0) {
      logger.debug('No items found matching search criteria');
      return [];
    }
    
    // Get items
    const items = Zotero.Items.get(itemIDs);
    
    logger.debug(`Found ${items.length} items matching search criteria`);
    return items;
  } catch (error) {
    logger.error('Failed to search for items', error);
    return [];
  }
}
