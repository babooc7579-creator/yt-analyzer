import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import UploadCalendarWorkspace from './UploadCalendarWorkspace';

describe('UploadCalendarWorkspace', () => {
  it('renders saved schedule records as an operational calendar', () => {
    const html = renderToStaticMarkup(
      <UploadCalendarWorkspace
        onOpenProductionCandidates={vi.fn()}
        videoUserRecords={{
          v1: { status: PRODUCTION_STATUS.ACTIVE, statusIds: [PRODUCTION_STATUS.ACTIVE], targetPublishDate: '2026-07-14' },
        }}
        videos={[{ videoId: 'v1', title: '예약 영상' }]}
      />,
    );

    expect(html).toContain('업로드 캘린더');
    expect(html).toContain('제작 후보함에서 일정 수정');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
  });
});
