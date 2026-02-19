# Avatar images

Only **optimized** avatar files are committed. Original sources stay local (or in `scripts/source-avatars/` for regeneration).

---

## What’s in the repo

| Path | In git? | Purpose |
|------|--------|--------|
| `public/images/avatars/*.png`, `*.webp` | ✅ Yes | 128px optimized PNG + WebP used by the app |
| `scripts/source-avatars/` | ✅ Folder only (`.gitkeep`) | Place originals here when you need to regenerate |
| `scripts/source-avatars/*.png` | ❌ No (gitignored) | Your local copy of original large PNGs |

---

## Adding or updating avatars (future)

1. **Put originals in the source folder**  
   Copy your full-size PNGs into `scripts/source-avatars/` with numeric names: `1.png`, `2.png`, … (add new numbers for new avatars, e.g. `78.png`).

2. **Regenerate optimized files**  
   From the project root:
   ```bash
   npm run optimize-avatars
   ```
   This reads `scripts/source-avatars/*.png`, resizes to 128px, and writes:
   - `public/images/avatars/{id}.png` (compressed)
   - `public/images/avatars/{id}.webp`

3. **Commit only the optimized output**  
   ```bash
   git add public/images/avatars/
   git commit -m "chore: update avatars"
   ```
   Do **not** commit the contents of `scripts/source-avatars/` (they are gitignored).

4. **Update the app if needed**  
   If you added new avatar IDs, ensure `constants/settings.js` has the right `TOTAL_AVATARS_COUNT` (and `SEARCHING_AVATAR_IDS` if you use the find-match shuffle).

---

## One-time migration (already done)

If you previously had a `public/images/avatars/128/` folder:

- Running `npm run optimize-avatars` once migrated files from `128/` into `public/images/avatars/` and removed `128/`.
- No further migration steps.

---

## Script reference

- **Command:** `npm run optimize-avatars`
- **Reads:** `scripts/source-avatars/*.png` (files like `1.png`, `2.png`, …)
- **Writes:** `public/images/avatars/{id}.png` and `public/images/avatars/{id}.webp`
- **Requires:** Node and the `sharp` dev dependency (installed with `npm install`)

The app uses these via `useAvatarUrl(id)` and `<picture>` (WebP with PNG fallback) for smaller loads.
