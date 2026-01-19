// Error Boundary component
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            {this.state.error && (
              <details className="error-details">
                <summary>Error details</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <button onClick={this.handleReset} className="btn-retry">
              Try Again
            </button>
            <button onClick={() => window.location.href = '/'} className="btn-home">
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
