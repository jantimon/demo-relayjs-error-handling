import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
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
}

function Movie({ movie }: MovieProps) {
  const result = useFragment(movieFragment, movie);

  if (!result.ok) {
    return null;
  }

  const data = result.value;

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
