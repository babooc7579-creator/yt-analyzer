export const WORK_TOOL_GROUPS = [
  {
    id: 'keyword-research',
    title: '키워드와 관심도 조사',
    description: '외부 검색 관심도와 관련 키워드를 공식 도구에서 직접 확인합니다.',
    tools: [
      {
        id: 'google-trends',
        label: 'Google Trends',
        description: '키워드의 기간별·지역별 상대 검색 관심도를 비교합니다.',
        href: 'https://trends.google.com/trends/explore?geo=KR',
        keywordUrl: (keyword) => `https://trends.google.com/trends/explore?geo=KR&q=${encodeURIComponent(keyword)}`,
        badge: '키워드 자동 전달',
      },
      {
        id: 'naver-datalab',
        label: '네이버 DataLab',
        description: '네이버 검색어 트렌드를 기간·기기·성별·연령별로 확인합니다.',
        href: 'https://datalab.naver.com/keyword/trendSearch.naver',
        badge: '키워드 붙여넣기',
      },
      {
        id: 'naver-search-ad',
        label: '네이버 검색광고',
        description: '키워드 도구에서 연관 키워드와 검색 수요를 확인합니다. 로그인이 필요할 수 있습니다.',
        href: 'https://searchad.naver.com/',
        badge: '로그인 필요 가능',
      },
    ],
  },
  {
    id: 'reference-search',
    title: '레퍼런스 직접 찾기',
    description: '같은 키워드가 실제 영상 플랫폼에서 어떻게 쓰이는지 확인합니다.',
    tools: [
      {
        id: 'youtube-search',
        label: 'YouTube 검색',
        description: '현재 키워드의 영상 제목, 썸네일, 조회 반응을 직접 비교합니다.',
        href: 'https://www.youtube.com/',
        keywordUrl: (keyword) => `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`,
        badge: '키워드 자동 전달',
      },
      {
        id: 'youtube-studio',
        label: 'YouTube Studio',
        description: '내가 운영하는 채널의 콘텐츠와 성과를 확인합니다.',
        href: 'https://studio.youtube.com/',
        badge: '운영 채널',
      },
    ],
  },
];

export const getWorkToolUrl = (tool, keyword = '') => {
  const normalizedKeyword = String(keyword || '').trim();
  if (normalizedKeyword && typeof tool?.keywordUrl === 'function') {
    return tool.keywordUrl(normalizedKeyword);
  }
  return tool?.href || '#';
};
