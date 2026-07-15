import { FUNCTION_API_BASE } from '../config';

const toArray = (items) => (Array.isArray(items) ? items : []);
const CREATOR_OS_ACTIONS_URL = 'https://github.com/babooc7579-creator/yt-analyzer/actions';

export function getSettingsDiagnostics({
  apiKey = '',
  error = '',
  syncWarnings = [],
} = {}) {
  const warnings = toArray(syncWarnings).filter(Boolean);
  const runtimeError = typeof error === 'string' ? error.trim() : '';

  return {
    apiKeyConfigured: Boolean(apiKey.trim()),
    runtimeError,
    syncWarnings: warnings,
  };
}

export function buildSettingsRouteProps(props = {}) {
  return {
    apiKey: props.apiKey || '',
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
    deploymentStatusUrl: CREATOR_OS_ACTIONS_URL,
    diagnostics: getSettingsDiagnostics(props),
    functionApiBase: FUNCTION_API_BASE,
    onChangeApiKey: props.setApiKey,
    savedChannelCount: toArray(props.savedChannels).length,
  };
}
