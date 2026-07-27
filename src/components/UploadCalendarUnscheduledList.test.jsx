import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import UploadCalendarUnscheduledList from './UploadCalendarUnscheduledList';

describe('UploadCalendarUnscheduledList', () => {
  it('renders unscheduled candidates with direct script and scheduling actions', () => {
    const html = renderToStaticMarkup(
      <UploadCalendarUnscheduledList
        focusedVideoId="v1"
        items={[{
          sourceLoaded: true,
          statusLabel: '제작 후보',
          thumbnail: 'https://example.com/thumb.jpg',
          title: '날짜 없는 후보',
          videoId: 'v1',
        }]}
        onOpenProductionCandidate={vi.fn()}
        onOpenProductionCandidates={vi.fn()}
        onOpenScriptBoard={vi.fn()}
      />,
    );

    expect(html).toContain('날짜 미정 제작 후보 1개');
    expect(html).toContain('대본 이어쓰기');
    expect(html).toContain('이 후보 날짜 정하기');
    expect(html).toContain('후보함에서 날짜 정하기');
    expect(html).toContain('이어서 작업');
  });

  it('renders nothing when every production candidate already has a date', () => {
    expect(renderToStaticMarkup(<UploadCalendarUnscheduledList items={[]} />)).toBe('');
  });
});
