import { useEffect, useState } from "react";
import { NavBar } from "./components/NavBar";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Main } from "./components/Main";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMovieList } from "./components/WatchedMovieList";
import { tempMovieData } from "./data/tempMovieData";
import { tempWatchedData } from "./data/tempWatchedData";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apikey = "43bf8725";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const query = "interstellar";

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch(
        `http://www.omdbapi.com/?apiKey=${apikey}&s=${query}`
      );
      const data = await response.json();
      setMovies(data.Search);
      console.log(data.Search);
    };
    fetchMovies();
  }, []);

  return (
    <>
      <NavBar>
        <Search />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          <MovieList movies={movies} />
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
      </Main>
    </>
  );
}
