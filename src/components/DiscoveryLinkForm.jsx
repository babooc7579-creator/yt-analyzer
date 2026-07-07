import { getDiscoveryLinkFormProps } from '../utils/discoveryLinkForm';
import DiscoveryLinkFormHeader from './DiscoveryLinkFormHeader';
import DiscoveryLinkMemoField from './DiscoveryLinkMemoField';
import DiscoveryLinkRiskyCandidateHint from './DiscoveryLinkRiskyCandidateHint';
import DiscoveryLinkSafetyNotice from './DiscoveryLinkSafetyNotice';
import DiscoveryLinkStatusFields from './DiscoveryLinkStatusFields';
import DiscoveryLinkSubmitButton from './DiscoveryLinkSubmitButton';
import DiscoveryLinkTextField from './DiscoveryLinkTextField';
import DiscoveryLinkUrlField from './DiscoveryLinkUrlField';

export default function DiscoveryLinkForm({
  duplicateLink,
  form,
  isCreateDisabled,
  saving,
  showRiskyCandidateHint,
  urlPreview,
  onChange,
  onSubmit,
}) {
  const {
    memoFieldProps,
    riskyCandidateHintProps,
    statusFieldsProps,
    submitButtonProps,
    titleFieldProps,
    urlFieldProps,
  } = getDiscoveryLinkFormProps({
    duplicateLink,
    form,
    isCreateDisabled,
    onChange,
    saving,
    showRiskyCandidateHint,
    urlPreview,
  });

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
      <DiscoveryLinkFormHeader />

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <DiscoveryLinkUrlField {...urlFieldProps} />

        <DiscoveryLinkTextField {...titleFieldProps} />

        <DiscoveryLinkStatusFields {...statusFieldsProps} />

        <DiscoveryLinkRiskyCandidateHint {...riskyCandidateHintProps} />

        <DiscoveryLinkMemoField {...memoFieldProps} />

        <DiscoveryLinkSubmitButton {...submitButtonProps} />
      </form>

      <DiscoveryLinkSafetyNotice />
    </section>
  );
}
