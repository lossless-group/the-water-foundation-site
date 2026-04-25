import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { factsCollection } from './content/facts/schema';
import { eventsCollection } from './content/events/config';

const eventOrganizers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/event-organizers' }),
  schema: z.object({
    org_name: z.string(),
    org_url: z.string().url(),
    linked_org_url: z.string().url(),
    org_trademarks: z.object({
      light: z.string(),
      dark: z.string(),
      vibrant: z.string().optional(),
    }),
  }),
});

const strategies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/strategies' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

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
  strategies,
  slides,
  facts: factsCollection,
  events: eventsCollection,
  'event-organizers': eventOrganizers,
};
