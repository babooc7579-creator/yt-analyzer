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

const renderPanel = (operationStage) => renderToStaticMarkup(
  <LegacyChannelPanelContent
    channelAddFormProps={{}}
    channelListProps={{}}
    footerProps={{}}
    introProps={{}}
    operationStage={operationStage}
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

  it('shows channel selection and stored-video loading in scan stage', () => {
    const html = renderPanel('scan');

    expect(html).toContain('영상 확인과 새 영상 수집');
    expect(html).toContain('channel-list');
    expect(html).toContain('tag-tabs:scan');
    expect(html).toContain('load-stored-footer');
    expect(html).not.toContain('add-form');
  });
});
