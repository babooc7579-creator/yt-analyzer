import {
  getProductionVideoDraftFieldProps,
  getProductionVideoDraftFieldsViewProps,
} from '../utils/productionVideoCard';

export default function ProductionVideoDraftFields({ onUpdateDraft, record, video, videoTitle }) {
  const {
    noteField,
    publishDateField,
    titleField,
  } = getProductionVideoDraftFieldsViewProps({ videoTitle });
  const safeRecord = record || {};
  const videoId = video?.videoId;
  const titleInputProps = getProductionVideoDraftFieldProps({
    fieldName: 'draftTitle',
    onUpdateDraft,
    videoId,
  });
  const noteInputProps = getProductionVideoDraftFieldProps({
    fieldName: 'note',
    onUpdateDraft,
    videoId,
  });
  const publishDateInputProps = getProductionVideoDraftFieldProps({
    fieldName: 'targetPublishDate',
    onUpdateDraft,
    videoId,
  });

  return (
    <>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">{titleField.label}</span>
        <input
          type="text"
          value={safeRecord.draftTitle || ''}
          onChange={titleInputProps.onChange}
          disabled={titleInputProps.disabled}
          placeholder={titleField.placeholder}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
          title={titleInputProps.title}
          aria-label={titleField['aria-label']}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">{noteField.label}</span>
        <textarea
          value={safeRecord.note || ''}
          onChange={noteInputProps.onChange}
          disabled={noteInputProps.disabled}
          placeholder={noteField.placeholder}
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          title={noteInputProps.title}
          aria-label={noteField['aria-label']}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">{publishDateField.label}</span>
        <input
          type="date"
          value={safeRecord.targetPublishDate || ''}
          onChange={publishDateInputProps.onChange}
          disabled={publishDateInputProps.disabled}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          title={publishDateInputProps.title || publishDateField.title}
          aria-label={publishDateField['aria-label']}
        />
      </label>
    </>
  );
}
