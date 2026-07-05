export default function ChannelBulkInputBox({
  bulkInput,
  bulkLoading,
  recognizedLineCount,
  setBulkInput,
}) {
  return (
    <>
      <textarea
        value={bulkInput}
        onChange={(event) => setBulkInput(event.target.value)}
        placeholder={'핸들 / 채널링크 / 영상링크를 한 줄에 하나씩 붙여넣으세요\n예)\n@channel1\nhttps://youtube.com/@channel2\nhttps://youtu.be/xxxxxxxxxxx'}
        className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none font-mono text-xs"
        rows={5}
        disabled={bulkLoading}
        aria-label="일괄 추가할 채널 목록"
      />
      <p className="text-[10px] text-slate-500">{recognizedLineCount}개 줄 인식됨. YouTube에서 채널 정보만 확인한 뒤 Cloud 목록에 저장합니다. 영상 수집은 하지 않습니다.</p>
    </>
  );
}
