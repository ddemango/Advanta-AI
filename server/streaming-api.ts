/**
 * RapidAPI Streaming Availability Service
 * Fetches authentic movie and TV show data with real streaming information
 */

interface StreamingService {
  id: string;
  name: string;
  homePage: string;
  themeColorCode: string;
}

interface StreamingOption {
  service: StreamingService;
  type: string;
  quality: string;
  addOn?: {
    id: string;
    name: string;
  };
  link: string;
  videoLink?: string;
  audios: Array<{
    language: string;
    region: string;
  }>;
  subtitles: Array<{
    closedCaptions: boolean;
    locale: {
      language: string;
      region: string;
    };
  }>;
  price?: {
    amount: string;
    currency: string;
    formatted: string;
  };
  expiresSoon: boolean;
  availableSince: number;
}

interface Show {
  id: string;
  imdbId: string;
  tmdbId: string;
  title: string;
  overview: string;
  releaseYear: number;
  originalTitle: string;
  genres: Array<{
    id: string;
    name: string;
  }>;
  directors: string[];
  cast: string[];
  rating: number;
  runtime: number;
  imageSet: {
    verticalPoster: {
      w240: string;
      w360: string;
      w480: string;
      w600: string;
      w720: string;
    };
    horizontalPoster: {
      w360: string;
      w480: string;
      w720: string;
      w1080: string;
      w1440: string;
    };
    verticalBackdrop: {
      w240: string;
      w360: string;
      w480: string;
      w600: string;
      w720: string;
    };
    horizontalBackdrop: {
      w360: string;
      w480: string;
      w720: string;
      w1080: string;
      w1440: string;
    };
  };
  streamingOptions: {
    [country: string]: StreamingOption[];
  };
  showType: 'movie' | 'series';
  firstAirYear?: number;
  lastAirYear?: number;
  seasonCount?: number;
  episodeCount?: number;
}

interface SearchResponse {
  shows: Show[];
  hasMore: boolean;
  nextCursor?: string;
}

class StreamingAPI {
  private apiKey: string;
  private baseUrl = 'https://streaming-availability.p.rapidapi.com';

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
    if (!this.apiKey) {
      throw new Error('RAPIDAPI_KEY environment variable is required');
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`RapidAPI request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search for shows by filters
   */
  async searchShows(params: {
    country?: string;
    genre?: string;
    orderBy?: 'original_title' | 'rating' | 'release_date';
    orderDirection?: 'asc' | 'desc';
    showType?: 'movie' | 'series';
    catalogs?: string;
    outputLanguage?: string;
    limit?: number;
    cursor?: string;
  }): Promise<SearchResponse> {
    const searchParams: Record<string, string> = {
      country: params.country || 'us',
      orderBy: params.orderBy || 'rating',
      orderDirection: params.orderDirection || 'desc',
      outputLanguage: params.outputLanguage || 'en',
      limit: (params.limit || 25).toString()
    };

    if (params.genre) searchParams.genre = params.genre;
    if (params.showType) searchParams.showType = params.showType;
    if (params.catalogs) searchParams.catalogs = params.catalogs;
    if (params.cursor) searchParams.cursor = params.cursor;

    return this.makeRequest('/shows/search/filters', searchParams);
  }

  /**
   * Get popular shows by platform
   */
  async getPopularShows(params: {
    service: string; // netflix, prime, hulu, disney, hbo, etc
    country?: string;
    showType?: 'movie' | 'series';
    limit?: number;
  }): Promise<SearchResponse> {
    return this.searchShows({
      catalogs: params.service,
      country: params.country,
      showType: params.showType,
      limit: params.limit,
      orderBy: 'rating',
      orderDirection: 'desc'
    });
  }

  /**
   * Get shows by genre
   */
  async getShowsByGenre(params: {
    genre: string;
    showType?: 'movie' | 'series';
    country?: string;
    limit?: number;
    orderBy?: 'rating' | 'release_date';
  }): Promise<SearchResponse> {
    const genreMap: Record<string, string> = {
      'Action': 'action',
      'Comedy': 'comedy',
      'Drama': 'drama',
      'Horror': 'horror',
      'Thriller': 'thriller',
      'Sci-Fi': 'scifi',
      'Fantasy': 'fantasy',
      'Romance': 'romance',
      'Crime': 'crime',
      'Documentary': 'documentary',
      'Animation': 'animation',
      'Adventure': 'adventure',
      'Family': 'family',
      'Mystery': 'mystery',
      'War': 'war',
      'Western': 'western',
      'Music': 'music',
      'History': 'history',
      'Biography': 'biography',
      'Sport': 'sport'
    };

    const mappedGenre = genreMap[params.genre] || params.genre.toLowerCase();

    return this.searchShows({
      genre: mappedGenre,
      showType: params.showType,
      country: params.country,
      limit: params.limit,
      orderBy: params.orderBy || 'rating'
    });
  }

  /**
   * Get show details by ID
   */
  async getShowById(id: string, country: string = 'us'): Promise<Show> {
    return this.makeRequest(`/shows/${id}`, { country });
  }

  /**
   * Convert API response to our recommendation format
   */
  convertToRecommendation(show: Show, matchScore: number = 85, reason: string = 'Recommended for you'): any {
    const usStreamingOptions = show.streamingOptions?.us || [];
    const serviceNames = usStreamingOptions.map(option => option.service.name);
    const uniqueServices: string[] = [];
    serviceNames.forEach(name => {
      if (uniqueServices.indexOf(name) === -1) {
        uniqueServices.push(name);
      }
    });
    const platforms = uniqueServices;
    
    return {
      id: show.id,
      title: show.title,
      year: show.releaseYear,
      contentType: show.showType === 'series' ? 'tv_show' : 'movie',
      genre: show.genres.map(g => g.name),
      rating: show.rating || 7.0,
      runtime: show.runtime || (show.showType === 'series' ? 45 : 120),
      platform: platforms.length > 0 ? platforms : ['Streaming'],
      description: show.overview || 'No description available',
      matchScore,
      reasonForRecommendation: reason,
      poster: show.imageSet?.verticalPoster?.w480 || show.imageSet?.verticalPoster?.w360 || '',
      backdrop: show.imageSet?.horizontalBackdrop?.w720 || '',
      imdbId: show.imdbId,
      tmdbId: show.tmdbId,
      streamingOptions: usStreamingOptions,
      ...(show.showType === 'series' && {
        seasons: show.seasonCount || 1,
        episodes: show.episodeCount || 10
      })
    };
  }
}

export const streamingAPI = new StreamingAPI();
export type { Show, StreamingOption, SearchResponse };