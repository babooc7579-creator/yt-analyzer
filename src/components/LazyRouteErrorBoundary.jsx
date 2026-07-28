import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class LazyRouteErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section
        className="border border-amber-400/30 bg-amber-500/10 p-5 text-amber-50"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div className="min-w-0">
            <h2 className="text-base font-black">최신 화면을 다시 불러와야 합니다</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              앱이 업데이트되었거나 화면 파일을 불러오지 못했습니다. 저장하지 않은 입력이 없다면
              아래 버튼으로 최신 버전을 다시 불러오세요.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-amber-300/40 bg-slate-950 px-4 py-2 text-xs font-black text-amber-100 hover:bg-amber-500/10 sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              최신 화면 다시 불러오기
            </button>
          </div>
        </div>
      </section>
    );
  }
}
