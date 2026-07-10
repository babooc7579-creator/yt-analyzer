export const getHomeRadarWorkflowSectionHeaderProps = () => ({
  eyebrow: '오늘 작업 흐름',
  description: '저장된 영상을 먼저 불러오고, 레이더 후보를 판단한 뒤, 만들 만한 항목만 제작 후보로 표시합니다.',
  safetyNote: '이 영역은 Cloud DB 조회와 Cloud 판단 기록 중심입니다. 새 영상 수집은 선택 채널 새 영상 수집 버튼에서만 실행됩니다.',
});

export const getHomeRadarWorkflowCards = ({
  loadedVideoCount = 0,
  openRadarCandidateCount = 0,
} = {}) => ([
  {
    key: 'load-stored-videos',
    title: '1. 저장된 영상 불러오기',
    description: '이미 Cloud DB에 저장된 영상만 화면에 올립니다. 새 YouTube API 호출은 없습니다.',
    value: `${loadedVideoCount}개`,
  },
  {
    key: 'judge-radar-candidates',
    title: '2. 오늘 후보 판단',
    description: '레이더가 먼저 볼 후보를 점수순으로 보여줍니다. 판단한 영상은 Cloud 판단 기록에 저장되고 오늘 레이더에서 숨겨집니다.',
    value: `${openRadarCandidateCount}개 남음`,
  },
]);
