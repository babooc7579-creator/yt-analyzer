import { LEGACY_ASIDE_COPY } from '../utils/legacyAsideProps';

const NEXT_ACTION_TONE_CLASS_NAMES = [
  {
    card: 'border border-indigo-100 bg-indigo-50/60 rounded-xl p-3',
    title: 'text-xs font-bold text-indigo-800',
  },
  {
    card: 'border border-emerald-100 bg-emerald-50 rounded-xl p-3',
    title: 'text-xs font-bold text-emerald-800',
  },
  {
    card: 'border border-blue-100 bg-blue-50 rounded-xl p-3',
    title: 'text-xs font-bold text-blue-800',
  },
];

const COLLECTION_LOOKUP_ACCENT_CLASS_NAMES = [
  'font-bold text-emerald-700',
  'font-bold text-blue-700',
];

export default function HiddenLegacyAside({
  checkedVideoCount,
  copy = LEGACY_ASIDE_COPY,
  savedVideoCount,
  selectedChannelCount,
  videoCount,
}) {
  return (
    <aside className="hidden">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">{copy.nextActionTitle}</p>
        <div className="space-y-3">
          {copy.nextActions.map((action, index) => (
            <div className={NEXT_ACTION_TONE_CLASS_NAMES[index].card} key={action.title}>
              <p className={NEXT_ACTION_TONE_CLASS_NAMES[index].title}>{action.title}</p>
              <p className="text-[11px] text-slate-600 mt-1">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">{copy.statusTitle}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{selectedChannelCount}</p>
            <p className="text-[11px] text-slate-500">{copy.statusLabels.selectedChannelCount}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{videoCount}</p>
            <p className="text-[11px] text-slate-500">{copy.statusLabels.videoCount}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{savedVideoCount}</p>
            <p className="text-[11px] text-slate-500">{copy.statusLabels.savedVideoCount}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{checkedVideoCount}</p>
            <p className="text-[11px] text-slate-500">{copy.statusLabels.checkedVideoCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">{copy.collectionLookupTitle}</p>
        <div className="space-y-3 text-[11px] text-slate-600 leading-relaxed">
          {copy.collectionLookupLines.map((line, index) => (
            <p key={line.accentText}>
              <span className={COLLECTION_LOOKUP_ACCENT_CLASS_NAMES[index]}>{line.accentText}</span>
              {line.text}
            </p>
          ))}
          <p className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-amber-800">{copy.collectionLookupWarning}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">{copy.ttoTtoTitle}</p>
        <div className="space-y-2 text-[11px] text-slate-600">
          {copy.ttoTtoCriteria.map((criterion) => (
            <p key={criterion}>{criterion}</p>
          ))}
        </div>
      </div>
    </aside>
  );
}
