/**
 * VideoService — resolves playable video URLs for course materials.
 *
 * Supports three providers:
 *  - youtube  → converts watch?v=... or youtu.be/... to embed URL
 *  - vimeo    → converts vimeo.com/ID to player.vimeo.com/video/ID
 *  - supabase → generates a 1-hour signed URL from Supabase Storage
 */
import type { VideoProvider } from '@/lms/data/catalog';

export interface VideoResolution {
    embedUrl: string;
    provider: VideoProvider;
    /** Signed URL TTL in seconds (only relevant for supabase provider). */
    ttl?: number;
}

export class VideoService {
    /**
     * Resolve a video URL to an embeddable or streamable URL.
     *
     * @param rawUrl   - Original URL stored in the database / catalog.
     * @param provider - Hosting provider hint.
     * @param bucketPath - Supabase Storage object path (only needed for 'supabase' provider).
     */
    async resolveVideoUrl(
        rawUrl: string,
        provider: VideoProvider,
        bucketPath?: string,
    ): Promise<VideoResolution> {
        switch (provider) {
            case 'youtube':
                return { embedUrl: this.toYouTubeEmbed(rawUrl), provider };
            case 'vimeo':
                return { embedUrl: this.toVimeoEmbed(rawUrl), provider };
            case 'supabase':
                return this.toSupabaseSignedUrl(bucketPath ?? rawUrl);
            default:
                return { embedUrl: rawUrl, provider };
        }
    }

    // ── YouTube ──────────────────────────────────────────────────────────────

    private toYouTubeEmbed(url: string): string {
        // Already an embed URL
        if (url.includes('youtube.com/embed/')) return url;

        // youtu.be/VIDEO_ID
        const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

        // youtube.com/watch?v=VIDEO_ID
        const watchMatch = url.match(/[?&]v=([^&]+)/);
        if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

        // Fallback — return as-is
        return url;
    }

    // ── Vimeo ─────────────────────────────────────────────────────────────────

    private toVimeoEmbed(url: string): string {
        // Already an embed URL
        if (url.includes('player.vimeo.com/video/')) return url;

        // vimeo.com/VIDEO_ID
        const match = url.match(/vimeo\.com\/(\d+)/);
        if (match) return `https://player.vimeo.com/video/${match[1]}`;

        return url;
    }

    // ── Supabase Storage ──────────────────────────────────────────────────────

    private async toSupabaseSignedUrl(path: string): Promise<VideoResolution> {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        const isMock = !supabaseUrl || supabaseUrl.includes('dummy');

        if (isMock) {
            // Return a placeholder embed URL in mock mode
            return {
                embedUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ?mock=1&path=${encodeURIComponent(path)}`,
                provider: 'supabase',
                ttl: 3600,
            };
        }

        try {
            const { createClient } = await import('@supabase/supabase-js');
            const client = createClient(supabaseUrl!, supabaseKey!);

            const { data, error } = await client
                .storage
                .from('curso-videos')
                .createSignedUrl(path, 3600); // 1 hour TTL

            if (error || !data?.signedUrl) {
                throw new Error(error?.message ?? 'Failed to create signed URL');
            }

            return { embedUrl: data.signedUrl, provider: 'supabase', ttl: 3600 };
        } catch (err) {
            console.error('[VideoService] Supabase signed URL failed:', err);
            return { embedUrl: path, provider: 'supabase', ttl: 0 };
        }
    }
}
