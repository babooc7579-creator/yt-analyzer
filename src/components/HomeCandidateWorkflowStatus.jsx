export default function HomeCandidateWorkflowStatus({
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  hasRightsWarning,
  productionCandidateCount,
}) {
  return (
    <>
      <p className={`mt-2 text-xs leading-relaxed ${hasRightsWarning ? 'text-amber-100/80' : 'text-emerald-100/70'}`}>
        {hasRightsWarning
          ? `링크 후보 중 권리 확인이 필요한 항목 ${discoveryRightsWarningCount}개가 있습니다.`
          : '만들 만한 영상과 외부 발견 링크를 제작 후보로 모으고, 나머지는 봤음/나중에 보기/제외로 정리합니다.'}
      </p>
      <p className="mt-3 text-lg font-black text-white">{`영상 ${productionCandidateCount}개 · 링크 ${discoveryCandidateCount}개`}</p>
    </>
  );
}
