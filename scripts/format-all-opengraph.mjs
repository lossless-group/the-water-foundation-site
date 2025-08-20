import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');
const ogImage = '/ogImageLandscape__The-Water-Foundation.jpg';
const ogImagePortrait = '/ogImagePortrait__The-Water-Foundation.jpg';

// Skip these directories
const SKIP_DIRS = [
  'node_modules',
  '.git',
  '.astro',
  'dist',
  'public',
  'src/layouts',  // Skip layout files as they're included by pages
  'src/components'  // Skip components as they're included by pages
];

// Skip these specific files
const SKIP_FILES = [
  'BoilerPlateHTML.astro',
  'BaseThemeLayout.astro'
];

function formatBaseThemeLayout(content) {
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

function processDirectory(directory) {
  const stats = fs.statSync(directory);
  if (!stats.isDirectory()) {
    return { updatedCount: 0, skippedCount: 0 };
  }

  const dirName = path.basename(directory);
  if (SKIP_DIRS.includes(dirName)) {
    return { updatedCount: 0, skippedCount: 0 };
  }

  const files = fs.readdirSync(directory);
  let updatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const fileStat = fs.statSync(fullPath);

    if (fileStat.isDirectory()) {
      const result = processDirectory(fullPath);
      updatedCount += result.updatedCount;
      skippedCount += result.skippedCount;
    } else if (file.endsWith('.astro') && !SKIP_FILES.includes(file)) {
      console.log(`\n🔍 Processing: ${fullPath.replace(pagesDir, '')}`);
      
      try {
        const result = processFile(fullPath);
        
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
  }

  return { updatedCount, skippedCount };
}

// Ensure the pages directory exists
if (!fs.existsSync(pagesDir)) {
  console.error(`❌ Error: Pages directory not found at ${pagesDir}`);
  process.exit(1);
}

console.log('🚀 Starting OpenGraph formatting for all pages...');
console.log(`📁 Processing directory: ${pagesDir}`);
console.log('This will update all .astro files with proper OpenGraph image formatting.');
console.log('Backups will be created for modified files with a .bak extension.\n');

const { updatedCount, skippedCount } = processDirectory(pagesDir);

console.log('\n📊 Summary:');
console.log(`✅ ${updatedCount} files formatted`);
console.log(`⏩ ${skippedCount} files skipped`);

if (updatedCount > 0) {
  console.log('\n⚠️  Note: Backups of modified files were created with .bak extensions.');
}
