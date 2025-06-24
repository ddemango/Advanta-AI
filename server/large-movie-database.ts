export interface Movie {
  imdbId: string;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  runtime: number;
}

export function generateLargeMovieDatabase(): Movie[] {
  const movies: Movie[] = [];
  let movieId = 1000000;

  // Add authentic War movies
  const warMovies = [
    { title: 'Saving Private Ryan', year: 1998 }, { title: 'Platoon', year: 1986 }, { title: 'Apocalypse Now', year: 1979 },
    { title: 'Full Metal Jacket', year: 1987 }, { title: 'Born on the Fourth of July', year: 1989 }, { title: 'We Were Soldiers', year: 2002 },
    { title: 'Black Hawk Down', year: 2001 }, { title: 'The Thin Red Line', year: 1998 }, { title: 'Hamburger Hill', year: 1987 },
    { title: 'Good Morning, Vietnam', year: 1987 }, { title: 'The Deer Hunter', year: 1978 }, { title: 'Coming Home', year: 1978 },
    { title: 'The Best Years of Our Lives', year: 1946 }, { title: 'The Bridge on the River Kwai', year: 1957 }, { title: 'The Great Escape', year: 1963 },
    { title: 'Lawrence of Arabia', year: 1962 }, { title: 'Patton', year: 1970 }, { title: 'All Quiet on the Western Front', year: 1930 },
    { title: 'Paths of Glory', year: 1957 }, { title: 'Dr. Strangelove', year: 1964 }, { title: 'M*A*S*H', year: 1970 },
    { title: 'The Longest Day', year: 1962 }, { title: 'A Bridge Too Far', year: 1977 }, { title: 'Das Boot', year: 1981 },
    { title: 'Come and See', year: 1985 }, { title: 'The Battle of Algiers', year: 1966 }, { title: 'Gallipoli', year: 1981 },
    { title: 'Glory', year: 1989 }, { title: 'Gettysburg', year: 1993 }, { title: 'Gods and Generals', year: 2003 },
    { title: 'The Patriot', year: 2000 }, { title: 'Braveheart', year: 1995 }, { title: 'Kingdom of Heaven', year: 2005 },
    { title: 'Troy', year: 2004 }, { title: 'Alexander', year: 2004 }, { title: '300', year: 2006 },
    { title: 'Gladiator', year: 2000 }, { title: 'Ben-Hur', year: 1959 }, { title: 'Spartacus', year: 1960 },
    { title: 'The Last Samurai', year: 2003 }, { title: 'Letters from Iwo Jima', year: 2006 }, { title: 'Flags of Our Fathers', year: 2006 },
    { title: 'Pearl Harbor', year: 2001 }, { title: 'Tora! Tora! Tora!', year: 1970 }, { title: 'Midway', year: 1976 },
    { title: 'They Were Expendable', year: 1945 }, { title: 'Thirty Seconds Over Tokyo', year: 1944 }, { title: 'The Sands of Iwo Jima', year: 1949 },
    { title: 'From Here to Eternity', year: 1953 }, { title: 'The Caine Mutiny', year: 1954 }, { title: 'Mister Roberts', year: 1955 },
    { title: 'The Enemy Below', year: 1957 }, { title: 'Run Silent, Run Deep', year: 1958 }, { title: 'The Guns of Navarone', year: 1961 },
    { title: 'Where Eagles Dare', year: 1968 }, { title: 'Kelly\'s Heroes', year: 1970 }, { title: 'The Dirty Dozen', year: 1967 },
    { title: 'The Wild Geese', year: 1978 }, { title: 'Force 10 from Navarone', year: 1978 }, { title: 'The Boys from Brazil', year: 1978 },
    { title: 'Apocalypse Now Redux', year: 2001 }, { title: 'The Hurt Locker', year: 2008 }, { title: 'Zero Dark Thirty', year: 2012 },
    { title: 'American Sniper', year: 2014 }, { title: '13 Hours', year: 2016 }, { title: 'Dunkirk', year: 2017 },
    { title: '1917', year: 2019 }, { title: 'They Shall Not Grow Old', year: 2018 }, { title: 'Hacksaw Ridge', year: 2016 },
    { title: 'Fury', year: 2014 }, { title: 'Lone Survivor', year: 2013 }, { title: 'Act of Valor', year: 2012 },
    { title: 'Green Zone', year: 2010 }, { title: 'Stop-Loss', year: 2008 }, { title: 'In the Valley of Elah', year: 2007 },
    { title: 'Home of the Brave', year: 2006 }, { title: 'Jarhead', year: 2005 }, { title: 'Three Kings', year: 1999 },
    { title: 'Courage Under Fire', year: 1996 }, { title: 'A Few Good Men', year: 1992 }, { title: 'Top Gun', year: 1986 },
    { title: 'An Officer and a Gentleman', year: 1982 }, { title: 'The Right Stuff', year: 1983 }, { title: 'Stripes', year: 1981 },
    { title: 'Private Benjamin', year: 1980 }, { title: 'The Boys in Company C', year: 1978 }, { title: 'Go Tell the Spartans', year: 1978 },
    { title: 'Who\'ll Stop the Rain', year: 1978 }, { title: 'Rolling Thunder', year: 1977 }, { title: 'Taxi Driver', year: 1976 },
    { title: 'The Man in the Glass Booth', year: 1975 }, { title: 'The Wind and the Lion', year: 1975 }, { title: 'The Man Who Would Be King', year: 1975 },
    { title: 'Zulu', year: 1964 }, { title: 'Zulu Dawn', year: 1979 }, { title: 'The Battle of Britain', year: 1969 },
    { title: 'Battle of the Bulge', year: 1965 }, { title: 'Sink the Bismarck!', year: 1960 }, { title: 'They Were Not Divided', year: 1950 },
    { title: 'Twelve O\'Clock High', year: 1949 }, { title: 'Command Decision', year: 1948 }, { title: 'The Story of G.I. Joe', year: 1945 },
    { title: 'Bataan', year: 1943 }, { title: 'Air Force', year: 1943 }, { title: 'Guadalcanal Diary', year: 1943 },
    { title: 'Wake Island', year: 1942 }, { title: 'Mrs. Miniver', year: 1942 }, { title: 'Flying Tigers', year: 1942 }
  ];

  // Add War movies
  for (const movieData of warMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['War'],
      rating: 6.0 + Math.random() * 3.5,
      runtime: 90 + Math.floor(Math.random() * 60)
    });
  }

  // Add authentic Western movies
  const westernMovies = [
    { title: 'The Good, the Bad and the Ugly', year: 1966 }, { title: 'Unforgiven', year: 1992 }, { title: 'True Grit', year: 2010 },
    { title: 'Butch Cassidy and the Sundance Kid', year: 1969 }, { title: 'The Magnificent Seven', year: 1960 }, { title: 'Tombstone', year: 1993 },
    { title: 'Dances with Wolves', year: 1990 }, { title: 'The Man Who Shot Liberty Valance', year: 1962 }, { title: 'Rio Bravo', year: 1959 },
    { title: 'High Noon', year: 1952 }, { title: 'The Searchers', year: 1956 }, { title: 'Shane', year: 1953 }, { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'A Fistful of Dollars', year: 1964 }, { title: 'For a Few Dollars More', year: 1965 }, { title: 'The Wild Bunch', year: 1969 },
    { title: 'Gunfight at the O.K. Corral', year: 1957 }, { title: 'The Treasure of the Sierra Madre', year: 1948 }, { title: 'Cat Ballou', year: 1965 },
    { title: 'Blazing Saddles', year: 1974 }, { title: 'Young Guns', year: 1988 }, { title: 'Wyatt Earp', year: 1994 }, { title: 'Maverick', year: 1994 },
    { title: 'The Quick and the Dead', year: 1995 }, { title: 'Open Range', year: 2003 }, { title: '3:10 to Yuma', year: 2007 },
    { title: 'Appaloosa', year: 2008 }, { title: 'The Assassination of Jesse James', year: 2007 }, { title: 'Hell or High Water', year: 2016 },
    { title: 'Wind River', year: 2017 }, { title: 'The Ballad of Buster Scruggs', year: 2018 }, { title: 'Hostiles', year: 2017 },
    { title: 'The Sisters Brothers', year: 2018 }, { title: 'News of the World', year: 2020 }, { title: 'The Power of the Dog', year: 2021 },
    { title: 'The Harder They Fall', year: 2021 }, { title: 'Old Henry', year: 2021 }, { title: 'Cry Macho', year: 2021 },
    { title: 'The Lone Ranger', year: 2013 }, { title: 'Cowboys & Aliens', year: 2011 }, { title: 'Rango', year: 2011 },
    { title: 'True Grit', year: 1969 }, { title: 'The Outlaw Josey Wales', year: 1976 }, { title: 'Pale Rider', year: 1985 },
    { title: 'Silverado', year: 1985 }, { title: 'Young Sherlock Holmes', year: 1985 }, { title: 'The Man from Snowy River', year: 1982 },
    { title: 'Quigley Down Under', year: 1990 }, { title: 'Geronimo: An American Legend', year: 1993 }, { title: 'Legends of the Fall', year: 1994 },
    { title: 'The Last of the Mohicans', year: 1992 }, { title: 'Deadwood', year: 2019 }, { title: 'Godless', year: 2017 },
    { title: 'Westworld', year: 1973 }, { title: 'Wild Wild West', year: 1999 }, { title: 'The Lone Ranger', year: 1956 },
    { title: 'Bonanza', year: 1959 }, { title: 'Gunsmoke', year: 1955 }, { title: 'Rawhide', year: 1959 },
    { title: 'The Rifleman', year: 1958 }, { title: 'Have Gun – Will Travel', year: 1957 }, { title: 'Wagon Train', year: 1957 },
    { title: 'The Virginian', year: 1962 }, { title: 'Big Valley', year: 1965 }, { title: 'The High Chaparral', year: 1967 },
    { title: 'Alias Smith and Jones', year: 1971 }, { title: 'Little House on the Prairie', year: 1974 }, { title: 'Dr. Quinn, Medicine Woman', year: 1993 },
    { title: 'Deadwood', year: 2004 }, { title: 'Hell on Wheels', year: 2011 }, { title: 'Westworld', year: 2016 },
    { title: 'Godless', year: 2017 }, { title: '1883', year: 2021 }, { title: 'Yellowstone', year: 2018 }
  ];

  // Add Western movies
  for (const movieData of westernMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Western'],
      rating: 5.5 + Math.random() * 4.0,
      runtime: 85 + Math.floor(Math.random() * 75)
    });
  }

  // Add authentic Horror movies
  const horrorMovies = [
    { title: 'The Exorcist', year: 1973 }, { title: 'Halloween', year: 1978 }, { title: 'A Nightmare on Elm Street', year: 1984 },
    { title: 'Friday the 13th', year: 1980 }, { title: 'Scream', year: 1996 }, { title: 'The Shining', year: 1980 },
    { title: 'Psycho', year: 1960 }, { title: 'Alien', year: 1979 }, { title: 'The Thing', year: 1982 }, { title: 'Poltergeist', year: 1982 },
    { title: 'The Texas Chain Saw Massacre', year: 1974 }, { title: 'Rosemary\'s Baby', year: 1968 }, { title: 'The Omen', year: 1976 },
    { title: 'Carrie', year: 1976 }, { title: 'Pet Sematary', year: 1989 }, { title: 'It', year: 2017 }, { title: 'Hereditary', year: 2018 },
    { title: 'Get Out', year: 2017 }, { title: 'A Quiet Place', year: 2018 }, { title: 'The Conjuring', year: 2013 },
    { title: 'Insidious', year: 2010 }, { title: 'Paranormal Activity', year: 2007 }, { title: 'The Ring', year: 2002 },
    { title: 'The Grudge', year: 2004 }, { title: 'Saw', year: 2004 }, { title: 'Hostel', year: 2005 }, { title: 'The Descent', year: 2005 },
    { title: 'Sinister', year: 2012 }, { title: 'The Babadook', year: 2014 }, { title: 'It Follows', year: 2014 },
    { title: 'The Witch', year: 2015 }, { title: 'Midsommar', year: 2019 }, { title: 'Us', year: 2019 }, { title: 'Nope', year: 2022 },
    { title: 'X', year: 2022 }, { title: 'Scream', year: 2022 }, { title: 'The Black Phone', year: 2021 }, { title: 'Malignant', year: 2021 },
    { title: 'Last Night in Soho', year: 2021 }, { title: 'Candyman', year: 2021 }, { title: 'Saint Maud', year: 2019 },
    { title: 'The Invisible Man', year: 2020 }, { title: 'Doctor Sleep', year: 2019 }, { title: 'Ready or Not', year: 2019 },
    { title: 'The Lighthouse', year: 2019 }, { title: 'Color Out of Space', year: 2019 }, { title: 'The Platform', year: 2019 },
    { title: 'His House', year: 2020 }, { title: 'Relic', year: 2020 }, { title: 'The Wailing', year: 2016 },
    { title: 'Train to Busan', year: 2016 }, { title: 'The Handmaiden', year: 2016 }, { title: 'Raw', year: 2016 },
    { title: 'Don\'t Breathe', year: 2016 }, { title: 'Lights Out', year: 2016 }, { title: 'The Conjuring 2', year: 2016 },
    { title: 'Ouija: Origin of Evil', year: 2016 }, { title: 'Split', year: 2016 }, { title: 'Annabelle: Creation', year: 2017 },
    { title: 'Happy Death Day', year: 2017 }, { title: 'The Ritual', year: 2017 }, { title: 'Gerald\'s Game', year: 2017 },
    { title: '1922', year: 2017 }, { title: 'The Dark Tower', year: 2017 }, { title: 'Annihilation', year: 2018 },
    { title: 'The Nun', year: 2018 }, { title: 'Halloween', year: 2018 }, { title: 'Suspiria', year: 2018 },
    { title: 'Bird Box', year: 2018 }, { title: 'Mandy', year: 2018 }, { title: 'Climax', year: 2018 }, { title: 'Cam', year: 2018 },
    { title: 'Overlord', year: 2018 }, { title: 'The House with a Clock in Its Walls', year: 2018 }, { title: 'Scary Stories to Tell in the Dark', year: 2019 },
    { title: 'Child\'s Play', year: 2019 }, { title: 'Pet Sematary', year: 2019 }, { title: 'The Curse of La Llorona', year: 2019 },
    { title: 'Brightburn', year: 2019 }, { title: 'Ma', year: 2019 }, { title: 'Crawl', year: 2019 }, { title: '47 Meters Down: Uncaged', year: 2019 },
    { title: 'In the Tall Grass', year: 2019 }, { title: 'Countdown', year: 2019 }, { title: 'Zombieland: Double Tap', year: 2019 },
    { title: 'Black Christmas', year: 2019 }, { title: 'The Turning', year: 2020 }, { title: 'The Grudge', year: 2020 },
    { title: 'Fantasy Island', year: 2020 }, { title: 'The Hunt', year: 2020 }, { title: 'A Quiet Place Part II', year: 2020 },
    { title: 'Antlers', year: 2021 }, { title: 'Old', year: 2021 }, { title: 'Fear Street Part One: 1994', year: 2021 },
    { title: 'Fear Street Part Two: 1978', year: 2021 }, { title: 'Fear Street Part Three: 1666', year: 2021 },
    { title: 'The Forever Purge', year: 2021 }, { title: 'Spiral', year: 2021 }
  ];

  // Add Horror movies
  for (const movieData of horrorMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Horror'],
      rating: 6.0 + Math.random() * 3.5,
      runtime: 80 + Math.floor(Math.random() * 50)
    });
  }

  // Add other genres with placeholder data for now
  const genres = ['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Mystery', 'Fantasy', 'Sci-Fi', 'Animation', 'Biography', 'Crime', 'Documentary', 'Family', 'History', 'Music', 'Sport', 'Adventure'];
  
  for (const genre of genres) {
    for (let i = 0; i < 100; i++) {
      movies.push({
        imdbId: `tt${movieId++}`,
        title: `${genre} Movie ${i + 1}`,
        year: 1950 + Math.floor(Math.random() * 74),
        genres: [genre],
        rating: 5.0 + Math.random() * 5.0,
        runtime: 80 + Math.floor(Math.random() * 60)
      });
    }
  }

  return movies;
}

export function getMoviePlot(title: string): string {
  return "A compelling story that will captivate audiences.";
}

export function getMovieDirector(title: string): string {
  return "Acclaimed Director";
}

export function getMovieCast(title: string): string[] {
  return ["Talented Cast"];
}

export function getMoviePoster(title: string): string {
  return "https://via.placeholder.com/300x450/333/fff?text=No+Poster";
}

export function getStreamingPlatforms(title: string): string[] {
  const platforms = ["Netflix", "Amazon Prime", "Disney+", "Hulu", "HBO Max", "Peacock", "Apple TV+", "Paramount+", "Available for Rent"];
  const numPlatforms = Math.floor(Math.random() * 3) + 1;
  const shuffled = platforms.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPlatforms);
}