import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ImprovementLogWorkspace from './ImprovementLogWorkspace';

describe('ImprovementLogWorkspace', () => {
  it('renders a read-only product improvement ledger with the script workspace first', () => {
    const html = renderToStaticMarkup(<ImprovementLogWorkspace />);

    expect(html).toContain('Creator OS 개선 기록');
    expect(html).toContain('대본 작업실');
    expect(html).toContain('현재 상태');
    expect(html).toContain('목표 상태');
    expect(html).toContain('체크포인트');
    expect(html).toContain('결정 필요');
    expect(html).toContain('API 호출이나 온라인 저장소(Azure DB) 변경은 없습니다');
    expect(html).toContain('실제 클릭');
  });
});
