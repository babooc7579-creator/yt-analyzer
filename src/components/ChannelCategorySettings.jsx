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
import { RotateCcw } from 'lucide-react';

export default function ChannelCategorySettings({
  cancelRenameCategory,
  categories,
  cloudOnlyTags = [],
  confirmRenameCategory,
  newCategoryName,
  renameLoading,
  renameValue,
  renamingCategory,
  restorableCategories = [],
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
  const restoreCategoryToLocalList = (category) => {
    setCategories?.((currentCategories) => getCategoriesAfterLocalAdd(currentCategories, category));
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
      {restorableCategories.length > 0 && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          <p className="text-[10px] font-bold text-slate-600">숨긴 분야 다시 표시</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">이 브라우저의 화면 목록에만 복원합니다. Cloud 채널 태그나 수집 영상은 변경하지 않습니다.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {restorableCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => restoreCategoryToLocalList(category)}
                className="inline-flex items-center gap-1 border border-slate-300 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-700"
                title={`${category} 분야를 이 브라우저 화면 목록에 다시 표시`}
              >
                <RotateCcw className="h-3 w-3" /> {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
