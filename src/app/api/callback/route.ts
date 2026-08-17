import { NextRequest, NextResponse } from "next/server";

/**
 * Step 2 of the Decap CMS OAuth flow. GitHub redirects here with `code` and
 * `state`. This exchanges the code for a token, then hands the token back to
 * the admin UI via postMessage using the exact handshake Decap's client-side
 * OAuth code expects (see decapEditorHtml below).
 *
 * Security properties:
 * - `state` must match the httpOnly cookie set in /api/auth — rejects any
 *   callback that didn't originate from a request we issued (CSRF).
 * - The GitHub client secret never reaches the browser — the code-for-token
 *   exchange happens in this server handler only.
 * - Before returning a usable token, we verify the authenticated GitHub user
 *   actually has push access to this exact repo. This means anyone who
 *   completes GitHub's consent screen but isn't a collaborator gets nothing
 *   usable back, even if the OAuth app itself doesn't restrict who can start
 *   the flow — access is enforced against live GitHub ACLs, not just trust in
 *   the OAuth exchange.
 * - The postMessage handshake only replies to same-origin messages, and only
 *   targets the same origin — a page other than our own /admin cannot fish
 *   the token out of this popup.
 */

export const runtime = "nodejs";

const REPO = process.env.GITHUB_REPO ?? "aconCS/focus_signs_web";

function decapEditorHtml(message: string) {
  // `message` is produced with JSON.stringify below, so it is always a safe
  // JS string literal — no manual escaping of interpolated values.
  return `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          if (e.origin !== window.location.origin) return;
          window.opener.postMessage(${message}, e.origin);
          window.removeEventListener("message", receiveMessage);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", window.location.origin);
      })();
    </script>
  </body>
</html>`;
}

function htmlResponse(body: string) {
  return new NextResponse(body, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function errorResponse(reason: string) {
  const message = JSON.stringify(`authorization:github:error:${reason}`);
  return htmlResponse(decapEditorHtml(message));
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  if (url.searchParams.get("error")) {
    return errorResponse("GitHub login was cancelled.");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("decap_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return errorResponse("Login attempt expired or was invalid. Close this window and try again.");
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return errorResponse("Server is missing GitHub OAuth configuration.");
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL("/api/callback", req.url).toString(),
    }),
  });

  if (!tokenRes.ok) {
    return errorResponse("GitHub token exchange failed.");
  }
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const token = tokenData.access_token;
  if (!token) {
    return errorResponse("GitHub did not return an access token.");
  }

  const repoRes = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: {
      authorization: `token ${token}`,
      accept: "application/vnd.github+json",
    },
  });
  const repoData = (await repoRes.json().catch(() => null)) as {
    permissions?: { push?: boolean };
  } | null;

  if (!repoRes.ok || !repoData?.permissions?.push) {
    return errorResponse(
      "Your GitHub account does not have write access to this repository."
    );
  }

  const successMessage = JSON.stringify(
    `authorization:github:success:${JSON.stringify({ token, provider: "github" })}`
  );
  const res = htmlResponse(decapEditorHtml(successMessage));
  res.cookies.delete("decap_oauth_state");
  return res;
}
