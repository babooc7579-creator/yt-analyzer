import React, { useMemo } from 'react';
import {
  DISCOVERY_RIGHTS_WARNINGS,
} from '../constants/discoveryLinks';
import { getProductionStatusFromRecord, PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from '../constants/status';
import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import { formatDateWithDots, getDateDistanceFromToday, getIsoTodayDate } from '../utils/dates';
import ProductionDiscoveryLinksSection from './ProductionDiscoveryLinksSection';
import ProductionKanbanBoard from './ProductionKanbanBoard';
import ProductionKanbanEmptyState from './ProductionKanbanEmptyState';
import ProductionKanbanSummary from './ProductionKanbanSummary';

const COLUMNS = [
  {
    id: PRODUCTION_STATUS.CANDIDATE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.CANDIDATE],
    description: '만들지 말지 판단할 소재',
    tone: 'border-indigo-200 bg-indigo-50',
  },
  {
    id: PRODUCTION_STATUS.ACTIVE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.ACTIVE],
    description: '지금 영상화하는 소재',
    tone: 'border-emerald-200 bg-emerald-50',
  },
  {
    id: PRODUCTION_STATUS.DONE,
    title: PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.DONE],
    description: '완성 후 기록으로 남긴 소재',
    tone: 'border-slate-200 bg-slate-50',
  },
];

const getDiscoveryLinkRightsStatusValue = (link) => link.rightsStatus || 'unknown';

const getScheduleSignal = (record) => {
  const distance = getDateDistanceFromToday(record?.targetPublishDate);
  if (distance === null) {
    return {
      label: '일정 미정',
      tone: 'bg-slate-100 text-slate-500',
    };
  }
  if (distance < 0) {
    return {
      label: `${Math.abs(distance)}일 지남`,
      tone: 'bg-rose-50 text-rose-600',
    };
  }
  if (distance === 0) {
    return {
      label: '오늘 예정',
      tone: 'bg-amber-100 text-amber-800',
    };
  }
  if (distance <= 3) {
    return {
      label: `${distance}일 남음`,
      tone: 'bg-amber-50 text-amber-700',
    };
  }
  return {
    label: formatDateWithDots(record.targetPublishDate),
    tone: 'bg-slate-100 text-slate-600',
  };
};

export default function ProductionKanban({
  discoveryLinks = [],
  videos,
  videoUserRecords,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
  onOpenReferenceVault,
}) {
  const {
    draftRecords,
    hasUnsavedChanges,
    linkMoveStates,
    moveDiscoveryLink,
    moveStates,
    moveVideo,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
  } = useProductionKanbanActions({
    onMoveVideo,
    onUpdateDiscoveryLink,
    onUpdateVideoRecord,
    videoUserRecords,
  });

  const discoveryLinkCandidates = useMemo(() => (
    discoveryLinks
      .filter((link) => (link.status || '') === 'candidate')
      .sort((left, right) => (
        new Date(right.updatedAt || right.createdAt || 0).getTime()
        - new Date(left.updatedAt || left.createdAt || 0).getTime()
      ))
  ), [discoveryLinks]);

  const groupedVideos = useMemo(() => {
    const grouped = videos.reduce((acc, video) => {
      const recordStatus = getProductionStatusFromRecord(videoUserRecords[video.videoId]);
      const status = acc[recordStatus] ? recordStatus : PRODUCTION_STATUS.CANDIDATE;
      acc[status].push(video);
      return acc;
    }, {
      [PRODUCTION_STATUS.CANDIDATE]: [],
      [PRODUCTION_STATUS.ACTIVE]: [],
      [PRODUCTION_STATUS.DONE]: [],
    });

    grouped[PRODUCTION_STATUS.CANDIDATE].sort((a, b) => Number(b.multiplier || 0) - Number(a.multiplier || 0));
    grouped[PRODUCTION_STATUS.ACTIVE].sort((a, b) => {
      const aRecord = videoUserRecords[a.videoId] || {};
      const bRecord = videoUserRecords[b.videoId] || {};
      const aDate = aRecord.targetPublishDate || '9999-12-31';
      const bDate = bRecord.targetPublishDate || '9999-12-31';
      return aDate.localeCompare(bDate);
    });
    grouped[PRODUCTION_STATUS.DONE].sort((a, b) => {
      const aRecord = videoUserRecords[a.videoId] || {};
      const bRecord = videoUserRecords[b.videoId] || {};
      return (bRecord.uploadedAt || '').localeCompare(aRecord.uploadedAt || '');
    });

    return grouped;
  }, [videos, videoUserRecords]);

  const productionSummary = useMemo(() => {
    const today = getIsoTodayDate();
    const scheduledVideos = videos
      .map(video => {
        const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};
        return {
          video,
          date: record.targetPublishDate || '',
        };
      })
      .filter(item => item.date)
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      candidateCount: groupedVideos[PRODUCTION_STATUS.CANDIDATE].length,
      activeCount: groupedVideos[PRODUCTION_STATUS.ACTIVE].length,
      uploadedCount: groupedVideos[PRODUCTION_STATUS.DONE].length,
      nextScheduled: scheduledVideos.find(item => item.date >= today) || scheduledVideos[0],
      overdueCount: scheduledVideos.filter(item => item.date < today).length,
      discoveryRightsWarningCount: discoveryLinkCandidates.filter(link => (
        DISCOVERY_RIGHTS_WARNINGS[getDiscoveryLinkRightsStatusValue(link)]
      )).length,
      activeWithoutDate: groupedVideos[PRODUCTION_STATUS.ACTIVE].filter((video) => {
        const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};
        return !record.targetPublishDate;
      }).length,
    };
  }, [discoveryLinkCandidates, draftRecords, groupedVideos, videoUserRecords, videos]);

  if (videos.length === 0 && discoveryLinkCandidates.length === 0) {
    return (
      <ProductionKanbanEmptyState
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
        onOpenReferenceVault={onOpenReferenceVault}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ProductionKanbanSummary
        discoveryLinkCandidateCount={discoveryLinkCandidates.length}
        productionSummary={productionSummary}
        videoCount={videos.length}
      />

      <ProductionDiscoveryLinksSection
        linkMoveStates={linkMoveStates}
        links={discoveryLinkCandidates}
        onMoveLink={moveDiscoveryLink}
        onOpenDiscoveryLinks={onOpenDiscoveryLinks}
      />

      <ProductionKanbanBoard
        columns={COLUMNS}
        draftRecords={draftRecords}
        getScheduleSignal={getScheduleSignal}
        groupedVideos={groupedVideos}
        hasUnsavedChanges={hasUnsavedChanges}
        moveStates={moveStates}
        onMove={moveVideo}
        onSave={saveDraftRecord}
        onUpdateDraft={updateDraftRecord}
        saveStates={saveStates}
        videoUserRecords={videoUserRecords}
      />
    </div>
  );
}
