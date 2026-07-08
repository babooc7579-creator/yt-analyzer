export const getChannelCategoryList = (categories) => (
  Array.isArray(categories) ? categories : []
);

export const getCategoryHideConfirmMessage = (category) => (
  `'${category}' 카테고리를 화면 목록에서 숨길까요?\n\n이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다. 나중에 같은 이름으로 카테고리를 다시 추가하면 목록에 다시 보입니다.`
);

export const getCategoriesAfterLocalHide = (categories, category) => (
  getChannelCategoryList(categories).filter((currentCategory) => currentCategory !== category)
);

export const canAddCategoryToLocalList = (categories, newCategoryName) => {
  const categoryList = getChannelCategoryList(categories);
  return Boolean(newCategoryName) && !categoryList.includes(newCategoryName);
};

export const getCategoriesAfterLocalAdd = (categories, newCategoryName) => (
  canAddCategoryToLocalList(categories, newCategoryName)
    ? [...getChannelCategoryList(categories), newCategoryName]
    : getChannelCategoryList(categories)
);

export const getChannelCategorySettingsProps = ({
  cancelRenameCategory,
  categories,
  cloudOnlyTags,
  confirmRenameCategory,
  hideCategoryFromLocalList,
  newCategoryName,
  renameLoading,
  renameValue,
  renamingCategory,
  setRenameValue,
  setNewCategoryName,
  startRenameCategory,
  addCategoryToLocalList,
}) => {
  const categoryList = getChannelCategoryList(categories);

  return {
    addInputProps: {
      newCategoryName,
      onAddCategory: addCategoryToLocalList,
      setNewCategoryName,
    },
    chipListProps: {
      cancelRenameCategory,
      categories: categoryList,
      confirmRenameCategory,
      hideCategoryFromLocalList,
      renameLoading,
      renameValue,
      renamingCategory,
      setRenameValue,
      startRenameCategory,
    },
    cloudOnlyTagsNoticeProps: {
      cloudOnlyTags,
    },
    categoryList,
  };
};

export const getChannelCategoryAddInputViewProps = () => ({
  addButtonProps: {
    'aria-label': '화면 카테고리 추가',
    title: '화면 카테고리 추가',
  },
  inputAriaLabel: '새 화면 카테고리 이름',
  inputPlaceholder: '새 카테고리명',
});

export const getChannelCloudOnlyTagsNoticeViewProps = (cloudOnlyTags = []) => {
  const tagList = getChannelCategoryList(cloudOnlyTags);

  if (tagList.length === 0) return null;

  return {
    description: '카테고리를 지워도 Cloud 채널 태그는 삭제되지 않습니다. 다시 보려면 같은 이름으로 카테고리를 추가하세요.',
    tagSummary: `${tagList.slice(0, 4).join(', ')}${tagList.length > 4 ? ` 외 ${tagList.length - 4}개` : ''}`,
    title: 'Cloud에는 있지만 화면 목록에는 없는 태그가 있습니다.',
  };
};
