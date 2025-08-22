import { Request, Response } from 'express';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const SERVICE_TO_TMDB_PROVIDER: Record<string, number> = {
  netflix: 8,
  prime: 9,
  disney: 337,
  hulu: 15,
  max: 384,
  peacock: 387,
  paramount: 531,
  apple: 350,
};

function poster(path?: string | null) {
  return path ? `${IMG_BASE}${path}` : undefined;
}

function apiKey() {
  const k = process.env.TMDB_API_KEY;
  if (!k) throw new Error('TMDB_API_KEY not set');
  return k;
}

export async function POST(req: Request, res: Response) {
  try {
    const {
      services,
      timeWindow,
      languages = ['en-US'],
      mediaTypes = ['movie', 'tv'],
      count = 100
    } = req.body;

    if (!services?.length) {
      return res.status(400).json({ error: 'services required' });
    }

    const region = process.env.WATCH_REGION || 'US';
    const providers = services
      .map((s: string) => SERVICE_TO_TMDB_PROVIDER[s])
      .filter(Boolean)
      .join('|');

    const discover = async (media: 'movie' | 'tv') => {
      const params = new URLSearchParams({
        api_key: apiKey(),
        language: languages[0] || 'en-US',
        sort_by: 'popularity.desc',
        watch_region: region,
        ...(providers ? { with_watch_providers: providers } : {}),
        ...(media === 'movie' && timeWindow
          ? { 'with_runtime.lte': String(timeWindow + 20) }
          : {}),
      });

      const response = await fetch(`${TMDB_BASE}/discover/${media}?${params}`);
      if (!response.ok) throw new Error(`discover ${media} ${response.status}`);
      
      const json = await response.json();
      return (json.results || [])
        .slice(0, Math.ceil(count / mediaTypes.length))
        .map((item: any) => ({
          id: item.id,
          media_type: media,
          title: media === 'movie' ? item.title : item.name,
          year: (item.release_date || item.first_air_date)?.slice(0, 4)
            ? Number((item.release_date || item.first_air_date).slice(0, 4))
            : undefined,
          overview: item.overview || '',
          poster_url: poster(item.poster_path),
          tmdb_url: `https://www.themoviedb.org/${media}/${item.id}`,
          popularity: item.popularity,
          genres: item.genre_ids || [],
        }));
    };

    // Fetch candidates
    const lists = await Promise.all(
      (mediaTypes as ('movie' | 'tv')[]).map(discover)
    );
    let items = lists.flat();

    // Enrich first N with runtime + providers (keeps TMDb calls reasonable)
    const detail = async (item: any) => {
      const detailResponse = await fetch(
        `${TMDB_BASE}/${item.media_type}/${item.id}?api_key=${apiKey()}`
      );
      const detailJson = detailResponse.ok ? await detailResponse.json() : {};
      const runtime =
        item.media_type === 'movie'
          ? detailJson.runtime
          : detailJson.episode_run_time?.[0] || undefined;

      const providerResponse = await fetch(
        `${TMDB_BASE}/${item.media_type}/${item.id}/watch/providers?api_key=${apiKey()}`
      );
      const providerJson = providerResponse.ok
        ? await providerResponse.json()
        : {};
      const regionInfo = providerJson.results?.[region];
      const normalize = (arr?: any[]) => arr?.map((p) => p.provider_name) || [];

      return {
        ...item,
        runtime,
        providers: regionInfo
          ? {
              flatrate: normalize(regionInfo.flatrate),
              ads: normalize(regionInfo.ads),
              rent: normalize(regionInfo.rent),
              buy: normalize(regionInfo.buy),
            }
          : {},
      };
    };

    const enriched = await Promise.all(items.slice(0, 40).map(detail)); // enrich top 40
    res.json({ items: enriched, total: enriched.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'retrieve_failed' });
  }
}