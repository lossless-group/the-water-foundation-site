import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.join(__dirname, '../src/pages/nerd-out/with-us.astro');

function formatBaseThemeLayout(content) {
  // This regex matches the BaseThemeLayout opening tag and captures everything until the closing >
  return content.replace(
    /(<BaseThemeLayout)([\s\S]*?)(>)/,
    (match, startTag, attrs, endTag) => {
      // Extract all attributes
      const attrRegex = /(\S+)=(["'])(.*?)\2/g;
      const attributes = [];
      let attrMatch;
      
      // Extract all attributes
      while ((attrMatch = attrRegex.exec(attrs)) !== null) {
        attributes.push({
          name: attrMatch[1],
          value: attrMatch[3]
        });
      }
      
      // Build the new formatted tag
      let formattedTag = `${startTag}\n`;
      
      // Add each attribute on its own line with proper indentation
      attributes.forEach(attr => {
        formattedTag += `  ${attr.name}="${attr.value}"\n`;
      });
      
      // Close the tag
      formattedTag += endTag;
      
      return formattedTag;
    }
  );
}

console.log('🚀 Fixing formatting for with-us.astro...');

// Read the file
const content = fs.readFileSync(targetFile, 'utf8');

// Create backup
const backupPath = `${targetFile}.bak`;
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log('✅ Created backup at:', backupPath);
}

// Format the content
const newContent = formatBaseThemeLayout(content);

// Write the formatted content back to the file
fs.writeFileSync(targetFile, newContent, 'utf8');

console.log('✅ Successfully formatted with-us.astro');
console.log('\nChanges made:');
console.log('1. Each attribute is now on its own line');
console.log('2. Attributes are properly indented with 2 spaces');
console.log('3. Original file backed up to:', backupPath);
