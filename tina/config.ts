import { defineConfig } from "tinacms";

/**
 * TinaCMS schema for the portfolio.
 *
 * Content lives as JSON under `content/projects/`, which the site reads at
 * build time — there is no database. Publishing from the CMS commits to the
 * repo, which redeploys the site.
 */

const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "master";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      // Uploads land beside the existing project photos.
      mediaRoot: "photos/portfolio",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "project",
        label: "Portfolio Projects",
        path: "content/projects",
        format: "json",
        ui: {
          filename: {
            // Slug drives the photo folder path, so keep it URL-safe.
            slugify: (values) =>
              (values?.title ?? "untitled")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Project title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "client",
            label: "Client name",
            description: "Shown on the project card and searchable by visitors.",
          },
          {
            type: "string",
            name: "service",
            label: "Service",
            required: true,
            options: [
              { value: "signage", label: "Signage" },
              { value: "vehicle-graphics", label: "Vehicle graphics" },
              { value: "print-vinyl", label: "Print & vinyl" },
              { value: "engraving-cutting", label: "Engraving & cutting" },
              { value: "building-cladding", label: "Building cladding" },
              { value: "promotional-events", label: "Promotional & events" },
              { value: "maintenance-repair", label: "Maintenance & repair" },
            ],
          },
          {
            type: "string",
            name: "industry",
            label: "Industry",
            required: true,
            options: [
              { value: "retail", label: "Retail" },
              { value: "hospitality", label: "Hospitality" },
              { value: "restaurants", label: "Restaurants" },
              { value: "corporate", label: "Corporate" },
              { value: "healthcare", label: "Healthcare" },
              { value: "automotive", label: "Automotive" },
              { value: "property", label: "Property" },
              { value: "education", label: "Education" },
              { value: "leisure", label: "Leisure" },
            ],
          },
          {
            type: "datetime",
            name: "date",
            label: "Completed",
            ui: { dateFormat: "YYYY-MM-DD" },
          },
          {
            type: "string",
            name: "summary",
            label: "Short description",
            description: "Optional. One or two sentences about the job.",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "ratio",
            label: "Card shape",
            description: "How tall the card sits in the portfolio grid.",
            options: [
              { value: "portrait", label: "Tall" },
              { value: "square", label: "Square" },
              { value: "landscape", label: "Wide" },
            ],
          },
          {
            type: "image",
            name: "photos",
            label: "Photos",
            description: "First photo is the cover shown in the grid.",
            list: true,
            required: true,
          },
        ],
      },
    ],
  },
});
