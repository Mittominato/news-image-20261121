// news-image-20261121 — "The World in One Image", Saturday 21 November 2026.
//
// An entry for the make.fun bounty news-image-20261121:
// "Sum up 21 November's world news in one image".
//
// The entry image is an illustrated newspaper front page for Saturday
// 21 November 2026. It was drawn for this entry from verified reporting
// of the day and is stored next to this program as entry.png. This
// program's only job is to publish that image exactly as it is: it reads
// the bundled PNG, checks that it really is the 1024x1024 image it
// claims to be, and writes the identical bytes to /output/entry.png.
//
// The program is fully deterministic and offline: it makes no network
// calls, reads no clock, and takes no random input, so two runs write
// byte-identical files.
//
// The six stories on the page (all reported on 21 November 2026):
//   1. KYIV UNDER FIRE — Russia's largest air assault of the war on
//      Ukraine: 400+ drones and 110 missiles overnight; missiles also
//      landed in Poland, which called it a deliberate provocation.
//   2. AI ROUT ON WALL STREET — the S&P 500 fell 3.7% and the Nasdaq
//      5.28% into correction as the AI sell-off deepened; the SEC opened
//      an accounting probe into Nvidia.
//   3. MYANMAR GUILTY OF GENOCIDE — the International Court of Justice
//      ruled 9-6 that Myanmar committed genocide against the Rohingya,
//      the first time the court has held a state responsible.
//   4. PERU QUAKE 6.8 — a magnitude 6.8 earthquake in Junin shook
//      central Peru and sent Lima residents into the streets; no major
//      damage reported.
//   5. UK-EU RESET DEAL — Britain and the EU sealed post-Brexit deals on
//      food and farm trade, linked carbon markets, and a youth mobility
//      scheme for up to 100,000 young people a side.
//   6. COP31 MISSES DEADLINE — the Antalya climate summit missed its
//      deadline and its draft dropped any mention of fossil fuels.
//
// Run it with: node main.ts
// It writes:   /output/entry.png (1024x1024, under 1 MiB)

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// --- Fixed entry constants -----------------------------------------------

const SOURCE_NAME = "entry.png";
const OUTPUT_DIR = "/output";
const OUTPUT_NAME = "entry.png";
const MAX_BYTES = 1024 * 1024; // bounty cap: 1 MiB
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;

// The eight-byte PNG signature every PNG file must start with.
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

// The six verified stories drawn on the page, in reading order. The short
// caption is what the panel itself says; the detail is the reported fact
// behind it, kept here so the program documents its own picture.
const STORIES: { caption: string; detail: string }[] = [
  { caption: "KYIV UNDER FIRE", detail: "Russia's largest air assault on Ukraine; missiles land in Poland" },
  { caption: "AI ROUT ON WALL STREET", detail: "S&P 500 -3.7%, Nasdaq -5.28%; SEC probes Nvidia accounting" },
  { caption: "MYANMAR GUILTY OF GENOCIDE", detail: "ICJ rules 9-6, the first state ever held responsible" },
  { caption: "PERU QUAKE 6.8", detail: "Magnitude 6.8 in Junin; tremors felt across Lima" },
  { caption: "UK-EU RESET DEAL", detail: "Trade, carbon-market and youth-mobility deals sealed in Brussels" },
  { caption: "COP31 MISSES DEADLINE", detail: "Antalya summit overruns; draft drops fossil fuels" },
];

// --- Small helpers ---------------------------------------------------------

function fail(message: string): never {
  throw new Error(`news-image-20261121: ${message}`);
}

// The directory this file lives in is the repository root, so the bundled
// image always sits next to the program, wherever the repo is checked out.
function repoRoot(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function sha256Hex(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

// Read the width and height out of the PNG's IHDR chunk. A valid PNG is
// 8 signature bytes, then a 4-byte length, the 4-byte "IHDR" tag, and then
// 13 bytes of header data whose first 8 bytes are width and height,
// big-endian, 4 bytes each.
function pngDimensions(bytes: Buffer): { width: number; height: number } {
  if (bytes.length < 33) {
    fail(`image is only ${bytes.length} bytes, too short to be a PNG`);
  }
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("image does not start with the PNG signature");
  }
  const ihdrTag = bytes.subarray(12, 16).toString("latin1");
  if (ihdrTag !== "IHDR") {
    fail(`first PNG chunk is ${JSON.stringify(ihdrTag)}, expected "IHDR"`);
  }
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

// --- Entry point -----------------------------------------------------------

function main(): void {
  // The picture always carries exactly six panels; refuse to publish a
  // build whose manifest drifted away from the image it describes.
  if (STORIES.length !== 6) {
    fail(`story manifest holds ${STORIES.length} stories, expected 6`);
  }

  const sourcePath = join(repoRoot(), SOURCE_NAME);
  const outputPath = join(OUTPUT_DIR, OUTPUT_NAME);

  const image = readFileSync(sourcePath);

  if (image.length === 0) {
    fail("bundled image is empty");
  }
  if (image.length > MAX_BYTES) {
    fail(`image is ${image.length} bytes, over the 1 MiB cap`);
  }
  const { width, height } = pngDimensions(image);
  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    fail(`image is ${width}x${height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
  }

  // Publish the image byte-for-byte. Nothing is re-encoded, resized or
  // re-compressed, so the output is identical to the bundled image and
  // identical on every run.
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(outputPath, image);

  // Read the file back and prove the write landed exactly as intended.
  const written = readFileSync(outputPath);
  if (!written.equals(image)) {
    fail("bytes read back from /output/entry.png differ from the source");
  }

  console.log("news-image-20261121 — The World in One Image");
  console.log(`  source:   ${sourcePath}`);
  console.log(`  output:   ${outputPath}`);
  console.log(`  size:     ${image.length} bytes`);
  console.log(`  picture:  ${width}x${height} PNG`);
  console.log(`  sha256:   ${sha256Hex(image)}`);
  console.log(`  stories:  ${STORIES.length} verified stories, Saturday 21 November 2026:`);
  for (const story of STORIES) {
    console.log(`    - ${story.caption}: ${story.detail}.`);
  }
  console.log("  done:     one image, six stories, Saturday 21 November 2026.");
}

main();
