import { describe, expect, it } from 'vitest';

import { getVideoResultsPanelViewProps } from './videoResultsPanelProps';

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
});
