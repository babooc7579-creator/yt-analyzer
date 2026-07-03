import React from 'react';
import { PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from '../constants/status';
import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import { useProductionKanbanData } from '../hooks/useProductionKanbanData';
import { formatDateWithDots, getDateDistanceFromToday } from '../utils/dates';
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

  const {
    discoveryLinkCandidates,
    groupedVideos,
    productionSummary,
  } = useProductionKanbanData({
    discoveryLinks,
    draftRecords,
    videoUserRecords,
    videos,
  });

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
