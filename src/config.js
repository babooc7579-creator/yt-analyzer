// App-wide configuration values.
// Keep API keys and secrets out of this file.

const configuredFunctionApiBase = import.meta.env.VITE_FUNCTION_API_BASE?.trim();

export const FUNCTION_API_BASE = configuredFunctionApiBase || '/api';

export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
