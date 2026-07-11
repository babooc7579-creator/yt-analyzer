import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionDiscoveryLinkMoveActions from './ProductionDiscoveryLinkMoveActions';

describe('ProductionDiscoveryLinkMoveActions', () => {
  it('renders Cloud discovery link move actions without deleting the link record', () => {
    const html = renderToStaticMarkup(
      <ProductionDiscoveryLinkMoveActions
        isMoving={false}
        link={{ id: 'link-1' }}
        linkTitle="좋은 참고 링크"
        onMove={() => 'move link'}
      />,
    );

    expect(html).toContain('발견함으로 되돌리기');
    expect(html).toContain('후보 제외');
    expect(html).toContain('제작 후보 표시만 해제하고 Cloud 발견함 상태를 받은 링크로 저장합니다. 링크 기록은 삭제되지 않습니다.');
    expect(html).toContain('링크 기록을 삭제하지 않고 Cloud 발견함의 후보 제외 상태로 저장합니다.');
    expect(html).toContain('aria-label="좋은 참고 링크 링크 삭제 없이 Cloud 발견함 후보 제외 상태로 저장"');
    expect(html).not.toContain('disabled=""');
  });

  it('renders disabled moving state as Cloud saving', () => {
    const html = renderToStaticMarkup(
      <ProductionDiscoveryLinkMoveActions
        isMoving
        link={{ id: 'link-1' }}
        linkTitle="좋은 참고 링크"
        onMove={() => 'move link'}
      />,
    );

    expect(html.match(/Cloud 저장 중/g)).toHaveLength(2);
    expect(html.match(/disabled=""/g)).toHaveLength(2);
  });

  it('disables move actions when the link has no Cloud id', () => {
    const html = renderToStaticMarkup(
      <ProductionDiscoveryLinkMoveActions
        isMoving={false}
        link={{}}
        linkTitle="임시 링크"
      />,
    );

    expect(html).toContain('임시 링크 제작 후보 표시를 해제하고 Cloud 발견함 받은 링크 상태로 저장');
    expect(html.match(/disabled=""/g)).toHaveLength(2);
  });
});
