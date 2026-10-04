/**
 * Background Removal Service
 * Lazy-loads @imgly/background-removal to isolate character artwork from the background in-browser.
 * Provides resilient fallback to framed artwork on CORS restrictions, WASM errors, or timeouts.
 */

const cutoutCache = new Map<string, string>();

export async function removeCharacterBackground(imageUrl: string): Promise<string | null> {
  if (!imageUrl) return null;
  if (cutoutCache.has(imageUrl)) {
    return cutoutCache.get(imageUrl)!;
  }

  try {
    // Dynamic import to keep initial bundle size lean
    const imgly = await import('@imgly/background-removal');
    const removeBackground = imgly.removeBackground || (imgly as any).default;

    if (typeof removeBackground !== 'function') {
      return null;
    }

    const removalPromise = removeBackground(imageUrl, {
      progress: (_key: string, _curr: number, _tot: number) => {},
      output: { format: 'image/png', quality: 0.88 }
    });

    // 8-second safety timeout so users are never blocked if model download is slow
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Background removal timeout')), 8000)
    );

    const blob = await Promise.race([removalPromise, timeoutPromise]);
    if (blob && blob instanceof Blob) {
      const objectUrl = URL.createObjectURL(blob);
      cutoutCache.set(imageUrl, objectUrl);
      return objectUrl;
    }
  } catch (err: any) {
    // Silent graceful fallback: CORS headers on cdn.myanimelist.net or unsupported WASM
    console.info('[LivingPortrait] Background removal unavailable, falling back to framed portrait:', err?.message || err);
  }

  return null;
}
