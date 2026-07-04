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
  const urlFieldProps = {
    duplicateLink,
    onChange,
    url: form.url,
    urlPreview,
  };

  const statusFieldsProps = {
    onChange,
    rightsStatus: form.rightsStatus,
    status: form.status,
  };

  const memoFieldProps = {
    onChange: (value) => onChange('memo', value),
    value: form.memo,
  };

  const submitButtonProps = {
    duplicateLink,
    isCreateDisabled,
    saving,
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
      <DiscoveryLinkFormHeader />

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <DiscoveryLinkUrlField {...urlFieldProps} />

        <DiscoveryLinkTextField
          ariaLabel="발견 링크 제목 또는 기억할 이름"
          label="제목 또는 기억할 이름"
          onChange={(value) => onChange('title', value)}
          placeholder="나중에 알아볼 수 있는 이름"
          value={form.title}
        />

        <DiscoveryLinkStatusFields {...statusFieldsProps} />

        <DiscoveryLinkRiskyCandidateHint show={showRiskyCandidateHint} />

        <DiscoveryLinkMemoField {...memoFieldProps} />

        <DiscoveryLinkSubmitButton {...submitButtonProps} />
      </form>

      <DiscoveryLinkSafetyNotice />
    </section>
  );
}
