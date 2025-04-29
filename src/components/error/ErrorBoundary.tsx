import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component to catch and handle JavaScript errors in child component tree.
 * Useful for preventing the entire app from crashing due to a single component failure.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack trace:", errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-4 m-4 rounded-lg bg-red-500/10 border border-red-500/20 text-white">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-white/80 mb-4">
            The application encountered an error. Please try refreshing the page.
          </p>
          <details className="bg-black/30 p-2 rounded text-sm font-mono text-white/70">
            <summary className="cursor-pointer">Error details</summary>
            <p className="mt-2 p-2 bg-black/50 rounded overflow-auto">
              {this.state.error?.toString()}
            </p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
