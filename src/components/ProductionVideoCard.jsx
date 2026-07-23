import { getProductionVideoCardViewProps } from '../utils/productionVideoCard';
import ProductionVideoCandidateReasons from './ProductionVideoCandidateReasons';
import ProductionVideoDraftForm from './ProductionVideoDraftForm';
import ProductionVideoExternalActions from './ProductionVideoExternalActions';
import ProductionVideoMetaBadges from './ProductionVideoMetaBadges';
import ProductionVideoReadinessChecklist from './ProductionVideoReadinessChecklist';
import ProductionVideoStatusActions from './ProductionVideoStatusActions';
import YouTubeThumbnailImage from './YouTubeThumbnailImage';

export default function ProductionVideoCard({
  columnId,
  isDirty,
  moveState,
  onFocus,
  onMove,
  onSave,
  onUpdateDraft,
  record,
  saveState,
  scheduleSignal,
  video,
}) {
  const {
    candidateReasonsProps,
    draftFormProps,
    externalActionsProps,
    metaBadgesProps,
    readinessChecklistProps,
    statusActionsProps,
    thumbnailAlt,
    titleLinkAriaLabel,
    videoTitle,
    videoUrl,
  } = getProductionVideoCardViewProps({
    columnId,
    isDirty,
    moveState,
    onFocus,
    onMove,
    onSave,
    onUpdateDraft,
    record,
    saveState,
    scheduleSignal,
    video,
  });

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={titleLinkAriaLabel}
        className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400"
      >
        <YouTubeThumbnailImage
          src={video.thumbnail}
          videoId={video.videoId}
          alt={thumbnailAlt}
          className="aspect-video w-full object-cover bg-slate-100"
        />
      </a>
      <div className="p-3">
        <a href={videoUrl} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900 hover:text-indigo-600" title={videoTitle} aria-label={titleLinkAriaLabel}>
          {videoTitle}
        </a>
        <ProductionVideoMetaBadges {...metaBadgesProps} />
        <ProductionVideoCandidateReasons {...candidateReasonsProps} />

        <section className="mt-3 rounded-xl border border-slate-200 bg-white p-3" aria-label="1. 원본 확인">
          <p className="mb-2 text-[10px] font-extrabold text-slate-500">1. 원본 확인</p>
          <ProductionVideoExternalActions {...externalActionsProps} />
        </section>

        <ProductionVideoReadinessChecklist {...readinessChecklistProps} />

        <ProductionVideoDraftForm {...draftFormProps} />

        <ProductionVideoStatusActions {...statusActionsProps} />
      </div>
    </article>
  );
}
