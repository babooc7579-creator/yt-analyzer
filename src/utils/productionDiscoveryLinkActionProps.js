const FALLBACK_LINK_TITLE = '이 링크';

const getDisplayLinkTitle = (linkTitle) => linkTitle || FALLBACK_LINK_TITLE;
const noop = () => {};

export const PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS = {
  DISCARDED: 'discarded',
  INBOX: 'inbox',
};

export const getProductionDiscoveryLinkBadgesViewProps = ({ sourceHost } = {}) => ({
  candidateLabel: '링크 후보',
  sourceLabel: `출처 ${sourceHost}`,
});

export const getProductionDiscoveryLinkMoveButtonViewProps = ({
  isMoving = false,
  label,
  movingLabel = 'Cloud 저장 중',
} = {}) => ({
  visibleLabel: isMoving ? movingLabel : label,
});

export const getProductionDiscoveryLinkCopyButtonProps = ({
  disabled,
  link,
  linkTitle,
} = {}) => {
  const displayTitle = getDisplayLinkTitle(linkTitle);

  return {
    ariaLabel: `${displayTitle} 원본 링크 URL 복사`,
    className: 'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50',
    copiedLabel: '복사 완료',
    copyingLabel: '복사 중',
    disabled,
    errorLabel: '복사 실패',
    iconClassName: 'h-3.5 w-3.5',
    label: '링크 복사',
    title: '원본 링크 URL을 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다.',
    url: link?.url,
  };
};

export const getProductionDiscoveryLinkOpenButtonProps = ({ link, linkTitle } = {}) => {
  const displayTitle = getDisplayLinkTitle(linkTitle);
  const href = link?.url || '#';
  const disabled = !link?.url;

  return {
    'aria-label': disabled
      ? `${displayTitle} 원본 링크 URL 없음`
      : `${displayTitle} 원본 링크 열기`,
    disabled,
    href,
    label: '원본 열기',
    title: disabled
      ? '원본 링크 URL이 없어 열 수 없습니다.'
      : '원본 링크를 새 탭에서 열기',
  };
};

export const getProductionDiscoveryLinkEditButtonProps = ({ linkTitle } = {}) => {
  const displayTitle = getDisplayLinkTitle(linkTitle);

  return {
    'aria-label': `${displayTitle} 발견함에서 수정`,
    label: '발견함에서 수정',
    title: '발견함 화면에서 링크 상태와 메모 수정',
  };
};

export const getProductionDiscoveryLinkMoveActions = ({ link, linkTitle, onMove } = {}) => {
  const displayTitle = getDisplayLinkTitle(linkTitle);
  const linkId = link?.id;
  const canMove = Boolean(linkId) && typeof onMove === 'function';
  const getOnMoveClick = (targetStatus) => (
    canMove ? () => onMove(linkId, targetStatus) : noop
  );

  return [
    {
      ariaLabel: `${displayTitle} 제작 후보 표시를 해제하고 Cloud 발견함 받은 링크 상태로 저장`,
      disabled: !canMove,
      label: '발견함으로 되돌리기',
      onClick: getOnMoveClick(PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS.INBOX),
      targetStatus: PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS.INBOX,
      title: '제작 후보 표시만 해제하고 Cloud 발견함 상태를 받은 링크로 저장합니다. 링크 기록은 삭제되지 않습니다.',
    },
    {
      ariaLabel: `${displayTitle} 링크 삭제 없이 Cloud 발견함 후보 제외 상태로 저장`,
      disabled: !canMove,
      label: '후보 제외',
      onClick: getOnMoveClick(PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS.DISCARDED),
      targetStatus: PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS.DISCARDED,
      title: '링크 기록을 삭제하지 않고 Cloud 발견함의 후보 제외 상태로 저장합니다.',
      tone: 'danger',
    },
  ];
};

export const getProductionDiscoveryLinkMoveStatusViewProps = (moveState) => {
  if (moveState === 'saved') {
    return {
      message: 'Cloud 발견함 상태 저장 완료. 링크 기록은 유지됩니다.',
      tone: 'success',
    };
  }

  if (moveState === 'error') {
    return {
      message: 'Cloud 상태 저장 실패. 저장 완료 처리하지 않았습니다. 다시 눌러 주세요.',
      tone: 'danger',
    };
  }

  return null;
};
