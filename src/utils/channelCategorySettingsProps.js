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
