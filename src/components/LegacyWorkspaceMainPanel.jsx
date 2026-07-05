import LegacyWorkspaceMainPanelContent from './LegacyWorkspaceMainPanelContent';
import { getLegacyWorkspaceMainPanelViewProps } from '../utils/legacyWorkspaceMainPanelViewProps';

export default function LegacyWorkspaceMainPanel(props) {
  return (
    <LegacyWorkspaceMainPanelContent {...getLegacyWorkspaceMainPanelViewProps(props)} />
  );
}
