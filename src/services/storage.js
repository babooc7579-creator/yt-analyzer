export const STORAGE_KEYS = {
  categories: 'yt_crm_categories',
  savedVideos: 'yt_crm_saved_videos',
  videoUserRecords: 'yt_crm_video_user_records',
};

export const readJsonStorage = (key, fallbackValue) => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

export const writeJsonStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
