export type AvatarUrls = { png: string; webp: string }

/**
 * Returns optimized avatar URLs (128px PNG + WebP). Only these optimized files
 * are committed in public/images/avatars/. Originals live in scripts/source-avatars/ (gitignored).
 *
 * Use with <picture>: <source :srcset="urls.webp" type="image/webp"><img :src="urls.png">
 */
export function useAvatarUrl(avatarId: number): AvatarUrls {
  const base = '/images/avatars'
  return {
    png: `${base}/${avatarId}.png`,
    webp: `${base}/${avatarId}.webp`,
  }
}
