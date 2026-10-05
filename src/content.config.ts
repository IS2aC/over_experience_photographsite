import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './data/categories';

/**
 * Œuvres = volumes de la bibliothèque (une série photo par fichier YAML).
 * Pour ajouter une série : déposer les photos dans src/content/oeuvres/images/
 * et créer un fichier src/content/oeuvres/<slug>.yaml (voir les exemples).
 */
const oeuvres = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/oeuvres' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      /** Titre court affiché sur la tranche du livre */
      spine: z.string(),
      subtitle: z.string(),
      categories: z.array(z.enum(CATEGORY_KEYS)).min(1),
      categoryLabel: z.string(),
      year: z.number(),
      location: z.string(),
      client: z.string().default('Studio OverXP'),
      description: z.string(),
      accent: z.enum(['primary', 'tertiary', 'secondary']).default('primary'),
      /** Série de démonstration issue de la maquette, à remplacer par de vraies œuvres */
      demo: z.boolean().default(false),
      /** Présence dans la grille « Archives & Expositions » */
      archive: z
        .object({
          badge: z.string(),
          date: z.string(),
          tags: z.tuple([z.string(), z.string()]),
        })
        .optional(),
      photos: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            title: z.string(),
            exif: z.string().optional(),
            grayscale: z.boolean().default(false),
          }),
        )
        .min(1),
    }),
});

export const collections = { oeuvres };
