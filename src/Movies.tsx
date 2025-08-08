import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Movie from "./Movie";
import type { Movies_movies$key } from "./__generated__/Movies_movies.graphql";

const moviesFragment = graphql`
  fragment Movies_movies on Movie @relay(plural: true) {
    id
    ...Movie_movie
  }
`;

interface MoviesProps {
  movies: Movies_movies$key;
}

function Movies({ movies }: MoviesProps) {
  const data = useFragment(moviesFragment, movies);

  return (
    <>
      <section>
        <header>
          <h2>Featured Movies</h2>
          <p>Explore our collection of movies</p>
        </header>
        <div>
          {data.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Movies;
