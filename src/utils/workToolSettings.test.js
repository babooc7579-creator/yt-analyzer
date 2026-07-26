import { describe, expect, it, vi } from 'vitest';

import {
  getSafeWorkToolUrl,
  registerWorkToolBeforeUnloadGuard,
  validateWorkToolPreferences,
} from './workToolSettings';

describe('workToolSettings', () => {
  it('accepts only safe http and https URLs', () => {
    expect(getSafeWorkToolUrl('https://example.com/path')).toBe('https://example.com/path');
    expect(getSafeWorkToolUrl('http://example.com')).toBe('http://example.com/');
    expect(getSafeWorkToolUrl('javascript:alert(1)')).toBe('');
    expect(getSafeWorkToolUrl('not-a-url')).toBe('');
  });

  it('validates every edited custom tool before Cloud save', () => {
    expect(validateWorkToolPreferences({
      customTools: [{ label: '', href: 'https://example.com/' }],
    })).toEqual({
      success: false,
      message: '1번째 개인 도구의 이름을 입력해 주세요.',
    });

    expect(validateWorkToolPreferences({
      customTools: [{ label: '내 도구', href: 'javascript:alert(1)' }],
    })).toEqual({
      success: false,
      message: '내 도구의 주소를 https:// 또는 http://로 시작하는 올바른 주소로 입력해 주세요.',
    });

    expect(validateWorkToolPreferences({
      customTools: [{ label: '내 도구', href: 'https://example.com/' }],
    })).toEqual({ success: true, message: '' });
  });

  it('registers and removes unload protection only for unsaved changes', () => {
    const listeners = new Map();
    const target = {
      addEventListener: vi.fn((name, handler) => listeners.set(name, handler)),
      removeEventListener: vi.fn((name, handler) => {
        if (listeners.get(name) === handler) listeners.delete(name);
      }),
    };

    const cleanup = registerWorkToolBeforeUnloadGuard({
      hasUnsavedChanges: true,
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

  it('does not protect unload after changes are saved', () => {
    const target = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    registerWorkToolBeforeUnloadGuard({
      hasUnsavedChanges: false,
      target,
    })();

    expect(target.addEventListener).not.toHaveBeenCalled();
    expect(target.removeEventListener).not.toHaveBeenCalled();
  });
});
