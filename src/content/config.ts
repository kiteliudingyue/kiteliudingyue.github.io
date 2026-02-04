import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()),
    image: z.string().optional(),
    videoUrl: z.string().optional(),
    embedUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
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

export const collections = { projects, blog, concerts };
