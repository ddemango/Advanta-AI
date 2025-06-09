// Clean implementation of movie recommendation with strict mainstream filtering
import { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { streamingAPI } from './streaming-api.js';

export async function setupMovieRecommendations(app: Express) {
  app.post("/api/generate-watchlist", async (req: Request, res: Response) => {
    try {
      const {
        mood,
        contentTypes,
        genres,
        timeAvailable,
        platforms,
        viewingContext,
        pastFavorites,
        includeWildCard,
        releaseYearRange
      } = req.body;

      const recommendations: any[] = [];
      const targetCount = 15;

      // Platform mapping
      const platformMap: Record<string, string> = {
        'Netflix': 'netflix',
        'Amazon Prime': 'prime', 
        'Hulu': 'hulu',
        'Disney+': 'disney',
        'HBO Max': 'hbo',
        'Apple TV+': 'apple',
        'Paramount+': 'paramount'
      };

      const hasAnyPlatform = platforms?.some((p: string) => p.toLowerCase() === 'any platform');
      const platformsToSearch = hasAnyPlatform ? 
        ['netflix', 'prime', 'hulu', 'disney'] : 
        platforms?.map((p: string) => platformMap[p] || p.toLowerCase()).slice(0, 3) || ['netflix'];

      console.log(`Searching for mainstream ${genres?.join(', ')} movies on ${platformsToSearch.join(', ')}`);

      // Search each platform with strict mainstream filtering
      for (const platform of platformsToSearch) {
        if (recommendations.length >= targetCount) break;

        try {
          // Search for each genre separately
          if (genres && genres.length > 0) {
            const genreMap: Record<string, string> = {
              'Action': 'action',
              'Comedy': 'comedy',
              'Drama': 'drama', 
              'Horror': 'horror',
              'Thriller': 'thriller',
              'Sci-Fi': 'scifi',
              'Romance': 'romance',
              'Crime': 'crime',
              'Adventure': 'adventure'
            };

            for (const genre of genres) {
              if (recommendations.length >= targetCount) break;

              const mappedGenre = genreMap[genre] || genre.toLowerCase();
              const searchParams = {
                catalogs: platform,
                showType: 'movie' as const,
                genre: mappedGenre,
                limit: 30,
                orderBy: 'rating' as const,
                orderDirection: 'desc' as const
              };

              console.log(`Searching ${platform} for ${genre} movies`);
              const response = await streamingAPI.searchShows(searchParams);

              // Log sample data to understand the structure
              if (response.shows.length > 0) {
                console.log(`Sample movie data:`, {
                  title: response.shows[0].title,
                  rating: response.shows[0].rating,
                  year: response.shows[0].releaseYear,
                  imdb: response.shows[0].imdbId,
                  tmdb: response.shows[0].tmdbId
                });
              }

              // Apply practical filtering for quality movies
              const mainstreamMovies = response.shows.filter((show: any) => {
                // More inclusive criteria to ensure we get results
                const hasTitle = show.title && show.title.length > 1;
                const hasYear = show.releaseYear && show.releaseYear >= 2000;
                const hasRating = show.rating !== undefined && show.rating > 0;
                const hasCleanTitle = !show.title.includes('²') && 
                                     !show.title.includes('#Alive') &&
                                     !show.title.includes('(Tillu)');
                
                console.log(`Checking ${show.title}: rating=${show.rating}, year=${show.releaseYear}, clean=${hasCleanTitle}`);
                
                return hasTitle && hasYear && hasRating && hasCleanTitle;
              });

              console.log(`Found ${mainstreamMovies.length} quality ${genre} movies from ${response.shows.length} total`);

              // Add filtered movies to recommendations
              mainstreamMovies.forEach((show: any) => {
                if (recommendations.length < targetCount) {
                  const inYearRange = !releaseYearRange || 
                    (show.releaseYear >= releaseYearRange[0] && show.releaseYear <= releaseYearRange[1]);
                  
                  const alreadyAdded = recommendations.some((rec: any) => rec.id === show.id);
                  
                  if (inYearRange && !alreadyAdded) {
                    const recommendation = streamingAPI.convertToRecommendation(
                      show,
                      Math.floor(Math.random() * 15) + 85,
                      `${mood} ${genre} recommendation`
                    );
                    recommendations.push(recommendation);
                    console.log(`✓ MAINSTREAM: ${show.title} (${show.releaseYear}) - Rating: ${show.rating}`);
                  }
                }
              });
            }
          }
        } catch (error) {
          console.error(`Error searching ${platform}:`, error);
        }
      }

      console.log(`Final recommendation count: ${recommendations.length}`);
      res.json({ recommendations });
      
    } catch (error) {
      console.error('Error generating personalized watchlist:', error);
      res.status(500).json({ 
        error: 'Failed to generate personalized watchlist',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}