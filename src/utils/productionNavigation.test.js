import { describe, expect, it, vi } from 'vitest';

import {
  getGuardedProductionNavigationHandlers,
  guardProductionNavigation,
  PRODUCTION_UNSAVED_NAVIGATION_MESSAGE,
} from './productionNavigation';

describe('production navigation guard', () => {
  it('moves immediately when every production draft is saved', () => {
    const confirmNavigation = vi.fn();
    const onNavigate = vi.fn();
    const navigate = guardProductionNavigation({
      confirmNavigation,
      hasUnsavedDrafts: false,
      onNavigate,
    });

    expect(navigate('target')).toBe(true);
    expect(onNavigate).toHaveBeenCalledWith('target');
    expect(confirmNavigation).not.toHaveBeenCalled();
  });

  it('stays in production workspace when unsaved navigation is cancelled', () => {
    const confirmNavigation = vi.fn(() => false);
    const onNavigate = vi.fn();
    const navigate = guardProductionNavigation({
      confirmNavigation,
      hasUnsavedDrafts: true,
      onNavigate,
    });

    expect(navigate()).toBe(false);
    expect(confirmNavigation).toHaveBeenCalledWith(PRODUCTION_UNSAVED_NAVIGATION_MESSAGE);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('moves without deleting or saving drafts when the user confirms', () => {
    const confirmNavigation = vi.fn(() => true);
    const onNavigate = vi.fn();
    const navigate = guardProductionNavigation({
      confirmNavigation,
      hasUnsavedDrafts: true,
      onNavigate,
    });

    expect(navigate()).toBe(true);
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it('defaults to staying when unsaved drafts exist but confirmation is unavailable', () => {
    const onNavigate = vi.fn();
    const navigate = guardProductionNavigation({
      hasUnsavedDrafts: true,
      onNavigate,
    });

    expect(navigate()).toBe(false);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('guards each available outbound production handler', () => {
    const onOpenHome = vi.fn();
    const onOpenReferenceVault = vi.fn();
    const handlers = getGuardedProductionNavigationHandlers({
      confirmNavigation: () => true,
      handlers: {
        home: onOpenHome,
        'reference-vault': onOpenReferenceVault,
        missing: undefined,
      },
      hasUnsavedDrafts: true,
    });

    handlers.home();
    handlers['reference-vault']();

    expect(onOpenHome).toHaveBeenCalledOnce();
    expect(onOpenReferenceVault).toHaveBeenCalledOnce();
    expect(handlers.missing).toBeUndefined();
  });
});
