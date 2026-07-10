import { SYNC_WARNING_BANNER_COPY } from '../constants/syncWarnings';

const toArray = (items) => (Array.isArray(items) ? items : []);

export const getSyncWarningBannerViewProps = ({ message, messages } = {}) => {
  const messageList = toArray(messages);
  const warningMessages = messageList.length > 0 ? messageList : (message ? [message] : []);

  return {
    helpText: SYNC_WARNING_BANNER_COPY.helpText,
    isVisible: warningMessages.length > 0,
    messages: warningMessages,
    title: SYNC_WARNING_BANNER_COPY.title,
  };
};
