import { describe, expect, it } from 'vitest';

import {
  getReferenceVaultEmptyStateActions,
  getVideoResultsPanelViewProps,
} from './videoResultsPanelProps';

describe('videoResultsPanelProps utils', () => {
  const video = { videoId: 'video-1', title: 'First video' };
  const secondVideo = { videoId: 'video-2', title: 'Second video' };

  const baseHandlers = {
    isProductionCandidate: (videoId) => videoId === 'video-2',
    isVideoSaved: (videoId) => videoId === 'video-1',
    onFetchComments: () => 'comments',
    onPromoteToProduction: () => 'promote',
    onToggleCheck: () => 'check',
    onToggleScrap: () => 'scrap',
  };

  it('builds safe video result lists and table props', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: ['video-1'],
      filteredVideos: [video],
      showWorkPanel: false,
      videos: [video, secondVideo],
    });

    expect(props.checkedVideoList).toEqual(['video-1']);
    expect(props.filteredVideoList).toEqual([video]);
    expect(props.videoList).toEqual([video, secondVideo]);
    expect(props.listTableProps).toMatchObject({
      videos: [video],
      checkedVideos: ['video-1'],
      isVideoSaved: baseHandlers.isVideoSaved,
      isProductionCandidate: baseHandlers.isProductionCandidate,
      toggleCheckVideo: baseHandlers.onToggleCheck,
      toggleScrapVideo: baseHandlers.onToggleScrap,
      promoteVideoToProduction: baseHandlers.onPromoteToProduction,
      fetchTopComments: baseHandlers.onFetchComments,
    });
  });

  it('builds card props with rank and current video status flags', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: ['video-1'],
      filteredVideos: [video, secondVideo],
      showWorkPanel: true,
      videos: [video, secondVideo],
    });

    expect(props.getVideoCardProps(video, 0)).toMatchObject({
      video,
      rank: 1,
      isChecked: true,
      isSaved: true,
      isProductionCandidate: false,
      showWorkPanel: true,
      onToggleCheck: baseHandlers.onToggleCheck,
      onToggleScrap: baseHandlers.onToggleScrap,
      onPromoteToProduction: baseHandlers.onPromoteToProduction,
      onFetchComments: baseHandlers.onFetchComments,
    });

    expect(props.getVideoCardProps(secondVideo, 1)).toMatchObject({
      video: secondVideo,
      rank: 2,
      isChecked: false,
      isSaved: false,
      isProductionCandidate: true,
    });
  });

  it('uses empty arrays when incoming video lists are invalid', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: null,
      filteredVideos: undefined,
      showWorkPanel: false,
      videos: 'not-list',
    });

    expect(props.checkedVideoList).toEqual([]);
    expect(props.filteredVideoList).toEqual([]);
    expect(props.videoList).toEqual([]);
    expect(props.listTableProps.videos).toEqual([]);
    expect(props.listTableProps.checkedVideos).toEqual([]);
  });

  it('keeps all videos separate from filtered videos for empty-state decisions', () => {
    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: [],
      filteredVideos: [],
      showWorkPanel: false,
      videos: [video],
    });

    expect(props.videoList).toEqual([video]);
    expect(props.filteredVideoList).toEqual([]);
    expect(props.listTableProps.videos).toEqual([]);
  });

  it('builds reference vault empty-state navigation actions without scan or save side effects', () => {
    const onOpenAddChannel = () => 'open add channel';
    const onOpenHome = () => 'open home';

    const actions = getReferenceVaultEmptyStateActions({
      onOpenAddChannel,
      onOpenHome,
    });

    expect(actions).toHaveLength(2);
    expect(actions.map(action => action.key)).toEqual(['home', 'add-channel']);
    expect(actions[0]).toMatchObject({
      iconKey: 'home',
      label: '오늘 레이더로',
      onClick: onOpenHome,
    });
    expect(actions[1]).toMatchObject({
      iconKey: 'add-channel',
      label: '새 채널 등록',
      onClick: onOpenAddChannel,
    });
    expect(actions[0].title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(actions[1].title).toContain('영상 수집이나 YouTube API 호출은 실행하지 않습니다');
  });

  it('omits reference vault actions when navigation handlers are unavailable', () => {
    expect(getReferenceVaultEmptyStateActions()).toEqual([]);
    expect(getReferenceVaultEmptyStateActions({ onOpenHome: () => 'home' })).toHaveLength(1);
    expect(getReferenceVaultEmptyStateActions({ onOpenAddChannel: () => 'add channel' })).toHaveLength(1);
  });

  it('passes reference vault empty-state actions through video results panel props', () => {
    const onOpenAddChannel = () => 'open add channel';
    const onOpenHome = () => 'open home';

    const props = getVideoResultsPanelViewProps({
      ...baseHandlers,
      checkedVideos: [],
      filteredVideos: [],
      onOpenAddChannel,
      onOpenHome,
      showWorkPanel: false,
      videos: [],
    });

    expect(props.referenceVaultEmptyStateProps.actions.map(action => action.key)).toEqual([
      'home',
      'add-channel',
    ]);
  });
});
