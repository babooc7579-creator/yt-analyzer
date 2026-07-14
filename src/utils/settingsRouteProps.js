import { FUNCTION_API_BASE } from '../config';

const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildSettingsRouteProps(props = {}) {
  return {
    categorySettingsProps: {
      cancelRenameCategory: props.cancelRenameCategory,
      categories: toArray(props.categories),
      cloudOnlyTags: toArray(props.cloudOnlyTags),
      confirmRenameCategory: props.confirmRenameCategory,
      newCategoryName: props.newCategoryName,
      renameLoading: props.renameLoading,
      renameValue: props.renameValue,
      renamingCategory: props.renamingCategory,
      setCategories: props.setCategories,
      setNewCategoryName: props.setNewCategoryName,
      setRenameValue: props.setRenameValue,
      startRenameCategory: props.startRenameCategory,
    },
    functionApiBase: FUNCTION_API_BASE,
    savedChannelCount: toArray(props.savedChannels).length,
  };
}
