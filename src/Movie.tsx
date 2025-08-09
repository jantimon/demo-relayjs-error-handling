import { graphql } from "relay-runtime";
import { useFragmentWithError } from "./RelayExplicitErrorHandling";
import type { ErrorHandler } from "./RelayExplicitErrorHandling";
import type { Movie_movie$key } from "./__generated__/Movie_movie.graphql";

const movieFragment = graphql`
  fragment Movie_movie on Movie @catch {
    id
    title
    director
    year
    genre
    rating
  }
`;

interface MovieProps {
  movie: Movie_movie$key;
  onError: ErrorHandler;
}

function Movie({ movie, onError }: MovieProps) {
  const data = useFragmentWithError(movieFragment, movie, onError);

  return (
    <article>
      <header>
        <h3>{data.title}</h3>
        <p>
          <strong>Director:</strong> {data.director.toLowerCase()} |
          <strong> Year:</strong> {data.year} |<strong> Genre:</strong>{" "}
          {data.genre}
          {data.rating && (
            <span>
              {" "}
              | <strong>Rating:</strong> {data.rating}/10
            </span>
          )}
        </p>
      </header>
    </article>
  );
}

export default Movie;
