import { renameTag } from '../services/channelApi';
import {
  TAG_RENAME_DUPLICATE_MESSAGE,
  getRenamedCategories,
  getSelectedCategoryAfterRename,
  getTagRenameCompleteMessage,
  getTagRenameConfirmMessage,
  getTagRenameErrorMessage,
  getTagRenameStartMessage,
} from '../utils/tagRenameActions';

export function useTagRenameActions({
  cancelRenameCategory,
  categories,
  loadChannelsFromCloud,
  renameValue,
  renamingCategory,
  selectedCategoryTab,
  setCategories,
  setError,
  setProgressMsg,
  setRenameLoading,
  setSelectedCategoryTab,
}) {
  const confirmRenameCategory = async () => {
    const from = renamingCategory;
    const to = renameValue.trim();

    if (!from || !to || from === to) {
      cancelRenameCategory();
      return;
    }

    if (categories.includes(to)) {
      setError(TAG_RENAME_DUPLICATE_MESSAGE);
      return;
    }

    const confirmed = window.confirm(getTagRenameConfirmMessage(from, to));
    if (!confirmed) return;

    setRenameLoading(true);
    setError('');
    setProgressMsg(getTagRenameStartMessage(from, to));

    try {
      const data = await renameTag({ from, to });
      if (!data.success) throw new Error(data.error || '태그 이름 변경에 실패했습니다.');

      setCategories(prev => getRenamedCategories(prev, from, to));
      const nextSelectedCategoryTab = getSelectedCategoryAfterRename(selectedCategoryTab, from, to);
      if (nextSelectedCategoryTab !== selectedCategoryTab) {
        setSelectedCategoryTab(nextSelectedCategoryTab);
      }
      setProgressMsg(getTagRenameCompleteMessage({
        from,
        to,
        channelsAffected: data.channelsAffected,
      }));
      await loadChannelsFromCloud();
      cancelRenameCategory();
    } catch (err) {
      setError(getTagRenameErrorMessage(err));
    } finally {
      setRenameLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  return {
    confirmRenameCategory,
  };
}
