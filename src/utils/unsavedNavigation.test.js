import { describe, expect, it, vi } from 'vitest';

import { guardUnsavedSidebarNavigation } from './unsavedNavigation';

describe('unsavedNavigation', () => {
  it('keeps the current view when the user cancels an unsaved move', () => {
    const confirmNavigation = vi.fn(() => false);
    const onNavigate = vi.fn();
    const navigate = guardUnsavedSidebarNavigation({
      activeView: 'ops-settings',
      confirmNavigation,
      hasUnsavedChanges: true,
      message: '저장하지 않은 설정이 있습니다.',
      onNavigate,
    });

    expect(navigate({ id: 'home' })).toBe(false);
    expect(confirmNavigation).toHaveBeenCalledWith('저장하지 않은 설정이 있습니다.');
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('moves without a prompt when nothing changed and ignores the active item', () => {
    const confirmNavigation = vi.fn();
    const onNavigate = vi.fn();
    const navigate = guardUnsavedSidebarNavigation({
      activeView: 'ops-settings',
      confirmNavigation,
      hasUnsavedChanges: false,
      message: '저장하지 않은 설정이 있습니다.',
      onNavigate,
    });

    expect(navigate({ id: 'ops-settings' })).toBe(false);
    expect(navigate({ id: 'home' })).toBe(true);
    expect(confirmNavigation).not.toHaveBeenCalled();
    expect(onNavigate).toHaveBeenCalledWith({ id: 'home' });
  });

  it('moves only after the user accepts an unsaved move', () => {
    const confirmNavigation = vi.fn(() => true);
    const onNavigate = vi.fn();
    const navigate = guardUnsavedSidebarNavigation({
      activeView: 'ops-settings',
      confirmNavigation,
      hasUnsavedChanges: true,
      message: '저장하지 않은 설정이 있습니다.',
      onNavigate,
    });

    expect(navigate({ id: 'home' })).toBe(true);
    expect(confirmNavigation).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith({ id: 'home' });
  });
});
