import { CheckCircle2, Clock, XCircle } from 'lucide-react';

import { getRadarCandidateStatusActionProps } from '../utils/radarCandidateStatusActions';
import RadarCandidateStatusButton from './RadarCandidateStatusButton';

const STATUS_ICONS = {
  excluded: XCircle,
  later: Clock,
  reviewed: CheckCircle2,
};

export default function RadarCandidateStatusActions({
  onMarkVideoStatus,
  video,
  videoTitle,
}) {
  const statusActionProps = getRadarCandidateStatusActionProps({
    onMarkVideoStatus,
    video,
    videoTitle,
  });

  return (
    <>
      {statusActionProps.map((actionProps) => (
        <RadarCandidateStatusButton
          key={actionProps.status}
          {...actionProps}
          icon={STATUS_ICONS[actionProps.iconName]}
        />
      ))}
    </>
  );
}
