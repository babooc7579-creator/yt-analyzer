import { describe, expect, it, vi } from 'vitest';

import {
  getGuardedProductionNavigationHandlers,
  guardProductionNavigation,
  guardProductionSidebarNavigation,
  PRODUCTION_UNSAVED_NAVIGATION_MESSAGE,
  registerProductionBeforeUnloadGuard,
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

  it('guards sidebar moves while allowing the active sidebar item to be reselected quietly', () => {
    const confirmNavigation = vi.fn(() => true);
    const onNavigate = vi.fn();
    const navigate = guardProductionSidebarNavigation({
      activeView: 'studio-candidates',
      confirmNavigation,
      hasUnsavedDrafts: true,
      onNavigate,
    });

    expect(navigate({ id: 'studio-candidates' })).toBe(false);
    expect(confirmNavigation).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();

    expect(navigate({ id: 'home' })).toBe(true);
    expect(confirmNavigation).toHaveBeenCalledWith(PRODUCTION_UNSAVED_NAVIGATION_MESSAGE);
    expect(onNavigate).toHaveBeenCalledWith({ id: 'home' });
  });

  it('keeps the current view when an unsaved sidebar move is cancelled', () => {
    const onNavigate = vi.fn();
    const navigate = guardProductionSidebarNavigation({
      activeView: 'studio-candidates',
      confirmNavigation: () => false,
      hasUnsavedDrafts: true,
      onNavigate,
    });

    expect(navigate({ id: 'vault-all' })).toBe(false);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('registers and removes browser unload protection for unsaved drafts', () => {
    const listeners = new Map();
    const target = {
      addEventListener: vi.fn((name, handler) => listeners.set(name, handler)),
      removeEventListener: vi.fn((name, handler) => {
        if (listeners.get(name) === handler) listeners.delete(name);
      }),
    };
    const cleanup = registerProductionBeforeUnloadGuard({
      hasUnsavedDrafts: true,
      target,
    });
    const event = {
      preventDefault: vi.fn(),
      returnValue: undefined,
    };

    listeners.get('beforeunload')(event);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(event.returnValue).toBe('');
    cleanup();
    expect(listeners.has('beforeunload')).toBe(false);
  });

  it('does not register browser unload protection when every draft is saved', () => {
    const target = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const cleanup = registerProductionBeforeUnloadGuard({
      hasUnsavedDrafts: false,
      target,
    });

    cleanup();

    expect(target.addEventListener).not.toHaveBeenCalled();
    expect(target.removeEventListener).not.toHaveBeenCalled();
  });
});
