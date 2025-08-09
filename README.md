# 🔧 Relay Explicit Error Handling - Proof of Concept

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/jantimon/demo-relayjs-error-handling/tree/useFragmentWithError)

**A proof-of-concept demonstrating explicit error handling contracts in RelayJS applications**

This demo showcases a new approach to error handling in Relay applications that replaces implicit error throwing with explicit error contracts, providing type-safe, traceable, and predictable error flows.

## The Problem with Current Relay Error Handling

### Developer Experience Issues
- **Unclear Error Boundaries**: Not obvious what an ErrorBoundary catches or where errors originate
- **Unpredictable Crashes**: Missing ErrorBoundaries cause entire applications to crash
- **No Static Analysis**: Impossible to statically verify error handling is complete
- **Implicit Contracts**: Components can throw errors without declaring this in their interface

### Architecture Problems  
- **Unclear Responsibility**: No way to know if a component or its consumer should handle errors
- **Type System Gaps**: Unlike stateful/stateless components, error-prone components aren't identifiable from their types
- **Cross-Package Boundaries**: Error handling across team/package boundaries is invisible and fragile

## The Solution: Explicit Error Contracts

This proof-of-concept introduces **explicit error handling contracts** similar to how we solved state management across package boundaries. Just as we moved from implicit internal state to explicit controlled/uncontrolled component contracts, we can move from implicit error throwing to explicit error handler contracts.

### Key Components

#### 1. `useFragmentWithError` Hook
```tsx
// Instead of manual error checking:
const result = useFragment(fragment, key);
if (!result.ok) return null;
const data = result.value;

// Components declare their error handling needs:
const data = useFragmentWithError(fragment, key, onError);
```

#### 2. `ErrorHandler` Type Safety
```tsx
interface MovieProps {
  movie: Movie_movie$key;
  onError: ErrorHandler; // ← Explicit contract in props
}
```

The `ErrorHandler` is a symbol-based type that can only be created by `useFieldErrorHandler`, ensuring type safety and preventing misuse.

#### 3. `ErrorBoundary` with Handler Validation
```tsx
function Movies() {
  const errorHandler = useFieldErrorHandler();
  
  return (
    <ErrorBoundary fieldErrorHandlers={[errorHandler]}>
      {movies.map((movie) => (
        <Movie movie={movie} onError={errorHandler} />
      ))}
    </ErrorBoundary>
  );
}
```

## Benefits Demonstrated

### ✅ Type-Safe & Explicit Contracts
- Error-handling is **hard enforced via TypeScript types**
- Components that can error **must declare `onError: ErrorHandler` in props**
- Recognizable from type/props whether a component can throw errors

### ✅ Static Analyzability  
- **TypeScript enforces contracts** across files and packages
- **ESLint can enforce** that `errorHandler` from `useFieldErrorHandler` is passed to `ErrorBoundary`
- **Static checks** prevent missing error handling during refactoring

### ✅ Traceability & Predictability
- **Explicitly visible** which components/hooks can throw errors  
- **Clear assignment** which ErrorBoundary catches which errors
- **Error handlers are passed down** explicitly through component tree, making error flow traceable

### ✅ Developer Experience
- **Error-handling as simple** as passing an `onError` handler
- **Teams immediately see** when error-handling is missing during refactoring  
- **Predictable behavior** in error cases (no unexpected app crashes)

## Code Examples

### Child Component (Movie.tsx)
```tsx
interface MovieProps {
  movie: Movie_movie$key;
  onError: ErrorHandler; // ← Explicit error contract
}

function Movie({ movie, onError }: MovieProps) {
  // No manual error checking needed - throws to ErrorBoundary if error
  const data = useFragmentWithError(movieFragment, movie, onError);
  
  return (
    <article>
      <h3>{data.title}</h3>
      <p>Director: {data.director}</p>
      {/* ... */}
    </article>
  );
}
```

### Parent Component (Movies.tsx)  
```tsx
function Movies({ movies }: MoviesProps) {
  const errorHandler = useFieldErrorHandler();
  const data = useFragment(moviesFragment, movies);
  
  return (
    <ErrorBoundary fieldErrorHandlers={[errorHandler]}>
      {data.map((movie) => (
        <Movie 
          key={movie.id} 
          movie={movie} 
          onError={errorHandler} // ← Explicit error flow
        />
      ))}
    </ErrorBoundary>
  );
}
```

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the demo. The error handling is fully functional but errors are handled gracefully with clear component boundaries.

## Implementation Details

### Core Files
- **`RelayExplicitErrorHandling.tsx`**: Core implementation with `useFragmentWithError`, `ErrorBoundary`, and `useFieldErrorHandler`
- **`Movie.tsx`**: Child component using `useFragmentWithError` with explicit `onError` prop
- **`Movies.tsx`**: Parent component managing error boundaries and passing error handlers

### Type Safety Mechanism
The `ErrorHandler` type uses a unique Symbol that can only be created by `useFieldErrorHandler`, preventing:
- Accidental handler creation outside the proper hook
- Passing invalid or mock handlers
- Runtime errors from improper error handler usage

## Future Enhancements

This proof-of-concept could be extended with:
- **ESLint rules** to enforce `ErrorBoundary` usage when `useFieldErrorHandler` is used
- **Custom error types** for different categories of GraphQL errors  
- **Error recovery strategies** built into the ErrorBoundary component
- **Development tools** for visualizing error handler flows

---

**This approach transforms error handling from an implicit, unpredictable concern into an explicit, type-safe, and traceable part of your component architecture.**
