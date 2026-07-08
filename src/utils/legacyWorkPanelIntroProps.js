export const LEGACY_WORK_PANEL_INTRO_COPY = {
  brandTitle: '타임머신 CRM',
  workflowDescription: '채널 저장 → 필요할 때만 새 영상 수집 → 저장된 영상 확인',
  workflowSteps: [
    {
      description: '소재를 모을 유튜브 채널을 Cloud 목록에 추가합니다. 채널 저장만으로 새 영상 수집은 실행되지 않습니다.',
      title: '1. 먼저 채널 저장',
    },
    {
      description: '새 데이터가 필요할 때만 실행합니다. YouTube API를 호출할 수 있습니다.',
      title: '2. 선택 채널 새 영상 수집',
    },
    {
      description: 'Cloud DB에 이미 저장된 영상만 조회합니다. 새 YouTube API 호출은 없습니다.',
      title: '3. 저장된 영상 불러오기',
    },
  ],
  workflowTitle: '오늘의 작업 흐름',
};

export const getLegacyWorkPanelIntroViewProps = ({
  apiKey = '',
  onChangeApiKey,
} = {}) => ({
  ...LEGACY_WORK_PANEL_INTRO_COPY,
  apiKeyInputProps: {
    'aria-label': '댓글 Top 10 조회용 YouTube API Key',
    onChange: (event) => onChangeApiKey?.(event.target.value),
    placeholder: 'YouTube API Key (댓글 스캔에만 필요)',
    type: 'password',
    value: apiKey,
  },
});
