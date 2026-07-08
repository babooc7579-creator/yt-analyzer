import { getProductionDiscoveryLinkCopyButtonProps } from '../utils/productionDiscoveryLinkActionProps';
import CopyUrlButton from './CopyUrlButton';

export default function ProductionDiscoveryLinkCopyButton({
  disabled,
  link,
  linkTitle,
}) {
  const copyButtonProps = getProductionDiscoveryLinkCopyButtonProps({
    disabled,
    link,
    linkTitle,
  });

  return (
    <CopyUrlButton {...copyButtonProps} />
  );
}
