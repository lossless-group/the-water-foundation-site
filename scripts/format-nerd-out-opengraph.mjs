import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../src/pages/nerd-out');
const ogImage = '/ogImageLandscape__The-Water-Foundation.jpg';
const ogImagePortrait = '/ogImagePortrait__The-Water-Foundation.jpg';

function formatBaseThemeLayout(content) {
  // This regex matches the BaseThemeLayout opening tag and captures its attributes
  const baseLayoutRegex = /<BaseThemeLayout([\s\S]*?)>/;
  
  return content.replace(
    baseLayoutRegex,
    (match, attrs) => {
      // Extract the title attribute if it exists
      const titleMatch = attrs.match(/title=(["'])(.*?)\1/);
      const title = titleMatch ? `  title="${titleMatch[2]}"` : '';
      
      // Remove title, ogImage, and ogImagePortrait from attributes
      const otherAttrs = attrs
        .replace(/title=(["']).*?\1/g, '')
        .replace(/ogImage=(["']).*?\1/g, '')
        .replace(/ogImagePortrait=(["']).*?\1/g, '')
        .trim()
        .replace(/\s+/g, ' ');
      
      // Build the new formatted tag
      let formattedTag = '<BaseThemeLayout\n';
      
      // Add title on its own line if it exists
      if (title) {
        formattedTag += `${title}\n`;
      }
      
      // Add ogImage and ogImagePortrait
      formattedTag += `  ogImage="${ogImage}"\n`;
      formattedTag += `  ogImagePortrait="${ogImagePortrait}"`;
      
      // Add any remaining attributes
      if (otherAttrs) {
        formattedTag += `\n  ${otherAttrs}`;
      }
      
      formattedTag += '\n>';
      
      return formattedTag;
    }
  );
}

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Create backup
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

console.log('🚀 Starting OpenGraph formatting for nerd-out directory...');

const files = fs.readdirSync(targetDir);
let updatedCount = 0;
let skippedCount = 0;

for (const file of files) {
  if (!file.endsWith('.astro')) continue;
  
  const filePath = path.join(targetDir, file);
  console.log(`\n🔍 Processing: ${file}`);
  
  try {
    const result = updateFile(filePath);
    
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
console.log(`⏩ ${skippedCount} files already properly formatted`);
