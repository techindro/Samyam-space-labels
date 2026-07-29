import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-400">Something went wrong</h2>
          <p className="text-white/70 text-sm max-w-md mb-4">
            An unexpected render error occurred in Samyam AI platform.
          </p>
          {this.state.error && (
            <div className="bg-black/60 border border-red-500/40 rounded-xl p-4 max-w-2xl w-full text-left font-mono text-xs text-red-300 mb-6 overflow-x-auto">
              <p className="font-bold text-red-400 mb-1">{this.state.error.toString()}</p>
              <pre className="text-[10px] text-white/50 whitespace-pre-wrap">{this.state.error.stack}</pre>
            </div>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-white font-medium text-xs hover:opacity-90 transition-opacity"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
