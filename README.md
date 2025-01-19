# Handlebars HTML Merger

A Node.js project to dynamically merge Handlebars templates with context data and generate HTML files. Static files (CSS, JS, images, etc.) are copied to the output directory, preserving the folder structure.

## Features
- Compile `.hbs` templates with Handlebars.
- Copy static files (CSS, JS, images) to the output directory.
- Only process modified files to save time.
- Logs the process to the console.

## Project Structure
handlebars-html-merger/ ├── components/ # Handlebars partials ├── input/ # Input files (templates and static files) ├── output/ # Generated HTML and copied static files ├── data/ # Context data in JSON format ├── index.js # Main script └── .gitignore # Ignored files and folders

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/handlebars-html-merger.git
   cd handlebars-html-merger
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the script:
   ```bash
   node index.js
   ```
