import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, Clock, Copy, ExternalLink, Link as LinkIcon, Loader2, Play, Rocket, Save, Star } from 'lucide-react';
import {
  DISCOVERY_RIGHTS_TONES,
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import { getProductionStatusFromRecord, PRODUCTION_STATUS, PRODUCTION_STATUS_LABELS } from '../constants/status';

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
const getDiscoveryLinkTitle = (link) => {
  if (link.title) return link.title;
  return getDiscoveryLinkHost(link.url, '발견 링크');
};
const getDiscoveryLinkRightsStatusValue = (link) => link.rightsStatus || 'unknown';

const copyTextToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error('copy_failed');
  }
};

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
  const [linkCopyStates, setLinkCopyStates] = useState({});

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

  const copyDiscoveryLink = async (linkId, url) => {
    if (!url || linkCopyStates[linkId] === 'copying') return;

    setLinkCopyStates(prev => ({ ...prev, [linkId]: 'copying' }));
    try {
      await copyTextToClipboard(url);
      setLinkCopyStates(prev => ({ ...prev, [linkId]: 'copied' }));
    } catch {
      setLinkCopyStates(prev => ({ ...prev, [linkId]: 'error' }));
    }

    setTimeout(() => {
      setLinkCopyStates(prev => {
        const next = { ...prev };
        delete next[linkId];
        return next;
      });
    }, 1800);
  };

  const renderDiscoveryLinkCandidate = (link) => {
    const linkMoveState = linkMoveStates[link.id];
    const isMovingLink = linkMoveState === 'saving';
    const copyState = linkCopyStates[link.id];
    const isCopyingLink = copyState === 'copying';
    const copyButtonLabel = copyState === 'copied'
      ? '복사 완료'
      : copyState === 'copying'
        ? '복사 중'
        : copyState === 'error'
          ? '복사 실패'
          : '링크 복사';
    const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
    const rightsWarning = DISCOVERY_RIGHTS_WARNINGS[rightsStatus];
    const sourceHost = getDiscoveryLinkHost(link.url);
    const platformLabel = getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link));
    const linkTitle = getDiscoveryLinkTitle(link);

    return (
      <article key={link.id} className={`rounded-xl border p-4 ${rightsWarning ? rightsWarning.cardClass : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold text-amber-800">링크 후보</span>
          <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
            {platformLabel}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
            출처 {sourceHost}
          </span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${(DISCOVERY_RIGHTS_TONES[rightsStatus] || DISCOVERY_RIGHTS_TONES.unknown).compactBadge}`}>
            {getDiscoveryRightsStatusLabel(rightsStatus)}
          </span>
        </div>
        <h4 className="mt-3 line-clamp-2 text-sm font-extrabold text-slate-900" title={linkTitle}>
          {linkTitle}
        </h4>
        <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
        {rightsWarning && (
          <div className={`mt-3 flex gap-2 rounded-lg border p-3 text-xs ${rightsWarning.panelClass}`}>
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-extrabold">{rightsWarning.title}</p>
              <p className="mt-1 leading-relaxed">{rightsWarning.description}</p>
            </div>
          </div>
        )}
        {link.memo ? (
          <p className="mt-3 line-clamp-3 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600">
            {link.memo}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-extrabold text-white transition hover:bg-slate-800"
            href={link.url}
            rel="noreferrer"
            target="_blank"
            title="원본 링크를 새 탭에서 열기"
            aria-label={`${linkTitle} 원본 링크 열기`}
          >
            원본 열기
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-3 text-[11px] font-extrabold transition disabled:opacity-50 ${
              copyState === 'copied'
                ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                : copyState === 'error'
                  ? 'border-red-100 bg-red-50 text-red-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            aria-label="원본 링크 복사"
            disabled={isCopyingLink}
            onClick={() => copyDiscoveryLink(link.id, link.url)}
            title="원본 링크 복사"
            type="button"
          >
            {copyState === 'copied' ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copyButtonLabel}
          </button>
          <button
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50"
            aria-label={`${linkTitle} 발견함에서 수정`}
            disabled={isMovingLink}
            onClick={onOpenDiscoveryLinks}
            title="발견함 화면에서 링크 상태와 메모 수정"
            type="button"
          >
            발견함에서 수정
          </button>
          <button
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 text-[11px] font-extrabold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
            aria-label={`${linkTitle} 발견함으로 되돌리기`}
            disabled={isMovingLink}
            onClick={() => moveDiscoveryLink(link.id, 'inbox')}
            title="제작 후보에서 빼고 발견함 받은 링크 상태로 저장"
            type="button"
          >
            {isMovingLink ? '저장 중...' : '발견함으로 되돌리기'}
          </button>
          <button
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 text-[11px] font-extrabold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            aria-label={`${linkTitle} 후보 제외`}
            disabled={isMovingLink}
            onClick={() => moveDiscoveryLink(link.id, 'discarded')}
            title="발견 링크를 후보 제외 상태로 저장"
            type="button"
          >
            {isMovingLink ? '저장 중...' : '후보 제외'}
          </button>
        </div>
        {linkMoveState === 'error' && (
          <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
            <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요.
          </p>
        )}
      </article>
    );
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
            <p className="mt-1 text-xs text-slate-500">스크랩한 소재를 제작 후보, 제작 중, 업로드 완료로 관리합니다.</p>
          </div>
          <p className="text-xs font-semibold text-slate-500">영상 {videos.length}개 · 링크 {discoveryLinkCandidates.length}개 후보</p>
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
            {discoveryLinkCandidates.map(renderDiscoveryLinkCandidate)}
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
                  const videoTitle = video.title || '제목 없는 영상';
                  const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};
                  const isDirty = hasUnsavedChanges(video.videoId);
                  const saveState = saveStates[video.videoId];
                  const isSaving = saveState === 'saving';
                  const moveState = moveStates[video.videoId];
                  const isMoving = moveState === 'saving';
                  const scheduleSignal = getScheduleSignal(record);

                  return (
                    <article key={video.videoId} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <img src={video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt={`${videoTitle} 썸네일`} className="aspect-video w-full object-cover bg-slate-100" />
                      <div className="p-3">
                        <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900 hover:text-indigo-600" title={videoTitle}>
                          {videoTitle}
                        </a>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{video.channel_title || video.channelTitle || '채널 정보 없음'}</span>
                          {column.id !== PRODUCTION_STATUS.CANDIDATE && (
                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${scheduleSignal.tone}`}>{scheduleSignal.label}</span>
                          )}
                          {video.multiplier !== undefined && (
                            <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600">대박 지수 {Number(video.multiplier || 0).toFixed(1)}x</span>
                          )}
                        </div>

                        <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <label className="block">
                            <span className="text-[10px] font-extrabold text-slate-500">내가 만들 제목</span>
                            <input
                              type="text"
                              value={record.draftTitle || ''}
                              onChange={(event) => updateDraftRecord(video.videoId, { draftTitle: event.target.value })}
                              placeholder="내 채널에 맞게 바꿀 제목 초안"
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
                              aria-label={`${videoTitle} 내가 만들 제목 입력`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-extrabold text-slate-500">메모</span>
                            <textarea
                              value={record.note || ''}
                              onChange={(event) => updateDraftRecord(video.videoId, { note: event.target.value })}
                              placeholder="훅 포인트, 참고할 장면, 만들 방향"
                              rows={2}
                              className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                              aria-label={`${videoTitle} 제작 메모 입력`}
                            />
                          </label>
                          <label className="block">
                            <span className="text-[10px] font-extrabold text-slate-500">업로드 예정일</span>
                            <input
                              type="date"
                              value={record.targetPublishDate || ''}
                              onChange={(event) => updateDraftRecord(video.videoId, { targetPublishDate: event.target.value })}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                              title="업로드 예정일 선택"
                              aria-label={`${videoTitle} 업로드 예정일 선택`}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => saveDraftRecord(video.videoId)}
                            disabled={!isDirty || isSaving}
                            className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isDirty && !isSaving ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            title={isDirty ? '제목, 메모, 업로드 예정일을 Cloud 판단 기록에 저장' : 'Cloud에 저장된 상태'}
                            aria-label={`${videoTitle} 제작 메모 저장`}
                          >
                            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            {isSaving ? '저장 중...' : isDirty ? '변경 내용 저장' : '저장됨'}
                          </button>
                          {saveState === 'saved' && (
                            <p className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" /> 클라우드에 저장됐습니다.
                            </p>
                          )}
                          {saveState === 'error' && (
                            <p className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                              <AlertCircle className="h-3 w-3" /> 저장 실패. 다시 저장해 주세요.
                            </p>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2">
                          {column.id !== PRODUCTION_STATUS.CANDIDATE && (
                            <button
                              type="button"
                              onClick={() => moveVideo(video.videoId, PRODUCTION_STATUS.CANDIDATE)}
                              disabled={isMoving}
                              className={`rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                              title="제작 상태를 후보로 되돌려 저장"
                              aria-label={`${videoTitle} 제작 후보로 이동`}
                            >
                              {isMoving ? '이동 중...' : '제작 후보로'}
                            </button>
                          )}
                          {column.id !== PRODUCTION_STATUS.ACTIVE && (
                            <button
                              type="button"
                              onClick={() => moveVideo(video.videoId, PRODUCTION_STATUS.ACTIVE)}
                              disabled={isMoving}
                              className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                              title="제작 중 상태로 저장"
                              aria-label={`${videoTitle} 제작 중으로 이동`}
                            >
                              {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />} {isMoving ? '이동 중...' : '제작 중으로'}
                            </button>
                          )}
                          {column.id !== PRODUCTION_STATUS.DONE && (
                            <button
                              type="button"
                              onClick={() => moveVideo(video.videoId, PRODUCTION_STATUS.DONE, { uploadedAt: record.uploadedAt || getTodayDate() })}
                              disabled={isMoving}
                              className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold ${isMoving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                              title="업로드 완료 상태로 저장하고 완료일을 기록"
                              aria-label={`${videoTitle} 업로드 완료로 이동`}
                            >
                              {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} {isMoving ? '이동 중...' : '업로드 완료'}
                            </button>
                          )}
                          {moveState === 'error' && (
                            <p className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-red-600">
                              <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요.
                            </p>
                          )}
                          {column.id === PRODUCTION_STATUS.DONE && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-bold text-slate-600">
                              업로드 완료일 {record.uploadedAt || '기록 없음'}
                            </div>
                          )}
                          <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:bg-slate-50" title="YouTube 원본 영상 열기" aria-label={`${videoTitle} YouTube 원본 보기`}>
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
