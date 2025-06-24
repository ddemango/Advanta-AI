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

  // Add authentic Action movies FIRST
  const actionMovies = [
    { title: 'Die Hard', year: 1988 }, { title: 'Terminator 2: Judgment Day', year: 1991 }, { title: 'Mad Max: Fury Road', year: 2015 },
    { title: 'The Matrix', year: 1999 }, { title: 'John Wick', year: 2014 }, { title: 'Heat', year: 1995 },
    { title: 'Speed', year: 1994 }, { title: 'The Dark Knight', year: 2008 }, { title: 'Iron Man', year: 2008 },
    { title: 'Mission: Impossible', year: 1996 }, { title: 'The Avengers', year: 2012 }, { title: 'Casino Royale', year: 2006 },
    { title: 'Goldeneye', year: 1995 }, { title: 'The Bourne Identity', year: 2002 }, { title: 'Lethal Weapon', year: 1987 },
    { title: 'Bad Boys', year: 1995 }, { title: 'Point Break', year: 1991 }, { title: 'The Rock', year: 1996 },
    { title: 'Face/Off', year: 1997 }, { title: 'Con Air', year: 1997 }, { title: 'Armageddon', year: 1998 },
    { title: 'Independence Day', year: 1996 }, { title: 'Top Gun', year: 1986 }, { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Aliens', year: 1986 }, { title: 'Predator', year: 1987 }, { title: 'Commando', year: 1985 },
    { title: 'First Blood', year: 1982 }, { title: 'The Expendables', year: 2010 }, { title: 'Fast Five', year: 2011 },
    { title: 'Guardians of the Galaxy', year: 2014 }, { title: 'Wonder Woman', year: 2017 }, { title: 'Black Panther', year: 2018 },
    { title: 'Aquaman', year: 2018 }, { title: 'Captain America: The Winter Soldier', year: 2014 }, { title: 'Thor: Ragnarok', year: 2017 },
    { title: 'Doctor Strange', year: 2016 }, { title: 'Ant-Man', year: 2015 }, { title: 'Spider-Man: Homecoming', year: 2017 },
    { title: 'Deadpool', year: 2016 }, { title: 'Logan', year: 2017 }, { title: 'X-Men: Days of Future Past', year: 2014 },
    { title: 'The Wolverine', year: 2013 }, { title: 'Captain Marvel', year: 2019 }, { title: 'Shazam!', year: 2019 },
    { title: 'Venom', year: 2018 }, { title: 'The Incredible Hulk', year: 2008 }, { title: 'Thor', year: 2011 },
    { title: 'Captain America: The First Avenger', year: 2011 }, { title: 'Iron Man 2', year: 2010 }, { title: 'Iron Man 3', year: 2013 },
    { title: 'Avengers: Age of Ultron', year: 2015 }, { title: 'Avengers: Infinity War', year: 2018 }, { title: 'Avengers: Endgame', year: 2019 },
    { title: 'Captain America: Civil War', year: 2016 }, { title: 'Spider-Man: Far From Home', year: 2019 }, { title: 'Spider-Man: No Way Home', year: 2021 },
    { title: 'The Batman', year: 2022 }, { title: 'Dune', year: 2021 }, { title: 'No Time to Die', year: 2021 },
    { title: 'F9: The Fast Saga', year: 2021 }, { title: 'Godzilla vs. Kong', year: 2021 }, { title: 'Mortal Kombat', year: 2021 },
    { title: 'The Suicide Squad', year: 2021 }, { title: 'Black Widow', year: 2021 }, { title: 'Eternals', year: 2021 },
    { title: 'Shang-Chi and the Legend of the Ten Rings', year: 2021 }, { title: 'The King\'s Man', year: 2021 }, { title: 'Matrix Resurrections', year: 2021 },
    { title: 'Uncharted', year: 2022 }, { title: 'Morbius', year: 2022 }, { title: 'Doctor Strange in the Multiverse of Madness', year: 2022 },
    { title: 'Thor: Love and Thunder', year: 2022 }, { title: 'Bullet Train', year: 2022 }, { title: 'Top Gun: Maverick', year: 2022 },
    { title: 'John Wick: Chapter 4', year: 2023 }, { title: 'Fast X', year: 2023 }, { title: 'Indiana Jones and the Dial of Destiny', year: 2023 },
    { title: 'Mission: Impossible – Dead Reckoning Part One', year: 2023 }, { title: 'The Flash', year: 2023 }, { title: 'Transformers: Rise of the Beasts', year: 2023 },
    { title: 'Spider-Man: Across the Spider-Verse', year: 2023 }, { title: 'Guardians of the Galaxy Vol. 3', year: 2023 }, { title: 'Ant-Man and the Wasp: Quantumania', year: 2023 },
    { title: 'Scream VI', year: 2023 }, { title: 'Evil Dead Rise', year: 2023 }, { title: 'John Wick: Chapter 2', year: 2017 },
    { title: 'John Wick: Chapter 3 – Parabellum', year: 2019 }, { title: 'Nobody', year: 2021 }, { title: 'The Equalizer', year: 2014 },
    { title: 'The Equalizer 2', year: 2018 }, { title: 'Taken', year: 2008 }, { title: 'Taken 2', year: 2012 },
    { title: 'Taken 3', year: 2014 }, { title: 'Non-Stop', year: 2014 }, { title: 'The Grey', year: 2011 },
    { title: 'Unknown', year: 2011 }, { title: 'Run All Night', year: 2015 }, { title: 'Cold Pursuit', year: 2019 },
    { title: 'The Commuter', year: 2018 }, { title: 'Honest Thief', year: 2020 }, { title: 'The Marksman', year: 2021 }
  ];

  for (const movieData of actionMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Action'],
      rating: 6.5 + Math.random() * 2.5,
      runtime: 90 + Math.floor(Math.random() * 60)
    });
  }

  // Add authentic Adventure movies
  const adventureMovies = [
    { title: 'Indiana Jones and the Raiders of the Lost Ark', year: 1981 }, { title: 'Pirates of the Caribbean: The Curse of the Black Pearl', year: 2003 }, { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 }, { title: 'The Lord of the Rings: The Return of the King', year: 2003 }, { title: 'The Hobbit: An Unexpected Journey', year: 2012 },
    { title: 'The Hobbit: The Desolation of Smaug', year: 2013 }, { title: 'The Hobbit: The Battle of Five Armies', year: 2014 }, { title: 'Jurassic Park', year: 1993 },
    { title: 'The Mummy', year: 1999 }, { title: 'National Treasure', year: 2004 }, { title: 'The Goonies', year: 1985 },
    { title: 'Back to the Future', year: 1985 }, { title: 'Romancing the Stone', year: 1984 }, { title: 'The Princess Bride', year: 1987 },
    { title: 'The NeverEnding Story', year: 1984 }, { title: 'Labyrinth', year: 1986 }, { title: 'The Dark Crystal', year: 1982 },
    { title: 'Willow', year: 1988 }, { title: 'The Time Machine', year: 2002 }, { title: 'Journey to the Center of the Earth', year: 2008 },
    { title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', year: 2005 }, { title: 'The Chronicles of Narnia: Prince Caspian', year: 2008 }, { title: 'The Chronicles of Narnia: The Voyage of the Dawn Treader', year: 2010 },
    { title: 'Percy Jackson & the Olympians: The Lightning Thief', year: 2010 }, { title: 'Percy Jackson: Sea of Monsters', year: 2013 }, { title: 'The Spiderwick Chronicles', year: 2008 },
    { title: 'Bridge to Terabithia', year: 2007 }, { title: 'Where the Wild Things Are', year: 2009 }, { title: 'The Secret Garden', year: 1993 },
    { title: 'The Indian in the Cupboard', year: 1995 }, { title: 'Jumanji', year: 1995 }, { title: 'Zathura: A Space Adventure', year: 2005 },
    { title: 'The Polar Express', year: 2004 }, { title: 'Hugo', year: 2011 }, { title: 'The Adventures of Tintin', year: 2011 },
    { title: 'Treasure Island', year: 1988 }, { title: 'Robinson Crusoe', year: 1997 }, { title: 'Swiss Family Robinson', year: 1960 },
    { title: 'The Jungle Book', year: 2016 }, { title: 'The Jungle Book', year: 1967 }, { title: 'Tarzan', year: 1999 },
    { title: 'The Lion King', year: 1994 }, { title: 'Finding Nemo', year: 2003 }, { title: 'Finding Dory', year: 2016 },
    { title: 'Moana', year: 2016 }, { title: 'Frozen', year: 2013 }, { title: 'Frozen II', year: 2019 },
    { title: 'Tangled', year: 2010 }, { title: 'Brave', year: 2012 }, { title: 'How to Train Your Dragon', year: 2010 },
    { title: 'How to Train Your Dragon 2', year: 2014 }, { title: 'How to Train Your Dragon: The Hidden World', year: 2019 }, { title: 'Shrek', year: 2001 },
    { title: 'Shrek 2', year: 2004 }, { title: 'Shrek the Third', year: 2007 }, { title: 'Shrek Forever After', year: 2010 },
    { title: 'Madagascar', year: 2005 }, { title: 'Madagascar: Escape 2 Africa', year: 2008 }, { title: 'Madagascar 3: Europe\'s Most Wanted', year: 2012 },
    { title: 'Ice Age', year: 2002 }, { title: 'Ice Age: The Meltdown', year: 2006 }, { title: 'Ice Age: Dawn of the Dinosaurs', year: 2009 },
    { title: 'Ice Age: Continental Drift', year: 2012 }, { title: 'Ice Age: Collision Course', year: 2016 }, { title: 'The Incredibles', year: 2004 },
    { title: 'The Incredibles 2', year: 2018 }, { title: 'Up', year: 2009 }, { title: 'WALL-E', year: 2008 },
    { title: 'Ratatouille', year: 2007 }, { title: 'Cars', year: 2006 }, { title: 'Cars 2', year: 2011 },
    { title: 'Cars 3', year: 2017 }, { title: 'Monsters, Inc.', year: 2001 }, { title: 'Monsters University', year: 2013 },
    { title: 'Toy Story', year: 1995 }, { title: 'Toy Story 2', year: 1999 }, { title: 'Toy Story 3', year: 2010 },
    { title: 'Toy Story 4', year: 2019 }, { title: 'A Bug\'s Life', year: 1998 }, { title: 'Coco', year: 2017 },
    { title: 'Inside Out', year: 2015 }, { title: 'The Good Dinosaur', year: 2015 }, { title: 'Onward', year: 2020 },
    { title: 'Soul', year: 2020 }, { title: 'Luca', year: 2021 }, { title: 'Turning Red', year: 2022 },
    { title: 'Lightyear', year: 2022 }, { title: 'Strange World', year: 2022 }, { title: 'Elemental', year: 2023 },
    { title: 'Indiana Jones and the Temple of Doom', year: 1984 }, { title: 'Indiana Jones and the Last Crusade', year: 1989 }, { title: 'Pirates of the Caribbean: Dead Man\'s Chest', year: 2006 },
    { title: 'Pirates of the Caribbean: At World\'s End', year: 2007 }, { title: 'Pirates of the Caribbean: On Stranger Tides', year: 2011 }, { title: 'Pirates of the Caribbean: Dead Men Tell No Tales', year: 2017 },
    { title: 'National Treasure: Book of Secrets', year: 2007 }, { title: 'The Lost World: Jurassic Park', year: 1997 }, { title: 'Jurassic Park III', year: 2001 },
    { title: 'Jurassic World', year: 2015 }, { title: 'Jurassic World: Fallen Kingdom', year: 2018 }, { title: 'Jurassic World Dominion', year: 2022 },
    { title: 'The Mummy Returns', year: 2001 }, { title: 'The Mummy: Tomb of the Dragon Emperor', year: 2008 }, { title: 'The Mummy', year: 2017 },
    { title: 'Back to the Future Part II', year: 1989 }, { title: 'Back to the Future Part III', year: 1990 }, { title: 'The Jewel of the Nile', year: 1985 }
  ];

  for (const movieData of adventureMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Adventure'],
      rating: 6.0 + Math.random() * 3.0,
      runtime: 85 + Math.floor(Math.random() * 70)
    });
  }

  // Add authentic Comedy movies
  const comedyMovies = [
    { title: 'Anchorman: The Legend of Ron Burgundy', year: 2004 }, { title: 'The Hangover', year: 2009 }, { title: 'Superbad', year: 2007 },
    { title: 'Pineapple Express', year: 2008 }, { title: 'Step Brothers', year: 2008 }, { title: 'Talladega Nights: The Ballad of Ricky Bobby', year: 2006 },
    { title: 'Dodgeball: A True Underdog Story', year: 2004 }, { title: 'Old School', year: 2003 }, { title: 'Wedding Crashers', year: 2005 },
    { title: 'Meet the Parents', year: 2000 }, { title: 'There\'s Something About Mary', year: 1998 }, { title: 'Dumb and Dumber', year: 1994 },
    { title: 'The Mask', year: 1994 }, { title: 'Ace Ventura: Pet Detective', year: 1994 }, { title: 'Liar Liar', year: 1997 },
    { title: 'The Truman Show', year: 1998 }, { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 }, { title: 'Bruce Almighty', year: 2003 },
    { title: 'Yes Man', year: 2008 }, { title: 'The Cable Guy', year: 1996 }, { title: 'Zoolander', year: 2001 },
    { title: 'Tropic Thunder', year: 2008 }, { title: 'Night at the Museum', year: 2006 }, { title: 'Meet the Fockers', year: 2004 },
    { title: 'American Pie', year: 1999 }, { title: 'American Pie 2', year: 2001 }, { title: 'American Wedding', year: 2003 },
    { title: 'Road Trip', year: 2000 }, { title: 'EuroTrip', year: 2004 }, { title: 'Van Wilder', year: 2002 },
    { title: 'Animal House', year: 1978 }, { title: 'Caddyshack', year: 1980 }, { title: 'Stripes', year: 1981 },
    { title: 'Ghostbusters', year: 1984 }, { title: 'Ghostbusters II', year: 1989 }, { title: 'Groundhog Day', year: 1993 },
    { title: 'Tommy Boy', year: 1995 }, { title: 'Black Sheep', year: 1996 }, { title: 'Wayne\'s World', year: 1992 },
    { title: 'Wayne\'s World 2', year: 1993 }, { title: 'The Blues Brothers', year: 1980 }, { title: 'Trading Places', year: 1983 },
    { title: 'Coming to America', year: 1988 }, { title: 'Beverly Hills Cop', year: 1984 }, { title: 'Beverly Hills Cop II', year: 1987 },
    { title: 'The Nutty Professor', year: 1996 }, { title: 'Dr. Dolittle', year: 1998 }, { title: 'Nutty Professor II: The Klumps', year: 2000 },
    { title: 'Rush Hour', year: 1998 }, { title: 'Rush Hour 2', year: 2001 }, { title: 'Rush Hour 3', year: 2007 },
    { title: 'Shanghai Noon', year: 2000 }, { title: 'Shanghai Knights', year: 2003 }, { title: 'The Tuxedo', year: 2002 },
    { title: 'Austin Powers: International Man of Mystery', year: 1997 }, { title: 'Austin Powers: The Spy Who Shagged Me', year: 1999 }, { title: 'Austin Powers in Goldmember', year: 2002 },
    { title: 'The Grand Budapest Hotel', year: 2014 }, { title: 'Moonrise Kingdom', year: 2012 }, { title: 'The Royal Tenenbaums', year: 2001 },
    { title: 'Rushmore', year: 1998 }, { title: 'Bottle Rocket', year: 1996 }, { title: 'The Life Aquatic with Steve Zissou', year: 2004 },
    { title: 'The Darjeeling Limited', year: 2007 }, { title: 'Fantastic Mr. Fox', year: 2009 }, { title: 'Isle of Dogs', year: 2018 },
    { title: 'The French Dispatch', year: 2021 }, { title: 'Asteroid City', year: 2023 }, { title: 'Knives Out', year: 2019 },
    { title: 'Glass Onion: A Knives Out Mystery', year: 2022 }, { title: 'Game Night', year: 2018 }, { title: 'Tag', year: 2018 },
    { title: 'Blockers', year: 2018 }, { title: 'Good Boys', year: 2019 }, { title: 'Booksmart', year: 2019 },
    { title: 'This Is the End', year: 2013 }, { title: 'The Interview', year: 2014 }, { title: 'Neighbors', year: 2014 },
    { title: 'Neighbors 2: Sorority Rising', year: 2016 }, { title: 'Bad Moms', year: 2016 }, { title: 'A Bad Moms Christmas', year: 2017 },
    { title: 'Girls Trip', year: 2017 }, { title: 'Rough Night', year: 2017 }, { title: 'The Hangover Part II', year: 2011 },
    { title: 'The Hangover Part III', year: 2013 }, { title: 'Anchorman 2: The Legend Continues', year: 2013 }, { title: 'Zoolander 2', year: 2016 },
    { title: 'Dumb and Dumber To', year: 2014 }, { title: 'Ace Ventura: When Nature Calls', year: 1995 }, { title: 'The Nutty Professor', year: 1963 },
    { title: 'Beverly Hills Cop III', year: 1994 }, { title: 'Night at the Museum: Battle of the Smithsonian', year: 2009 }, { title: 'Night at the Museum: Secret of the Tomb', year: 2014 },
    { title: 'Meet the Parents', year: 2000 }, { title: 'Little Fockers', year: 2010 }, { title: 'American Reunion', year: 2012 }
  ];

  for (const movieData of comedyMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Comedy'],
      rating: 6.0 + Math.random() * 3.0,
      runtime: 85 + Math.floor(Math.random() * 50)
    });
  }

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
    { title: 'Fury', year: 2014 }, { title: 'Lone Survivor', year: 2013 }, { title: 'Act of Valor', year: 2012 }
  ];

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
    { title: 'Appaloosa', year: 2008 }, { title: 'The Assassination of Jesse James by the Coward Robert Ford', year: 2007 }, { title: 'Hell or High Water', year: 2016 },
    { title: 'Wind River', year: 2017 }, { title: 'The Ballad of Buster Scruggs', year: 2018 }, { title: 'Hostiles', year: 2017 },
    { title: 'The Sisters Brothers', year: 2018 }, { title: 'News of the World', year: 2020 }, { title: 'The Power of the Dog', year: 2021 }
  ];

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
    { title: 'X', year: 2022 }, { title: 'Scream', year: 2022 }, { title: 'The Black Phone', year: 2021 }, { title: 'Malignant', year: 2021 }
  ];

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

  // Add authentic Drama movies
  const dramaMovies = [
    { title: 'The Shawshank Redemption', year: 1994 }, { title: 'The Godfather', year: 1972 }, { title: 'The Godfather Part II', year: 1974 },
    { title: 'Schindler\'s List', year: 1993 }, { title: 'Forrest Gump', year: 1994 }, { title: 'One Flew Over the Cuckoo\'s Nest', year: 1975 },
    { title: 'Goodfellas', year: 1990 }, { title: 'The Departed', year: 2006 }, { title: 'Fight Club', year: 1999 },
    { title: 'Pulp Fiction', year: 1994 }, { title: 'The Green Mile', year: 1999 }, { title: 'There Will Be Blood', year: 2007 },
    { title: 'No Country for Old Men', year: 2007 }, { title: 'Taxi Driver', year: 1976 }, { title: 'Raging Bull', year: 1980 },
    { title: 'The Pianist', year: 2002 }, { title: 'American Beauty', year: 1999 }, { title: 'A Beautiful Mind', year: 2001 },
    { title: 'Rain Man', year: 1988 }, { title: 'Good Will Hunting', year: 1997 }, { title: 'Dead Poets Society', year: 1989 },
    { title: 'Philadelphia', year: 1993 }, { title: 'The Pursuit of Happyness', year: 2006 }, { title: 'Million Dollar Baby', year: 2004 },
    { title: 'Crash', year: 2004 }, { title: 'Mystic River', year: 2003 }, { title: 'Manchester by the Sea', year: 2016 },
    { title: 'Moonlight', year: 2016 }, { title: 'Parasite', year: 2019 }, { title: 'Nomadland', year: 2020 }
  ];

  for (const movieData of dramaMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Drama'],
      rating: 7.0 + Math.random() * 2.5,
      runtime: 100 + Math.floor(Math.random() * 60)
    });
  }

  // Add authentic Romance movies
  const romanceMovies = [
    { title: 'Titanic', year: 1997 }, { title: 'The Notebook', year: 2004 }, { title: 'Casablanca', year: 1942 },
    { title: 'Gone with the Wind', year: 1939 }, { title: 'Ghost', year: 1990 }, { title: 'Pretty Woman', year: 1990 },
    { title: 'Dirty Dancing', year: 1987 }, { title: 'When Harry Met Sally', year: 1989 }, { title: 'Sleepless in Seattle', year: 1993 },
    { title: 'You\'ve Got Mail', year: 1998 }, { title: 'The Princess Bride', year: 1987 }, { title: 'Roman Holiday', year: 1953 },
    { title: 'An Affair to Remember', year: 1957 }, { title: 'Love Actually', year: 2003 }, { title: 'The Holiday', year: 2006 },
    { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 }, { title: 'Her', year: 2013 }, { title: 'La La Land', year: 2016 },
    { title: 'Before Sunrise', year: 1995 }, { title: 'Before Sunset', year: 2004 }, { title: 'Before Midnight', year: 2013 },
    { title: 'The Fault in Our Stars', year: 2014 }, { title: 'A Walk to Remember', year: 2002 }, { title: 'Dear John', year: 2010 },
    { title: 'The Vow', year: 2012 }, { title: 'Safe Haven', year: 2013 }, { title: 'Me Before You', year: 2016 },
    { title: 'Call Me by Your Name', year: 2017 }, { title: 'The Shape of Water', year: 2017 }, { title: 'Marriage Story', year: 2019 }
  ];

  for (const movieData of romanceMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Romance'],
      rating: 6.5 + Math.random() * 2.5,
      runtime: 90 + Math.floor(Math.random() * 50)
    });
  }

  // Add authentic Thriller movies
  const thrillerMovies = [
    { title: 'Psycho', year: 1960 }, { title: 'Vertigo', year: 1958 }, { title: 'North by Northwest', year: 1959 },
    { title: 'Rear Window', year: 1954 }, { title: 'The Birds', year: 1963 }, { title: 'Dial M for Murder', year: 1954 },
    { title: 'Se7en', year: 1995 }, { title: 'The Silence of the Lambs', year: 1991 }, { title: 'Zodiac', year: 2007 },
    { title: 'Gone Girl', year: 2014 }, { title: 'Shutter Island', year: 2010 }, { title: 'The Sixth Sense', year: 1999 },
    { title: 'The Prestige', year: 2006 }, { title: 'Memento', year: 2000 }, { title: 'Inception', year: 2010 },
    { title: 'The Usual Suspects', year: 1995 }, { title: 'L.A. Confidential', year: 1997 }, { title: 'Heat', year: 1995 },
    { title: 'The Fugitive', year: 1993 }, { title: 'Cape Fear', year: 1991 }, { title: 'Fatal Attraction', year: 1987 },
    { title: 'Basic Instinct', year: 1992 }, { title: 'Single White Female', year: 1992 }, { title: 'Misery', year: 1990 },
    { title: 'The Hand That Rocks the Cradle', year: 1992 }, { title: 'Sleeping with the Enemy', year: 1991 }, { title: 'What Lies Beneath', year: 2000 },
    { title: 'The Others', year: 2001 }, { title: 'Secret Window', year: 2004 }, { title: 'Red Eye', year: 2005 }
  ];

  for (const movieData of thrillerMovies) {
    movies.push({
      imdbId: `tt${movieId++}`,
      title: movieData.title,
      year: movieData.year,
      genres: ['Thriller'],
      rating: 6.5 + Math.random() * 2.5,
      runtime: 95 + Math.floor(Math.random() * 45)
    });
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