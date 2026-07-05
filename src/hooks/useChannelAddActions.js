import { fetchChannelPreview } from '../services/functionApi';
import {
  getBulkChannelCreatePayload,
  getBulkChannelHandles,
  getChannelCreatePayload,
  getTrimmedChannelInput,
  isDuplicateChannel,
} from '../utils/channelAddActions';

const getChannelSaveFailureMessage = (error, actionLabel = '저장') => {
  const message = error?.message || '채널 정보를 Cloud에 저장하지 못했습니다.';
  if (message.includes('완료 처리하지 않았습니다')) return message;
  return `${message} Cloud 채널 ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

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
    const channelInput = getTrimmedChannelInput(newChannelInput);
    if (!channelInput) return;

    setPreviewLoading(true);
    setError('');
    setChannelPreview(null);

    try {
      const data = await fetchChannelPreview(channelInput);
      if (!data.success) throw new Error(data.error || '채널을 불러오지 못했습니다.');

      if (isDuplicateChannel(savedChannels, data.channel.id)) {
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
    setProgressMsg('채널을 Cloud 목록에 저장하는 중입니다. 새 영상 수집은 실행하지 않습니다.');

    try {
      await saveChannel(getChannelCreatePayload({
        handle: newChannelInput,
        tags: newChannelTags,
        language: newChannelLang,
        note: newChannelNote,
      }));

      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg('채널이 Cloud 목록에 추가되었습니다. 새 영상은 선택 채널 새 영상 수집 버튼을 눌렀을 때만 확인합니다.');
      cancelChannelPreview();
    } catch (err) {
      setError(getChannelSaveFailureMessage(err, '저장'));
    } finally {
      setLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  const handleBulkAdd = async () => {
    const handles = getBulkChannelHandles(bulkInput);
    if (handles.length === 0) {
      setError('등록할 채널을 한 줄에 하나씩 입력해주세요.');
      return;
    }

    setBulkLoading(true);
    setError('');
    setBulkResult(null);
    setProgressMsg(`${handles.length}개 채널 정보를 YouTube에서 확인한 뒤 Cloud 목록에 저장하는 중입니다. 영상 수집은 실행하지 않습니다.`);

    try {
      const data = await bulkCreateChannels(getBulkChannelCreatePayload({
        handles,
        tags: newChannelTags,
        language: newChannelLang,
      }));

      setBulkResult(data);
      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg(`Cloud 일괄 추가 완료: ${data.total}개 중 ${data.added}개가 저장되었습니다. 새 영상 수집은 실행하지 않았습니다.`);
      await loadChannelsFromCloud();
    } catch (err) {
      setError(getChannelSaveFailureMessage(err, '일괄 저장'));
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
