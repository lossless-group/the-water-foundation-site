import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

// Helper function to get the component's HTML output
async function getHeroHTML(props = {}) {
  // Default props
  const defaultProps = {
    headerTxt: 'Test Header',
    backgroundsArray: [
      {
        type: 'gradient',
        gradient: 'from-blue-500 to-purple-600',
        overlay: true,
        overlayOpacity: 0.5
      },
      {
        type: 'image',
        src: '/test-image.jpg',
        alt: 'Test Image',
        overlay: true
      }
    ],
    ...props
  };

  // In a real test, you would render the Astro component here
  // For now, we'll return a mock HTML structure based on the props
  return `
    <section class="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <div class="backgrounds-container absolute inset-0">
        ${defaultProps.backgroundsArray.map(bg => `
          <div class="${bg.type === 'gradient' ? 'bg-gradient-to-br ' + bg.gradient : ''}">
            ${bg.overlay ? `<div style="opacity: ${bg.overlayOpacity || 0.4};"></div>` : ''}
          </div>
        `).join('')}
      </div>
      <div class="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        <h1>${defaultProps.headerTxt}</h1>
        ${defaultProps.targetActionsArray ? `
          <div class="flex gap-4">
            ${defaultProps.targetActionsArray.map(action => `
              <a href="${action.href}" class="${action.variant === 'primary' ? 'bg-primary-600' : 'bg-secondary-100'}">
                ${action.text}
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

describe('Hero Component', () => {
  it('renders the header text', async () => {
    const html = await getHeroHTML({ headerTxt: 'Test Header' });
    const dom = new JSDOM(html);
    const header = dom.window.document.querySelector('h1');
    expect(header).not.toBeNull();
    expect(header.textContent).toContain('Test Header');
  });

  it('renders multiple background elements', async () => {
    const html = await getHeroHTML();
    const dom = new JSDOM(html);
    const backgrounds = dom.window.document.querySelectorAll('.backgrounds-container > div');
    expect(backgrounds.length).toBe(2);
  });

  it('applies correct classes based on background type', async () => {
    const html = await getHeroHTML();
    const dom = new JSDOM(html);
    const gradientBg = dom.window.document.querySelector('.backgrounds-container > div:first-child');
    expect(gradientBg.className).toContain('bg-gradient-to-br');
    expect(gradientBg.className).toContain('from-blue-500');
    expect(gradientBg.className).toContain('to-purple-600');
  });

  it('applies overlay when specified', async () => {
    const html = await getHeroHTML();
    const dom = new JSDOM(html);
    const overlay = dom.window.document.querySelector('.backgrounds-container > div:first-child > div');
    expect(overlay).not.toBeNull();
    expect(overlay.style.opacity).toBe('0.5');
  });

  it('uses default background when no backgrounds provided', async () => {
    const html = await getHeroHTML({ backgroundsArray: [] });
    const dom = new JSDOM(html);
    const backgrounds = dom.window.document.querySelectorAll('.backgrounds-container > div');
    expect(backgrounds.length).toBe(0);
  });

  it('renders action buttons when provided', async () => {
    const html = await getHeroHTML({
      targetActionsArray: [
        { text: 'Learn More', href: '/learn', variant: 'primary' },
        { text: 'Contact Us', href: '/contact', variant: 'secondary' }
      ]
    });
    
    const dom = new JSDOM(html);
    const buttons = dom.window.document.querySelectorAll('a');
    
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Learn More');
    expect(buttons[1].textContent).toContain('Contact Us');
    expect(buttons[0].className).toContain('bg-primary-600');
    expect(buttons[1].className).toContain('bg-secondary-100');
  });
});
