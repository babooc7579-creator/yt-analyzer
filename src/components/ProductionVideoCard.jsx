import { getYouTubeVideoUrl } from '../utils/urls';
import ProductionVideoDraftForm from './ProductionVideoDraftForm';
import ProductionVideoMetaBadges from './ProductionVideoMetaBadges';
import ProductionVideoStatusActions from './ProductionVideoStatusActions';

export default function ProductionVideoCard({
  columnId,
  isDirty,
  moveState,
  onMove,
  onSave,
  onUpdateDraft,
  record,
  saveState,
  scheduleSignal,
  video,
}) {
  const videoTitle = video.title || '제목 없는 영상';
  const videoUrl = getYouTubeVideoUrl(video.videoId);
  const isSaving = saveState === 'saving';
  const isMoving = moveState === 'saving';
  const metaBadgesProps = {
    columnId,
    scheduleSignal,
    video,
  };

  const draftFormProps = {
    isDirty,
    isSaving,
    onSave,
    onUpdateDraft,
    record,
    saveState,
    video,
    videoTitle,
  };

  const statusActionsProps = {
    columnId,
    isMoving,
    moveState,
    onMove,
    record,
    video,
    videoTitle,
    videoUrl,
  };

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <img src={video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt={`${videoTitle} 썸네일`} className="aspect-video w-full object-cover bg-slate-100" />
      <div className="p-3">
        <a href={videoUrl} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900 hover:text-indigo-600" title={videoTitle} aria-label={`${videoTitle} YouTube 원본 영상 열기`}>
          {videoTitle}
        </a>
        <ProductionVideoMetaBadges {...metaBadgesProps} />

        <ProductionVideoDraftForm {...draftFormProps} />

        <ProductionVideoStatusActions {...statusActionsProps} />
      </div>
    </article>
  );
}
