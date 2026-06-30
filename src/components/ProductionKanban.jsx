import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, Clock, ExternalLink, Loader2, Play, Rocket, Save, Star } from 'lucide-react';
import { PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from '../constants/status';

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

const getProductionStatus = (record) => {
  if (record?.status === PRODUCTION_STATUS.ACTIVE) return PRODUCTION_STATUS.ACTIVE;
  if (record?.status === PRODUCTION_STATUS.DONE) return PRODUCTION_STATUS.DONE;
  return PRODUCTION_STATUS.CANDIDATE;
};

const getTodayDate = () => new Date().toISOString().slice(0, 10);
const formatDate = (date) => date ? date.split('-').join('.') : '';
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
  videos,
  videoUserRecords,
  onMoveVideo,
  onUpdateVideoRecord,
  onOpenReferenceVault,
}) {
  const [draftRecords, setDraftRecords] = useState({});
  const [saveStates, setSaveStates] = useState({});
  const [moveStates, setMoveStates] = useState({});

  useEffect(() => {
    setDraftRecords(videoUserRecords);
  }, [videoUserRecords]);

  const groupedVideos = useMemo(() => {
    const grouped = videos.reduce((acc, video) => {
      const status = getProductionStatus(videoUserRecords[video.videoId]);
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
      activeWithoutDate: groupedVideos[PRODUCTION_STATUS.ACTIVE].filter((video) => {
        const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};
        return !record.targetPublishDate;
      }).length,
    };
  }, [draftRecords, groupedVideos, videoUserRecords, videos]);

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

  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <Star className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-extrabold text-slate-800">제작 칸반에 올릴 후보가 없습니다</h3>
        <p className="mt-2 text-sm text-slate-500">레이더나 레퍼런스 금고에서 스크랩을 누르면 이곳에 제작 후보로 모입니다.</p>
        <button onClick={onOpenReferenceVault} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700">
          <Rocket className="h-4 w-4" /> 레퍼런스 금고 열기
        </button>
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
            <p className="mt-1 text-xs text-slate-500">스크랩한 소재를 제작 후보, 제작 중, 업로드 완료로 관리합니다.</p>
          </div>
          <p className="text-xs font-semibold text-slate-500">총 {videos.length}개 소재</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4">
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
              <CalendarDays className="h-3 w-3" /> 다음 예정
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
      </div>

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
                  const isSaving = saveState === 'saving';
                  const moveState = moveStates[video.videoId];
                  const isMoving = moveState === 'saving';
                  const scheduleSignal = getScheduleSignal(record);

                  return (
                    <article key={video.videoId} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <img src={video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt="" className="aspect-video w-full object-cover bg-slate-100" />
                      <div className="p-3">
                        <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900 hover:text-indigo-600">
                          {video.title}
                        </a>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{video.channel_title || video.channelTitle || '채널 정보 없음'}</span>
                          {column.id !== PRODUCTION_STATUS.CANDIDATE && (
                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${scheduleSignal.tone}`}>{scheduleSignal.label}</span>
                          )}
                          {video.multiplier !== undefined && (
                            <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600">대박지수 {Number(video.multiplier || 0).toFixed(1)}x</span>
                          )}
                        </div>

                        <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <label className="block">
                            <span className="text-[10px] font-extrabold text-slate-500">내가 만들 제목</span>
                            <input
                              type="text"
                              value={record.draftTitle || ''}
                              onChange={(event) => updateDraftRecord(video.videoId, { draftTitle: event.target.value })}
                              placeholder="예) 한국형으로 바꾼 제목 초안"
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-extrabold text-slate-500">메모</span>
                            <textarea
                              value={record.note || ''}
                              onChange={(event) => updateDraftRecord(video.videoId, { note: event.target.value })}
                              placeholder="후킹 포인트, 참고할 장면, 만들 방향"
                              rows={2}
                              className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-extrabold text-slate-500">업로드 예정일</span>
                            <input
                              type="date"
                              value={record.targetPublishDate || ''}
                              onChange={(event) => updateDraftRecord(video.videoId, { targetPublishDate: event.target.value })}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                          </label>
                          <button
                            onClick={() => saveDraftRecord(video.videoId)}
                            disabled={!isDirty || isSaving}
                            className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isDirty && !isSaving ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                          >
                            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            {isSaving ? '저장 중...' : isDirty ? '변경 내용 저장' : '저장됨'}
                          </button>
                          {saveState === 'saved' && (
                            <p className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" /> 클라우드에 저장됐습니다
                            </p>
                          )}
                          {saveState === 'error' && (
                            <p className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                              <AlertCircle className="h-3 w-3" /> 저장 실패. 다시 저장해 주세요
                            </p>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2">
                          {column.id !== PRODUCTION_STATUS.CANDIDATE && (
                            <button onClick={() => moveVideo(video.videoId, PRODUCTION_STATUS.CANDIDATE)} disabled={isMoving} className={`rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                              {isMoving ? '이동 중...' : '제작 후보로'}
                            </button>
                          )}
                          {column.id !== PRODUCTION_STATUS.ACTIVE && (
                            <button onClick={() => moveVideo(video.videoId, PRODUCTION_STATUS.ACTIVE)} disabled={isMoving} className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                              {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />} {isMoving ? '이동 중...' : '제작 중으로'}
                            </button>
                          )}
                          {column.id !== PRODUCTION_STATUS.DONE && (
                            <button onClick={() => moveVideo(video.videoId, PRODUCTION_STATUS.DONE, { uploadedAt: record.uploadedAt || getTodayDate() })} disabled={isMoving} className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                              {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} {isMoving ? '이동 중...' : '업로드 완료'}
                            </button>
                          )}
                          {moveState === 'error' && (
                            <p className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-red-600">
                              <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요
                            </p>
                          )}
                          {column.id === PRODUCTION_STATUS.DONE && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-bold text-slate-600">
                              업로드 완료일: {record.uploadedAt || '기록 없음'}
                            </div>
                          )}
                          <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:bg-slate-50">
                            <Play className="h-3.5 w-3.5" /> 원본 보기 <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </article>
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
