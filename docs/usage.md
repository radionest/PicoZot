# PicoZot User Guide

This guide explains how to use the PicoZot plugin for Zotero to analyze PICO elements and generate literature reviews.

## Installation

1. Download the latest `.xpi` file from the [Releases](https://github.com/radionest/picozot/releases) page.
2. In Zotero, go to Tools → Add-ons.
3. Click the gear icon and select "Install Add-on From File..."
4. Select the downloaded `.xpi` file.
5. Restart Zotero when prompted.

## Initial Setup

Before using PicoZot, you need to configure your AI API key:

1. In Zotero, go to Tools → PicoZot → Settings.
2. Enter your API key in the "API Key" field.
3. Select the AI model you want to use.
4. Click "Save".

## PICO Analysis

PICO (Population, Intervention, Comparison, Outcome) is a framework used in evidence-based medicine to formulate clinical questions and search for evidence.

### Analyzing a Single Item

1. Select an item in your Zotero library.
2. Right-click and select "Analyze PICO Elements" from the context menu.
3. The analysis results will be displayed in a dialog.
4. You can save the analysis as an item annotation by checking the "Save analysis as item annotation" option.

### Analyzing Multiple Items

1. Select multiple items in your Zotero library (use Ctrl/Cmd+click to select multiple items).
2. Right-click and select "Analyze PICO Elements" from the context menu.
3. The analysis results for each item will be displayed in the dialog.
4. You can save the analyses as item annotations by checking the "Save analysis as item annotation" option.

### Viewing Analysis Results

The analysis results include the following PICO elements:

- **Population/Problem**: The specific patient population or problem being addressed.
- **Intervention**: The intervention or exposure being considered.
- **Comparison**: The comparison intervention or exposure (if applicable).
- **Outcome**: The outcome measures.

## Literature Review Generation

PicoZot can generate comprehensive literature reviews based on selected papers.

### Generating a Literature Review

1. Select multiple items in your Zotero library.
2. Right-click and select "Generate Literature Review" from the context menu.
3. Choose a template from the dropdown menu:
   - **Default Template**: A basic literature review structure.
   - **Systematic Review**: A more detailed structure for systematic reviews.
4. Configure the options:
   - **Combine PICO elements from all items**: Combines PICO elements from all selected items for a more comprehensive review.
   - **Save review as a document**: Saves the review as a document in the PicoZot folder.
5. Add any additional instructions in the text area.
6. Click "Generate Review".
7. The generated review will be displayed in the dialog.
8. If you selected the "Save review as a document" option, the review will be saved to the PicoZot folder in your Zotero directory.

### Review Structure

The generated review follows a structured format based on the selected template:

#### Default Template

- **Introduction**: Background information and context for the review.
- **Methods**: Description of the search strategy, inclusion criteria, and analysis methods.
- **Results**: Presentation of the findings from the included studies.
- **Discussion**: Interpretation of the results and discussion of implications.
- **Conclusion**: Summary of the main findings and their significance.

#### Systematic Review Template

- **Abstract**: A structured summary of the review.
- **Introduction**: Background information and rationale for the review.
- **Methods**:
  - **Search Strategy**: Description of the search strategy and databases used.
  - **Inclusion and Exclusion Criteria**: Specification of the criteria for including and excluding studies.
  - **Data Extraction**: Description of how data was extracted from the included studies.
  - **Quality Assessment**: Description of how the quality of the included studies was assessed.
- **Results**: Presentation of the findings from the included studies.
- **Discussion**: Interpretation of the results and discussion of implications.
- **Conclusion**: Summary of the main findings and their significance.

## PICO Comparison

PicoZot can compare PICO elements across multiple papers to identify similarities and differences.

### Comparing PICO Elements

1. Select multiple items in your Zotero library.
2. Open the PicoZot sidebar by clicking the PicoZot button in the toolbar.
3. Click "Compare PICO Elements" in the sidebar.
4. The comparison results will show similarities and differences in PICO elements across the selected items.

### Comparison Results

The comparison results include:

- **Similarities**: Common elements across all selected items.
- **Differences**: Elements that vary between items, with details for each item.

## Using the Sidebar

The PicoZot sidebar provides quick access to all plugin features.

### Opening the Sidebar

Click the PicoZot button in the Zotero toolbar to toggle the sidebar.

### Sidebar Features

The sidebar includes:

- **Tools**: Buttons for PICO Analysis, Literature Review Generation, and PICO Comparison.
- **Selected Items**: A list of currently selected items in your Zotero library.
- **Results**: Display area for PICO analysis and comparison results.

## Settings

You can configure PicoZot settings to customize its behavior.

### Accessing Settings

1. Click the PicoZot button in the toolbar to open the sidebar.
2. Click "Settings" at the bottom of the sidebar.

### Available Settings

- **AI Settings**:
  - **API Key**: Your AI API key.
  - **AI Model**: The AI model to use (e.g., GPT-4, GPT-3.5 Turbo).
- **UI Settings**:
  - **Show sidebar on startup**: Whether to show the sidebar when Zotero starts.

## Troubleshooting

### API Key Issues

If you encounter errors related to the AI API key:

1. Check that you have entered the correct API key in the settings.
2. Ensure that your API key has sufficient permissions and credits.
3. Check your internet connection.

### Content Extraction Issues

If PicoZot fails to extract content from items:

1. Ensure that the items have abstracts or notes.
2. For PDF attachments, ensure that they are properly indexed by Zotero.

### Performance Issues

If PicoZot is running slowly:

1. Try using a smaller number of items for analysis or review generation.
2. Close other applications to free up system resources.
3. Consider using a less resource-intensive AI model.

## Getting Help

If you encounter any issues or have questions about PicoZot:

1. Check the [GitHub repository](https://github.com/radionest/picozot) for known issues and solutions.
2. Submit a new issue on GitHub if you encounter a bug or have a feature request.
3. Contact the developer at [your.email@example.com](mailto:your.email@example.com) for additional support.
