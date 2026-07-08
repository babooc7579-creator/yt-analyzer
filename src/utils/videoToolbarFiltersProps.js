export const getVideoToolbarFiltersViewProps = ({
  lengthFilter,
  searchKeyword,
  setLengthFilter,
  setSearchKeyword,
  setShowWorkPanel,
  setSortType,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
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
  viewModeControlProps: {
    setViewMode,
    viewMode,
  },
  workPanelToggleProps: {
    setShowWorkPanel,
    showWorkPanel,
  },
});

export const getVideoToolbarSearchFieldViewProps = () => ({
  ariaLabel: '저장 영상 제목 검색',
  placeholder: '제목 검색...',
  title: '불러온 저장 영상 제목 검색',
});

export const getVideoToolbarSelectFiltersViewProps = () => ({
  lengthFilterAriaLabel: '영상 길이 필터',
  lengthFilterOptions: [
    { label: '길이 전체', value: 'all' },
    { label: '쇼츠만', value: 'shorts' },
    { label: '롱폼만', value: 'long' },
  ],
  lengthFilterTitle: '쇼츠/롱폼 길이 필터',
  viewFilterAriaLabel: '조회수 조건 필터',
  viewFilterOptions: [
    { label: '조회수 전체', value: 0 },
    { label: '10만 이상', value: 100000 },
    { label: '50만 이상', value: 500000 },
    { label: '100만 이상', value: 1000000 },
  ],
  viewFilterTitle: '불러온 저장 영상의 조회수 조건 필터',
});

export const getVideoToolbarSortControlOptions = () => [
  {
    value: 'multiplier',
    label: '대박지수',
    title: '대박 지수 높은 순으로 정렬',
    ariaLabel: '대박 지수 높은 순 정렬',
    activeClassName: 'text-indigo-700',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-bold',
  },
  {
    value: 'viral',
    label: '화제성(일평균)',
    title: '일평균 조회 반응이 높은 순으로 정렬',
    ariaLabel: '화제성 높은 순 정렬',
    activeClassName: 'text-orange-600',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
  {
    value: 'date',
    label: '최신순',
    title: '업로드 최신순으로 정렬',
    ariaLabel: '최신순 정렬',
    activeClassName: 'text-slate-800',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
  {
    value: 'likes',
    label: '참여율(좋아요)',
    title: '참여율 높은 순으로 정렬',
    ariaLabel: '참여율 높은 순 정렬',
    activeClassName: 'text-rose-600',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
];

export const getVideoToolbarViewModeOptions = () => [
  {
    value: 'card',
    label: '카드 보기',
    title: '영상 후보를 카드 형태로 보기',
    ariaLabel: '카드 보기로 전환',
  },
  {
    value: 'list',
    label: '리스트 보기',
    title: '영상 후보를 표 형태로 보기',
    ariaLabel: '리스트 보기로 전환',
  },
];

export const getVideoToolbarWorkPanelToggleViewProps = ({ showWorkPanel }) => ({
  ariaLabel: showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기',
  label: showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기',
  title: showWorkPanel ? '작업 패널 숨기기' : '카드 보기에서 작업 패널 함께 보기',
});
