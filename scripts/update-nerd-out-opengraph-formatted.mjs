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
  const baseLayoutRegex = /<BaseThemeLayout([^>]*)>/;
  
  return content.replace(
    baseLayoutRegex,
    (match, attrs) => {
      // Extract and format the title attribute
      const titleMatch = attrs.match(/title="([^"]*)"/);
      const title = titleMatch ? titleMatch[0] : '';
      
      // Remove the title from the remaining attributes
      const otherAttrs = attrs.replace(/title="[^"]*"/, '').trim();
      
      // Build the new formatted tag
      let formattedTag = '<BaseThemeLayout\n';
      
      // Add title on its own line if it exists
      if (title) {
        formattedTag += `  ${title.trim()}\n`;
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
  
  // Skip if already has ogImage
  if (content.includes('ogImage=')) {
    return { updated: false, reason: 'already has ogImage' };
  }

  // Check if BaseThemeLayout exists
  if (!/<BaseThemeLayout([^>]*)>/.test(content)) {
    return { updated: false, reason: 'no BaseThemeLayout found' };
  }

  // Create backup
  const backupPath = `${filePath}.bak`;
  fs.writeFileSync(backupPath, content, 'utf8');
  
  // Format and write new content
  const newContent = formatBaseThemeLayout(content);
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  return { updated: true };
}

console.log('🚀 Starting formatted OpenGraph image update for nerd-out directory...');

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
      console.log(`✅ Updated: ${file} (backup saved to ${file}.bak)`);
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
console.log(`✅ ${updatedCount} files updated`);
console.log(`⏩ ${skippedCount} files skipped`);
