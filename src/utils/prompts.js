import { getLanguageLabel } from '../constants/languages';

export const buildAIRemakePrompt = (targetVideos) => {
  if (!Array.isArray(targetVideos) || targetVideos.length === 0) {
    return '';
  }

  let prompt = `다음은 내가 벤치마킹을 위해 수집한 글로벌 타채널의 '떡상(Viral)' 영상 목록이야.\n\n`;

  targetVideos.forEach((video, index) => {
    const languageLabel = getLanguageLabel(video.language);
    const formatLabel = video.isShorts ? '쇼츠' : '롱폼';
    const viewCount = Number(video.view_count || 0).toLocaleString();

    prompt += `${index + 1}. [${languageLabel}] 원본 제목: "${video.title}"\n   (조회수: ${viewCount}회 / 찐팬 참여도(좋아요): ${video.like_ratio}% / 포맷: ${formatLabel})\n\n`;
  });

  prompt += `\n[요청 사항]\n1. 위 영상들의 원본 제목을 한국어로 자연스럽게 번역해 줘.\n2. 이 영상들이 평소보다 몇 배씩 터질 수 있었던 '핵심 후킹 포인트(소재의 참신함 등)'를 분석해 줘.\n3. 원본의 표현, 구성, 장면을 그대로 베끼지 않고 '2026년 현재 한국 유튜브 트렌드'에 맞게 안전하게 재구성한다면 어떻게 해야 할까? 가장 자극적이고 클릭을 유도할 수 있는 [새로운 제목 3가지]와 [대본 인트로 뼈대]를 제안해 줘.`;

  return prompt;
};
