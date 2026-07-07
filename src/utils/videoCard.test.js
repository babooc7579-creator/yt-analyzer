import { describe, expect, it } from 'vitest';

import {
  getVideoCardCandidateReasons,
  getVideoCardViewProps,
} from './videoCard';

describe('videoCard utils', () => {
  const video = {
    videoId: 'video 1',
    title: 'Old viral idea',
    daysOld: 200,
    multiplier: 3.2,
    thumbnail: 'thumb.jpg',
  };

  it('builds candidate reasons from multiplier, age, and strong reaction signals', () => {
    const reasons = getVideoCardCandidateReasons({
      video,
      isStrongReaction: true,
    });

    expect(reasons).toHaveLength(3);
    expect(reasons[0]).toContain('3.2');
    expect(reasons[1]).toContain('200');
    expect(typeof reasons[2]).toBe('string');
  });

  it('builds checked video card props with forwarded handlers and encoded video URL', () => {
    const onToggleCheck = () => 'toggle check';
    const onToggleScrap = () => 'toggle scrap';
    const onPromoteToProduction = () => 'promote';
    const onFetchComments = () => 'comments';

    const props = getVideoCardViewProps({
      video,
      rank: 2,
      isChecked: true,
      isSaved: true,
      isProductionCandidate: true,
      showWorkPanel: true,
      onToggleCheck,
      onToggleScrap,
      onPromoteToProduction,
      onFetchComments,
    });

    expect(props.cardClassName).toContain('border-indigo-300');
    expect(props.contentClassName).toBe('p-5');
    expect(props.videoTitle).toBe('Old viral idea');
    expect(props.videoUrl).toBe('https://youtube.com/watch?v=video%201');
    expect(props.thumbnailProps).toMatchObject({
      isCandidate: true,
      isChecked: true,
      isSaved: true,
      isStrongReaction: true,
      rank: 2,
      thumbnailHeightClass: 'min-h-[360px]',
      video,
      videoTitle: 'Old viral idea',
    });
    expect(props.statusBadgeProps).toEqual({
      isChecked: true,
      isProductionCandidate: true,
      isSaved: true,
    });
    expect(props.metaActionsProps).toMatchObject({
      onFetchComments,
      video,
      videoTitle: 'Old viral idea',
      videoUrl: 'https://youtube.com/watch?v=video%201',
    });
    expect(props.primaryActionsProps).toMatchObject({
      isProductionCandidate: true,
      isSaved: true,
      onPromoteToProduction,
      onToggleScrap,
      video,
      videoTitle: 'Old viral idea',
    });
  });

  it('uses candidate styling and compact content when a video is not checked', () => {
    const props = getVideoCardViewProps({
      video: {
        ...video,
        multiplier: 2,
      },
      rank: 1,
      isChecked: false,
      isSaved: false,
      isProductionCandidate: false,
      showWorkPanel: false,
      onToggleCheck: () => {},
      onToggleScrap: () => {},
      onPromoteToProduction: () => {},
      onFetchComments: () => {},
    });

    expect(props.cardClassName).toContain('border-rose-100');
    expect(props.contentClassName).toBe('p-4');
    expect(props.thumbnailProps).toMatchObject({
      isCandidate: true,
      isChecked: false,
      isSaved: false,
      isStrongReaction: false,
      thumbnailHeightClass: 'min-h-[420px]',
    });
    expect(props.statsGridProps).toMatchObject({
      isStrongReaction: false,
      showWorkPanel: false,
    });
  });

  it('uses safe defaults for videos without titles or ids', () => {
    const props = getVideoCardViewProps({
      video: {},
      rank: 1,
      isChecked: false,
      isSaved: false,
      isProductionCandidate: false,
      showWorkPanel: false,
      onToggleCheck: () => {},
      onToggleScrap: () => {},
      onPromoteToProduction: () => {},
      onFetchComments: () => {},
    });

    expect(props.cardClassName).toContain('border-slate-200');
    expect(props.candidateReasons).toEqual([]);
    expect(props.videoTitle).not.toBe('');
    expect(props.videoUrl).toBe('');
  });
});
