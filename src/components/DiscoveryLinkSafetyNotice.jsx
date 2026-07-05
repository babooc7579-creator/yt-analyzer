export default function DiscoveryLinkSafetyNotice() {
  return (
    <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-xs leading-relaxed text-emerald-100">
      <p className="font-extrabold">안전 기준</p>
      <p className="mt-1">
        저장 영상 조회와 같은 Cloud DB 작업입니다. 선택 채널 새 영상 수집이나 외부 사이트 크롤링을 실행하지 않습니다.
      </p>
    </div>
  );
}
