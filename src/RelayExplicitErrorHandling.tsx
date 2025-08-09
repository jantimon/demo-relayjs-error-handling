import { useFragment } from "react-relay";
import { Component, useMemo } from "react";
import type { ReactNode } from "react";
import type { GraphQLTaggedNode, Result } from "relay-runtime";
import type { KeyType, KeyTypeData } from "react-relay/relay-hooks/helpers";

/** Unique internal symbol to prevent external ErrorHandler creation */
const ERROR_HANDLER_SYMBOL = Symbol("ErrorHandler");

/**
 * Type-safe error contract for fragment error boundaries as a stable array of handler objects
 * MUST only be created by the `useFieldErrorHandler` hook
 *
 * The array-based design enables:
 * - Parent error handler forwarding/composition
 */
export type ErrorHandler = readonly [
  {
    readonly [ERROR_HANDLER_SYMBOL]: true;
  },
  // Optional: parent error handlers
  ...{
    readonly [ERROR_HANDLER_SYMBOL]: true;
  }[],
];

/**
 * Creates a unique error handler contract for fragment error boundary management
 *
 * The returned handler MUST be passed to both the ErrorBoundary's `fieldErrorHandlers`
 * prop and all `useFragmentWithError` instances this contract is responsible for.
 *
 * @param errorHandlers - Optional parent error handlers to forward/compose
 * @returns Stable array reference containing error handler contracts
 */
export const useFieldErrorHandler = (
  ...errorHandlers: ErrorHandler[]
): ErrorHandler =>
  useMemo(
    () => [{ [ERROR_HANDLER_SYMBOL]: true }, ...errorHandlers.flat()] as const,
    errorHandlers,
  );

/**
 * Type constraint for Relay fragment or query keys that have `@catch` directive
 *
 * @template TData - The success data type when the Result is ok
 * @template TError - The error type when the Result is not ok (defaults to unknown)
 *
 * @exqmple
 * ```typescript
 * const fragment = graphql`
 *   fragment MyComponent_data on User \@catch {
 *     name
 *     email
 *   }
 * `;
 * ```
 */
export type RelayKeyWithCatch<TData = unknown, TError = unknown> = KeyType<
  Result<TData, TError>
>;

type ExtractValue<T> = T extends { ok: true; value: infer V } ? V : never;

/**
 * Thrown when Relay fragments with `@catch` directive fail to resolve successfully
 *
 * Triggered by `useFragmentWithError` when fragment result indicates error state,
 * designed to be caught by error boundaries for graceful error handling
 */
export class FragmentError extends Error {
  public readonly errorHandler: ErrorHandler;
  public readonly resultErrors?: readonly any[];
  constructor(
    message: string,
    errorHandler: ErrorHandler,
    resultErrors?: readonly any[],
  ) {
    super(message);
    this.name = "FragmentError";
    this.errorHandler = errorHandler;
    this.resultErrors = resultErrors;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FragmentError);
    }
  }
}

/**
 * Safely extracts data from Relay fragments with `@catch` directive by throwing on error states.
 *
 * Designed only for fragments using `@catch` or `@catch(to: RESULT)` that wrap data in Result types.
 * Throws FragmentError on failure states to trigger error boundaries, ensuring consumers
 * receive non-nullable data and can rely on successful fragment resolution.
 *
 * @param fragment - GraphQL fragment with @catch directive
 * @param fragmentRef - Fragment reference key from parent component
 * @param errorHandler - Error handler array for boundary identification and error routing
 * @returns Unwrapped fragment data
 * @throws {FragmentError} When fragment result indicates failure state
 */
export function useFragmentWithError<TKey extends RelayKeyWithCatch>(
  fragment: GraphQLTaggedNode,
  fragmentRef: TKey,
  errorHandler: ErrorHandler,
): ExtractValue<KeyTypeData<TKey>> {
  const result = useFragment<TKey>(fragment, fragmentRef);
  if (!result?.ok) {
    // Throw to trigger the <ErrorBoundary /> and prevent hook consumers from accessing
    // the error data
    throw new FragmentError(
      "Fragment error occurred",
      errorHandler,
      result?.errors,
    );
  }
  return result.value as ExtractValue<KeyTypeData<TKey>>;
}

// Props for our ErrorBoundary component
interface ErrorBoundaryProps {
  children: ReactNode;
  fieldErrorHandlers: ErrorHandler;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * React error boundary that provides type-safe, responsibility-based error handling for fragment errors
 *
 * This boundary only handles errors it is explicitly configured to handle via the `fieldErrorHandlers`
 * prop. It uses efficient array overlap detection to determine error responsibility, supporting
 * both exact array matches and partial overlap for composed error handlers.
 *
 * @example
 * ```typescript
 * const errorHandler = useFieldErrorHandler();
 * // Or with composition: const errorHandler = useFieldErrorHandler(parentHandler);
 *
 * <ErrorBoundary
 *   fieldErrorHandlers={errorHandler}
 *   fallback={<div>Fragment loading failed</div>}
 * >
 *   <ComponentUsingFragmentWithError errorHandler={errorHandler} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  static isResponsibleForError(
    error: Error,
    fieldErrorHandlers: ErrorHandler,
  ): error is Error & { errorHandler: ErrorHandler } {
    const errorHandler = (
      error as Error & {
        errorHandler?: ErrorHandler;
      }
    ).errorHandler;
    return Boolean(
      // Check if this is a FragmentError, otherwise not responsible
      errorHandler &&
        // Check if this error handler array has any overlap with the given field error handlers
        (errorHandler === fieldErrorHandlers ||
          errorHandler.some((handler) => fieldErrorHandlers.includes(handler))),
    );
  }

  render() {
    if (this.state.hasError) {
      // Rethrow the error if this Boundary is not responsible for handling this error
      if (
        this.state.error &&
        !ErrorBoundary.isResponsibleForError(
          this.state.error,
          this.props.fieldErrorHandlers,
        )
      ) {
        throw this.state.error;
      }
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
