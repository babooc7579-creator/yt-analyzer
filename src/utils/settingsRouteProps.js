import { FUNCTION_API_BASE } from '../config';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { getRestorableCategories } from './channelCategorySettingsProps';

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
    errorGuidance: getSettingsErrorGuidance(runtimeError),
    runtimeError,
    syncWarnings: warnings,
  };
}

export function getSettingsErrorGuidance(error = '') {
  const message = typeof error === 'string' ? error.trim() : '';
  if (!message) return null;

  if (/\b(401|403)\b|unauthorized|forbidden|권한|로그인/i.test(message)) {
    return {
      title: '로그인 또는 접근 권한을 확인해 주세요',
      description: 'Microsoft 계정 로그인 상태와 Creator OS 접근 권한을 확인한 뒤 온라인 저장소(Azure DB)의 채널을 다시 불러오세요.',
    };
  }

  if (/cors|failed to fetch|networkerror|network request|네트워크/i.test(message)) {
    return {
      title: '브라우저와 온라인 저장 API(Azure) 연결을 확인해 주세요',
      description: '인터넷 연결 또는 API의 허용 주소 문제일 수 있습니다. 잠시 뒤 다시 시도하고, 계속되면 배포 상태를 확인하세요.',
    };
  }

  if (/\b5\d\d\b|server|서버/i.test(message)) {
    return {
      title: '온라인 저장 API(Azure)가 요청을 처리하지 못했습니다',
      description: '입력 데이터 문제로 단정하지 말고 잠시 뒤 온라인 저장소(Azure DB)의 채널을 다시 불러오세요. 반복되면 GitHub Actions 배포 상태를 확인하세요.',
    };
  }

  return {
    title: '현재 오류를 확인한 뒤 다시 시도해 주세요',
    description: '먼저 온라인 저장소(Azure DB)의 채널 다시 불러오기를 실행하고, 같은 오류가 반복되면 배포 상태를 확인하세요.',
  };
}

export function buildSettingsRouteProps(props = {}) {
  const categories = toArray(props.categories);
  const cloudOnlyTags = toArray(props.cloudOnlyTags);

  return {
    apiKey: props.apiKey || '',
    categorySettingsProps: {
      cancelRenameCategory: props.cancelRenameCategory,
      categories,
      cloudOnlyTags,
      confirmRenameCategory: props.confirmRenameCategory,
      newCategoryName: props.newCategoryName,
      renameLoading: props.renameLoading,
      renameValue: props.renameValue,
      renamingCategory: props.renamingCategory,
      restorableCategories: getRestorableCategories(categories, [...DEFAULT_CATEGORIES, ...cloudOnlyTags]),
      setCategories: props.setCategories,
      setNewCategoryName: props.setNewCategoryName,
      setRenameValue: props.setRenameValue,
      startRenameCategory: props.startRenameCategory,
    },
    deploymentStatusUrl: CREATOR_OS_ACTIONS_URL,
    diagnostics: getSettingsDiagnostics(props),
    functionApiBase: FUNCTION_API_BASE,
    onClearError: () => props.setError?.(''),
    onRefreshChannels: props.loadChannelsFromCloud,
    onChangeApiKey: props.setApiKey,
    refreshingChannels: Boolean(props.channelsLoading),
    savedChannelCount: toArray(props.savedChannels).length,
    workToolSettingsProps: {
      error: props.workToolPreferencesError || '',
      loading: Boolean(props.workToolPreferencesLoading),
      onDirtyChange: props.setHasUnsavedWorkToolSettings,
      onOpenWorkTools: () => props.openCreatorView?.({ id: 'tools-bookmarks' }),
      onReload: props.loadWorkToolPreferences,
      onSave: props.saveWorkToolPreferences,
      preferences: props.workToolPreferences,
      saving: Boolean(props.workToolPreferencesSaving),
    },
  };
}
