/**
 * Syncs `content/projects/*.json` with the photo folders on disk.
 *
 * Photo folders are the source of truth for WHICH photos a project has —
 * dropping files into `public/photos/portfolio/<service>/<slug>/` and re-running
 * this picks them up. Everything an editor types in the CMS (title, client,
 * industry, date) is preserved on re-run; only `photos`, `service` and `ratio`
 * are recomputed.
 *
 * Run: node scripts/sync-projects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const photoRoot = path.join(root, "public", "photos", "portfolio");
const contentDir = path.join(root, "content", "projects");

/**
 * Best-guess industry per project, used only when a project is first created.
 * Once the file exists the CMS value wins, so wrong guesses are cheap to fix.
 */
const INDUSTRY_GUESS = {
  "harbour-medical-wrap": "healthcare",
  "kindergarten-wall-decals": "education",
  "polycarpou-keo-wall-wrap": "retail",
  aristotelis: "corporate",
  "artio-3d-letter": "hospitality",
  "ceiling-led-panels": "corporate",
  "led-channel-letters": "corporate",
  "metal-letter-e": "corporate",
  "parking-print-vinyl": "corporate",
  "art-fashion-rollup": "retail",
  "dentist-rollup": "healthcare",
  "event-backdrop-ballroom": "corporate",
  "greekby-rollup": "corporate",
  "be-on": "corporate",
  "beach-bar": "hospitality",
  "best-food-cyprus": "restaurants",
  bloom: "retail",
  "building-for-rent": "property",
  "by-velcheva-boutique": "retail",
  calzature: "retail",
  "coral-bay-clinic": "healthcare",
  "crocs-coming-soon": "retail",
  "cube-cyta": "retail",
  "dental-clinic-fkiara": "healthcare",
  "elicious-burger-house": "restaurants",
  "elinas-tools": "retail",
  "elinn-hotel": "hospitality",
  ergopro: "corporate",
  ergotherapia: "healthcare",
  "eu-foods": "retail",
  "eye-contact": "retail",
  "for-sale-signs": "property",
  frontistirio: "education",
  "gym-wall-decal": "leisure",
  "harbour-medical-branch": "healthcare",
  "husqvarna-kyprianou": "retail",
  "kissos-flower": "retail",
  ladore: "retail",
  mahimos: "corporate",
  "malberry-park": "hospitality",
  mandria: "corporate",
  "maria-papadimitriou": "corporate",
  michaella: "retail",
  "mito-developers": "property",
  "nails-permanent-makeup": "retail",
  "olias-homes": "property",
  "panther-cuts-barbershop": "retail",
  "parking-sign-plates": "corporate",
  "poppy-flower-boutique": "retail",
  poseidonio: "hospitality",
  "pr-anything-on-wheel": "automotive",
  "pylon-monument-sign": "corporate",
  "raftis-sunset-breeze-villas": "property",
  "rc-cafe": "restaurants",
  "red-elements": "retail",
  "right-care-clinic": "healthcare",
  "rimini-ristorante": "restaurants",
  "sandy-beach-bar": "hospitality",
  "sense-by-the-beach": "hospitality",
  "shisha-house": "hospitality",
  sozos: "corporate",
  "speech-care": "healthcare",
  "the-social-marketing": "corporate",
  "under-study-project": "property",
  veranta: "restaurants",
  "waterpark-park-signage": "leisure",
  "athinodorou-truck": "corporate",
  "erb-asfalistiki-bus": "corporate",
  "food-truck-wrap": "restaurants",
  "scania-bus-swirl": "corporate",
  "valkyrian-investments-truck": "corporate",
  "van-curve-wrap": "corporate",
  "waterpark-bus": "leisure",
  "waterpark-car": "leisure",
};

/** Slugs whose title-cased form reads wrong. */
const TITLE_OVERRIDE = {
  "rc-cafe": "RC Café",
  "pr-anything-on-wheel": "PR Anything On Wheel",
  "eu-foods": "EU Foods",
  "cube-cyta": "Cube Cyta",
  "erb-asfalistiki-bus": "ERB Asfalistiki Bus",
  "led-channel-letters": "LED Channel Letters",
  "ceiling-led-panels": "Ceiling LED Panels",
  "artio-3d-letter": "Artio 3D Letter",
  "polycarpou-keo-wall-wrap": "Polycarpou KEO Wall Wrap",
  "metal-letter-e": "Metal Letter E",
};

function titleFromSlug(slug) {
  return (
    TITLE_OVERRIDE[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function ratioFor(width, height) {
  const r = width / height;
  if (r > 1.15) return "landscape";
  if (r < 0.85) return "portrait";
  return "square";
}

function listDirs(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => fs.statSync(path.join(dir, f)).isDirectory())
    .sort();
}

const services = listDirs(photoRoot);
fs.mkdirSync(contentDir, { recursive: true });

let created = 0;
let updated = 0;
let dayOffset = 0;
const seen = new Set();

for (const service of services) {
  for (const slug of listDirs(path.join(photoRoot, service))) {
    const dir = path.join(photoRoot, service, slug);
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
    if (files.length === 0) continue;

    seen.add(slug);
    const photos = files.map((f) => `/photos/portfolio/${service}/${slug}/${f}`);
    const meta = await sharp(path.join(dir, files[0])).metadata();

    const target = path.join(contentDir, `${slug}.json`);
    const existing = fs.existsSync(target)
      ? JSON.parse(fs.readFileSync(target, "utf8"))
      : null;

    // Editor-owned fields survive a re-sync; disk-derived ones are recomputed.
    const record = {
      title: existing?.title ?? titleFromSlug(slug),
      client: existing?.client ?? titleFromSlug(slug),
      service,
      industry: existing?.industry ?? INDUSTRY_GUESS[slug] ?? "corporate",
      date:
        existing?.date ??
        new Date(Date.now() - dayOffset * 86_400_000).toISOString().slice(0, 10),
      ratio: ratioFor(meta.width, meta.height),
      photos,
    };
    if (existing?.summary) record.summary = existing.summary;

    dayOffset += 3;
    fs.writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`);
    if (existing) updated += 1;
    else created += 1;
  }
}

// Content files whose photo folder disappeared would render broken images.
const orphans = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((slug) => !seen.has(slug));

console.log(`created ${created}, updated ${updated}`);
if (orphans.length) {
  console.log(`\norphaned (folder gone, file kept for review):`);
  for (const o of orphans) console.log(`  content/projects/${o}.json`);
}
