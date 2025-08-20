import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../src/pages/nerd-out');
const ogImage = '/ogImageLandscape__The-Water-Foundation.jpg';
const ogImagePortrait = '/ogImagePortrait__The-Water-Foundation.jpg';

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has ogImage
  if (content.includes('ogImage=')) {
    return { updated: false, reason: 'already has ogImage' };
  }

  // Find the BaseThemeLayout opening tag
  const baseLayoutRegex = /<BaseThemeLayout([^>]*)>/;
  
  if (!baseLayoutRegex.test(content)) {
    return { updated: false, reason: 'no BaseThemeLayout found' };
  }

  const newContent = content.replace(
    baseLayoutRegex,
    (match, attrs) => {
      const cleanAttrs = attrs.trim();
      return `<BaseThemeLayout ${cleanAttrs}${cleanAttrs ? ' ' : ''}ogImage="${ogImage}" ogImagePortrait="${ogImagePortrait}">`;
    }
  );

  // Create backup
  const backupPath = `${filePath}.bak`;
  fs.writeFileSync(backupPath, content, 'utf8');
  
  // Write new content
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  return { updated: true };
}

console.log('🚀 Starting OpenGraph image update for nerd-out directory...');

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
