const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Directories
const INPUT_DIR = path.join(__dirname, "input");
const OUTPUT_DIR = path.join(__dirname, "output");
const COMPONENTS_DIR = path.join(__dirname, "components");
const CONTEXT_FILE = path.join(__dirname, "data", "context.json");

// Helper function: Copy files
function copyFile(inputPath, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.copyFileSync(inputPath, outputPath);
  console.log(`Copied: ${inputPath} -> ${outputPath}`);
}

// Helper function: Check if file has been modified
function isModified(inputFile, outputFile) {
  if (!fs.existsSync(outputFile)) return true;
  const inputStat = fs.statSync(inputFile);
  const outputStat = fs.statSync(outputFile);
  return inputStat.mtime > outputStat.mtime;
}

// Load partials
function loadPartials() {
  fs.readdirSync(COMPONENTS_DIR).forEach((file) => {
    const partialName = path.basename(file, ".hbs");
    const partialPath = path.join(COMPONENTS_DIR, file);
    const partialContent = fs.readFileSync(partialPath, "utf-8");
    handlebars.registerPartial(partialName, partialContent);
    console.log(`Registered partial: ${partialName}`);
  });
}

// Main function: Process input directory
function processInput() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error("Input directory does not exist!");
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const context = fs.existsSync(CONTEXT_FILE)
    ? JSON.parse(fs.readFileSync(CONTEXT_FILE, "utf-8"))
    : {};

  fs.readdirSync(INPUT_DIR, { withFileTypes: true }).forEach((entry) => {
    const inputPath = path.join(INPUT_DIR, entry.name);
    const outputPath = path.join(OUTPUT_DIR, entry.name);

    if (entry.isDirectory()) {
      processInput(inputPath); // Recursively handle directories
    } else if (entry.isFile()) {
      if (entry.name.endsWith(".hbs")) {
        if (isModified(inputPath, outputPath.replace(".hbs", ".html"))) {
          const templateContent = fs.readFileSync(inputPath, "utf-8");
          const template = handlebars.compile(templateContent);
          const outputContent = template(context);

          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath.replace(".hbs", ".html"), outputContent);
          console.log(`Compiled: ${inputPath} -> ${outputPath.replace(".hbs", ".html")}`);
        }
      } else {
        if (isModified(inputPath, outputPath)) {
          copyFile(inputPath, outputPath);
        }
      }
    }
  });
}

// Load partials and process input
loadPartials();
processInput();
