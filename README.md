# 🎬 Relay Movies Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/jantimon/demo-relayjs-error-handling/tree/semantic-non-null)

A minimal React + Relay GraphQL demo with Vite dev server GraphQL endpoint

## Features

- **React 19** with TypeScript
- **Relay** for GraphQL data fetching with fragments
- **Vite middleware** for GraphQL API endpoint (works in all environments)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

```

The demo will start at `http://localhost:5173` with Vite dev server handling GraphQL requests at `/graphql`.

## Project Structure

```
src/
├── data/            # Mock movie data
├── __generated__/   # Auto-generated Relay types
├── App.tsx         # Main app with Relay provider
├── Movies.tsx      # Movies list with Relay query
├── Movie.tsx       # Individual movie with Relay fragment
└── RelayEnvironment.ts  # Relay configuration
```

## Key Concepts Demonstrated

- **Component-based data requirements** - Each component defines its own GraphQL fragment
- **Automatic type generation** - TypeScript types generated from GraphQL schema
- **Mock-first development** - Vite middleware handles GraphQL requests, no backend needed
- **Clean component hierarchy** - App → Movies → Movie with proper data flow

## GraphQL Schema

Simple movie database schema with:
- `movies` query for listing all movies
- `movie(id)` query for individual movies
- Movie type with title, director, year, genre, rating, and description

## Commands

```bash
npm run dev          # Start development server
npm run preview      # Preview production build
npx relay-compiler   # Regenerate Relay types
```
