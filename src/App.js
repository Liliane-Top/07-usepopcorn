import { useEffect, useState } from "react";
import { NavBar } from "./components/NavBar";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Main } from "./components/Main";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMovieList } from "./components/WatchedMovieList";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { MovieDetails } from "./components/MovieDetails";

export const apikey = "43bf8725";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectedMovie = (id) => {
    // id === selectedId ? handleClose() : setSelectedId(id);
    setSelectedId(() => (id === selectedId ? null : id));
  };

  const handleClose = () => setSelectedId(null);

  const handleAddWatched = (movie) => {
    setWatched((prevWatched) => {
      const duplicate = prevWatched.find(
        (watchedMovie) => watchedMovie.imdbID === movie.imdbID
      );
      if (!duplicate) {
        return [...prevWatched, movie];
      } else {
        return prevWatched;
      }
    });
  };

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
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onHandleSelectedMovie={handleSelectedMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onHandleClose={handleClose}
              onHandleWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
