import { getCollection } from 'astro:content';

interface MarkdownDeckData {
  title: string;
  description: string;
  component: string;
  content?: string;
}

export const markdownDecks: Record<string, MarkdownDeckData> = {};

// Load all markdown decks at build time
const loadMarkdownDecks = async () => {
  try {
    const slides = await getCollection('slides');
    
    for (const slide of slides) {
      const slug = slide.id.replace(/\.md$/, '').toLowerCase();
      markdownDecks[slug] = {
        title: slide.data.title || 'Untitled Deck',
        description: slide.data.description || '',
        component: 'MarkdownDeck',
        content: slide.body
      };
    }
    
    console.log('Loaded markdown decks:', Object.keys(markdownDecks));
  } catch (error) {
    console.error('Error loading markdown decks:', error);
  }
};

// Initialize the decks
await loadMarkdownDecks();

export async function getMarkdownDeck(slug: string): Promise<MarkdownDeckData | undefined> {
  // Try exact match first
  if (markdownDecks[slug]) {
    return markdownDecks[slug];
  }
  
  // Try case-insensitive match
  const foundSlug = Object.keys(markdownDecks).find(key => 
    key.toLowerCase() === slug.toLowerCase()
  );
  
  return foundSlug ? markdownDecks[foundSlug] : undefined;
}
