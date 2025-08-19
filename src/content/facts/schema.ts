import { defineCollection, z } from 'astro:content';

export const factsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    index: z.number(),
    title: z.string().optional(),     // if you use `zinger`, make it optional here or restructure
    zinger: z.string().optional(),
    type: z.literal('Fact'),
    companion_image_url: z.string().optional(),
    sources: z.array(z.object({
      org: z.string(),
      title: z.string(),
      url: z.string().url(),
    })).optional(),
    // legacy fallback (optional)
    source_org: z.string().optional(),
    source_title: z.string().optional(),
    source_url: z.string().url().optional(),
  }).refine(data => !!data.title || !!data.zinger, {
    message: 'Either title or zinger is required',
  }),
});