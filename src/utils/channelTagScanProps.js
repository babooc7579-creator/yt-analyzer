const toSafeCount = (count) => {
  const numericCount = Number(count);

  return Number.isFinite(numericCount) ? Math.max(0, numericCount) : 0;
};

export const getChannelTagTabRowProps = ({
  category,
  count = 0,
  scannableCount = 0,
} = {}) => {
  const safeCount = toSafeCount(count);
  const safeScannableCount = toSafeCount(scannableCount);
  const canScanTag = safeScannableCount > 0;

  return {
    canScanTag,
    listButtonTitle: `'${category}' 태그 채널 목록 보기 - 운영중 ${safeScannableCount}개 / 전체 ${safeCount}개`,
    listButtonAriaLabel: `'${category}' 태그 채널 목록 보기`,
    scanButtonTitle: canScanTag
      ? `'${category}' 태그의 운영중 채널 ${safeScannableCount}개만 새 영상 수집합니다. YouTube API 호출이 발생하며 수집 영상 목록 불러오기와 다른 작업입니다.`
      : `'${category}' 태그에는 새 영상 수집을 실행할 운영중 채널이 없습니다. 보류/제외 채널은 수집하지 않습니다.`,
    scanButtonAriaLabel: canScanTag
      ? `'${category}' 태그 새 영상 수집, YouTube API 호출`
      : `'${category}' 태그 새 영상 수집 불가, 운영중 채널 없음`,
  };
};

export const getChannelTagScanNoticeProps = () => ({
  title: '태그별 새 영상 수집',
  description:
    '숫자는 운영중/전체 채널입니다. 새 영상 수집은 운영중 채널만 YouTube API로 확인합니다.',
});
