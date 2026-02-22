import { defineCollection, z } from 'astro:content';

const research = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    authors: z.string(),
    venue: z.string().optional(),
    pdfUrl: z.string().optional(),
    status: z.enum(['Published', 'Working Paper', 'Whitepaper']),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
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

export const collections = { research, blog, concerts };
