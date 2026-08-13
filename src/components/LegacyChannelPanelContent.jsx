import ChannelAddForm from './ChannelAddForm';
import ChannelList from './ChannelList';
import ChannelTagTabs from './ChannelTagTabs';
import LegacyChannelPanelFooter from './LegacyChannelPanelFooter';
import LegacyWorkPanelIntro from './LegacyWorkPanelIntro';
import { ArrowLeft } from 'lucide-react';

const OPERATION_STAGE_COPY = {
  add: {
    description: '채널 주소나 핸들을 먼저 확인한 뒤 온라인 저장소(Azure DB)의 채널 목록에 저장합니다. 등록만으로 영상 수집은 시작되지 않습니다.',
    eyebrow: '2단계',
    title: '새 채널 등록',
  },
  manage: {
    description: '분야별 채널을 확인하고 오늘 볼 채널을 선택합니다. 선택만으로 YouTube API를 호출하지 않습니다.',
    eyebrow: '1단계',
    title: '채널 선택과 분류 관리',
  },
  scan: {
    description: '왼쪽에서 대상 채널을 확인한 뒤, 오른쪽에서 수집 영상을 조회하거나 필요할 때만 새 영상을 수집합니다.',
    eyebrow: '3단계',
    title: '영상 확인과 새 영상 수집',
  },
};

const OPERATION_SOURCE_COPY = {
  'youtube-video-search': '검색 영상의 출처 채널을 등록 검토 중입니다. 주소만 미리 채웠으며, 아래에서 채널 확인과 최종 저장을 해야 등록됩니다.',
  'youtube-channel-search': 'YouTube 채널 검색에서 찾은 채널을 등록 검토 중입니다. 주소만 미리 채웠으며, 아래에서 채널 확인과 최종 저장을 해야 등록됩니다.',
  'youtube-channel-search-bulk': 'YouTube 채널 검색에서 고른 채널을 일괄 등록 검토 중입니다. 목록만 미리 채웠으며, 아래에서 확인과 최종 등록을 해야 저장됩니다.',
  'youtube-video-search-bulk': '검색 영상에서 고른 중요 출처 채널을 일괄 등록 검토 중입니다. 목록만 미리 채웠으며, 아래에서 확인과 최종 등록을 해야 저장됩니다.',
};

export default function LegacyChannelPanelContent({
  channelAddFormProps,
  channelListProps,
  footerProps,
  introProps,
  onReturnToKeywordExplorer,
  operationSource,
  operationStage,
  showWorkPanel,
  tagTabsProps,
}) {
  const isOperationsView = Boolean(operationStage);
  const stageCopy = OPERATION_STAGE_COPY[operationStage];
  const sourceCopy = operationStage === 'add' ? OPERATION_SOURCE_COPY[operationSource] : null;
  const showChannelSelection = !isOperationsView || operationStage === 'manage' || operationStage === 'scan';
  const showAddForm = !isOperationsView || operationStage === 'add';
  const showFooter = !isOperationsView || operationStage === 'scan';

  return (
    <div className={`space-y-4 ${showWorkPanel ? '' : 'hidden'}`}>
      <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-300 p-4">
        {stageCopy ? (
          <div className="mb-4 border-l-4 border-indigo-500 bg-white px-4 py-3">
            <p className="text-[10px] font-black text-indigo-600">{stageCopy.eyebrow}</p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-950">{stageCopy.title}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-600">{stageCopy.description}</p>
            {sourceCopy ? (
              <div role="status" className="mt-3 rounded-lg border border-violet-200 bg-violet-50 px-3 py-3 text-xs font-bold leading-5 text-violet-800">
                <p>{sourceCopy} 이동만으로 YouTube API 호출이나 영상 수집은 실행되지 않습니다.</p>
                {onReturnToKeywordExplorer ? (
                  <button
                    type="button"
                    onClick={onReturnToKeywordExplorer}
                    className="mt-2 inline-flex h-9 items-center gap-1 rounded-lg border border-violet-300 bg-white px-3 text-xs font-black text-violet-800 hover:bg-violet-100"
                    title="기존 임시 검색 결과가 유지된 키워드 탐색 화면으로 돌아갑니다. YouTube API나 Azure DB를 호출하지 않습니다."
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> 검색 결과로 돌아가기
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <LegacyWorkPanelIntro {...introProps} />
        )}

        {showChannelSelection ? (
          <>
            <ChannelTagTabs
              {...tagTabsProps}
              showScanActions={!isOperationsView || operationStage === 'scan'}
            />

            <ChannelList {...channelListProps} />
          </>
        ) : null}

        {showAddForm ? (
          <>
            {!isOperationsView ? <hr className="my-5 border-slate-200" /> : null}
            <ChannelAddForm {...channelAddFormProps} />
          </>
        ) : null}

        {showFooter ? <LegacyChannelPanelFooter {...footerProps} /> : null}
      </div>
    </div>
  );
}
