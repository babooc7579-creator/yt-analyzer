import ScrapbookWorkspace from './ScrapbookWorkspace';
import { getLegacyVaultTabViewProps } from '../utils/legacyVaultTabViewProps';

export default function LegacyVaultTab(props) {
  const { scrapbookWorkspaceProps } = getLegacyVaultTabViewProps(props);

  return (
    <ScrapbookWorkspace {...scrapbookWorkspaceProps} />
  );
}
