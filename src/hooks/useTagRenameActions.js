import { renameTag } from '../services/functionApi';

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
      setError('이미 존재하는 카테고리 이름입니다.');
      return;
    }

    setRenameLoading(true);
    setError('');

    try {
      const data = await renameTag({ from, to });
      if (!data.success) throw new Error(data.error || '태그 이름 변경에 실패했습니다.');

      setCategories(prev => prev.map(category => (category === from ? to : category)));
      if (selectedCategoryTab === from) setSelectedCategoryTab(to);
      setProgressMsg(`'${from}' → '${to}'로 변경 완료 (채널 ${data.channelsAffected}개 영향)`);
      await loadChannelsFromCloud();
      cancelRenameCategory();
    } catch (err) {
      setError(err.message);
    } finally {
      setRenameLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  return {
    confirmRenameCategory,
  };
}
