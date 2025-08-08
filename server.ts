import express from "express";
import { createServer as createViteServer } from "vite";
import { mockMovies } from "./src/data/movies.js";

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.post("/graphql", express.json(), (req, res) => {
    try {
      const { query, variables } = req.body;

      const operationMatch = query.match(/query\s+(\w+)/);
      const operationName = operationMatch?.[1];

      let result;

      switch (operationName) {
        case "AppQuery":
          result = {
            data: {
              movies: mockMovies,
            },
          };
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
