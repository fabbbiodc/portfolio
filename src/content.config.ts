import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const programming = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/programming",
  }),
});

const design = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/design",
  }),
});

export const collections = {
  programming,
  design,
};
