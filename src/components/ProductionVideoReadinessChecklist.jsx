import { CheckCircle2, CircleDashed } from 'lucide-react';

const TONE_CLASSES = {
  ready: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  working: 'border-slate-200 bg-white text-slate-600',
};

export default function ProductionVideoReadinessChecklist({
  description,
  items = [],
  summaryText,
  title,
  tone = 'working',
}) {
  if (items.length === 0) return null;

  return (
    <div className={`mt-3 rounded-xl border px-3 py-2 ${TONE_CLASSES[tone] || TONE_CLASSES.working}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-extrabold">{title}</p>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold">
          {summaryText}
        </span>
      </div>
      <p className="mt-1 text-[10px] leading-relaxed opacity-80">{description}</p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {items.map((item) => {
          const Icon = item.isReady ? CheckCircle2 : CircleDashed;
          return (
            <span
              key={item.key}
              className={`inline-flex items-center justify-between gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${
                item.isReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}
              title={item.title}
            >
              <span className="inline-flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {item.label}
              </span>
              <span>{item.isReady ? item.readyText : item.missingText}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
