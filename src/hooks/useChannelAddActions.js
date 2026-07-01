import { fetchChannelPreview } from '../services/functionApi';

export function useChannelAddActions({
  bulkCreateChannels,
  bulkInput,
  cancelChannelPreview,
  channelPreview,
  loadChannelsFromCloud,
  newChannelInput,
  newChannelLang,
  newChannelNote,
  newChannelTags,
  savedChannels,
  saveChannel,
  setBulkLoading,
  setBulkResult,
  setChannelPreview,
  setError,
  setLoading,
  setPreviewLoading,
  setProgressMsg,
  setSelectedCategoryTab,
}) {
  const handlePreviewChannel = async () => {
    if (!newChannelInput.trim()) return;

    setPreviewLoading(true);
    setError('');
    setChannelPreview(null);

    try {
      const data = await fetchChannelPreview(newChannelInput.trim());
      if (!data.success) throw new Error(data.error || '채널을 불러오지 못했습니다.');

      if (savedChannels.some(channel => channel.id === data.channel.id)) {
        setError('이미 등록된 채널입니다.');
      } else {
        setChannelPreview(data.channel);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSaveChannel = async () => {
    if (!channelPreview) return;

    setLoading(true);
    setError('');
    setProgressMsg('채널 저장 중...');

    try {
      await saveChannel({
        handle: newChannelInput.trim(),
        tags: newChannelTags,
        language: newChannelLang,
        note: newChannelNote,
      });

      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg('채널이 클라우드 목록에 추가되었습니다. 새 영상은 스캔 버튼을 눌렀을 때 수집됩니다.');
      cancelChannelPreview();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  const handleBulkAdd = async () => {
    const handles = bulkInput.split('\n').map(line => line.trim()).filter(Boolean);
    if (handles.length === 0) {
      setError('등록할 채널을 한 줄에 하나씩 입력해주세요.');
      return;
    }

    setBulkLoading(true);
    setError('');
    setBulkResult(null);
    setProgressMsg(`${handles.length}개 채널 정보를 YouTube에서 확인한 뒤 클라우드 목록에 저장하는 중...`);

    try {
      const data = await bulkCreateChannels({
        handles,
        tags: newChannelTags,
        language: newChannelLang,
      });

      setBulkResult(data);
      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg(`일괄 추가 완료! ${data.total}개 중 ${data.added}개 성공`);
      await loadChannelsFromCloud();
    } catch (err) {
      setError(err.message);
    } finally {
      setBulkLoading(false);
      setTimeout(() => setProgressMsg(''), 5000);
    }
  };

  return {
    handleBulkAdd,
    handlePreviewChannel,
    handleSaveChannel,
  };
}
