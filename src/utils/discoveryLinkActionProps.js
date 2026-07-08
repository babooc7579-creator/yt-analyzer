const utilityButtonClassName = 'inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50';
const candidateButtonClassNames = {
  active: 'border border-indigo-100 bg-indigo-50 text-indigo-500',
  enabled: 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-300',
};

const getSafeTitle = (title) => title || '발견 링크';
const getSafeLink = (link) => (
  link && typeof link === 'object' ? link : {}
);

export const getDiscoveryLinkCandidateActionProps = ({
  currentStatus,
  onSendToCandidate,
  saving = false,
  title,
} = {}) => {
  const displayTitle = getSafeTitle(title);
  const isCandidate = currentStatus === 'candidate';

  return {
    buttonProps: {
      'aria-label': isCandidate
        ? `${displayTitle} 이미 Cloud 발견함 기록에 제작 후보로 저장됨, 권리 확인 상태는 별도 확인 필요`
        : `${displayTitle} Cloud 발견함 기록에 제작 후보로 저장, 권리 확인 완료 의미 아님`,
      className: `inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-extrabold transition disabled:cursor-not-allowed ${
        isCandidate ? candidateButtonClassNames.active : candidateButtonClassNames.enabled
      }`,
      disabled: saving || isCandidate,
      onClick: onSendToCandidate,
      title: isCandidate
        ? '이미 Cloud 발견함 기록에 제작 후보로 저장되어 제작실에 표시됩니다. 권리 확인 상태는 별도로 확인해야 합니다.'
        : '검토 상태를 제작 후보로 저장하고 제작실에 표시합니다. 권리 확인 완료를 의미하지 않으며, 외부 사이트를 새로 수집하지 않습니다.',
      type: 'button',
    },
    isCandidate,
    label: isCandidate ? '후보 등록됨' : '제작 후보로',
  };
};

export const getDiscoveryLinkUtilityActionProps = ({
  isEditing = false,
  link,
  onDelete,
  onToggleEdit,
  saving = false,
  title,
} = {}) => {
  const displayTitle = getSafeTitle(title);
  const sourceLink = getSafeLink(link);

  return {
    copyUrlButtonProps: {
      ariaLabel: `${displayTitle} 원본 링크 URL 복사`,
      className: utilityButtonClassName,
      copiedLabel: '복사 완료',
      copyingLabel: '복사 중',
      disabled: saving,
      errorLabel: '복사 실패',
      iconClassName: 'h-4 w-4',
      label: '복사',
      title: '원본 링크 URL을 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다.',
      url: sourceLink.url,
    },
    deleteButtonProps: {
      'aria-label': `${displayTitle} Cloud 발견함에서 링크 기록 삭제, 원본 사이트는 삭제하지 않음`,
      className: 'inline-flex h-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 text-red-600 transition hover:bg-red-100 disabled:opacity-50',
      disabled: saving,
      onClick: onDelete,
      title: 'Cloud 발견함에서 링크 기록만 삭제합니다. 원본 사이트는 삭제되지 않습니다.',
      type: 'button',
    },
    editButtonLabel: isEditing ? '닫기' : '수정',
    editButtonProps: {
      'aria-label': `${displayTitle} 발견 링크 제목과 메모 ${isEditing ? '수정 닫기' : '수정'}`,
      className: utilityButtonClassName,
      disabled: saving,
      onClick: onToggleEdit,
      title: isEditing
        ? '제목과 메모 수정 화면을 닫습니다. 저장하지 않은 입력은 적용되지 않습니다.'
        : '제목과 메모를 수정합니다. 저장 버튼을 눌러야 Cloud 발견함에 반영됩니다.',
      type: 'button',
    },
    editIconName: isEditing ? 'close' : 'edit',
    openLinkLabel: '열기',
    openLinkProps: {
      'aria-label': `${displayTitle} 원본 링크 새 탭으로 열기, 외부 사이트 수집 없음`,
      className: utilityButtonClassName.replace('disabled:opacity-50', ''),
      href: sourceLink.url,
      rel: 'noreferrer',
      target: '_blank',
      title: '원본 링크를 새 탭으로 엽니다. 외부 사이트를 자동 수집하거나 다운로드하지 않습니다.',
    },
  };
};
