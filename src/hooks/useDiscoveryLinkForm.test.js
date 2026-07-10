import { beforeEach, describe, expect, it, vi } from 'vitest';

const { formStateOverrides, stateSetters } = vi.hoisted(() => ({
  formStateOverrides: [],
  stateSetters: [],
}));

vi.mock('react', () => ({
  useMemo: vi.fn((factory) => factory()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const initialState = formStateOverrides.length
      ? formStateOverrides.shift()
      : (typeof initialValue === 'function' ? initialValue() : initialValue);

    return [initialState, setter];
  }),
}));

import { useMemo, useState } from 'react';
import { useDiscoveryLinkForm } from './useDiscoveryLinkForm';

const createSubmitEvent = () => ({ preventDefault: vi.fn() });

const setFormState = (overrides = {}) => {
  formStateOverrides.push({
    url: '',
    title: '',
    memo: '',
    status: 'inbox',
    rightsStatus: 'unknown',
    ...overrides,
  });
};

describe('useDiscoveryLinkForm', () => {
  beforeEach(() => {
    formStateOverrides.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('initializes the create form with safe defaults and a disabled submit state', () => {
    const formHook = useDiscoveryLinkForm({
      links: [],
      onCreateLink: vi.fn(),
      saving: false,
    });

    expect(useState).toHaveBeenCalledWith(expect.any(Function));
    expect(formHook.form).toEqual({
      url: '',
      title: '',
      memo: '',
      status: 'inbox',
      rightsStatus: 'unknown',
    });
    expect(formHook.urlPreview).toBeNull();
    expect(formHook.duplicateLink).toBeNull();
    expect(formHook.isCreateDisabled).toBe(true);
    expect(formHook.showRiskyCandidateHint).toBe(false);
  });

  it('updates one form field while preserving the rest of the current form', () => {
    const formHook = useDiscoveryLinkForm({
      links: [],
      onCreateLink: vi.fn(),
      saving: false,
    });

    formHook.updateForm('title', 'New idea');

    expect(stateSetters[0]).toHaveBeenCalledWith(expect.any(Function));

    const updateForm = stateSetters[0].mock.calls[0][0];
    expect(updateForm({
      url: 'https://example.com',
      title: 'Old idea',
      memo: 'keep memo',
      status: 'saved',
      rightsStatus: 'needs_check',
    })).toEqual({
      url: 'https://example.com',
      title: 'New idea',
      memo: 'keep memo',
      status: 'saved',
      rightsStatus: 'needs_check',
    });
  });

  it('blocks creation when the URL already exists or has an invalid format', () => {
    const existingLink = { id: 'link-1', url: 'https://www.example.com/path' };
    setFormState({ url: ' https://example.com/path/ ' });

    const duplicateFormHook = useDiscoveryLinkForm({
      links: [existingLink],
      onCreateLink: vi.fn(),
      saving: false,
    });

    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [[existingLink], 'https://example.com/path/']);
    expect(duplicateFormHook.duplicateLink).toBe(existingLink);
    expect(duplicateFormHook.isCreateDisabled).toBe(true);

    setFormState({ url: 'not a url' });

    const invalidFormHook = useDiscoveryLinkForm({
      links: [],
      onCreateLink: vi.fn(),
      saving: false,
    });

    expect(invalidFormHook.urlPreview).toMatchObject({
      isValid: false,
      label: '올바른 URL 형식이 아닙니다',
    });
    expect(invalidFormHook.isCreateDisabled).toBe(true);
  });

  it('creates a discovery link with trimmed values and detected platform metadata', async () => {
    setFormState({
      url: ' https://www.instagram.com/reel/abc/ ',
      title: '  Cake table idea  ',
      memo: '  Check original source  ',
      status: 'saved',
      rightsStatus: 'needs_check',
    });
    const onCreateLink = vi.fn(() => Promise.resolve(true));
    const formHook = useDiscoveryLinkForm({
      links: [],
      onCreateLink,
      saving: false,
    });
    const event = createSubmitEvent();

    await formHook.handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onCreateLink).toHaveBeenCalledWith({
      url: 'https://www.instagram.com/reel/abc/',
      platform: 'instagram',
      title: 'Cake table idea',
      memo: 'Check original source',
      status: 'saved',
      rightsStatus: 'needs_check',
    });
    expect(stateSetters[0]).toHaveBeenCalledWith({
      url: '',
      title: '',
      memo: '',
      status: 'inbox',
      rightsStatus: 'unknown',
    });
  });

  it('does not call create or reset the form when submit is disabled or create fails', async () => {
    const disabledCreate = vi.fn();
    const disabledFormHook = useDiscoveryLinkForm({
      links: [],
      onCreateLink: disabledCreate,
      saving: false,
    });

    await disabledFormHook.handleSubmit(createSubmitEvent());

    expect(disabledCreate).not.toHaveBeenCalled();

    setFormState({ url: 'https://example.com/source' });
    const failedCreate = vi.fn(() => Promise.resolve(false));
    const failedFormHook = useDiscoveryLinkForm({
      links: [],
      onCreateLink: failedCreate,
      saving: false,
    });

    await failedFormHook.handleSubmit(createSubmitEvent());

    expect(failedCreate).toHaveBeenCalledTimes(1);
    expect(stateSetters.at(-1)).not.toHaveBeenCalled();
  });

  it('asks for confirmation before marking a do-not-use link as a candidate', async () => {
    const confirm = vi.fn(() => false);
    vi.stubGlobal('window', { confirm });
    setFormState({
      url: 'https://example.com/source',
      status: 'candidate',
      rightsStatus: 'do_not_use',
    });
    const onCreateLink = vi.fn();
    const formHook = useDiscoveryLinkForm({
      links: [],
      onCreateLink,
      saving: false,
    });

    expect(formHook.showRiskyCandidateHint).toBe(true);

    await formHook.handleSubmit(createSubmitEvent());

    expect(confirm).toHaveBeenCalled();
    expect(onCreateLink).not.toHaveBeenCalled();
  });
});
