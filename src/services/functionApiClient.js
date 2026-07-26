import { FUNCTION_API_BASE } from '../config';

export const FUNCTION_API_REQUEST_FAILED_MESSAGE =
  'Cloud API 요청에 실패했습니다.';

export const FUNCTION_API_RESPONSE_READ_FAILED_MESSAGE =
  'Cloud API 응답을 읽지 못했습니다. 잠시 뒤 다시 시도해 주세요.';

const getResponseErrorMessage = (response, data) => (
  data?.error || data?.message || `${FUNCTION_API_REQUEST_FAILED_MESSAGE} (${response.status})`
);

const readJsonResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      ...(data && typeof data === 'object' ? data : {}),
      success: false,
      error: getResponseErrorMessage(response, data),
    };
  }

  if (!data || typeof data !== 'object') {
    return {
      success: false,
      error: FUNCTION_API_RESPONSE_READ_FAILED_MESSAGE,
    };
  }

  return data;
};

export const getJson = async (path) => {
  const response = await fetch(`${FUNCTION_API_BASE}${path}`);
  return readJsonResponse(response);
};

export const sendJson = async (path, options = {}) => {
  const { headers, ...fetchOptions } = options;
  const response = await fetch(`${FUNCTION_API_BASE}${path}`, {
    ...fetchOptions,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
  });
  return readJsonResponse(response);
};

export const postJson = (path, body) => (
  sendJson(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
);

export const patchJson = (path, body) => (
  sendJson(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
);

export const putJson = (path, body) => (
  sendJson(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
);

export const deleteJson = (path) => (
  sendJson(path, {
    method: 'DELETE',
  })
);
