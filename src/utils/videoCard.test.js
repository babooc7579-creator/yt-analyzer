import { describe, expect, it } from 'vitest';

import {
  getVideoCardCandidateReasons,
  getVideoCardCandidateReasonsViewProps,
  getVideoCardCopyUrlButtonProps,
  getVideoCardMetaBadgesViewProps,
  getVideoCardStatsGridViewProps,
  getVideoCardStatusBadgeItems,
  getVideoCardThumbnailBadgeItems,
  getVideoCardViewProps,
  getVideoThumbnailAltText,
  getVideoTitleLinkAriaLabel,
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

  it('builds candidate reason display props', () => {
    expect(getVideoCardCandidateReasonsViewProps({
      candidateReasons: ['평균 대비 3.2배', '200일 지난 소재'],
    })).toEqual({
      joinedReasons: '평균 대비 3.2배 · 200일 지난 소재',
      reasonList: ['평균 대비 3.2배', '200일 지난 소재'],
      shouldShow: true,
      title: '후보 이유',
    });

    expect(getVideoCardCandidateReasonsViewProps({
      candidateReasons: null,
    }).shouldShow).toBe(false);
  });

  it('builds copy URL button props without API confusion', () => {
    const props = getVideoCardCopyUrlButtonProps({
      videoTitle: 'First idea',
      videoUrl: 'https://youtube.com/watch?v=video1',
    });

    expect(props).toMatchObject({
      ariaLabel: 'First idea YouTube 원본 URL 복사',
      copiedLabel: '복사 완료',
      label: 'URL 복사',
      url: 'https://youtube.com/watch?v=video1',
    });
    expect(props.title).toContain('YouTube API 호출이나 저장 작업은 없습니다');
  });

  it('builds language and duration badges with unknown-language fallback', () => {
    expect(getVideoCardMetaBadgesViewProps({
      video: {
        duration: '00:59',
        isShorts: true,
        language: 'EN',
      },
    })).toEqual({
      durationBadge: {
        isShorts: true,
        text: 'Shorts (00:59)',
      },
      languageLabel: 'EN',
    });

    expect(getVideoCardMetaBadgesViewProps({
      video: {
        duration: '08:30',
        isShorts: false,
        language: 'UNKNOWN',
      },
    })).toEqual({
      durationBadge: {
        isShorts: false,
        text: '08:30',
      },
      languageLabel: '언어 미상',
    });
  });

  it('builds status badge items in display order', () => {
    const badges = getVideoCardStatusBadgeItems({
      isChecked: true,
      isProductionCandidate: true,
      isSaved: true,
    });

    expect(badges.map((badge) => badge.label)).toEqual([
      '소재 보관됨',
      '후보함 등록',
      'AI 요청문 선택',
    ]);
    expect(badges.every((badge) => badge.isVisible)).toBe(true);
  });

  it('builds stats grid text and labels', () => {
    const props = getVideoCardStatsGridViewProps({
      isStrongReaction: true,
      showWorkPanel: true,
      video: {
        daysOld: 200,
        like_count: 1234,
        like_ratio: 4.5,
        multiplier: 3.2,
        view_count: 987654,
      },
    });

    expect(props.viewCountTileProps.label).toBe('총 조회수');
    expect(props.multiplierTileProps.label).toBe('대박 지수');
    expect(props.engagementTileProps.label).toBe('참여율');
    expect(props.daysOldTileProps.label).toBe('경과일');
    expect(props.viewCountText).toBe('987,654');
    expect(props.engagementLikeText).toBe('좋아요 1,234');
    expect(props.daysOldText).toBe('200일');
    expect(props.multiplierTileProps.className).toContain('bg-rose-600');
  });

  it('builds thumbnail badge items and generic media copy', () => {
    const badges = getVideoCardThumbnailBadgeItems({
      isCandidate: true,
      isStrongReaction: true,
      rank: 4,
    });

    expect(badges.filter((badge) => badge.isVisible).map((badge) => badge.label)).toEqual([
      '#4',
      '또터또 후보',
      '강한 반응',
    ]);
    expect(getVideoThumbnailAltText({ videoTitle: 'First idea' })).toBe('First idea 썸네일');
    expect(getVideoTitleLinkAriaLabel({ videoTitle: 'First idea' })).toBe('First idea YouTube 원본 영상 열기');
  });
});
