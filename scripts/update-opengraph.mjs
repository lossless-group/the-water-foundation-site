import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');
const ogImage = '/ogImageLandscape__The-Water-Foundation.jpg';
const ogImagePortrait = '/ogImagePortrait__The-Water-Foundation.jpg';

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has ogImage
  if (content.includes('ogImage=')) {
    return false;
  }

  // Find the BaseThemeLayout opening tag
  const baseLayoutRegex = /<BaseThemeLayout([^>]*)>/;
  
  if (!baseLayoutRegex.test(content)) {
    console.log(`Skipping ${filePath} - No BaseThemeLayout found`);
    return false;
  }

  let newContent = content.replace(
    baseLayoutRegex,
    (match, attrs) => {
      // Remove any trailing whitespace and closing bracket
      const cleanAttrs = attrs.trim();
      return `<BaseThemeLayout ${cleanAttrs}${cleanAttrs ? ' ' : ''}ogImage="${ogImage}" ogImagePortrait="${ogImagePortrait}">`;
    }
  );

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const result = processDirectory(fullPath);
      updatedCount += result.updatedCount;
      skippedCount += result.skippedCount;
      errorCount += result.errorCount;
    } else if (file.endsWith('.astro')) {
      try {
        const wasUpdated = updateFile(fullPath);
        if (wasUpdated) {
          console.log(`✅ Updated: ${fullPath}`);
          updatedCount++;
        } else {
          console.log(`⏩ Skipped (already has ogImage): ${fullPath}`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${fullPath}:`, error.message);
        errorCount++;
      }
    }
  }

  return { updatedCount, skippedCount, errorCount };
}

console.log('🚀 Starting OpenGraph image update...');
const { updatedCount, skippedCount, errorCount } = processDirectory(pagesDir);

console.log('\n📊 Summary:');
console.log(`✅ ${updatedCount} files updated`);
console.log(`⏩ ${skippedCount} files skipped (already have ogImage)`);
console.log(`❌ ${errorCount} errors`);

if (errorCount > 0) {
  process.exit(1);
}
