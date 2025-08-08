import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import Movies from "./Movies";
import type { AppQuery } from "./__generated__/AppQuery.graphql";

const appQuery = graphql`
  query AppQuery {
    movies {
      id
      ...Movies_movies
    }
  }
`;

function App() {
  const data = useLazyLoadQuery<AppQuery>(appQuery, {});

  return (
    <main>
      <header>
        <h1>🎬 Movie Database</h1>
        <p>A simple Relay GraphQL demo</p>
      </header>
      {data.movies && <Movies movies={data.movies} />}
    </main>
  );
}

export default App;
