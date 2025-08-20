import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../src/pages/partners');
const ogImage = '/ogImageLandscape__The-Water-Foundation.jpg';
const ogImagePortrait = '/ogImagePortrait__The-Water-Foundation.jpg';

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
      
      // Add ogImage and ogImagePortrait if they don't exist
      const hasOgImage = attributes.some(attr => attr.name === 'ogImage');
      const hasOgImagePortrait = attributes.some(attr => attr.name === 'ogImagePortrait');
      
      if (!hasOgImage) {
        attributes.push({ name: 'ogImage', value: ogImage });
      }
      if (!hasOgImagePortrait) {
        attributes.push({ name: 'ogImagePortrait', value: ogImagePortrait });
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

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if no BaseThemeLayout found
  if (!/<BaseThemeLayout/.test(content)) {
    return { updated: false, reason: 'no BaseThemeLayout found' };
  }
  
  // Create backup if it doesn't exist
  const backupPath = `${filePath}.bak`;
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content, 'utf8');
  }
  
  // Format the content
  const newContent = formatBaseThemeLayout(content);
  
  // Only write if content changed
  if (newContent === content) {
    return { updated: false, reason: 'already properly formatted' };
  }
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  return { updated: true };
}

console.log('🚀 Starting OpenGraph formatting for partners directory...');

const files = fs.readdirSync(targetDir).filter(file => file.endsWith('.astro'));
let updatedCount = 0;
let skippedCount = 0;

for (const file of files) {
  const filePath = path.join(targetDir, file);
  console.log(`\n🔍 Processing: ${file}`);
  
  try {
    const result = processFile(filePath);
    
    if (result.updated) {
      console.log(`✅ Formatted: ${file} (backup saved to ${file}.bak)`);
      updatedCount++;
    } else {
      console.log(`⏩ Skipped: ${file} (${result.reason})`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

console.log('\n📊 Summary:');
console.log(`✅ ${updatedCount} files formatted`);
console.log(`⏩ ${skippedCount} files skipped`);
