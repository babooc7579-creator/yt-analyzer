import { CheckCircle2, CircleDashed } from 'lucide-react';

const TONE_CLASSES = {
  ready: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  working: 'border-slate-200 bg-white text-slate-600',
};

export default function ProductionVideoReadinessChecklist({
  description,
  items = [],
  remainingItems,
  summaryText,
  title,
  tone = 'working',
}) {
  if (items.length === 0) return null;

  const displayItems = Array.isArray(remainingItems)
    ? remainingItems
    : items.filter((item) => !item.isReady);
  const isReady = tone === 'ready' || displayItems.length === 0;

  return (
    <div className={`mt-3 rounded-xl border px-3 py-2 ${TONE_CLASSES[tone] || TONE_CLASSES.working}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1 text-[10px] font-extrabold">
          {isReady ? <CheckCircle2 className="h-3 w-3" /> : <CircleDashed className="h-3 w-3" />}
          {title}
        </p>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold">
          {summaryText}
        </span>
      </div>
      <p className="mt-1 text-[10px] leading-relaxed opacity-80">{description}</p>
      {displayItems.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {displayItems.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center justify-between gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500"
              title={item.title}
            >
              <span className="inline-flex items-center gap-1">
                <CircleDashed className="h-3 w-3" />
                {item.label}
              </span>
              <span>{item.missingText}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
