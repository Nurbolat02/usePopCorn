import { useState, useRef, useEffect } from "react";
import useMovies from "./useMovies";
import "./App.css";
import useMovieDetails from "./useMovieDetails";
import StarRating from "./StarRating";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Loader() {
  return <div>Loading...</div>;
}
function Error({ error }) {
  return <div>{error}</div>;
}
function Search({ query, setQuery, movies, error }) {
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p className="num-results">
        Found <strong>{error ? "0" : movies?.length}</strong> results
      </p>
    </>
  );
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
function MovieList({ movies, setSelectedMovie, loading, error }) {
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <ul className="list">
          {movies?.map((movie) => (
            <li
              onClick={() => {
                setSelectedMovie(movie.imdbID);
              }}
              key={movie.imdbID}
            >
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
              <h3>{movie.Title}</h3>
              <div>
                <p>
                  <span>🗓</span>
                  <span>{movie.Year}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
function MovieDetails({ selectedMovie, watched, onCloseMovie, setWatched }) {
  const [movie, loading, error] = useMovieDetails(selectedMovie);
  const [userRating, setUserRating] = useState("");
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbID,
  } = movie;
  console.log(movie);
  const watchedMovie = watched.find((element) => element.imdbID === imdbID);

  const watchedUserRating = watchedMovie?.userRating;
  function addMovieToWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleAdd() {
    const newMovie = {
      imdbID,
      Title: title,
      Year: year,
      Poster: poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };

    addMovieToWatched(newMovie);
    onCloseMovie();
  }
  return (
    <>
      <div className="details">
        {loading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>

            <section>
              <div className="rating">
                {!watchedMovie ? (
                  <>
                    <StarRating length={10} setUserRating={setUserRating} />
                    {userRating > 0 && (
                      <button
                        className="btn-add"
                        onClick={() => {
                          handleAdd(movie, userRating);
                          onCloseMovie();
                        }}
                      >
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>
                    You rated with movie {watchedUserRating} <span>⭐️</span>
                  </p>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
function MovieWatchedList({ watched, onDeleteWatched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
            </div>
            <button
              className="btn-delete"
              onClick={() => onDeleteWatched(movie.imdbID)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
function MovieSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  );
}
function Box({ children, open, onOpen }) {
  return (
    <>
      <div className="box">
        <button className="btn-toggle" onClick={() => onOpen((open) => !open)}>
          {open ? "–" : "+"}
        </button>
        {open && children}
      </div>
    </>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState(function () {
    const data = localStorage.getItem("watched");
    const result = JSON.parse(data) || [];
    return result;
  });
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  function onCloseMovie() {
    setSelectedMovie(null);
  }

  function onDeleteWatched(id) {
    setWatched((prev) => {
      return prev.filter((element) => element.imdbID !== id);
    });
  }

  function addMovieToWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  const [movies, loading, error] = useMovies(query);

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched],
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search
          query={query}
          setQuery={setQuery}
          movies={movies}
          error={error}
        />
      </NavBar>
      <Main>
        <Box open={isOpen1} onOpen={setIsOpen1}>
          <MovieList
            movies={movies}
            loading={loading}
            error={error}
            setSelectedMovie={setSelectedMovie}
          />
        </Box>
        <Box open={isOpen2} onOpen={setIsOpen2}>
          {selectedMovie ? (
            <MovieDetails
              selectedMovie={selectedMovie}
              watched={watched}
              onCloseMovie={onCloseMovie}
              setWatched={setWatched}
            />
          ) : (
            <>
              <MovieSummary watched={watched} />
              <MovieWatchedList
                onDeleteWatched={onDeleteWatched}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
