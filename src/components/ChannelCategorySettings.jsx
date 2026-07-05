import ChannelCategoryAddInput from './ChannelCategoryAddInput';
import ChannelCategoryChipList from './ChannelCategoryChipList';
import ChannelCategoryHelpText from './ChannelCategoryHelpText';
import ChannelCloudOnlyTagsNotice from './ChannelCloudOnlyTagsNotice';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function ChannelCategorySettings({
  cancelRenameCategory,
  categories,
  cloudOnlyTags = [],
  confirmRenameCategory,
  newCategoryName,
  renameLoading,
  renameValue,
  renamingCategory,
  setCategories,
  setNewCategoryName,
  setRenameValue,
  startRenameCategory,
}) {
  const categoryList = toArray(categories);

  const hideCategoryFromLocalList = (category) => {
    const confirmed = window.confirm(
      `'${category}' 카테고리를 화면 목록에서 숨길까요?\n\n이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다. 나중에 같은 이름으로 카테고리를 다시 추가하면 목록에 다시 보입니다.`
    );
    if (!confirmed) return;
    setCategories(categoryList.filter((currentCategory) => currentCategory !== category));
  };

  const addCategoryToLocalList = () => {
    if (!newCategoryName || categoryList.includes(newCategoryName)) return;
    setCategories([...categoryList, newCategoryName]);
    setNewCategoryName('');
  };
  const addInputProps = {
    newCategoryName,
    onAddCategory: addCategoryToLocalList,
    setNewCategoryName,
  };

  const chipListProps = {
    cancelRenameCategory,
    categories: categoryList,
    confirmRenameCategory,
    hideCategoryFromLocalList,
    renameLoading,
    renameValue,
    renamingCategory,
    setRenameValue,
    startRenameCategory,
  };

  const cloudOnlyTagsNoticeProps = {
    cloudOnlyTags,
  };

  return (
    <div className="mb-3 p-2 bg-white rounded border border-indigo-200 shadow-inner">
      <ChannelCategoryAddInput {...addInputProps} />
      <ChannelCategoryChipList {...chipListProps} />
      <ChannelCategoryHelpText />
      <ChannelCloudOnlyTagsNotice {...cloudOnlyTagsNoticeProps} />
    </div>
  );
}
