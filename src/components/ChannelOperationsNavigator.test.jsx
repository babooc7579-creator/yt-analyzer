import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelOperationsNavigator from './ChannelOperationsNavigator';

describe('ChannelOperationsNavigator', () => {
  it('renders one workflow with three distinct operation stages', () => {
    const html = renderToStaticMarkup(<ChannelOperationsNavigator activeStage="add" />);

    expect(html).toContain('채널 운영실');
    expect(html).toContain('1. 채널 관리');
    expect(html).toContain('2. 새 채널 등록');
    expect(html).toContain('3. 새 영상 수집');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('채널 선택만으로 YouTube API는 호출되지 않습니다');
  });
});
