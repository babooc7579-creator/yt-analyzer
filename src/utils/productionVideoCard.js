import {
  getRadarPriorityLabel,
  getRadarReasons,
  getRadarScore,
} from './radarCandidates';
import { getYouTubeVideoUrl } from './urls';

export const getProductionVideoCardViewProps = ({
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
}) => {
  const videoTitle = video.title || '제목 없는 영상';
  const videoUrl = getYouTubeVideoUrl(video.videoId);
  const isSaving = saveState === 'saving';
  const isMoving = moveState === 'saving';
  const radarScore = Math.round(getRadarScore(video));

  return {
    candidateReasonsProps: {
      priorityLabel: getRadarPriorityLabel(radarScore),
      radarScore,
      reasons: getRadarReasons(video),
    },
    draftFormProps: {
      isDirty,
      isSaving,
      onSave,
      onUpdateDraft,
      record,
      saveState,
      video,
      videoTitle,
    },
    metaBadgesProps: {
      columnId,
      scheduleSignal,
      video,
    },
    statusActionsProps: {
      columnId,
      isMoving,
      moveState,
      onMove,
      record,
      video,
      videoTitle,
      videoUrl,
    },
    videoTitle,
    videoUrl,
  };
};
