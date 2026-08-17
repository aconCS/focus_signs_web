# Portfolio content

Each file in `projects/` is one portfolio project. They are the source of truth
for the portfolio grid, the home page gallery, the hero slideshow, and the cover
images on the services and industries pages — there is no database.

## Editing

- **CMS** — open `/admin` on the deployed site (needs the one-time setup below).
- **By hand** — edit the JSON directly.

## Adding photos in bulk

Drop images into `public/photos/portfolio/<service>/<slug>/` and run:

    npm run sync:projects

That creates a content file for any new folder and refreshes the photo list on
existing ones. Fields an editor owns — title, client, industry, date, summary —
are never overwritten, so it is safe to re-run.

## Connecting the CMS (one-time)

The editor is [Decap CMS](https://decapcms.org) — free, open source, no
per-project account limit. It authenticates through a GitHub OAuth App and a
small OAuth backend already built into this repo
(`src/app/api/auth`, `src/app/api/callback`) — no third-party service sits
between your client and GitHub.

1. **Create a GitHub OAuth App** at
   https://github.com/settings/developers → *New OAuth App*.
   - Homepage URL: your production URL (e.g. `https://focussigns.cy`)
   - Redirect URIs (GitHub allows up to 10 — add both, one per line):
     - `https://focussigns.cy/api/callback`
     - `http://localhost:3000/api/callback` (optional, only if you want to
       test the CMS locally)
   - Leave "Allow wildcard matching" and "Enable Device Flow" unchecked.
2. **Copy the Client ID**, then generate and copy a **Client Secret**.
3. **Add two environment variables in Vercel** (Project Settings → Environment
   Variables), Production scope:
   - `GITHUB_OAUTH_CLIENT_ID`
   - `GITHUB_OAUTH_CLIENT_SECRET`
   For local testing, put the same two values in `.env.local` (gitignored).
4. Redeploy. Your client can now open `/admin`, sign in with their own GitHub
   account, and edit.

`base_url` in the CMS config is filled in automatically from whatever host
served the request (`src/app/api/admin-config/route.ts`) — it resolves to
`http://localhost:3000` when you're running `npm run dev` and to your real
domain once deployed, so there's nothing to edit or forget to revert between
the two.

## Access control

Anyone can start the GitHub login flow, but `/api/callback` checks — using the
real GitHub API, not just trusting the OAuth screen — that the signed-in
account has **push access to this exact repository** before it hands back a
usable session. Accounts without write access get rejected outright. To let
someone edit, add them as a collaborator on the GitHub repo; to revoke access,
remove them there — nothing to manage in the CMS itself.

## Notes

- The first photo in `photos` is the cover shown in grids.
- New projects created through the CMS store photos under
  `public/photos/portfolio/<slug>/`, without the `<service>/` folder the
  original 74 projects use — the app doesn't care either way, since it reads
  whatever paths are listed in each project's `photos` field rather than
  scanning folders.
- `date` values on the original 74 projects were generated when the photos
  were first imported and are not real completion dates.
- `industry` values on the original 74 projects were guessed from the project
  name and are worth reviewing.
