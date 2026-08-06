const TITLE_STOP_WORDS = new Set([
  'about', 'and', 'best', 'complete', 'create', 'episode', 'for', 'from', 'guide', 'how',
  'learn', 'new', 'official', 'part', 'shorts', 'should', 'the', 'this', 'tips', 'tutorial',
  'microsoft', 'online', 'update', 'updates', 'use', 'using', 'video', 'with', 'you', 'your', 'youtube',
  '가이드', '강의', '공개', '방법', '사용법', '실제', '영상', '완벽', '유튜브',
  '이것', '정리', '추천', '최신', '총정리', '하는', '해보기',
]);

const toArray = (items) => (Array.isArray(items) ? items : []);
const toNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const getVideoId = (video, index) => String(video?.videoId || video?.video_id || `topic-video-${index}`);

export const getTitleTopicTokens = (title = '') => (
  Array.from(new Set(
    String(title)
      .normalize('NFKC')
      .toLowerCase()
      .match(/[가-힣]{2,}|[a-z]{3,}/g) || [],
  )).filter((token) => !TITLE_STOP_WORDS.has(token))
);

const areTopicTokensSimilar = (leftTokens, rightTokens) => {
  if (leftTokens.length < 2 || rightTokens.length < 2) return false;

  const rightSet = new Set(rightTokens);
  const intersectionCount = leftTokens.filter((token) => rightSet.has(token)).length;
  if (intersectionCount < 2) return false;

  const smallerSize = Math.min(leftTokens.length, rightTokens.length);
  const unionSize = new Set([...leftTokens, ...rightTokens]).size;
  return intersectionCount / smallerSize >= 0.6 || intersectionCount / unionSize >= 0.45;
};

const getCommonTokens = (members) => {
  const [firstMember, ...restMembers] = members;
  if (!firstMember) return [];
  return firstMember.tokens.filter((token) => (
    restMembers.every((member) => member.tokens.includes(token))
  ));
};

export const getSimilarTopicGroups = (videos = [], { limit = 6 } = {}) => {
  const candidateGroups = [];
  const preparedVideos = toArray(videos).map((video, index) => ({
    id: getVideoId(video, index),
    tokens: getTitleTopicTokens(video?.title),
    video,
  }));
  const tokenFrequency = new Map();
  preparedVideos.forEach((member) => {
    member.tokens.forEach((token) => tokenFrequency.set(token, (tokenFrequency.get(token) || 0) + 1));
  });
  const frequentTokenThreshold = preparedVideos.length >= 8
    ? Math.ceil(preparedVideos.length * 0.65)
    : Number.POSITIVE_INFINITY;

  preparedVideos.forEach((preparedVideo) => {
    const tokens = preparedVideo.tokens.filter((token) => (
      (tokenFrequency.get(token) || 0) < frequentTokenThreshold
    ));
    if (tokens.length < 2) return;

    const member = {
      id: preparedVideo.id,
      tokens,
      video: preparedVideo.video,
    };
    const matchingGroup = candidateGroups.find((group) => (
      areTopicTokensSimilar(group.anchorTokens, tokens)
    ));

    if (matchingGroup) matchingGroup.members.push(member);
    else candidateGroups.push({ anchorTokens: tokens, members: [member] });
  });

  return candidateGroups
    .filter((group) => group.members.length >= 2)
    .map((group, index) => {
      const commonTokens = getCommonTokens(group.members);
      const labelTokens = (commonTokens.length >= 2 ? commonTokens : group.anchorTokens).slice(0, 3);
      return {
        count: group.members.length,
        id: `similar-topic-${index}-${group.members[0].id}`,
        label: labelTokens.join(' · '),
        maxViews: Math.max(...group.members.map((member) => toNumber(member.video?.view_count))),
        representativeVideoId: group.members[0].id,
        videoIds: group.members.map((member) => member.id),
      };
    })
    .sort((left, right) => right.count - left.count || right.maxViews - left.maxViews)
    .slice(0, Math.max(0, toNumber(limit)));
};

export const annotateSimilarTopicVideos = (videos = [], groups = getSimilarTopicGroups(videos)) => {
  const groupByVideoId = new Map();
  toArray(groups).forEach((group) => {
    toArray(group.videoIds).forEach((videoId) => groupByVideoId.set(String(videoId), group));
  });

  return toArray(videos).map((video, index) => {
    const group = groupByVideoId.get(getVideoId(video, index));
    if (!group) return video;
    return {
      ...video,
      similarTopic: {
        count: group.count,
        id: group.id,
        isRepresentative: group.representativeVideoId === getVideoId(video, index),
        label: group.label,
      },
    };
  });
};

export const filterVideosByTopicGroup = (videos = [], groups = [], activeGroupId = '') => {
  if (!activeGroupId) return toArray(videos);
  const activeGroup = toArray(groups).find((group) => group.id === activeGroupId);
  if (!activeGroup) return toArray(videos);
  const videoIds = new Set(toArray(activeGroup.videoIds).map(String));
  return toArray(videos).filter((video, index) => videoIds.has(getVideoId(video, index)));
};
