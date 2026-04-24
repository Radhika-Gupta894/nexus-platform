import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 Global UI Crash Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
          <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 max-w-lg w-full text-center shadow-2xl">
            <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle className="text-red-500" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-blue-200 mb-8 opacity-80 leading-relaxed">
              We've experienced a runtime collision. Don't worry, your data is safe.
            </p>
            <pre className="text-[10px] bg-black/40 p-4 rounded-2xl text-red-300 text-left mb-8 overflow-auto max-h-32 mb-8">
               {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="group flex items-center justify-center gap-3 w-full py-4 bg-white text-blue-900 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl"
            >
              <RotateCcw className="group-hover:rotate-180 transition-transform duration-700" size={20} />
              Restore NEXUS Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
