export const getVideoToolbarFiltersViewProps = ({
  lengthFilter,
  onResetFilters,
  searchKeyword,
  selectedVideoCount,
  setLengthFilter,
  setSearchKeyword,
  setShowWorkPanel,
  setSortType,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
  ttoTtoMode,
  viewFilter,
  viewMode,
}) => ({
  searchFieldProps: {
    searchKeyword,
    setSearchKeyword,
  },
  selectFiltersProps: {
    lengthFilter,
    setLengthFilter,
    setViewFilter,
    viewFilter,
  },
  sortControlProps: {
    setSortType,
    sortType,
  },
  statusProps: {
    activeFilterCount: [
      Boolean(searchKeyword?.trim()),
      Number(viewFilter) > 0,
      Boolean(lengthFilter && lengthFilter !== 'all'),
      Boolean(ttoTtoMode),
    ].filter(Boolean).length,
    onResetFilters,
    selectedVideoCount: Number(selectedVideoCount) || 0,
  },
  viewModeControlProps: {
    setViewMode,
    viewMode,
  },
  workPanelToggleProps: {
    setShowWorkPanel,
    showWorkPanel,
  },
});

export const getVideoToolbarSearchFieldViewProps = ({ searchKeyword } = {}) => ({
  ariaLabel: '수집 영상 제목 검색',
  clearAriaLabel: '수집 영상 검색어 지우기, 영상 선택 유지, API 호출 없음',
  clearTitle: '검색어만 지웁니다. 영상 선택은 유지하며 Azure DB나 YouTube API를 호출하지 않습니다.',
  placeholder: '제목 검색...',
  showClearButton: Boolean(searchKeyword),
  title: '불러온 수집 영상의 제목만 검색합니다. YouTube API를 새로 호출하지 않습니다.',
});

export const getVideoToolbarSelectFiltersViewProps = () => ({
  lengthFilterAriaLabel: '영상 길이 필터',
  lengthFilterOptions: [
    { label: '길이 전체', value: 'all' },
    { label: '쇼츠만', value: 'shorts' },
    { label: '롱폼만', value: 'long' },
  ],
  lengthFilterTitle: '불러온 수집 영상 정보의 쇼츠/롱폼 길이 필터입니다. YouTube API를 새로 호출하지 않습니다.',
  viewFilterAriaLabel: '조회수 조건 필터',
  viewFilterOptions: [
    { label: '조회수 전체', value: 0 },
    { label: '10만 이상', value: 100000 },
    { label: '50만 이상', value: 500000 },
    { label: '100만 이상', value: 1000000 },
  ],
  viewFilterTitle: '불러온 수집 영상 정보의 조회수 조건 필터입니다. YouTube API를 새로 호출하지 않습니다.',
});

export const getVideoToolbarSortControlOptions = () => [
  {
    value: 'multiplier',
    label: '대박지수',
    title: '현재 불러온 수집 영상 정보를 대박 지수 높은 순으로 정렬합니다. YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '대박 지수 높은 순 정렬, 화면 정렬만 변경, YouTube API 호출 없음',
    activeClassName: 'text-indigo-700',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-bold',
  },
  {
    value: 'viral',
    label: '화제성(일평균)',
    title: '현재 불러온 수집 영상 정보를 일평균 조회 반응이 높은 순으로 정렬합니다. YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '화제성 높은 순 정렬, 화면 정렬만 변경, YouTube API 호출 없음',
    activeClassName: 'text-orange-600',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
  {
    value: 'date',
    label: '최신순',
    title: '현재 불러온 수집 영상 정보를 업로드 최신순으로 정렬합니다. YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '최신순 정렬, 화면 정렬만 변경, YouTube API 호출 없음',
    activeClassName: 'text-slate-800',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
  {
    value: 'likes',
    label: '참여율(좋아요)',
    title: '현재 불러온 수집 영상 정보를 참여율 높은 순으로 정렬합니다. YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '참여율 높은 순 정렬, 화면 정렬만 변경, YouTube API 호출 없음',
    activeClassName: 'text-rose-600',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
];

export const getVideoToolbarViewModeOptions = () => [
  {
    value: 'card',
    label: '카드 보기',
    title: '현재 불러온 수집 영상 정보를 카드 형태로 봅니다. YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '카드 보기로 전환, 화면 표시만 변경, YouTube API 호출 없음',
  },
  {
    value: 'list',
    label: '리스트 보기',
    title: '현재 불러온 수집 영상 정보를 표 형태로 봅니다. YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '리스트 보기로 전환, 화면 표시만 변경, YouTube API 호출 없음',
  },
];

export const getVideoToolbarWorkPanelToggleViewProps = ({ showWorkPanel }) => ({
  ariaLabel: showWorkPanel
    ? '작업 패널 닫기, 화면 표시만 변경, YouTube API 호출 없음'
    : '작업 패널 열기, 화면 표시만 변경, YouTube API 호출 없음',
  label: showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기',
  title: showWorkPanel
    ? '작업 패널을 숨깁니다. 화면 표시만 바꾸며 YouTube API를 새로 호출하지 않습니다.'
    : '카드 보기에서 작업 패널을 함께 봅니다. 화면 표시만 바꾸며 YouTube API를 새로 호출하지 않습니다.',
});
