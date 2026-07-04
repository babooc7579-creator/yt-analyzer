import HomeOperatingGuidelineCard from './HomeOperatingGuidelineCard';

const GUIDELINES = [
  {
    title: '수집은 API 호출',
    description: '새 영상 수집은 YouTube API를 호출합니다. 필요한 채널만 체크해서 실행하세요.',
    className: 'border-emerald-400/20 bg-emerald-500/10',
    titleClassName: 'text-emerald-200',
  },
  {
    title: '불러오기는 저장 데이터 조회',
    description: '저장된 영상 불러오기는 이미 DB에 있는 영상만 보여줍니다.',
    className: 'border-blue-400/20 bg-blue-500/10',
    titleClassName: 'text-blue-200',
  },
  {
    title: '터또터 기준',
    description: '한 번 반응이 검증된 영상을 재편집해 다시 살릴 후보를 우선 확인합니다.',
    className: 'border-orange-400/20 bg-orange-500/10',
    titleClassName: 'text-orange-200',
  },
];

export default function HomeOperatingGuidelines() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
      <p className="text-sm font-extrabold text-white">운영 기준</p>
      <div className="mt-4 space-y-3 text-sm text-slate-400">
        {GUIDELINES.map(guideline => (
          <HomeOperatingGuidelineCard key={guideline.title} guideline={guideline} />
        ))}
      </div>
    </section>
  );
}
