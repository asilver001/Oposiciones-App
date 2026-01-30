import React from 'react';

/**
 * ErrorBoundary - Captura errores de componentes hijos
 *
 * Uso:
 * <ErrorBoundary>
 *   <ComponenteQuePuedeFallar />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-red-950 text-red-200 p-4 rounded-lg">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="font-bold text-center">Error al cargar componente</p>
          <p className="text-sm mt-2 opacity-70 text-center max-w-md">
            {this.state.error?.message || 'Error desconocido'}
          </p>
          {this.state.error?.stack && (
            <details className="mt-4 text-xs opacity-50 max-w-full overflow-auto">
              <summary className="cursor-pointer">Ver detalles</summary>
              <pre className="mt-2 p-2 bg-red-900/50 rounded text-left whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
