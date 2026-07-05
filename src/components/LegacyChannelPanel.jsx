import LegacyChannelPanelContent from './LegacyChannelPanelContent';
import { getLegacyChannelPanelViewProps } from '../utils/legacyChannelPanelViewProps';

export default function LegacyChannelPanel(props) {
  return (
    <LegacyChannelPanelContent {...getLegacyChannelPanelViewProps(props)} />
  );
}
