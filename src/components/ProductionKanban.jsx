import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Link as LinkIcon, Rocket, Star } from 'lucide-react';
import {
  DISCOVERY_RIGHTS_WARNINGS,
} from '../constants/discoveryLinks';
import { getProductionStatusFromRecord, PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from '../constants/status';
import ProductionDiscoveryLinkCard from './ProductionDiscoveryLinkCard';
import ProductionVideoCard from './ProductionVideoCard';

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

const getTodayDate = () => new Date().toISOString().slice(0, 10);
const formatDate = (date) => date ? date.split('-').join('.') : '';
const getDiscoveryLinkRightsStatusValue = (link) => link.rightsStatus || 'unknown';

const getDateDistance = (date) => {
  if (!date) return null;
  const today = new Date(`${getTodayDate()}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);
  return Math.round((target - today) / 86400000);
};

const getScheduleSignal = (record) => {
  const distance = getDateDistance(record?.targetPublishDate);
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
    label: formatDate(record.targetPublishDate),
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
  const [draftRecords, setDraftRecords] = useState({});
  const [saveStates, setSaveStates] = useState({});
  const [moveStates, setMoveStates] = useState({});
  const [linkMoveStates, setLinkMoveStates] = useState({});

  useEffect(() => {
    setDraftRecords(videoUserRecords);
  }, [videoUserRecords]);

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
    const today = getTodayDate();
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

  const updateDraftRecord = (videoId, updates) => {
    setDraftRecords(prev => ({
      ...prev,
      [videoId]: {
        ...(prev[videoId] || videoUserRecords[videoId] || {}),
        videoId,
        ...updates,
      },
    }));
  };

  const hasUnsavedChanges = (videoId) => {
    const saved = videoUserRecords[videoId] || {};
    const draft = draftRecords[videoId] || {};

    return (saved.draftTitle || '') !== (draft.draftTitle || '')
      || (saved.note || '') !== (draft.note || '')
      || (saved.targetPublishDate || '') !== (draft.targetPublishDate || '');
  };

  const saveDraftRecord = async (videoId) => {
    const draft = draftRecords[videoId] || {};
    setSaveStates(prev => ({ ...prev, [videoId]: 'saving' }));

    const didSave = await onUpdateVideoRecord(videoId, {
      draftTitle: draft.draftTitle || '',
      note: draft.note || '',
      targetPublishDate: draft.targetPublishDate || '',
    });

    setSaveStates(prev => ({ ...prev, [videoId]: didSave ? 'saved' : 'error' }));

    if (didSave) {
      setTimeout(() => {
        setSaveStates(prev => {
          if (prev[videoId] !== 'saved') return prev;
          const next = { ...prev };
          delete next[videoId];
          return next;
        });
      }, 2200);
    }
  };

  const moveVideo = async (videoId, status, extraUpdates = {}) => {
    setMoveStates(prev => ({ ...prev, [videoId]: 'saving' }));
    const didMove = await onMoveVideo(videoId, status, extraUpdates);
    setMoveStates(prev => ({ ...prev, [videoId]: didMove ? 'saved' : 'error' }));

    if (didMove) {
      setTimeout(() => {
        setMoveStates(prev => {
          if (prev[videoId] !== 'saved') return prev;
          const next = { ...prev };
          delete next[videoId];
          return next;
        });
      }, 1600);
    }
  };

  const moveDiscoveryLink = async (linkId, status) => {
    if (!onUpdateDiscoveryLink) return;

    setLinkMoveStates(prev => ({ ...prev, [linkId]: 'saving' }));
    const didMove = await onUpdateDiscoveryLink(linkId, { status });
    setLinkMoveStates(prev => ({ ...prev, [linkId]: didMove ? 'saved' : 'error' }));

    if (didMove) {
      setTimeout(() => {
        setLinkMoveStates(prev => {
          if (prev[linkId] !== 'saved') return prev;
          const next = { ...prev };
          delete next[linkId];
          return next;
        });
      }, 1600);
    }
  };

  if (videos.length === 0 && discoveryLinkCandidates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <Star className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-extrabold text-slate-800">제작 칸반에 후보가 없습니다</h3>
        <p className="mt-2 text-sm text-slate-500">레이더, 레퍼런스 금고, 발견함에서 제작 후보로 보내면 이곳에 모입니다.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onOpenReferenceVault}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
            title="저장된 영상 후보를 볼 수 있는 레퍼런스 금고 열기"
            aria-label="저장된 영상 후보를 볼 수 있는 레퍼런스 금고 열기"
          >
            <Rocket className="h-4 w-4" /> 레퍼런스 금고 열기
          </button>
          <button
            type="button"
            onClick={onOpenDiscoveryLinks}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            title="외부 링크 후보를 저장하고 관리하는 발견함 열기"
            aria-label="외부 링크 후보를 저장하고 관리하는 발견함 열기"
          >
            <LinkIcon className="h-4 w-4" /> 발견함 열기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-indigo-100 bg-white p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-extrabold text-indigo-700">제작 칸반</p>
            <h3 className="mt-1 text-xl font-extrabold text-slate-900">후보를 제작 흐름으로 옮깁니다</h3>
            <p className="mt-1 text-xs text-slate-500">스크랩한 영상과 발견함 링크를 제작 후보, 제작 중, 업로드 완료 흐름으로 관리합니다.</p>
          </div>
          <p className="text-xs font-semibold text-slate-500">영상 {videos.length}개 관리 · 링크 {discoveryLinkCandidates.length}개 후보</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-5">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-3">
            <p className="text-[10px] font-extrabold uppercase text-indigo-500">제작 후보</p>
            <p className="mt-1 text-lg font-black text-indigo-900">{productionSummary.candidateCount}개</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3">
            <p className="text-[10px] font-extrabold uppercase text-emerald-600">제작 중</p>
            <p className="mt-1 text-lg font-black text-emerald-900">{productionSummary.activeCount}개</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-extrabold uppercase text-slate-500">업로드 완료</p>
            <p className="mt-1 text-lg font-black text-slate-900">{productionSummary.uploadedCount}개</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-3">
            <p className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-700">
              <LinkIcon className="h-3 w-3" /> 링크 후보
            </p>
            <p className="mt-1 text-lg font-black text-amber-950">{discoveryLinkCandidates.length}개</p>
            {productionSummary.discoveryRightsWarningCount > 0 && (
              <p className="mt-1 text-[10px] font-bold text-rose-600">권리 확인 필요 {productionSummary.discoveryRightsWarningCount}개</p>
            )}
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-3">
            <p className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-700">
              <CalendarDays className="h-3 w-3" /> 다음 일정
            </p>
            <p className="mt-1 truncate text-sm font-black text-amber-950">
              {productionSummary.nextScheduled ? formatDate(productionSummary.nextScheduled.date) : '일정 없음'}
            </p>
            {productionSummary.nextScheduled && (
              <p className="mt-1 line-clamp-1 text-[10px] font-bold text-amber-800">
                {productionSummary.nextScheduled.video.title}
              </p>
            )}
            {productionSummary.overdueCount > 0 && (
              <p className="mt-1 text-[10px] font-bold text-rose-600">지난 일정 {productionSummary.overdueCount}개 확인 필요</p>
            )}
            {productionSummary.activeWithoutDate > 0 && (
              <p className="mt-1 text-[10px] font-bold text-amber-700">제작 중 {productionSummary.activeWithoutDate}개 일정 미정</p>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-indigo-50 pt-3 text-[11px] font-bold text-slate-500">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">영상 기준: 스크랩북/제작 상태 기록</span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">링크 기준: 발견함에서 제작 후보로 표시한 링크</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">새 YouTube API 호출 없음</span>
        </div>
      </div>

      {discoveryLinkCandidates.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-white p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-700">
                <LinkIcon className="h-4 w-4" />
                발견함 링크 후보
              </p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-900">외부에서 저장한 제작 후보 링크</h3>
              <p className="mt-1 text-xs text-slate-500">
                발견함에서 상태를 제작 후보로 바꾼 링크입니다. 아직 별도 제작 DB로 옮긴 것은 아니며, 후보 참고 목록으로 보여줍니다.
              </p>
            </div>
            <button
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
              aria-label="발견함 링크 관리 화면 열기"
              onClick={onOpenDiscoveryLinks}
              title="발견함 화면에서 링크 후보를 수정"
              type="button"
            >
              <LinkIcon className="h-4 w-4" />
              발견함 열기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {discoveryLinkCandidates.map((link) => (
              <ProductionDiscoveryLinkCard
                key={link.id}
                link={link}
                moveState={linkMoveStates[link.id]}
                onEditInDiscoveryLinks={onOpenDiscoveryLinks}
                onMove={moveDiscoveryLink}
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {COLUMNS.map((column) => (
          <section key={column.id} className={`rounded-2xl border p-4 ${column.tone}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{column.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{column.description}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700 shadow-sm">{groupedVideos[column.id].length}</span>
            </div>

            <div className="space-y-3">
              {groupedVideos[column.id].length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-xs font-semibold text-slate-400">비어 있음</div>
              ) : (
                groupedVideos[column.id].map((video) => {
                  const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};
                  const isDirty = hasUnsavedChanges(video.videoId);
                  const saveState = saveStates[video.videoId];
                  const moveState = moveStates[video.videoId];
                  const scheduleSignal = getScheduleSignal(record);

                  return (
                    <ProductionVideoCard
                      key={video.videoId}
                      columnId={column.id}
                      isDirty={isDirty}
                      moveState={moveState}
                      onMove={moveVideo}
                      onSave={saveDraftRecord}
                      onUpdateDraft={updateDraftRecord}
                      record={record}
                      saveState={saveState}
                      scheduleSignal={scheduleSignal}
                      video={video}
                    />
                  );
                })
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
