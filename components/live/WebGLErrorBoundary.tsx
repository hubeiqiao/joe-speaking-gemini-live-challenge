'use client';

import { Component, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function DefaultFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30',
        className,
      )}
    >
      <div className="p-4 text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 11a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 0 1-3-3V5a3 3 0 1 1 6 0v6a3 3 0 0 1-3 3Z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <p className="text-xs text-default-500">3D visualization unavailable</p>
      </div>
    </div>
  );
}

type WebGLErrorBoundaryState = {
  error: Error | null;
  hasError: boolean;
  isWebGLSupported: boolean;
};

export class WebGLErrorBoundary extends Component<
  { children: ReactNode; className?: string; fallback?: ReactNode },
  WebGLErrorBoundaryState
> {
  state: WebGLErrorBoundaryState = {
    hasError: false,
    error: null,
    isWebGLSupported: true,
  };

  componentDidMount() {
    if (!checkWebGLSupport()) {
      this.setState({ isWebGLSupported: false });
    }

    window.addEventListener('webglcontextlost', this.handleContextLost);
    window.addEventListener('webglcontextrestored', this.handleContextRestored);
  }

  componentWillUnmount() {
    window.removeEventListener('webglcontextlost', this.handleContextLost);
    window.removeEventListener('webglcontextrestored', this.handleContextRestored);
  }

  static getDerivedStateFromError(error: Error): Partial<WebGLErrorBoundaryState> {
    return { hasError: true, error };
  }

  handleContextLost = (event: Event) => {
    event.preventDefault();
    this.setState({ error: new Error('WebGL context lost'), hasError: true });
  };

  handleContextRestored = () => {
    this.setState({ error: null, hasError: false });
  };

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[WebGLErrorBoundary] Caught error:', error.message);
    }
  }

  render() {
    if (this.state.hasError || !this.state.isWebGLSupported) {
      return this.props.fallback ?? <DefaultFallback className={this.props.className} />;
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;
