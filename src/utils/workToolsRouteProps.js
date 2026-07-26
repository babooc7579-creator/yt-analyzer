import { EMPTY_WORK_TOOL_PREFERENCES, getConfiguredWorkToolGroups } from '../constants/workTools';

export function buildWorkToolsRouteProps(props = {}) {
  const preferences = props.workToolPreferences || EMPTY_WORK_TOOL_PREFERENCES;

  return {
    error: props.workToolPreferencesError || '',
    loading: Boolean(props.workToolPreferencesLoading),
    onReload: props.loadWorkToolPreferences,
    toolGroups: getConfiguredWorkToolGroups(preferences),
  };
}
