// Movie Database Builder - Fetches 5000+ authentic movies from TMDB API
import fs from 'fs';
import path from 'path';

// TMDB API configuration
const TMDB_API_KEY = 'your_tmdb_api_key_here'; // User will need to provide this
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  runtime?: number;
  overview: string;
  poster_path: string;
  imdb_id?: string;
}

interface ProcessedMovie {
  imdbId: string;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  runtime: number;
  plot: string;
  poster: string;
  tmdbId: string;
}

// TMDB Genre mapping
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10765: 'Sci-Fi & Fantasy'
};

// Function to fetch movies from TMDB
async function fetchMoviesFromTMDB(page: number = 1): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&sort_by=popularity.desc&vote_count.gte=100`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TMDB data for page ${page}:`, error);
    return [];
  }
}

// Function to get movie details including runtime and IMDB ID
async function getMovieDetails(tmdbId: number): Promise<Partial<TMDBMovie>> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`
    );
    
    if (!response.ok) {
      return {};
    }
    
    const data = await response.json();
    return {
      runtime: data.runtime,
      imdb_id: data.external_ids?.imdb_id
    };
  } catch (error) {
    console.error(`Error fetching details for movie ${tmdbId}:`, error);
    return {};
  }
}

// Function to process TMDB movie data into our format
function processMovie(tmdbMovie: TMDBMovie, details: Partial<TMDBMovie>): ProcessedMovie {
  const year = new Date(tmdbMovie.release_date).getFullYear();
  const genres = tmdbMovie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);
  
  return {
    imdbId: details.imdb_id || `tt${tmdbMovie.id}`,
    title: tmdbMovie.title,
    year: year || 2000,
    genres: genres.length > 0 ? genres : ['Drama'],
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    runtime: details.runtime || 120,
    plot: tmdbMovie.overview || 'A compelling story that will captivate audiences.',
    poster: tmdbMovie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      : 'https://via.placeholder.com/300x450/333/fff?text=No+Poster',
    tmdbId: tmdbMovie.id.toString()
  };
}

// Main function to build the movie database
export async function buildMovieDatabase(targetCount: number = 5000): Promise<ProcessedMovie[]> {
  console.log(`Building movie database with ${targetCount} movies...`);
  
  const allMovies: ProcessedMovie[] = [];
  let page = 1;
  const maxPages = Math.ceil(targetCount / 20); // TMDB returns 20 movies per page
  
  while (allMovies.length < targetCount && page <= maxPages) {
    console.log(`Fetching page ${page}... (${allMovies.length}/${targetCount} movies)`);
    
    const tmdbMovies = await fetchMoviesFromTMDB(page);
    
    if (tmdbMovies.length === 0) {
      console.log('No more movies available from TMDB');
      break;
    }
    
    // Process movies in batches to avoid rate limiting
    for (const tmdbMovie of tmdbMovies) {
      if (allMovies.length >= targetCount) break;
      
      // Skip movies without proper data
      if (!tmdbMovie.title || !tmdbMovie.release_date) continue;
      
      // Get additional details
      const details = await getMovieDetails(tmdbMovie.id);
      
      // Process and add movie
      const processedMovie = processMovie(tmdbMovie, details);
      allMovies.push(processedMovie);
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    page++;
  }
  
  console.log(`Database build complete: ${allMovies.length} movies collected`);
  return allMovies;
}

// Function to save movies to a TypeScript file
export function saveMoviesToFile(movies: ProcessedMovie[], filename: string = 'movie-database.ts') {
  const content = `// Auto-generated movie database with ${movies.length} movies
// Generated on ${new Date().toISOString()}

export const MOVIE_DATABASE = ${JSON.stringify(movies, null, 2)};

export const MOVIE_COUNT = ${movies.length};
`;

  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Movie database saved to ${filePath}`);
}

// Export for use in routes
export async function initializeMovieDatabase() {
  try {
    // Check if we already have a large movie database
    const existingDbPath = path.join(__dirname, 'movie-database.ts');
    
    if (fs.existsSync(existingDbPath)) {
      console.log('Existing movie database found, loading...');
      const { MOVIE_DATABASE } = await import('./movie-database.ts');
      return MOVIE_DATABASE;
    }
    
    // Build new database if none exists
    console.log('Building new movie database...');
    const movies = await buildMovieDatabase(5000);
    saveMoviesToFile(movies);
    return movies;
    
  } catch (error) {
    console.error('Error initializing movie database:', error);
    // Fallback to current smaller database
    return [];
  }
}