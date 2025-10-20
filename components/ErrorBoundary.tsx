'use client';

// ============================================================================
// MONITORING SETUP #3: Custom Error Boundary with Sentry
// File: components/ErrorBoundary.tsx
// ============================================================================

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  eventId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry with detailed context
    Sentry.withScope((scope) => {
      scope.setExtras({
        componentStack: errorInfo.componentStack,
        ...errorInfo,
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      });

      scope.setTag('component', 'ErrorBoundary');

      const eventId = Sentry.captureException(error);
      this.setState({ eventId, errorInfo });
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Custom error reporting for business metrics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  handleReportFeedback = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({
        eventId: this.state.eventId,
        title: 'Help us improve',
        subtitle: 'We’re sorry for the inconvenience. Please describe what happened.',
        subtitle2: 'Our developers will be notified.',
        labelName: 'Name',
        labelEmail: 'Email',
        labelComments: 'What were you trying to do?',
        labelSubmit: 'Send Report',
        successMessage: 'Thank you for your feedback! We’ll look into this.',
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 text-center mb-6">
              We&apos;ve been notified and are working to fix the issue.
              Please try refreshing the page.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-600 font-semibold mb-2">
                  Development Error Details:
                </p>
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </div>

            {/* User Feedback */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">
                Help us improve by giving feedback on what happened:
              </p>
              <button
                onClick={this.handleReportFeedback}
                className="w-full text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Submit Error Report
              </button>
            </div>

            {/* Error ID */}
            <p className="text-xs text-gray-400 text-center mt-6">
              Error ID: {this.state.eventId || 'Generating...'}
            </p>

            {/* Recovery Guidance */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">What you can try:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Refresh the page</li>
                <li>• Clear your browser cache</li>
                <li>• Try a different browser</li>
                <li>• Check your internet connection</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components (simpler use cases)
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    Sentry.withScope((scope) => {
      if (errorInfo?.componentStack) {
        scope.setExtra('componentStack', errorInfo.componentStack);
      }
      scope.setTag('origin', 'useErrorHandler');
      Sentry.captureException(error);
    });

    console.error('Error caught by useErrorHandler:', error, errorInfo);
  };
}

// Utility component for wrapping components that might error
export function ErrorFallback({ error, resetError }: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">
            Something went wrong
          </h3>
          <p className="text-xs text-red-800 mb-3">
            {error.message}
          </p>
          <button
            onClick={resetError}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

// Higher-order component for adding error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
