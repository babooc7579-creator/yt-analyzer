const toArray = (items) => (Array.isArray(items) ? items : []);

export const LEGACY_ASIDE_COPY = {
  collectionLookupLines: [
    {
      accentText: '선택 채널 새 영상 수집',
      text: '은 YouTube API를 호출해 새 영상 여부를 확인합니다.',
    },
    {
      accentText: '저장된 영상 불러오기',
      text: '는 이미 저장된 데이터만 조회합니다.',
    },
  ],
  collectionLookupTitle: '수집과 조회 차이',
  collectionLookupWarning: 'API 호출이 필요한 작업은 필요한 때만 실행하세요.',
  nextActionTitle: '오늘의 다음 행동',
  nextActions: [
    {
      description: '아직 없는 채널은 왼쪽에서 먼저 저장합니다.',
      title: '1. 채널 저장',
    },
    {
      description: '새 데이터가 필요할 때만 실행합니다.',
      title: '2. 새 영상 수집',
    },
    {
      description: '저장된 데이터만 보고 싶을 때 사용합니다.',
      title: '3. 저장 영상 조회',
    },
  ],
  statusLabels: {
    checkedVideoCount: '선택 영상',
    savedVideoCount: '스크랩',
    selectedChannelCount: '선택 채널',
    videoCount: '불러온 영상',
  },
  statusTitle: '현재 상태',
  ttoTtoCriteria: [
    '업로드 후 6개월 이상 지난 영상',
    '채널 평균보다 반응이 컸던 영상',
    '지금 다시 써도 소재로 확장 가능한 영상',
  ],
  ttoTtoTitle: '터또터 발굴 기준',
};

export function getLegacyAsideProps(props = {}) {
  return {
    checkedVideoCount: toArray(props.checkedVideos).length,
    copy: LEGACY_ASIDE_COPY,
    savedVideoCount: toArray(props.savedVideos).length,
    selectedChannelCount: toArray(props.selectedChannelIds).length,
    videoCount: props.totalVideoCount,
  };
}
