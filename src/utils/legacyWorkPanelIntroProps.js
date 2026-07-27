export const LEGACY_WORK_PANEL_INTRO_COPY = {
  brandTitle: '타임머신 CRM',
  workflowDescription: '채널 등록·선택 → 수집된 영상 정보 확인 → 필요할 때만 새 영상 수집',
  workflowSteps: [
    {
      description: '채널을 Cloud 목록에 등록하고 오늘 확인할 채널을 선택합니다. 선택만으로 새 영상 수집은 실행되지 않습니다.',
      title: '1. 채널 등록·선택',
    },
    {
      description: '온라인 저장소(Azure DB)에 이미 보관된 수집 영상 정보를 먼저 조회합니다. 새 YouTube API 호출은 없습니다.',
      title: '2. 수집 영상 목록 불러오기',
    },
    {
      description: '새 데이터가 필요할 때만 선택 채널의 새 영상을 확인합니다. YouTube API를 호출할 수 있습니다.',
      title: '3. 필요할 때 새 영상 수집',
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
