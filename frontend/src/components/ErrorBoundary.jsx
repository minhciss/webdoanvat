import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.hash = '#home';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-stone-900">Đã xảy ra lỗi hiển thị</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Hệ thống đã tự động ghi nhận lỗi này. Bạn có thể tải lại trang hoặc quay về trang chủ để tiếp tục trải nghiệm.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-stone-50 rounded-xl text-left border border-stone-200 text-[11px] text-stone-600 font-mono overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
