import { useEffect, useState } from "react";

const KEY = "c9ff1f00";

function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //   `http://www.omdbapi.com/?apikey=${KEY}&s=Inter`

  useEffect(
    function () {
      async function getData() {
        try {
          setLoading(true);
          setError("");
          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          );

          if (!result.ok) {
            throw new Error("There is some problem with fetch");
          }

          const data = await result.json();
          if (data.Response === "False") {
            throw new Error("There is now films");
          }
          setMovies(data.Search);
          setError("");
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
      getData();
    },
    [query],
  );

  return [movies, loading, error];
}
export default useMovies;
