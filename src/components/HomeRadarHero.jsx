import { Sparkles } from 'lucide-react';

export default function HomeRadarHero() {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-2xl bg-indigo-500/15 p-4">
        <Sparkles className="h-8 w-8 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm font-extrabold text-indigo-300">오늘의 레이더</p>
        <h3 className="mt-1 text-2xl font-extrabold text-white">오늘 볼 소재와 다음 행동을 먼저 정합니다</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">발굴 → 수집 → 보관 → 분석 → 제작 → 축적 흐름으로 레퍼런스 자산을 운영합니다.</p>
      </div>
    </div>
  );
}
