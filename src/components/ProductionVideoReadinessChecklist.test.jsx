import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionVideoReadinessChecklist from './ProductionVideoReadinessChecklist';

describe('ProductionVideoReadinessChecklist', () => {
  it('shows only the preparation items that still need work', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoReadinessChecklist
        description="상태 확인만 하며 저장이나 API 호출은 실행하지 않습니다."
        items={[
          {
            key: 'source',
            isReady: true,
            label: '원본 링크',
            missingText: '영상 ID 없음',
            readyText: '확인 가능',
            title: 'YouTube 원본 링크 확인용입니다. 화면 표시만 하며 YouTube API를 새로 호출하지 않습니다.',
          },
          {
            key: 'note',
            isReady: false,
            label: '제작 메모',
            missingText: '메모 필요',
            readyText: '작성됨',
            title: '훅 포인트 메모입니다. 아래 Cloud 저장 버튼을 눌러야 저장됩니다.',
          },
        ]}
        summaryText="1개 남음"
        title="남은 준비"
        tone="working"
      />,
    );

    expect(html).toContain('남은 준비');
    expect(html).toContain('1개 남음');
    expect(html).toContain('상태 확인만 하며 저장이나 API 호출은 실행하지 않습니다.');
    expect(html).not.toContain('원본 링크');
    expect(html).not.toContain('확인 가능');
    expect(html).toContain('제작 메모');
    expect(html).toContain('메모 필요');
    expect(html).toContain('아래 Cloud 저장 버튼을 눌러야 저장됩니다.');
  });

  it('collapses to one completion message when every preparation item is ready', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoReadinessChecklist
        description="원본, 제목, 메모, 일정이 모두 준비됐습니다."
        items={[{
          key: 'source',
          isReady: true,
          label: '원본 링크',
          readyText: '확인 가능',
        }]}
        remainingItems={[]}
        summaryText="4/4 준비"
        title="작업 준비 완료"
        tone="ready"
      />,
    );

    expect(html).toContain('작업 준비 완료');
    expect(html).toContain('4/4 준비');
    expect(html).toContain('원본, 제목, 메모, 일정이 모두 준비됐습니다.');
    expect(html).not.toContain('원본 링크');
  });
});
