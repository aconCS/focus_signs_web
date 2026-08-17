import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Step 1 of the Decap CMS "self-hosted OAuth" flow: the admin UI opens this
 * route in a popup, we redirect to GitHub's consent screen, GitHub redirects
 * back to /api/callback.
 *
 * The `state` value is the CSRF defense — GitHub echoes it back on the
 * callback, and we reject anything that doesn't match the cookie we set here.
 * It is stored in an httpOnly cookie so client-side script (including any
 * injected via XSS elsewhere on the site) cannot read or forge it.
 */

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing GITHUB_OAUTH_CLIENT_ID", { status: 500 });
  }

  const state = crypto.randomBytes(24).toString("hex");
  const redirectUri = new URL("/api/callback", req.url).toString();

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user:email");
  authorizeUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authorizeUrl);
  res.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    // GitHub OAuth apps typically use one callback URL for prod and a
    // separate app for local dev over http:// — see content/README.md.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/callback",
    maxAge: 600,
  });
  return res;
}
