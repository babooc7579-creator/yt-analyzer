import React from 'react';
import { CalendarDays, Link as LinkIcon } from 'lucide-react';

import { formatDateWithDots } from '../utils/dates';

export default function ProductionKanbanSummary({
  discoveryLinkCandidateCount,
  productionSummary,
  videoCount,
}) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-indigo-700">제작 칸반</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-900">후보를 제작 흐름으로 옮깁니다</h3>
          <p className="mt-1 text-xs text-slate-500">스크랩한 영상과 발견함 링크를 제작 후보, 제작 중, 업로드 완료 흐름으로 관리합니다.</p>
        </div>
        <p className="text-xs font-semibold text-slate-500">영상 {videoCount}개 관리 · 링크 {discoveryLinkCandidateCount}개 후보</p>
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
          <p className="mt-1 text-lg font-black text-amber-950">{discoveryLinkCandidateCount}개</p>
          {productionSummary.discoveryRightsWarningCount > 0 && (
            <p className="mt-1 text-[10px] font-bold text-rose-600">권리 확인 필요 {productionSummary.discoveryRightsWarningCount}개</p>
          )}
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-3">
          <p className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-700">
            <CalendarDays className="h-3 w-3" /> 다음 일정
          </p>
          <p className="mt-1 truncate text-sm font-black text-amber-950">
            {productionSummary.nextScheduled ? formatDateWithDots(productionSummary.nextScheduled.date) : '일정 없음'}
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
  );
}
