import {
  ExternalLink,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

import { getDiscoveryLinkUtilityActionProps } from '../utils/discoveryLinkActionProps';
import CopyUrlButton from './CopyUrlButton';

export default function DiscoveryLinkUtilityActions({
  isEditing,
  link,
  onDelete,
  onToggleEdit,
  saving,
  title,
}) {
  const {
    copyUrlButtonProps,
    deleteButtonProps,
    editButtonLabel,
    editButtonProps,
    editIconName,
    openLinkProps,
  } = getDiscoveryLinkUtilityActionProps({
    isEditing,
    link,
    onDelete,
    onToggleEdit,
    saving,
    title,
  });

  return (
    <>
      <a {...openLinkProps}>
        <ExternalLink className="h-4 w-4" />
        열기
      </a>

      <CopyUrlButton {...copyUrlButtonProps} />

      <button {...editButtonProps}>
        {editIconName === 'close' ? (
          <X className="h-4 w-4" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
        {editButtonLabel}
      </button>

      <button {...deleteButtonProps}>
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );
}
