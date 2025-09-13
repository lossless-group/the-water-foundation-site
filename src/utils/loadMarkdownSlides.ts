import fs from 'fs';
import path from 'path';

export async function loadMarkdownSlides(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/content/slides', `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    return null;
  }
}
