import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

import ProductionKanbanScheduleSummary from './ProductionKanbanScheduleSummary';
import ProductionKanbanSummaryCard from './ProductionKanbanSummaryCard';

export default function ProductionKanbanSummaryMetrics({
  discoveryLinkCandidateCount,
  productionSummary,
}) {
  return (
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
  );
}
