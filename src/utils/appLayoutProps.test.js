import { describe, expect, it } from 'vitest';

import {
  buildLayoutProps,
  getCreatorSidebarHeaderViewProps,
  getCreatorSidebarItemViewProps,
  getCreatorWorkspaceHeaderStatCards,
  getWorkspaceTabsViewProps,
} from './appLayoutProps';

describe('appLayoutProps utils', () => {
  it('builds layout counts from channel, video, and selected channel lists', () => {
    const props = buildLayoutProps({
      activeCreatorItem: { id: 'today' },
      addChannelNote: () => 'add note',
      changeNoteText: () => 'change note',
      closeNotesModal: () => 'close notes',
      closeTopCommentsModal: () => 'close comments',
      commentModal: { isOpen: true },
      creatorView: 'today',
      discoveryCandidateCount: 3,
      notesModal: { isOpen: false },
      openCreatorView: () => 'open',
      savedChannels: [{ id: 'channel1' }, { id: 'channel2' }],
      savedVideos: [{ videoId: 'video1' }],
      selectedChannelIds: ['channel1'],
      syncWarnings: ['warning'],
      videos: [{ videoId: 'video1' }, { videoId: 'video2' }],
    });

    expect(props).toMatchObject({
      activeCreatorItem: { id: 'today' },
      channelCount: 2,
      commentModal: { isOpen: true },
      creatorView: 'today',
      discoveryCandidateCount: 3,
      notesModal: { isOpen: false },
      savedVideoCount: 1,
      selectedChannelCount: 1,
      syncWarnings: ['warning'],
      videoCount: 2,
    });
  });

  it('forwards layout handlers without invoking them', () => {
    const addChannelNote = () => 'add note';
    const changeNoteText = () => 'change note';
    const closeNotesModal = () => 'close notes';
    const closeTopCommentsModal = () => 'close comments';
    const openCreatorView = () => 'open';

    const props = buildLayoutProps({
      addChannelNote,
      changeNoteText,
      closeNotesModal,
      closeTopCommentsModal,
      openCreatorView,
    });

    expect(props.onAddNote).toBe(addChannelNote);
    expect(props.onChangeNoteText).toBe(changeNoteText);
    expect(props.onCloseNotes).toBe(closeNotesModal);
    expect(props.onCloseTopComments).toBe(closeTopCommentsModal);
    expect(props.onOpenCreatorView).toBe(openCreatorView);
  });

  it('uses safe zero counts for invalid list inputs', () => {
    const props = buildLayoutProps({
      savedChannels: null,
      savedVideos: 'bad',
      selectedChannelIds: undefined,
      videos: {},
    });

    expect(props.channelCount).toBe(0);
    expect(props.savedVideoCount).toBe(0);
    expect(props.selectedChannelCount).toBe(0);
    expect(props.videoCount).toBe(0);
  });

  it('builds Creator OS sidebar header copy', () => {
    expect(getCreatorSidebarHeaderViewProps()).toEqual({
      brandLabel: '타임머신 CRM',
      description: '유튜브 레퍼런스를 발굴하고 제작 자산으로 축적하는 지휘실입니다.',
      title: 'Creator OS',
    });
  });

  it('builds sidebar item action copy for ready and coming soon views', () => {
    expect(getCreatorSidebarItemViewProps({
      item: { label: '오늘', status: 'ready' },
    })).toEqual({
      actionLabel: '오늘 화면 열기',
      isComingSoon: false,
      statusLabel: '준비중',
    });

    expect(getCreatorSidebarItemViewProps({
      item: { label: '설정', status: 'soon' },
    })).toEqual({
      actionLabel: '설정 준비중 안내 보기, API 호출이나 DB 변경 없음',
      isComingSoon: true,
      statusLabel: '준비중',
    });
  });

  it('builds workspace header stat card copy in display order', () => {
    const cards = getCreatorWorkspaceHeaderStatCards({
      channelCount: 10,
      discoveryCandidateCount: 2,
      savedVideoCount: 3,
      selectedChannelCount: 4,
      videoCount: 99,
    });

    expect(cards.map((card) => card.label)).toEqual([
      '채널',
      '불러온 영상',
      '선택 채널',
      '스크랩 영상',
      '링크 후보',
    ]);
    expect(cards.map((card) => card.value)).toEqual([10, 99, 4, 3, 2]);
    expect(cards[1].description).toContain('새 YouTube API 호출 수가 아닙니다');
  });

  it('builds workspace tab copy with saved video count', () => {
    expect(getWorkspaceTabsViewProps({
      savedVideoCount: 7,
    })).toEqual({
      dashboardTab: {
        ariaLabel: '분석 대시보드 탭 열기, 탭 이동만으로 YouTube API 호출 없음',
        label: '분석 대시보드',
        title: '현재 불러온 저장 영상 분석 대시보드 보기. 탭 이동만으로 YouTube API를 새로 호출하지 않습니다.',
      },
      scrapbookTab: {
        ariaLabel: '영구 스크랩북 탭 열기, 보관 영상 7개, 탭 이동만으로 YouTube API 호출 없음',
        label: '영구 스크랩북',
        title: 'Cloud 스크랩북 보기 - 보관 영상 7개. 탭 이동만으로 YouTube API를 새로 호출하지 않습니다.',
      },
    });
  });
});
