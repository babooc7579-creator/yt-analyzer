import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import LegacyChannelPanelContent from './LegacyChannelPanelContent';

vi.mock('./ChannelAddForm', () => ({ default: () => <div>add-form</div> }));
vi.mock('./ChannelList', () => ({ default: () => <div>channel-list</div> }));
vi.mock('./ChannelTagTabs', () => ({
  default: ({ showScanActions }) => <div>tag-tabs:{showScanActions ? 'scan' : 'browse'}</div>,
}));
vi.mock('./LegacyChannelPanelFooter', () => ({ default: () => <div>load-stored-footer</div> }));
vi.mock('./LegacyWorkPanelIntro', () => ({ default: () => <div>legacy-intro</div> }));

const renderPanel = (operationStage, operationSource, onReturnToKeywordExplorer) => renderToStaticMarkup(
  <LegacyChannelPanelContent
    channelAddFormProps={{}}
    channelListProps={{}}
    footerProps={{}}
    introProps={{}}
    operationStage={operationStage}
    operationSource={operationSource}
    onReturnToKeywordExplorer={onReturnToKeywordExplorer}
    showWorkPanel
    tagTabsProps={{}}
  />,
);

describe('LegacyChannelPanelContent operation stages', () => {
  it('shows only channel selection tools in manage stage', () => {
    const html = renderPanel('manage');

    expect(html).toContain('채널 선택과 분류 관리');
    expect(html).toContain('channel-list');
    expect(html).toContain('tag-tabs:browse');
    expect(html).not.toContain('add-form');
    expect(html).not.toContain('load-stored-footer');
  });

  it('shows only the registration form in add stage', () => {
    const html = renderPanel('add');

    expect(html).toContain('새 채널 등록');
    expect(html).toContain('add-form');
    expect(html).not.toContain('channel-list');
    expect(html).not.toContain('load-stored-footer');
  });

  it('explains when registration started from a video search result', () => {
    const html = renderPanel('add', 'youtube-video-search', vi.fn());

    expect(html).toContain('검색 영상의 출처 채널을 등록 검토 중입니다');
    expect(html).toContain('이동만으로 YouTube API 호출이나 영상 수집은 실행되지 않습니다');
    expect(html).toContain('검색 결과로 돌아가기');
  });

  it('shows channel selection and stored-video loading in scan stage', () => {
    const html = renderPanel('scan');

    expect(html).toContain('영상 확인과 새 영상 수집');
    expect(html).toContain('channel-list');
    expect(html).toContain('tag-tabs:scan');
    expect(html).toContain('load-stored-footer');
    expect(html).not.toContain('add-form');
  });
});
