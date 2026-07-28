import { SYNC_WARNING_BANNER_COPY } from '../constants/syncWarnings';

const toArray = (items) => (Array.isArray(items) ? items : []);

export const getSyncWarningBannerViewProps = ({ actions, message, messages } = {}) => {
  const messageList = toArray(messages);
  const warningMessages = messageList.length > 0 ? messageList : (message ? [message] : []);
  const retryActions = toArray(actions).filter(action => (
    action
    && typeof action === 'object'
    && typeof action.onClick === 'function'
    && action.label
  ));

  return {
    actions: retryActions,
    helpText: SYNC_WARNING_BANNER_COPY.helpText,
    isVisible: warningMessages.length > 0,
    messages: warningMessages,
    title: SYNC_WARNING_BANNER_COPY.title,
  };
};

export const getSyncWarningRetryButtonViewProps = ({
  action,
  pendingActionKey,
} = {}) => {
  const isPending = Boolean(action?.key) && action.key === pendingActionKey;

  return {
    disabled: Boolean(pendingActionKey),
    isPending,
    label: isPending ? (action.pendingLabel || action.label) : action.label,
  };
};

export const getSyncWarningRetryResult = ({
  action,
  succeeded,
} = {}) => ({
  actionKey: action?.key || '',
  message: succeeded ? action?.successMessage : action?.failureMessage,
  succeeded: Boolean(succeeded),
});
