import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

import ProductionKanbanScheduleSummary from './ProductionKanbanScheduleSummary';
import ProductionKanbanSummaryCard from './ProductionKanbanSummaryCard';

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
        <ProductionKanbanSummaryCard
          label="제작 후보"
          labelClassName="text-indigo-500"
          value={`${productionSummary.candidateCount}개`}
          valueClassName="text-lg text-indigo-900"
          wrapperClassName="border-indigo-100 bg-indigo-50"
        />
        <ProductionKanbanSummaryCard
          label="제작 중"
          labelClassName="text-emerald-600"
          value={`${productionSummary.activeCount}개`}
          valueClassName="text-lg text-emerald-900"
          wrapperClassName="border-emerald-100 bg-emerald-50"
        />
        <ProductionKanbanSummaryCard
          label="업로드 완료"
          labelClassName="text-slate-500"
          value={`${productionSummary.uploadedCount}개`}
          valueClassName="text-lg text-slate-900"
          wrapperClassName="border-slate-200 bg-slate-50"
        />
        <ProductionKanbanSummaryCard
          label={<><LinkIcon className="h-3 w-3" /> 링크 후보</>}
          labelClassName="inline-flex items-center gap-1 text-amber-700"
          value={`${discoveryLinkCandidateCount}개`}
          valueClassName="text-lg text-amber-950"
          wrapperClassName="border-amber-100 bg-amber-50"
        >
          {productionSummary.discoveryRightsWarningCount > 0 && (
            <p className="mt-1 text-[10px] font-bold text-rose-600">권리 확인 필요 {productionSummary.discoveryRightsWarningCount}개</p>
          )}
        </ProductionKanbanSummaryCard>
        <ProductionKanbanScheduleSummary productionSummary={productionSummary} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-indigo-50 pt-3 text-[11px] font-bold text-slate-500">
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">영상 기준: 스크랩북/제작 상태 기록</span>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">링크 기준: 발견함에서 제작 후보로 표시한 링크</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">새 YouTube API 호출 없음</span>
      </div>
    </div>
  );
}
