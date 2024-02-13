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
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   console.log("After initial render");
  // }, []);

  // useEffect(() => {
  //   console.log("After each render");
  // });

  // useEffect(() => {
  //   console.log("After state change of query");
  // }, [query]);

  // console.log("During render");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(""); //we need to reset the error to empty
        const response = await fetch(
          `http://www.omdbapi.com/?apiKey=${apikey}&s=${query}`
        );
        if (!response.ok)
          throw new Error("something went wrong while fetching");

        const data = await response.json();
        if (data.Response === "False") throw new Error("No such movie found");

        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies(); //it is required to call the inner function
  }, [query]); //use effect 1st parameter is a function and second is in this case query so it will rerender after update state query

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return <p className="loader">Loading...</p>;
};

const ErrorMessage = (message) => {
  return <p className="error">{message.message}</p>;
};
