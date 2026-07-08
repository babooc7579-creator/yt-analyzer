import { describe, expect, it } from 'vitest';

import {
  getDiscoveryLinkDraftUpdates,
  getDiscoveryLinkEditFormViewProps,
  getDiscoveryLinkFormProps,
  getDiscoveryLinkUrlPreview,
  needsRiskyDiscoveryCandidateConfirmation,
  normalizeDiscoveryLinkUrl,
} from './discoveryLinkForm';

describe('discoveryLinkForm utils', () => {
  it('trims title and memo draft updates', () => {
    expect(getDiscoveryLinkDraftUpdates('  Short idea  ', '  check rights  ')).toEqual({
      title: 'Short idea',
      memo: 'check rights',
    });
  });

  it('normalizes valid URLs without changing source identity', () => {
    expect(normalizeDiscoveryLinkUrl(' HTTPS://www.Example.com/path/?b=2 ')).toBe('https://example.com/path?b=2');
  });

  it('falls back to trimmed lower-case text for invalid URLs', () => {
    expect(normalizeDiscoveryLinkUrl('  NOT A URL/  ')).toBe('not a url');
  });

  it('returns URL preview metadata for valid and invalid input', () => {
    expect(getDiscoveryLinkUrlPreview('https://www.instagram.com/reel/abc/')).toMatchObject({
      host: 'instagram.com',
      isValid: true,
    });

    expect(getDiscoveryLinkUrlPreview('not a url')).toEqual({
      host: '',
      label: '올바른 URL 형식이 아닙니다',
      isValid: false,
    });
  });

  it('requires confirmation only when do-not-use links are sent to candidate', () => {
    expect(needsRiskyDiscoveryCandidateConfirmation('candidate', 'do_not_use')).toBe(true);
    expect(needsRiskyDiscoveryCandidateConfirmation('candidate', 'needs_check')).toBe(false);
    expect(needsRiskyDiscoveryCandidateConfirmation('saved', 'do_not_use')).toBe(false);
  });

  it('builds discovery link create form child props and field update handlers', () => {
    const changes = [];
    const onChange = (field, value) => changes.push([field, value]);
    const duplicateLink = { id: 'link-1' };
    const urlPreview = { isValid: true, label: 'Instagram link' };

    const props = getDiscoveryLinkFormProps({
      duplicateLink,
      form: {
        url: 'https://instagram.com/reel/abc',
        title: 'Cake table',
        memo: 'check source',
        status: 'candidate',
        rightsStatus: 'needs_check',
      },
      isCreateDisabled: true,
      onChange,
      saving: true,
      showRiskyCandidateHint: true,
      urlPreview,
    });

    expect(props.urlFieldProps).toMatchObject({
      duplicateLink,
      onChange,
      url: 'https://instagram.com/reel/abc',
      urlPreview,
    });
    expect(props.titleFieldProps).toMatchObject({
      ariaLabel: '발견 링크 제목 또는 기억할 이름',
      label: '제목 또는 기억할 이름',
      placeholder: '나중에 알아볼 수 있는 이름',
      value: 'Cake table',
    });
    expect(props.statusFieldsProps).toMatchObject({
      onChange,
      rightsStatus: 'needs_check',
      status: 'candidate',
    });
    expect(props.memoFieldProps.value).toBe('check source');
    expect(props.submitButtonProps).toEqual({
      duplicateLink,
      isCreateDisabled: true,
      saving: true,
    });
    expect(props.riskyCandidateHintProps).toEqual({
      show: true,
    });

    props.titleFieldProps.onChange('New title');
    props.memoFieldProps.onChange('New memo');

    expect(changes).toEqual([
      ['title', 'New title'],
      ['memo', 'New memo'],
    ]);
  });

  it('builds edit form button labels and preserves handlers', () => {
    const onCancel = () => 'cancel';
    const onSave = () => 'save';
    const setDraftMemo = () => 'memo';
    const setDraftTitle = () => 'title';
    const props = getDiscoveryLinkEditFormViewProps({
      draftMemo: 'memo',
      draftTitle: 'title',
      linkId: 'link-1',
      onCancel,
      onSave,
      saving: false,
      setDraftMemo,
      setDraftTitle,
      title: 'Idea link',
    });

    expect(props.saveButtonLabel).toBe('저장');
    expect(props.cancelButtonLabel).toBe('취소');
    expect(props.saveButtonProps.onClick).toBe(onSave);
    expect(props.cancelButtonProps.onClick).toBe(onCancel);
    expect(props.titleField.label).toBe('제목');
    expect(props.memoField.label).toBe('메모');
  });
});
