import { Movie } from "./Movie";

export function MovieList({ movies, onHandleSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onHandleSelectedMovie={onHandleSelectedMovie}
        />
      ))}
    </ul>
  );
}
