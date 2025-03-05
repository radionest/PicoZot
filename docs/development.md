# PicoZot Development Guide

This guide provides information for developers who want to contribute to the PicoZot plugin for Zotero.

## Development Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)
- [Zotero](https://www.zotero.org/) (v6 or later)

### Setup Steps

1. Clone the repository:
   ```
   git clone https://github.com/radionest/picozot.git
   cd picozot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development build with watch mode:
   ```
   npm run dev
   ```

4. Install the plugin in Zotero for testing:
   - In Zotero, go to Tools → Add-ons.
   - Click the gear icon and select "Debug Add-ons".
   - Click "Load Temporary Add-on" and select the `manifest.json` file from the `dist` directory.

## Project Structure

```
picozot/
│
├── src/                      # Source code
│   ├── index.js              # Entry point
│   ├── addon.js              # Zotero addon registration
│   ├── services/             # Service modules
│   │   ├── aiService.js      # AI service
│   │   ├── picoParser.js     # PICO parser
│   │   └── literatureReview.js  # Literature review generation
│   │
│   ├── ui/                   # UI components
│   │   ├── dialog.js         # Dialog components
│   │   ├── sidebar.js        # Sidebar components
│   │   └── templates.js      # HTML templates
│   │
│   └── utils/                # Utility modules
│       ├── config.js         # Configuration utilities
│       ├── logger.js         # Logging utilities
│       └── zoteroApi.js      # Zotero API utilities
│
├── test/                     # Tests
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   ├── mocks/                # Mock data for tests
│   └── test-helpers.js       # Test helper functions
│
├── locale/                   # Localization
│   ├── en-US/                # English
│   └── ru-RU/                # Russian
│
├── resources/                # Static resources
│   ├── icons/                # Icons
│   └── templates/            # Review templates
│
├── build/                    # Build scripts
│   ├── webpack.config.js     # Webpack configuration
│   ├── build.js              # Build script
│   └── package.js            # Packaging script
│
├── docs/                     # Documentation
│   ├── api.md                # API documentation
│   ├── usage.md              # User guide
│   └── development.md        # Development guide
│
├── dist/                     # Build output (generated)
├── manifest.json             # Plugin manifest
├── package.json              # npm package configuration
└── README.md                 # Project overview
```

## Development Workflow

### Building the Plugin

- Development build with watch mode:
  ```
  npm run dev
  ```

- Production build:
  ```
  npm run build
  ```

- Package the plugin as an XPI file:
  ```
  npm run package
  ```

### Testing

- Run all tests:
  ```
  npm test
  ```

- Run specific tests:
  ```
  npm test -- test/unit/picoParser.test.js
  ```

### Code Style

- Check code style:
  ```
  npm run lint
  ```

- Format code:
  ```
  npm run format
  ```

## Adding Features

### Adding a New Service

1. Create a new file in the `src/services` directory.
2. Export functions that provide the service functionality.
3. Import and use the service in other modules as needed.

Example:
```javascript
// src/services/newService.js
import { logger } from '../utils/logger.js';

export async function newServiceFunction() {
  try {
    logger.info('New service function called');
    // Implementation
    return result;
  } catch (error) {
    logger.error('Failed to execute new service function', error);
    throw error;
  }
}
```

### Adding a New UI Component

1. Create a new file in the `src/ui` directory.
2. Export functions that create and manage the UI component.
3. Import and use the component in other modules as needed.

Example:
```javascript
// src/ui/newComponent.js
import { logger } from '../utils/logger.js';

export function createNewComponent() {
  try {
    logger.info('Creating new component');
    
    const component = document.createElement('div');
    component.id = 'picozot-new-component';
    // Configure component
    
    return component;
  } catch (error) {
    logger.error('Failed to create new component', error);
    throw error;
  }
}
```

### Adding a New Utility

1. Create a new file in the `src/utils` directory.
2. Export functions that provide utility functionality.
3. Import and use the utility in other modules as needed.

Example:
```javascript
// src/utils/newUtil.js
import { logger } from './logger.js';

export function newUtilFunction() {
  try {
    logger.info('New utility function called');
    // Implementation
    return result;
  } catch (error) {
    logger.error('Failed to execute new utility function', error);
    throw error;
  }
}
```

## Localization

### Adding a New Locale

1. Create a new directory in the `locale` directory with the appropriate locale code (e.g., `fr-FR` for French).
2. Copy the DTD file from an existing locale (e.g., `en-US/picozot.dtd`) to the new locale directory.
3. Translate the strings in the DTD file.

### Adding New Strings

1. Add the new string to all locale DTD files.
2. Use the string in your code with the appropriate entity reference.

Example:
```xml
<!-- locale/en-US/picozot.dtd -->
<!ENTITY picozot.newString "New String">

<!-- locale/ru-RU/picozot.dtd -->
<!ENTITY picozot.newString "Новая строка">
```

```javascript
// Usage in code
const label = document.createElement('label');
label.setAttribute('value', '&picozot.newString;');
```

## Working with Zotero API

### Accessing Zotero Objects

The Zotero API is available through the global `Zotero` object. You can access various Zotero functionality through this object.

Example:
```javascript
// Get selected items
const items = ZoteroPane.getSelectedItems();

// Access Zotero preferences
const prefValue = Zotero.Prefs.get('extensions.picozot.setting');

// Create a new Zotero item
const item = new Zotero.Item('note');
item.setNote('Note content');
await item.saveTx();
```

### Handling Zotero Events

You can listen for Zotero events to respond to user actions.

Example:
```javascript
// Listen for item selection changes
const itemsView = ZoteroPane.itemsView;
if (itemsView) {
  itemsView.addEventListener('select', () => {
    const items = ZoteroPane.getSelectedItems();
    // Handle selected items
  });
}
```

## Working with AI API

The AI service uses an external API (e.g., OpenAI) to provide AI functionality. You need to handle API keys, requests, and responses appropriately.

### API Key Management

- Store API keys securely in Zotero preferences.
- Allow users to enter their own API keys.
- Never hardcode API keys in the source code.

### Error Handling

- Handle API errors gracefully.
- Provide meaningful error messages to users.
- Implement retry logic for transient errors.

Example:
```javascript
try {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  logger.error('API request failed', error);
  throw new Error(`Failed to communicate with AI service: ${error.message}`);
}
```

## Debugging

### Console Logging

Use the logger utility for console logging:

```javascript
import { logger } from '../utils/logger.js';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### Zotero Debug Output

You can view Zotero debug output:

1. Open the Zotero debug output window:
   - In Zotero, go to Help → Debug Output Logging.
   - Click "Enable Output Logging".
   - Click "View Output".

2. Filter the output to show only PicoZot messages:
   - Enter "PicoZot" in the filter box.

## Releasing

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes

### Release Process

1. Update version number in `package.json` and `manifest.json`.
2. Update the changelog with the new version and changes.
3. Build and package the plugin:
   ```
   npm run package
   ```
4. Test the packaged XPI file.
5. Create a new release on GitHub:
   - Tag the release with the version number (e.g., `v1.0.0`).
   - Upload the XPI file.
   - Add release notes.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Run tests and ensure they pass.
5. Submit a pull request.

### Pull Request Guidelines

- Keep changes focused on a single issue.
- Include tests for new functionality.
- Update documentation as needed.
- Follow the existing code style.
- Provide a clear description of the changes.

## Resources

- [Zotero Plugin Development Documentation](https://www.zotero.org/support/dev/client_coding/plugin_development)
- [Mozilla Add-on Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
