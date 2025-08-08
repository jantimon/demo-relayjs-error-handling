import express from "express";
import { createServer as createViteServer } from "vite";
import { mockMovies } from "./src/data/movies.js";

let simulateDirectorError = false;

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  // Endpoint to toggle error simulation
  app.post("/toggle-errors", (_req, res) => {
    simulateDirectorError = !simulateDirectorError;
    res.json({ simulateDirectorError });
  });

  app.post("/graphql", express.json(), (req, res) => {
    try {
      const { query } = req.body;

      const operationMatch = query.match(/query\s+(\w+)/);
      const operationName = operationMatch?.[1];

      let result: any;

      switch (operationName) {
        case "AppQuery":
          const shouldSimulateDirectorError = simulateDirectorError;

          if (shouldSimulateDirectorError) {
            // Simulate field errors on director field for some movies
            const moviesWithErrors = mockMovies.map((movie, index) => {
              // Make every other movie's director field fail
              if (index % 2 === 0) {
                return { ...movie, director: null };
              }
              return movie;
            });

            const errors = mockMovies
              .map((_, index) => {
                if (index % 2 === 0) {
                  return {
                    message: "Failed to fetch director information",
                    path: ["movies", index, "director"],
                  };
                }
                return null;
              })
              .filter(Boolean);

            result = {
              data: {
                movies: moviesWithErrors,
              },
              errors,
            };
          } else {
            result = {
              data: {
                movies: mockMovies,
              },
            };
          }
          break;

        default:
          result = {
            errors: [{ message: `Unknown operation: ${operationName}` }],
          };
      }

      res.json(result);
    } catch (error) {
      res.status(400).json({ errors: [{ message: "Invalid JSON" }] });
    }
  });

  app.use(vite.middlewares);

  const port = process.env.PORT || 5173;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
