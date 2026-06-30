import { Settings } from 'lucide-react';

export default function ComingSoonView({ item }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/90 p-10 text-center shadow-xl shadow-slate-950/30">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
        <Settings className="h-8 w-8 text-slate-400" />
      </div>
      <p className="mt-5 text-sm font-extrabold text-indigo-300">{item?.sectionTitle}</p>
      <h3 className="mt-2 text-2xl font-extrabold text-white">{item?.label} 준비중</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{item?.summary}</p>
      <p className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">이 화면은 안내 전용입니다. 클릭해도 새 API 호출, DB 변경, localStorage 삭제가 발생하지 않습니다.</p>
    </div>
  );
}
