# NAV Parser

A web-based application for parsing and displaying Net Asset Value (NAV) data from text files. This tool helps you visualize and analyze mutual fund NAV information in a structured table format.

## Features

- Upload and parse NAV data from text files
- Display NAV data in a clean, organized table format
- Persistent storage of parsed data using localStorage
- Display statistics including:
  - Total number of unique schemes
  - Latest NAV date
- Responsive design for various screen sizes

## Usage

1. Open the application in a web browser
2. Click the file input button to select a NAV data text file
3. The application will automatically parse and display the data in a table
4. The parsed data includes:
   - Scheme Code
   - ISIN
   - Scheme Name
   - NAV
   - Date

## Input File Format

The application expects a text file with semicolon-separated values (;) containing the following fields:
- Scheme Code
- Scheme Name
- ISIN Growth
- ISIN Dividend Reinvestment
- NAV
- Date

Lines that don't match this format or contain headers will be automatically filtered out.

## Technical Details

- Built with vanilla JavaScript
- Uses modern browser features including:
  - localStorage for data persistence
  - FileReader API for file processing
  - Modern JavaScript ES6+ features
- No external dependencies required

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- localStorage API
- FileReader API

## Installation

1. Clone this repository
2. Open `index.html` in a web browser
3. Start uploading NAV data files
