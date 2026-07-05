import { renameTag } from '../services/channelApi';

const getTagRenameErrorMessage = (error) => {
  const message = error?.message || '태그 이름 변경에 실패했습니다.';
  return `${message} Cloud 태그 이름 변경을 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

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

    const confirmed = window.confirm(
      `'${from}' 태그 이름을 '${to}'로 변경할까요?\n\n이 작업은 화면 목록만 바꾸는 것이 아니라, Cloud DB에서 이 태그가 붙은 채널들에도 일괄 반영됩니다.`
    );
    if (!confirmed) return;

    setRenameLoading(true);
    setError('');
    setProgressMsg(`Cloud 태그 '${from}'을 '${to}'로 변경하는 중입니다. 이 태그가 붙은 채널에도 반영됩니다.`);

    try {
      const data = await renameTag({ from, to });
      if (!data.success) throw new Error(data.error || '태그 이름 변경에 실패했습니다.');

      setCategories(prev => prev.map(category => (category === from ? to : category)));
      if (selectedCategoryTab === from) setSelectedCategoryTab(to);
      setProgressMsg(`Cloud 태그 변경 완료: '${from}' → '${to}' (채널 ${data.channelsAffected}개 반영)`);
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
