import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CREATOR_OS_PRODUCT_MAP } from '../constants/creatorOs';
import { getCreatorSidebarNavigationGroups } from '../utils/appLayoutProps';
import CreatorSidebar from './CreatorSidebar';
import CreatorSidebarRoadmap from './CreatorSidebarRoadmap';

describe('CreatorSidebar', () => {
  it('shows live workspaces and keeps future items collapsed by default', () => {
    const html = renderToStaticMarkup(
      <CreatorSidebar activeView="home" onOpenView={() => {}} />,
    );

    expect(html).toContain('오늘의 레이더');
    expect(html).toContain('발견 링크 저장');
    expect(html).toContain('제작 후보함');
    expect(html).toContain('선택 채널 새 영상 수집');
    expect(html).toContain('향후 기능');
    expect(html).toContain('21개');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('트렌드 스캐너');
    expect(html).not.toContain('후킹 분석');
    expect(html).not.toContain('성과 리포트');
  });

  it('renders every planned item when the roadmap is expanded', () => {
    const {
      roadmapItemCount,
      roadmapSections,
    } = getCreatorSidebarNavigationGroups(CREATOR_OS_PRODUCT_MAP);
    const html = renderToStaticMarkup(
      <CreatorSidebarRoadmap
        activeView="discovery-trends"
        isOpen
        onOpenView={() => {}}
        onToggle={() => {}}
        roadmapItemCount={roadmapItemCount}
        roadmapSections={roadmapSections}
      />,
    );

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('트렌드 스캐너');
    expect(html).toContain('후킹 분석');
    expect(html).toContain('성과 리포트');
    expect(html.match(/data-testid="creator-sidebar-item-/g)).toHaveLength(21);
  });
});
