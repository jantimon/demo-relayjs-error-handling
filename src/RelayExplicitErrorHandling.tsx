import { useFragment } from "react-relay";
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import type { GraphQLTaggedNode, Result } from "relay-runtime";
import type { KeyType, KeyTypeData } from "react-relay/relay-hooks/helpers";

// Symbol-based ErrorHandler type that can only be created by useFieldErrorHandler
const ERROR_HANDLER_SYMBOL = Symbol("ErrorHandler");

export interface ErrorHandler {
  readonly [ERROR_HANDLER_SYMBOL]: true;
  readonly id: string;
}

// Hook to create a typed ErrorHandler that only this module can create
export function useFieldErrorHandler(): ErrorHandler {
  // Create a unique error handler instance
  return {
    [ERROR_HANDLER_SYMBOL]: true,
    id: Math.random().toString(36).substring(2, 11), // Simple unique ID
  } as ErrorHandler;
}

// Extract the value type from a Result type
type ExtractValue<T> = T extends { ok: true; value: infer V } ? V : never;

// Custom Error class that requires onError handler and optional result.errors
export class FragmentError extends Error {
  public readonly errorHandler: ErrorHandler;
  public readonly resultErrors?: readonly any[];

  constructor(
    message: string,
    onError: ErrorHandler,
    resultErrors?: readonly any[],
  ) {
    super(message);
    this.name = "FragmentError";
    this.errorHandler = onError;
    this.resultErrors = resultErrors;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FragmentError);
    }
  }
}

// Custom hook that throws when fragment result is not ok
export function useFragmentWithError<
  TKey extends KeyType<Result<unknown, unknown>>,
>(
  fragment: GraphQLTaggedNode,
  fragmentRef: TKey,
  onError: ErrorHandler,
): ExtractValue<KeyTypeData<TKey>> {
  const result = useFragment<TKey>(fragment, fragmentRef);

  // If result has an 'ok' property and it's false, throw to be caught by ErrorBoundary
  if (!result?.ok) {
    // Create a FragmentError with required onError and optional result.errors
    throw new FragmentError("Fragment error occurred", onError, result?.errors);
  }

  // If result.ok is true, return the value
  return result.value as ExtractValue<KeyTypeData<TKey>>;
}

// Props for our ErrorBoundary component
interface ErrorBoundaryProps {
  children: ReactNode;
  fieldErrorHandlers: ErrorHandler[];
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorHandler?: ErrorHandler;
}

// ErrorBoundary that requires explicit error handlers for type safety
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if this error has an associated error handler
    const errorHandler = (error as any).errorHandler;
    return {
      hasError: true,
      error,
      errorHandler,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    const errorHandler = (error as any).errorHandler;
    if (errorHandler) {
      console.log("Error caught with handler:", errorHandler.id);

      // Check if this error handler is in our allowed list
      const isHandlerValid = this.props.fieldErrorHandlers.some(
        (handler) => handler.id === errorHandler.id,
      );

      if (!isHandlerValid) {
        console.warn("Error handler not found in fieldErrorHandlers array");
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
