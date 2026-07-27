import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import LegacyWorkspaceView from './LegacyWorkspaceView';

vi.mock('./LegacyChannelPanel', () => ({
  default: ({ operationStage }) => <div>channel-panel:{operationStage || 'legacy'}</div>,
}));

vi.mock('./LegacyWorkspaceMainPanel', () => ({
  default: ({ operationStage }) => <div>main-panel:{operationStage || 'legacy'}</div>,
}));

vi.mock('./ChannelOperationsNavigator', () => ({
  default: () => <div>operations-navigator</div>,
}));

vi.mock('./HiddenLegacyAside', () => ({
  default: () => <div>hidden-aside</div>,
}));

const renderWorkspace = (activeOperationStage) => renderToStaticMarkup(
  <LegacyWorkspaceView
    activeOperationStage={activeOperationStage}
    asideProps={{}}
    channelPanelProps={{}}
    mainPanelProps={{}}
    operationsNavProps={activeOperationStage ? {} : null}
    showWorkPanel
  />,
);

describe('LegacyWorkspaceView operation stages', () => {
  it.each(['manage', 'add'])('keeps %s focused on the channel panel', (stage) => {
    const html = renderWorkspace(stage);

    expect(html).toContain(`channel-panel:${stage}`);
    expect(html).not.toContain('main-panel:');
  });

  it('shows channel selection and video tools together in scan stage', () => {
    const html = renderWorkspace('scan');

    expect(html).toContain('channel-panel:scan');
    expect(html).toContain('main-panel:scan');
  });

  it('preserves the original two-panel legacy workspace outside channel operations', () => {
    const html = renderWorkspace(null);

    expect(html).toContain('channel-panel:legacy');
    expect(html).toContain('main-panel:legacy');
  });
});
