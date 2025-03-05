# PicoZot

A Zotero plugin for PICO analysis and literature review generation.

## Features

- **PICO Analysis**: Automatically extract PICO elements (Population, Intervention, Comparison, Outcome) from research papers.
- **Literature Review Generation**: Generate comprehensive literature reviews based on selected papers.
- **PICO Comparison**: Compare PICO elements across multiple papers to identify similarities and differences.
- **AI-Powered**: Utilizes advanced AI models to analyze and synthesize research content.

## Installation

### From Release

1. Download the latest `.xpi` file from the [Releases](https://github.com/radionest/picozot/releases) page.
2. In Zotero, go to Tools → Add-ons.
3. Click the gear icon and select "Install Add-on From File..."
4. Select the downloaded `.xpi` file.
5. Restart Zotero when prompted.

### From Source

1. Clone this repository:
   ```
   git clone https://github.com/radionest/picozot.git
   ```
2. Install dependencies:
   ```
   cd picozot
   npm install
   ```
3. Build the plugin:
   ```
   npm run build
   ```
4. The built `.xpi` file will be in the root directory.
5. Follow steps 2-5 from the "From Release" section to install the built plugin.

## Usage

### PICO Analysis

1. Select one or more items in your Zotero library.
2. Right-click and select "Analyze PICO Elements" from the context menu.
3. The analysis results will be displayed and can be saved as item annotations.

### Literature Review Generation

1. Select multiple items in your Zotero library.
2. Right-click and select "Generate Literature Review" from the context menu.
3. Choose a template and options for the review.
4. The generated review can be saved as a document.

### PICO Comparison

1. Select multiple items in your Zotero library.
2. Open the PicoZot sidebar by clicking the PicoZot button in the toolbar.
3. Click "Compare PICO Elements" in the sidebar.
4. The comparison results will show similarities and differences in PICO elements across the selected items.

## Configuration

1. Open the PicoZot settings by clicking "Settings" in the PicoZot sidebar.
2. Enter your AI API key.
3. Choose the AI model to use.
4. Configure other options as needed.

## Development

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```

### Development Workflow

1. Start the development build with watch mode:
   ```
   npm run dev
   ```
2. Install the plugin in Zotero for testing:
   - In Zotero, go to Tools → Add-ons.
   - Click the gear icon and select "Debug Add-ons".
   - Click "Load Temporary Add-on" and select the `manifest.json` file from the `dist` directory.

### Building for Production

```
npm run build
```

### Packaging

```
npm run package
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Zotero](https://www.zotero.org/) for the excellent reference management software.
- [OpenAI](https://openai.com/) for the AI models used in this plugin.
