import { NextRequest, NextResponse } from "next/server";

/**
 * Serves public/admin/config.template.yml with `base_url` filled in from the
 * request's own origin, so the same file works unmodified on localhost, a
 * Vercel preview URL, and production — nobody has to hand-edit a domain
 * before testing locally, and there's nothing to forget to revert before
 * deploying.
 *
 * next.config.ts rewrites /admin/config.yml here, so Decap (which fetches
 * config.yml relative to /admin/index.html by default) never knows this
 * isn't a static file.
 */

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");

  const templatePath = path.join(
    process.cwd(),
    "public",
    "admin",
    "config.template.yml"
  );
  const template = await fs.readFile(templatePath, "utf8");
  const yaml = template.replace("__BASE_URL__", req.nextUrl.origin);

  return new NextResponse(yaml, {
    headers: { "content-type": "text/yaml; charset=utf-8" },
  });
}
