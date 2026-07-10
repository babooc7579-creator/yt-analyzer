import { describe, expect, it, vi } from 'vitest';

import { getVideoListTableRowViewProps } from './videoListTableRowProps';

describe('videoListTableRowProps utils', () => {
  const video = {
    videoId: 'video 1',
    title: 'Old viral idea',
    daysOld: 200,
    multiplier: 3.2,
  };

  it('builds checked row props with candidate signals and encoded video URL', () => {
    const fetchTopComments = vi.fn();
    const promoteVideoToProduction = vi.fn();
    const toggleCheckVideo = vi.fn();
    const toggleScrapVideo = vi.fn();

    const props = getVideoListTableRowViewProps({
      fetchTopComments,
      isChecked: true,
      isProductionCandidate: true,
      isSaved: true,
      promoteVideoToProduction,
      toggleCheckVideo,
      toggleScrapVideo,
      video,
    });

    expect(props.rowClassName).toContain('bg-indigo-50');
    expect(props.contentCellProps).toMatchObject({
      fetchTopComments,
      isChecked: true,
      isProductionCandidate: true,
      isSaved: true,
      isStrongReaction: true,
      isTtoTto: true,
      video,
      videoTitle: 'Old viral idea',
      videoUrl: 'https://youtube.com/watch?v=video%201',
    });
    expect(props.candidateActionProps).toMatchObject({
      disabled: false,
      isProductionCandidate: true,
      videoTitle: 'Old viral idea',
    });
    expect(props.markerCellsProps).toMatchObject({
      checkDisabled: false,
      isChecked: true,
      isSaved: true,
      scrapDisabled: false,
      videoTitle: 'Old viral idea',
    });
    expect(props.statsCellsProps).toEqual({
      isStrongReaction: true,
      video,
    });
  });

  it('connects marker and production actions to the current video', () => {
    const promoteVideoToProduction = vi.fn();
    const toggleCheckVideo = vi.fn();
    const toggleScrapVideo = vi.fn();

    const props = getVideoListTableRowViewProps({
      fetchTopComments: () => {},
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      promoteVideoToProduction,
      toggleCheckVideo,
      toggleScrapVideo,
      video,
    });

    props.candidateActionProps.onPromote();
    props.markerCellsProps.onToggleCheck();
    props.markerCellsProps.onToggleScrap();

    expect(promoteVideoToProduction).toHaveBeenCalledWith(video);
    expect(toggleCheckVideo).toHaveBeenCalledWith('video 1');
    expect(toggleScrapVideo).toHaveBeenCalledWith(video);
  });

  it('uses safe non-candidate styling and title defaults', () => {
    const props = getVideoListTableRowViewProps({
      fetchTopComments: () => {},
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      promoteVideoToProduction: () => {},
      toggleCheckVideo: () => {},
      toggleScrapVideo: () => {},
      video: {},
    });

    expect(props.rowClassName).toContain('bg-white');
    expect(props.contentCellProps).toMatchObject({
      isStrongReaction: false,
      isTtoTto: false,
      videoUrl: '',
    });
    expect(props.contentCellProps.videoTitle).not.toBe('');
  });

  it('disables row actions when the video id or handlers are missing', () => {
    const promoteVideoToProduction = vi.fn();
    const toggleCheckVideo = vi.fn();
    const toggleScrapVideo = vi.fn();

    const props = getVideoListTableRowViewProps({
      fetchTopComments: () => {},
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      promoteVideoToProduction,
      toggleCheckVideo,
      toggleScrapVideo,
      video: { title: 'No ID video' },
    });

    expect(props.candidateActionProps.disabled).toBe(true);
    expect(props.markerCellsProps).toMatchObject({
      checkDisabled: true,
      scrapDisabled: true,
    });

    props.candidateActionProps.onPromote();
    props.markerCellsProps.onToggleCheck();
    props.markerCellsProps.onToggleScrap();

    expect(promoteVideoToProduction).not.toHaveBeenCalled();
    expect(toggleCheckVideo).not.toHaveBeenCalled();
    expect(toggleScrapVideo).not.toHaveBeenCalled();

    const missingHandlerProps = getVideoListTableRowViewProps({
      fetchTopComments: () => {},
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      video,
    });

    expect(missingHandlerProps.candidateActionProps.disabled).toBe(true);
    expect(missingHandlerProps.markerCellsProps.checkDisabled).toBe(true);
    expect(missingHandlerProps.markerCellsProps.scrapDisabled).toBe(true);
  });
});
