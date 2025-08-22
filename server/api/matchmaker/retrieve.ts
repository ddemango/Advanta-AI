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

// Genre mapping (match the UI keys)
const GENRE_ID_MAP: Record<string, { movie?: number|null; tv?: number|null }> = {
  action:{movie:28,tv:10759}, adventure:{movie:12,tv:10759}, animation:{movie:16,tv:16},
  comedy:{movie:35,tv:35}, crime:{movie:80,tv:80}, documentary:{movie:99,tv:99},
  drama:{movie:18,tv:18}, family:{movie:10751,tv:10751}, fantasy:{movie:14,tv:10765},
  history:{movie:36,tv:null}, horror:{movie:27,tv:null}, music:{movie:10402,tv:null},
  mystery:{movie:9648,tv:9648}, romance:{movie:10749,tv:null}, scifi:{movie:878,tv:10765},
  thriller:{movie:53,tv:9648}, war:{movie:10752,tv:10768}, western:{movie:37,tv:37},
  sports:{movie:null,tv:null}, // fallback keyword filter below
};

function genreParamFor(media:'movie'|'tv', keys:string[]) {
  const ids = keys
    .map(k => GENRE_ID_MAP[k]?.[media])
    .filter((x): x is number => typeof x === 'number');
  return ids.length ? ids.join(',') : null;
}

function textHas(wordList: string[], item: any) {
  const hay = `${item.title || ''} ${item.overview || ''}`.toLowerCase();
  return wordList.some(w => hay.includes(w));
}

function poster(path?: string | null) {
  return path ? `${IMG_BASE}${path}` : undefined;
}

function apiKey() {
  const k = process.env.TMDB_API_KEY;
  if (!k) throw new Error('TMDB_API_KEY not set');
  return k;
}

async function pjToJsonSafe(res: any) {
  try { return await res.json(); } catch { return {}; }
}

export async function POST(req: Request, res: Response) {
  try {
    const {
      services,
      timeWindow = 120,
      languages = ['en-US'],
      mediaTypes = ['movie', 'tv'],
      genres = [],
      yearFrom,
      yearTo,
      ratings = [],
      count = 100
    } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: 'services required' });
    }

    const region = process.env.WATCH_REGION || 'US';
    const providers = services
      .map((s: string) => SERVICE_TO_TMDB_PROVIDER[s])
      .filter(Boolean)
      .join('|');

    const discover = async (media: 'movie' | 'tv') => {
      const withGenres = genreParamFor(media, genres);
      const params = new URLSearchParams({
        api_key: apiKey(),
        language: languages[0] || 'en-US',
        sort_by: 'popularity.desc',
        watch_region: region,
        ...(providers ? { with_watch_providers: providers } : {}),
        ...(withGenres ? { with_genres: withGenres } : {}),
        ...(media === 'movie' && timeWindow
          ? { 'with_runtime.lte': String(timeWindow + 20) }
          : {}),
        // Add year range filtering
        ...(yearFrom ? { 'primary_release_date.gte': `${yearFrom}-01-01` } : {}),
        ...(yearTo ? { 'primary_release_date.lte': `${yearTo}-12-31` } : {}),
      });

      const response = await fetch(`${TMDB_BASE}/discover/${media}?${params}`);
      if (!response.ok) throw new Error(`discover ${media} ${response.status}`);
      
      const json = await response.json();
      return (json.results || [])
        .slice(0, Math.ceil(count / (mediaTypes as string[]).length))
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
    const candidates = lists.flat();

    // Extract US certification from TMDB data
    const movieCert = (dj: any, region: string) => {
      const r = dj.release_dates?.results?.find((x: any) => x.iso_3166_1 === region) ||
                dj.release_dates?.results?.find((x: any) => x.iso_3166_1 === "US");
      return r?.release_dates?.map((rd: any) => rd.certification).find((c: string) => c && c.trim()) || "";
    };

    const tvCert = (dj: any, region: string) => {
      const r = dj.content_ratings?.results?.find((x: any) => x.iso_3166_1 === region) ||
                dj.content_ratings?.results?.find((x: any) => x.iso_3166_1 === "US");
      return r?.rating || "";
    };

    // Enrich first N with runtime + providers + certification (keeps TMDb calls reasonable)
    const detail = async (item: any) => {
      const detailResponse = await fetch(
        `${TMDB_BASE}/${item.media_type}/${item.id}?api_key=${apiKey()}&append_to_response=release_dates,content_ratings`
      );
      const detailJson = detailResponse.ok ? await detailResponse.json() : {};
      const runtime =
        item.media_type === 'movie'
          ? detailJson.runtime
          : detailJson.episode_run_time?.[0] || undefined;

      // Extract US (or region) certification
      const certification = item.media_type === "movie" 
        ? movieCert(detailJson, region) 
        : tvCert(detailJson, region);

      const providerResponse = await fetch(
        `${TMDB_BASE}/${item.media_type}/${item.id}/watch/providers?api_key=${apiKey()}`
      );
      const providerJson = providerResponse.ok
        ? await pjToJsonSafe(providerResponse)
        : {};
      const regionInfo = (providerJson as any)?.results?.[region];
      const normalize = (arr?: any[]) => arr?.map((p) => p.provider_name) || [];

      return {
        ...item,
        runtime,
        certification, // Add certification to returned item
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

    let enriched = await Promise.all(candidates.slice(0, 40).map(detail)); // enrich top 40

    let items = enriched;

    // Sports: not a TMDb genre; filter by common words
    if (genres.includes('sports')) {
      const hasSports = (it: any) => {
        const hay = `${it.title || ""} ${it.overview || ""}`.toLowerCase();
        return [
          "sport", "sports", "soccer", "football", "nba", "nfl", "mlb", "baseball", "basketball",
          "hockey", "tennis", "ufc", "mma", "boxing", "golf", "f1", "formula 1", "wrestling"
        ].some(w => hay.includes(w));
      };
      items = items.filter(hasSports);
    }

    // TV "Horror" fallback: use textual hints if TV genre missing
    if (genres.includes('horror')) {
      items = items.filter(it =>
        it.media_type === 'movie' ? true :
        textHas(['horror','haunted','ghost','vampire','zombie','slasher','possession','supernatural'], it)
      );
    }

    // MPAA / TV rating enforcement (movies: exact; tv: mapped)
    if (ratings.length) {
      // Map film ratings to TV equivalents for mixed content (only used if TV is requested)
      const mpaaToTv: Record<string, string> = { 
        G: "TV-G", 
        PG: "TV-PG", 
        "PG-13": "TV-14", 
        R: "TV-MA", 
        NR: "NR" 
      };

      const allowedMovies = new Set(ratings);
      const allowedTv = new Set(ratings.map((r: string) => mpaaToTv[r]).filter(Boolean));

      items = items.filter((it: any) => {
        const cert = (it.certification || "").toUpperCase().replace(/\s+/g, '');
        if (it.media_type === "movie") {
          if (allowedMovies.has("NR")) {
            return cert === "NR" || cert === "" || /NOTRATED|UNRATED/i.test(it.certification || "");
          }
          return allowedMovies.has(cert);
        } else {
          if (allowedTv.has("NR")) {
            return cert === "NR" || cert === "" || /NOTRATED|UNRATED/i.test(it.certification || "");
          }
          return allowedTv.size ? allowedTv.has(cert) : true; // if only movies selected, don't exclude tv here
        }
      });
    }

    res.json({ items, total: items.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'retrieve_failed' });
  }
}