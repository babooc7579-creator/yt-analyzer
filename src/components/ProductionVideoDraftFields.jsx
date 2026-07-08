import { getProductionVideoDraftFieldsViewProps } from '../utils/productionVideoCard';

export default function ProductionVideoDraftFields({ onUpdateDraft, record, video, videoTitle }) {
  const {
    noteField,
    publishDateField,
    titleField,
  } = getProductionVideoDraftFieldsViewProps({ videoTitle });

  return (
    <>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">{titleField.label}</span>
        <input
          type="text"
          value={record.draftTitle || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { draftTitle: event.target.value })}
          placeholder={titleField.placeholder}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
          aria-label={titleField['aria-label']}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">{noteField.label}</span>
        <textarea
          value={record.note || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { note: event.target.value })}
          placeholder={noteField.placeholder}
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          aria-label={noteField['aria-label']}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">{publishDateField.label}</span>
        <input
          type="date"
          value={record.targetPublishDate || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { targetPublishDate: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          title={publishDateField.title}
          aria-label={publishDateField['aria-label']}
        />
      </label>
    </>
  );
}
