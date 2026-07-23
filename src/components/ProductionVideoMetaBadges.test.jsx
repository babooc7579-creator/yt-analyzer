import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import ProductionVideoMetaBadges from './ProductionVideoMetaBadges';

describe('ProductionVideoMetaBadges', () => {
  it('shows a saved target date on candidate cards without requiring a schedule signal', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoMetaBadges
        columnId={PRODUCTION_STATUS.CANDIDATE}
        record={{ targetPublishDate: '2026-07-30' }}
        video={{ channelTitle: '참고 채널', multiplier: 3.25 }}
      />,
    );

    expect(html).toContain('참고 채널');
    expect(html).toContain('업로드 26.07.30');
    expect(html).toContain('대박 지수 3.3x');
  });

  it('keeps the existing schedule signal on active production cards', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoMetaBadges
        columnId={PRODUCTION_STATUS.ACTIVE}
        record={{}}
        scheduleSignal={{ label: '오늘 예정', tone: 'bg-rose-50 text-rose-600' }}
        video={{ channelTitle: '참고 채널' }}
      />,
    );

    expect(html).toContain('오늘 예정');
    expect(html).not.toContain('업로드 ');
  });
});
