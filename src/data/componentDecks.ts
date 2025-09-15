export interface ComponentDeck {
  title: string;
  description: string;
  component: string;
}

export const componentDecks: Record<string, ComponentDeck> = {
  'water-fund-variant-1': {
    title: 'The Water Foundation',
    description: 'Systemic Solutions for Global Water Security',
    component: 'SlideShowVariant1'
  },
  'meet-at-the-drop': {
    title: 'Meet The Water Foundation at The Drop',
    description: 'An exclusive gathering of water innovation leaders, investors, and changemakers',
    component: 'SlideShowMeetAt'
  },
  'sample': {
    title: 'Sample Presentation',
    description: 'A sample slide deck to test the Water Theme integration',
    component: 'sample'
  }
};
