/**
 * Optimize avatar images: resize to 128px and output compressed PNG + WebP.
 * Run: npm run optimize-avatars
 * Reads: scripts/source-avatars/*.png (gitignored; place original PNGs here)
 * Writes: public/images/avatars/{id}.png, public/images/avatars/{id}.webp (only these are committed)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT, 'scripts', 'source-avatars')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'avatars')
const LEGACY_128_DIR = path.join(OUT_DIR, '128')
const MAX_SIZE = 128
const PNG_COMPRESSION = 9
const WEBP_QUALITY = 82

// One-time migration: move 128/* into public/images/avatars/ so we don't keep two copies in git
let didMigration = false
if (fs.existsSync(LEGACY_128_DIR)) {
  console.log('Migrating 128/ into public/images/avatars/ ...')
  const legacyFiles = fs.readdirSync(LEGACY_128_DIR)
  fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const f of legacyFiles) {
    fs.copyFileSync(path.join(LEGACY_128_DIR, f), path.join(OUT_DIR, f))
  }
  fs.rmSync(LEGACY_128_DIR, { recursive: true })
  console.log('Done.\n')
  didMigration = true
}

if (!fs.existsSync(SRC_DIR)) {
  if (didMigration) process.exit(0)
  console.error('Source directory not found:', SRC_DIR)
  console.error('Create it and add original avatar PNGs (1.png, 2.png, ...) to regenerate optimized files.')
  process.exit(1)
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.png') && /^\d+\.png$/.test(f))
console.log(`Found ${files.length} avatars to optimize.`)

let totalBefore = 0
let totalAfterPng = 0
let totalAfterWebp = 0

await Promise.all(
  files.map(async (file) => {
    const id = path.basename(file, '.png')
    const srcPath = path.join(SRC_DIR, file)
    const pngPath = path.join(OUT_DIR, `${id}.png`)
    const webpPath = path.join(OUT_DIR, `${id}.webp`)

    const stat = fs.statSync(srcPath)
    totalBefore += stat.size

    const pipeline = sharp(srcPath).resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })

    const [pngBuf, webpBuf] = await Promise.all([
      pipeline.clone().png({ compressionLevel: PNG_COMPRESSION }).toBuffer(),
      pipeline.clone().webp({ quality: WEBP_QUALITY }).toBuffer(),
    ])

    fs.writeFileSync(pngPath, pngBuf)
    fs.writeFileSync(webpPath, webpBuf)
    totalAfterPng += pngBuf.length
    totalAfterWebp += webpBuf.length

    console.log(`  ${file} -> ${id}.png (${(pngBuf.length / 1024).toFixed(1)} KB), ${id}.webp (${(webpBuf.length / 1024).toFixed(1)} KB)`)
  })
)

console.log('\nDone.')
console.log(`  Original total: ${(totalBefore / 1024).toFixed(1)} KB`)
console.log(`  PNG 128 total:  ${(totalAfterPng / 1024).toFixed(1)} KB`)
console.log(`  WebP 128 total: ${(totalAfterWebp / 1024).toFixed(1)} KB`)
