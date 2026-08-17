import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // `admin` is the TinaCMS editor, which is not localised and must not be
  // rewritten to /<locale>/admin or the CMS fails to load.
  matcher: ["/((?!api|trpc|admin|_next|_vercel|.*\\..*).*)"],
};
