export const getHomeRadarWorkflowSectionHeaderProps = () => ({
  eyebrow: '오늘 작업 흐름',
  description: '수집된 영상 정보를 먼저 불러오고, 레이더 후보를 판단한 뒤, 만들 만한 항목만 제작 후보로 표시합니다.',
  safetyNote: '이 영역은 온라인 저장소(Azure DB) 조회와 판단 기록 저장 중심입니다. 새 영상 수집은 선택 채널 새 영상 수집 버튼에서만 실행됩니다.',
});

export const getHomeRadarWorkflowCards = ({
  loadedVideoCount = 0,
  openRadarCandidateCount = 0,
} = {}) => ([
  {
    key: 'load-stored-videos',
    title: '1. 수집 영상 목록 불러오기',
    description: '이미 온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 화면에 올립니다. 새 YouTube API 호출은 없습니다.',
    value: `${loadedVideoCount}개`,
  },
  {
    key: 'judge-radar-candidates',
    title: '2. 오늘 후보 판단',
    description: '레이더가 먼저 볼 후보를 점수순으로 보여줍니다. 판단한 영상은 온라인 저장소(Azure DB)의 판단 기록에 저장되고 오늘 레이더에서 숨겨집니다.',
    value: `${openRadarCandidateCount}개 남음`,
  },
]);
