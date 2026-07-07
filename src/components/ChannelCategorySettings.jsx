import {
  canAddCategoryToLocalList,
  getCategoriesAfterLocalAdd,
  getCategoriesAfterLocalHide,
  getCategoryHideConfirmMessage,
  getChannelCategorySettingsProps,
} from '../utils/channelCategorySettingsProps';
import ChannelCategoryAddInput from './ChannelCategoryAddInput';
import ChannelCategoryChipList from './ChannelCategoryChipList';
import ChannelCategoryHelpText from './ChannelCategoryHelpText';
import ChannelCloudOnlyTagsNotice from './ChannelCloudOnlyTagsNotice';

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
  const categoryList = Array.isArray(categories) ? categories : [];

  const hideCategoryFromLocalList = (category) => {
    const confirmed = window.confirm(getCategoryHideConfirmMessage(category));
    if (!confirmed) return;
    setCategories(getCategoriesAfterLocalHide(categoryList, category));
  };

  const addCategoryToLocalList = () => {
    if (!canAddCategoryToLocalList(categoryList, newCategoryName)) return;
    setCategories(getCategoriesAfterLocalAdd(categoryList, newCategoryName));
    setNewCategoryName('');
  };
  const {
    addInputProps,
    chipListProps,
    cloudOnlyTagsNoticeProps,
  } = getChannelCategorySettingsProps({
    addCategoryToLocalList,
    cancelRenameCategory,
    categories: categoryList,
    cloudOnlyTags,
    confirmRenameCategory,
    hideCategoryFromLocalList,
    newCategoryName,
    renameLoading,
    renameValue,
    renamingCategory,
    setNewCategoryName,
    setRenameValue,
    startRenameCategory,
  });

  return (
    <div className="mb-3 p-2 bg-white rounded border border-indigo-200 shadow-inner">
      <ChannelCategoryAddInput {...addInputProps} />
      <ChannelCategoryChipList {...chipListProps} />
      <ChannelCategoryHelpText />
      <ChannelCloudOnlyTagsNotice {...cloudOnlyTagsNoticeProps} />
    </div>
  );
}
