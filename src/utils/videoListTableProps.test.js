import { describe, expect, it } from 'vitest';

import {
  VIDEO_LIST_TABLE_HEADERS,
  getVideoListTableViewProps,
} from './videoListTableProps';

describe('videoListTableProps utils', () => {
  const video = { videoId: 'video1', title: 'First idea' };

  it('exposes the table header definitions in their configured order', () => {
    expect(VIDEO_LIST_TABLE_HEADERS.map(header => header.key)).toEqual([
      'ai-select',
      'material',
      'video-info',
      'production',
      'views',
      'score',
      'engagement',
      'days-old',
    ]);
    expect(VIDEO_LIST_TABLE_HEADERS.every(header => header.label && header.className)).toBe(true);
  });

  it('builds row props with selection, saved, and production candidate state', () => {
    const fetchTopComments = () => 'comments';
    const promoteVideoToProduction = () => 'promote';
    const toggleCheckVideo = () => 'check';
    const toggleScrapVideo = () => 'scrap';

    const props = getVideoListTableViewProps({
      checkedVideos: ['video1'],
      fetchTopComments,
      isProductionCandidate: (videoId) => videoId === 'video1',
      isVideoSaved: (videoId) => videoId === 'video1',
      promoteVideoToProduction,
      toggleCheckVideo,
      toggleScrapVideo,
    });

    expect(props.headers).toBe(VIDEO_LIST_TABLE_HEADERS);
    expect(props.getRowProps(video)).toEqual({
      fetchTopComments,
      isChecked: true,
      isProductionCandidate: true,
      isSaved: true,
      promoteVideoToProduction,
      toggleCheckVideo,
      toggleScrapVideo,
      video,
    });
  });

  it('uses safe checked video defaults for invalid checked video input', () => {
    const props = getVideoListTableViewProps({
      checkedVideos: null,
      fetchTopComments: () => {},
      isProductionCandidate: () => false,
      isVideoSaved: () => false,
      promoteVideoToProduction: () => {},
      toggleCheckVideo: () => {},
      toggleScrapVideo: () => {},
    });

    expect(props.getRowProps(video)).toMatchObject({
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      video,
    });
  });
});
