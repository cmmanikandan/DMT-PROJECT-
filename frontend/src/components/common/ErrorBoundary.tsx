import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside ErrorBoundary:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="dashboard-card p-6 m-4 border-brand-amber/40 bg-amber-50/20 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-semibold text-text-main">
            {this.props.fallbackTitle || "An unexpected error occurred in this view"}
          </h3>
          <p className="text-[12px] text-text-muted mt-1 max-w-md mx-auto">
            {this.state.error?.message || "The component could not be rendered with the current dataset state."}
          </p>
          <div className="mt-4">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-primary text-white text-[12px] font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Component</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
