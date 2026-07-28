import ChannelAddForm from './ChannelAddForm';
import ChannelList from './ChannelList';
import ChannelTagTabs from './ChannelTagTabs';
import LegacyChannelPanelFooter from './LegacyChannelPanelFooter';
import LegacyWorkPanelIntro from './LegacyWorkPanelIntro';

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

export default function LegacyChannelPanelContent({
  channelAddFormProps,
  channelListProps,
  footerProps,
  introProps,
  operationStage,
  showWorkPanel,
  tagTabsProps,
}) {
  const isOperationsView = Boolean(operationStage);
  const stageCopy = OPERATION_STAGE_COPY[operationStage];
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
