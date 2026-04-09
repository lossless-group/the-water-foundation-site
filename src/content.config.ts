import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { factsCollection } from './content/facts/schema';
import { eventsCollection } from './content/events/config';

const slides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/slides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.date().optional(),
    theme: z.string().default('water'),
    transition: z.string().default('slide'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  slides,
  facts: factsCollection,
  events: eventsCollection,
};
