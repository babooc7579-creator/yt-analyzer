import { describe, expect, it } from 'vitest';

import { getVideoListRowContentViewProps } from './videoListRowContentProps';

describe('videoListRowContentProps utils', () => {
  it('splits row content props into badges, meta actions, thumbnail, and title link props', () => {
    const fetchTopComments = () => 'comments';
    const video = { videoId: 'video1', title: 'First idea' };

    expect(getVideoListRowContentViewProps({
      fetchTopComments,
      isChecked: true,
      isProductionCandidate: true,
      isSaved: true,
      isStrongReaction: true,
      isTtoTto: true,
      video,
      videoTitle: 'First idea',
      videoUrl: 'https://youtube.com/watch?v=video1',
    })).toEqual({
      badgesProps: {
        isChecked: true,
        isProductionCandidate: true,
        isSaved: true,
        isStrongReaction: true,
        isTtoTto: true,
      },
      metaActionsProps: {
        fetchTopComments,
        video,
        videoTitle: 'First idea',
        videoUrl: 'https://youtube.com/watch?v=video1',
      },
      thumbnailProps: {
        video,
        videoTitle: 'First idea',
      },
      titleLinkProps: {
        videoTitle: 'First idea',
        videoUrl: 'https://youtube.com/watch?v=video1',
      },
    });
  });

  it('preserves false badge states for controlled row rendering', () => {
    const props = getVideoListRowContentViewProps({
      fetchTopComments: () => {},
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      isStrongReaction: false,
      isTtoTto: false,
      video: {},
      videoTitle: '',
      videoUrl: '',
    });

    expect(props.badgesProps).toEqual({
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      isStrongReaction: false,
      isTtoTto: false,
    });
    expect(props.titleLinkProps).toEqual({
      videoTitle: '',
      videoUrl: '',
    });
  });
});
