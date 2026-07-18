import { LogOut, ShieldCheck } from 'lucide-react';

export const CREATOR_OS_LOGIN_PATH = '/.auth/login/aad?post_login_redirect_uri=/';
export const CREATOR_OS_LOGOUT_PATH = '/.auth/logout?post_logout_redirect_uri=/';

export default function CreatorAccessControl() {
  return (
    <div className="mt-5 border-t border-slate-800 pt-4">
      <div className="flex items-center gap-2 text-xs text-emerald-300">
        <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Microsoft 계정으로 보호됨</span>
      </div>
      <a
        aria-label="Creator OS에서 로그아웃"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
        href={CREATOR_OS_LOGOUT_PATH}
        title="현재 Microsoft 계정에서 로그아웃합니다."
      >
        <LogOut aria-hidden="true" className="h-4 w-4" />
        로그아웃
      </a>
    </div>
  );
}
