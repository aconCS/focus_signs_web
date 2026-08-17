import AboutContent from "@/components/AboutContent";
import { getPortfolioProjects } from "@/lib/portfolio.server";

/**
 * Thin server shell: the page body is interactive (FAQ accordion) so it lives
 * in a client component, and the portfolio data is read here on the server.
 */
export default function AboutPage() {
  return <AboutContent projects={getPortfolioProjects()} />;
}
