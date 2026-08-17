# Portfolio content

Each file in `projects/` is one portfolio project. They are the source of truth
for the portfolio grid, the home page gallery, the hero slideshow, and the cover
images on the services and industries pages — there is no database.

## Editing

Two ways in, both writing the same files:

- **CMS** — `npm run dev:cms`, then open http://localhost:3000/admin.
  In production this is `https://<site>/admin` once Tina Cloud is connected.
- **By hand** — edit the JSON directly.

## Adding photos in bulk

Drop images into `public/photos/portfolio/<service>/<slug>/` and run:

    npm run sync:projects

That creates a content file for any new folder and refreshes the photo list on
existing ones. Fields an editor owns — title, client, industry, date, summary —
are never overwritten, so it is safe to re-run.

## Connecting Tina Cloud (one-time, required for the live CMS)

The local CMS works with no account. Editing on the deployed site needs one:

1. Sign up at https://app.tina.io and create a project pointing at this repo.
2. Add the two values it gives you to Vercel's environment variables:
   - `NEXT_PUBLIC_TINA_CLIENT_ID`
   - `TINA_TOKEN`
3. Change the `build` script in `package.json` to `build:cms`, so the admin UI
   is generated at deploy time:

       "build": "tinacms build && next build"

Until step 3 the site builds and deploys normally, just without `/admin`.

## Notes

- The first photo in `photos` is the cover shown in grids.
- `date` values were generated when the photos were first imported and are not
  real completion dates — worth correcting as projects are edited.
- `industry` values were guessed from the project name and should be reviewed.
