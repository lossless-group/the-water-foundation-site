import fs from 'fs';
import path from 'path';

export async function loadMarkdownSlides(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/content/slides', `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf8');
    // Remove any frontmatter if present (lines between --- at the start of file)
    return content.replace(/^---[\s\S]*?---\s*/, '');
  } catch (error) {
    console.error(`Failed to load markdown slides for ${slug}:`, error);
    return null;
  }
}
