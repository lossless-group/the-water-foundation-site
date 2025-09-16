import { defineCollection, z } from 'astro:content';
import { factsCollection } from './facts/schema';
import { eventsCollection } from './events/config';

// Slides collection for presentation content
const slides = defineCollection({
  type: 'content',
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
