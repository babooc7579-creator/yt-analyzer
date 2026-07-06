import { getLanguageLabel } from '../constants/languages';
import {
  CHANNEL_GRADE_LABELS,
  CHANNEL_GRADE_TONES,
  CHANNEL_STATUS_LABELS,
  CHANNEL_STATUS_TONES,
} from '../constants/status';
import { formatCompactKo } from './formatters';

export const getChannelListItemMetaViewProps = ({
  channel,
  grade,
  status,
}) => ({
  gradeBadgeProps: {
    className: `rounded-full border px-2 py-0.5 text-[9px] font-extrabold ${CHANNEL_GRADE_TONES[grade]}`,
    label: `등급 ${CHANNEL_GRADE_LABELS[grade]}`,
  },
  languageLabel: getLanguageLabel(channel.language),
  stats: channel.stats ? [
    {
      label: '구독자 수',
      text: `구독자 ${formatCompactKo(channel.stats.subscriberCount)}`,
    },
    {
      label: '전체 영상 수',
      text: `영상 ${formatCompactKo(channel.stats.totalVideoCount)}`,
    },
    {
      label: '평균 조회수',
      text: `평균 ${formatCompactKo(channel.stats.avgViewCount)}`,
    },
  ] : [],
  statusBadgeProps: {
    className: `rounded-full border px-2 py-0.5 text-[9px] font-extrabold ${CHANNEL_STATUS_TONES[status]}`,
    label: CHANNEL_STATUS_LABELS[status],
  },
});
