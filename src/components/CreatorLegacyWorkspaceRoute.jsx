import LegacyWorkspaceView from './LegacyWorkspaceView';
import {
  getLegacyAsideProps,
  getLegacyChannelPanelProps,
  getLegacyMainPanelProps,
} from '../utils/legacyWorkspaceProps';

export default function CreatorLegacyWorkspaceRoute(props) {
  const legacyWorkspaceViewProps = {
    asideProps: getLegacyAsideProps(props),
    channelPanelProps: getLegacyChannelPanelProps(props),
    mainPanelProps: getLegacyMainPanelProps(props),
    showWorkPanel: props.showWorkPanel,
  };

  return (
    <LegacyWorkspaceView {...legacyWorkspaceViewProps} />
  );
}
