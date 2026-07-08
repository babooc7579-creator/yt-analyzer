import { getDiscoveryLinkName } from './discoveryLinkCollection';

export const DISCOVERY_LINK_LOAD_FAILED_MESSAGE =
  '발견함 링크를 불러오지 못했습니다.';

export const DISCOVERY_LINK_LOAD_UNAVAILABLE_MESSAGE =
  'Cloud 발견함 연결에 실패했습니다. Cloud 조회가 성공할 때까지 발견함 목록을 기준 데이터로 보지 않습니다.';

export const DISCOVERY_LINK_SAVE_FAILED_MESSAGE =
  '링크를 저장하지 못했습니다.';

export const DISCOVERY_LINK_SAVE_CLOUD_FAILED_MESSAGE =
  'Cloud에 링크를 저장하지 못했습니다.';

export const DISCOVERY_LINK_STATUS_SAVE_FAILED_MESSAGE =
  '링크 상태를 저장하지 못했습니다.';

export const DISCOVERY_LINK_UPDATE_CLOUD_FAILED_MESSAGE =
  'Cloud에 링크 변경 사항을 저장하지 못했습니다.';

export const DISCOVERY_LINK_DELETE_FAILED_MESSAGE =
  '링크를 삭제하지 못했습니다.';

export const DISCOVERY_LINK_DELETE_CLOUD_FAILED_MESSAGE =
  'Cloud에서 링크 기록을 삭제하지 못했습니다.';

export const DISCOVERY_LINK_SAVE_ACTION_LABEL = '저장';

export const DISCOVERY_LINK_UPDATE_ACTION_LABEL = '변경 저장';

export const DISCOVERY_LINK_DELETE_ACTION_LABEL = '삭제';

export const DISCOVERY_LINK_SAVING_MESSAGES = {
  create: '새 발견 링크를 Cloud에 저장하는 중입니다.',
  update: '링크 변경 사항을 Cloud에 저장하는 중입니다.',
  update_status: '검토 상태를 Cloud에 저장하는 중입니다.',
  update_rights: '권리 상태 표시를 Cloud에 저장하는 중입니다.',
  update_text: '제목과 메모를 Cloud에 저장하는 중입니다.',
  delete: 'Cloud 발견함에서 링크 기록을 삭제하는 중입니다.',
};

export const getDiscoveryLinkSavingMessage = (saving, action) => (
  saving ? DISCOVERY_LINK_SAVING_MESSAGES[action] || '' : ''
);

export const getDiscoveryActionError = (error, fallbackMessage, actionLabel = '저장') => {
  const message = error?.message || fallbackMessage;
  return `${message} Cloud ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export const getDiscoveryLinkCreatedNotice = (link) => (
  `${getDiscoveryLinkName(link)} 링크를 Cloud 발견함에 저장했습니다.`
);

export const getDiscoveryLinkDeletedNotice = (link) => (
  `${getDiscoveryLinkName(link)} 링크 기록을 Cloud 발견함에서 삭제했습니다.`
);
