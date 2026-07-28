import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import SyncWarningBanner from './SyncWarningBanner';

describe('SyncWarningBanner', () => {
  it('renders a functionality-specific read-only retry action', () => {
    const html = renderToStaticMarkup(
      <SyncWarningBanner
        messages={['영상 판단 기록을 불러오지 못했습니다.']}
        actions={[
          {
            key: 'video-records',
            label: '영상 판단 기록 다시 확인',
            title: 'Azure DB 읽기만 다시 실행합니다.',
            onClick: vi.fn(),
          },
        ]}
      />,
    );

    expect(html).toContain('일부 온라인 저장 기능 확인 필요');
    expect(html).toContain('영상 판단 기록 다시 확인');
    expect(html).toContain('Azure DB 읽기만 다시 실행합니다');
  });
});
