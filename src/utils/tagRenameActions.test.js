import { describe, expect, it } from 'vitest';

import {
  TAG_RENAME_DUPLICATE_MESSAGE,
  TAG_RENAME_FAILED_MESSAGE,
  getRenamedCategories,
  getSelectedCategoryAfterRename,
  getTagRenameCompleteMessage,
  getTagRenameConfirmMessage,
  getTagRenameErrorMessage,
  getTagRenameStartMessage,
} from './tagRenameActions';

describe('tagRenameActions utils', () => {
  it('builds tag rename messages that clearly mention Cloud updates', () => {
    expect(TAG_RENAME_DUPLICATE_MESSAGE).toBe('이미 존재하는 카테고리 이름입니다.');
    expect(TAG_RENAME_FAILED_MESSAGE).toBe('태그 이름 변경에 실패했습니다.');
    expect(getTagRenameConfirmMessage('해외', '해외 레퍼런스')).toContain('온라인 저장소(Azure DB)');
    expect(getTagRenameConfirmMessage('해외', '해외 레퍼런스')).toContain('일괄 반영');
    expect(getTagRenameStartMessage('해외', '해외 레퍼런스')).toBe(
      "온라인 저장소(Azure DB)의 채널 태그 '해외'을 '해외 레퍼런스'로 변경하는 중입니다. 이 태그가 붙은 채널에도 반영됩니다."
    );
    expect(getTagRenameCompleteMessage({
      from: '해외',
      to: '해외 레퍼런스',
      channelsAffected: 3,
    })).toBe(
      "온라인 저장소(Azure DB)의 채널 태그 변경 완료: '해외' → '해외 레퍼런스' (채널 3개 반영)"
    );
  });

  it('builds Cloud failure messages from thrown errors or fallback text', () => {
    expect(getTagRenameErrorMessage(new Error('network down'))).toBe(
      'network down 온라인 저장소(Azure DB)의 채널 태그 이름 변경을 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.'
    );
    expect(getTagRenameErrorMessage(null)).toBe(
      '태그 이름 변경에 실패했습니다. 온라인 저장소(Azure DB)의 채널 태그 이름 변경을 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.'
    );
  });

  it('renames matching categories without mutating the original list', () => {
    const categories = ['해외', '예능', '정치'];

    expect(getRenamedCategories(categories, '해외', '해외 레퍼런스')).toEqual([
      '해외 레퍼런스',
      '예능',
      '정치',
    ]);
    expect(categories).toEqual(['해외', '예능', '정치']);
    expect(getRenamedCategories(null, '해외', '해외 레퍼런스')).toEqual([]);
  });

  it('keeps the selected category unless the renamed tag was selected', () => {
    expect(getSelectedCategoryAfterRename('해외', '해외', '해외 레퍼런스')).toBe('해외 레퍼런스');
    expect(getSelectedCategoryAfterRename('예능', '해외', '해외 레퍼런스')).toBe('예능');
  });
});
