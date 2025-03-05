# PicoZot API Documentation

This document describes the API for the PicoZot plugin for Zotero.

## Core Services

### PICO Parser

The PICO Parser service extracts and processes PICO elements from research papers.

#### Methods

##### `analyzePico(items, options)`

Analyzes PICO elements for a collection of Zotero items.

- **Parameters**:
  - `items` (Array): Array of Zotero items to analyze
  - `options` (Object, optional): Analysis options
    - `saveAnnotation` (boolean): Whether to save the analysis as an item annotation (default: true)
- **Returns**: Promise<Array> - Array of items with their PICO elements
- **Example**:
  ```javascript
  const items = ZoteroPane.getSelectedItems();
  const results = await analyzePico(items);
  ```

##### `getPicoElements(item)`

Gets PICO elements for a single Zotero item.

- **Parameters**:
  - `item` (Object): Zotero item
- **Returns**: Promise<Object> - PICO elements
- **Example**:
  ```javascript
  const item = ZoteroPane.getSelectedItems()[0];
  const picoElements = await getPicoElements(item);
  ```

##### `comparePicoElements(items)`

Compares PICO elements between multiple items.

- **Parameters**:
  - `items` (Array): Array of Zotero items to compare
- **Returns**: Promise<Object> - Comparison results with similarities and differences
- **Example**:
  ```javascript
  const items = ZoteroPane.getSelectedItems();
  const comparison = await comparePicoElements(items);
  ```

### Literature Review

The Literature Review service generates comprehensive literature reviews based on selected papers.

#### Methods

##### `generateLiteratureReview(items, options)`

Generates a literature review for a collection of Zotero items.

- **Parameters**:
  - `items` (Array): Array of Zotero items to include in the review
  - `options` (Object, optional): Review options
    - `templateName` (string): Name of the template to use (default: 'default')
    - `combinePico` (boolean): Whether to combine PICO elements from all items (default: true)
    - `saveToFile` (boolean): Whether to save the review as a document (default: true)
    - `filename` (string): Filename for the saved document (default: 'Literature Review.docx')
    - `additionalInstructions` (string): Additional instructions for the review generation
- **Returns**: Promise<string> - The generated literature review
- **Example**:
  ```javascript
  const items = ZoteroPane.getSelectedItems();
  const review = await generateLiteratureReview(items, {
    templateName: 'systematic',
    combinePico: true
  });
  ```

##### `getReviewTemplate(templateName)`

Gets a literature review template.

- **Parameters**:
  - `templateName` (string, optional): Name of the template (default: 'default')
- **Returns**: Promise<Object> - Template structure
- **Example**:
  ```javascript
  const template = await getReviewTemplate('systematic');
  ```

##### `formatReview(review, style)`

Formats a literature review according to a specific style.

- **Parameters**:
  - `review` (string): The literature review text
  - `style` (string, optional): The formatting style (default: 'apa')
- **Returns**: Promise<string> - The formatted review
- **Example**:
  ```javascript
  const formattedReview = await formatReview(review, 'vancouver');
  ```

### AI Service

The AI Service provides AI-powered functionality for the plugin.

#### Methods

##### `generateText(prompt, options)`

Generates text using the AI model.

- **Parameters**:
  - `prompt` (string): The prompt to send to the AI model
  - `options` (Object, optional): Additional options for the AI model
    - `temperature` (number): Controls randomness (default: 0.7)
    - `maxTokens` (number): Maximum number of tokens to generate (default: 4000)
- **Returns**: Promise<string> - The generated text
- **Example**:
  ```javascript
  const text = await generateText('Summarize the following research paper: ' + abstract);
  ```

##### `extractPicoElements(text)`

Extracts PICO elements from text using AI.

- **Parameters**:
  - `text` (string): The text to analyze
- **Returns**: Promise<Object> - The extracted PICO elements
- **Example**:
  ```javascript
  const picoElements = await extractPicoElements(abstract);
  ```

## UI Components

### Dialog

The Dialog module provides dialog UI components.

#### Methods

##### `showDialog(type, options)`

Shows a dialog of the specified type.

- **Parameters**:
  - `type` (string): Dialog type ('main', 'pico-analysis', 'literature-review', 'settings')
  - `options` (Object, optional): Additional options for the dialog
    - `items` (Array): Zotero items to use in the dialog
- **Returns**: Promise<Object> - Dialog window and document
- **Example**:
  ```javascript
  const dialog = await showDialog('pico-analysis', { 
    items: ZoteroPane.getSelectedItems() 
  });
  ```

### Sidebar

The Sidebar module provides sidebar UI components.

#### Methods

##### `createSidebar()`

Creates and initializes the sidebar.

- **Returns**: Promise<Element> - The sidebar element
- **Example**:
  ```javascript
  const sidebar = await createSidebar();
  ```

##### `toggleSidebar()`

Toggles sidebar visibility.

- **Example**:
  ```javascript
  toggleSidebar();
  ```

##### `updateSelectedItems()`

Updates selected items in the sidebar.

- **Example**:
  ```javascript
  updateSelectedItems();
  ```

## Utility Functions

### Zotero API

The Zotero API module provides utilities for interacting with Zotero.

#### Methods

##### `getItemContent(item)`

Gets content from a Zotero item (abstract, notes, etc.).

- **Parameters**:
  - `item` (Object): Zotero item
- **Returns**: Promise<string> - Item content
- **Example**:
  ```javascript
  const content = await getItemContent(item);
  ```

##### `saveItemAnnotation(item, title, content)`

Saves an annotation to a Zotero item.

- **Parameters**:
  - `item` (Object): Zotero item
  - `title` (string): Annotation title
  - `content` (string): Annotation content
- **Returns**: Promise<boolean> - True if successful
- **Example**:
  ```javascript
  const success = await saveItemAnnotation(item, 'PICO Analysis', picoText);
  ```

##### `getItemMetadata(item)`

Gets metadata for a Zotero item.

- **Parameters**:
  - `item` (Object): Zotero item
- **Returns**: Promise<Object> - Item metadata
- **Example**:
  ```javascript
  const metadata = await getItemMetadata(item);
  ```

##### `saveDocument(content, filename)`

Saves a document to a file.

- **Parameters**:
  - `content` (string): Document content
  - `filename` (string): Filename
- **Returns**: Promise<boolean> - True if successful
- **Example**:
  ```javascript
  const success = await saveDocument(review, 'Literature Review.docx');
  ```

### Configuration

The Configuration module provides utilities for managing plugin configuration.

#### Methods

##### `getConfig()`

Gets the current configuration.

- **Returns**: Object - Configuration object
- **Example**:
  ```javascript
  const config = getConfig();
  ```

##### `saveConfig(config)`

Saves configuration to Zotero preferences.

- **Parameters**:
  - `config` (Object): Configuration object to save
- **Returns**: boolean - True if successful
- **Example**:
  ```javascript
  const success = saveConfig({ aiModel: 'gpt-4' });
  ```

##### `getConfigValue(key, defaultValue)`

Gets a specific configuration value.

- **Parameters**:
  - `key` (string): Configuration key
  - `defaultValue` (any, optional): Default value if key is not found
- **Returns**: any - Configuration value
- **Example**:
  ```javascript
  const apiKey = getConfigValue('aiApiKey', '');
  ```

##### `setConfigValue(key, value)`

Sets a specific configuration value.

- **Parameters**:
  - `key` (string): Configuration key
  - `value` (any): Configuration value
- **Returns**: boolean - True if successful
- **Example**:
  ```javascript
  const success = setConfigValue('showSidebar', true);
