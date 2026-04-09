import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Events collection schema
export const eventsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    event_name: z.string(),
    upcoming_dates: z.string(),
    upcoming_location: z.string(),
    url: z.string().url(),
    splash_page_path: z.string(),
    organizer: z.string().optional(),
    twf_zinger: z.string(),
    invite_message: z.string(),
    share_image: z.string(),
    fun_team_photo: z.string().optional(),
    contact_email: z.string().email(),
    contact_phone: z.string().optional(),
    event_website: z.string().url(),
    // Legacy field for backward compatibility
    description: z.string().optional(),
  }),
});
