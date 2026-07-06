const toArray = (items) => (Array.isArray(items) ? items : []);

export default function ChannelBulkResultPanel({
  bulkResult,
  resetBulkAdd,
}) {
  if (!bulkResult) return null;
  const failedResults = toArray(bulkResult.results).filter((result) => !result.success);

  return (
    <div className="p-2 bg-white rounded-lg border border-indigo-200 text-xs space-y-1 max-h-32 overflow-y-auto">
      <p className="font-bold text-slate-700">총 {bulkResult.total}개 중 {bulkResult.added}개 성공</p>
      {failedResults.map((result, index) => (
        <p key={index} className="text-red-500 truncate">실패: {result.handle} - {result.error}</p>
      ))}
      <button
        type="button"
        onClick={resetBulkAdd}
        className="mt-1 w-full text-center text-indigo-600 hover:text-indigo-800 font-semibold"
        title="일괄 저장 결과 닫기"
        aria-label="채널 일괄 저장 결과 닫기"
      >
        닫기
      </button>
    </div>
  );
}
