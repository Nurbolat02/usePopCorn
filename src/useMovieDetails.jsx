import { useEffect, useState } from "react";
const KEY = "c9ff1f00";
//  `http://www.omdbapi.com/?apikey=c9ff1f00&i=tt0268321`,
function useMovieDetails(id) {
  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(
    function () {
      async function getData() {
        try {
          setLoading(true);
          setError("");
          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${id}`,
          );
          if (!result.ok) {
            throw new Error(`there is some problem with fetching`);
          }
          const data = await result.json();
          setMovie(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
      getData();
    },
    [id],
  );
  return [movie, loading, error];
}
export default useMovieDetails;
