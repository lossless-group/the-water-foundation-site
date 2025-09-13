export interface ComponentDeck {
  title: string;
  description: string;
  component: string;
}

export const componentDecks: Record<string, ComponentDeck> = {
  'water-fund-variant-1': {
    title: 'The Water Fund',
    description: 'Systemic Solutions for Global Water Security',
    component: 'SlideShowVariant1'
  },
  'sample': {
    title: 'Sample Presentation',
    description: 'A sample slide deck to test the Water Theme integration',
    component: 'sample'
  }
};
