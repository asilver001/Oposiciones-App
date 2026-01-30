import React from 'react';

/**
 * RoadmapErrorBoundary - Error boundary específico para el Roadmap
 */
export default class RoadmapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('RoadmapErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-red-950 text-red-200 p-6 rounded-lg">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="font-bold text-lg text-center">Error al cargar Roadmap</p>
          <p className="text-sm mt-2 opacity-80 text-center max-w-md">
            {this.state.error?.message || 'Error desconocido'}
          </p>
          {this.state.error?.stack && (
            <details className="mt-4 text-xs opacity-60 max-w-full overflow-auto">
              <summary className="cursor-pointer hover:opacity-100">Ver detalles técnicos</summary>
              <pre className="mt-2 p-3 bg-red-900/50 rounded text-left whitespace-pre-wrap max-h-48 overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg text-sm transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
