import { getJson, putJson } from './functionApiClient';

export const fetchWorkToolPreferences = () => getJson('/work-tool-preferences');

export const saveWorkToolPreferences = (preferences) => (
  putJson('/work-tool-preferences', preferences)
);
