import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-[#F5F1EA] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#121212] border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif text-[#F5F1EA] mb-2">Oops! Something went wrong</h1>
            <p className="text-xs text-[#F5F1EA]/60 leading-relaxed mb-6">
              An unexpected error occurred while loading this page. Don't worry, your data is safe!
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-black/50 border border-white/10 text-left overflow-x-auto">
                <p className="text-[11px] font-mono text-red-300">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#A35D68] text-white font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#F5F1EA]/80 font-medium text-sm transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <Home className="w-4 h-4" />
                <span>Return to Story Homepage</span>
              </button>
            </div>
          </div>

          <footer className="mt-8 text-xs text-[#F5F1EA]/40">
            Sowmiya's Birthday Story App
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
