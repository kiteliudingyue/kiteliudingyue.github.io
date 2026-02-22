import { defineCollection, z } from 'astro:content';

const research = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    authors: z.array(z.object({
      name: z.string(),
      url: z.string().optional(),
    })).default([]),
    venue: z.string().optional(),
    pdfUrl: z.string().optional(),
    hook: z.string().optional(),
    status: z.enum(['Published', 'Working Paper', 'Whitepaper']),
    sortOrder: z.number(),
  }),
});

const concerts = defineCollection({
  type: 'content',
  schema: z.object({
    artist: z.string(),
    venue: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    posterUrl: z.string(),
    videoUrl: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { research, concerts };
