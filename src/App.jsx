import React, { useState, useEffect, useMemo } from 'react';
import { Play, AlertCircle, Loader2, Youtube, FileSpreadsheet, Star, Lightbulb, Trash2, History, Search, Filter, FolderOpen, CheckSquare, Square, Rocket, TrendingUp, Sparkles, Copy, CheckCircle2, Plus, Globe, Settings, Clock, ThumbsUp, MessageSquareText, X, Bookmark, RefreshCw } from 'lucide-react';

const DEFAULT_CATEGORIES = ['해짜', '영화', '드라마', '역사', '정치', '지식/정보', '미분류1', '미분류2', '미분류3'];

// ⚠️ Azure Portal > yt-analyzer-func > 개요 화면의 "기본 도메인" 값과 일치해야 합니다.
const FUNCTION_API_BASE = 'https://yt-analyzer-func-hyd8hxbwb8gkephg.koreacentral-01.azurewebsites.net/api';

const LANGUAGES = [
  { code: 'KR', label: '🇰🇷 KR', name: '한국어' },
  { code: 'EN', label: '🇺🇸 EN', name: '영어' },
  { code: 'JP', label: '🇯🇵 JP', name: '일본어' },
  { code: 'ES', label: '🇪🇸 ES', name: '스페인어' },
  { code: 'ETC', label: '🌐 기타', name: '기타 언어' }
];

export default function App() {
  const [apiKey, setApiKey] = useState('');
  
  // 상태 관리
  const [categories, setCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yt_crm_categories')) || DEFAULT_CATEGORIES; } catch { return DEFAULT_CATEGORIES; }
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const [savedChannels, setSavedChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [savedVideos, setSavedVideos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yt_crm_saved_videos')) || []; } catch { return []; }
  });
  
  const [newChannelInput, setNewChannelInput] = useState('');
  const [newChannelTags, setNewChannelTags] = useState([]); // 여러 태그 선택 가능
  const [newChannelLang, setNewChannelLang] = useState('EN');
  const [newChannelNote, setNewChannelNote] = useState('');
  const [channelPreview, setChannelPreview] = useState(null); // 저장 전 미리보기 결과
  const [previewLoading, setPreviewLoading] = useState(false);

  // 일괄 추가 모드 (여러 줄 붙여넣기)
  const [addMode, setAddMode] = useState('single'); // 'single' | 'bulk'
  const [bulkInput, setBulkInput] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null); // { total, added, results }

  // 태그 이름 수정 (rename)
  const [renamingCategory, setRenamingCategory] = useState(null); // 수정 중인 카테고리 원래 이름
  const [renameValue, setRenameValue] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);

  // 결(태그) 단위 일괄 스캔 - 현재 스캔 중인 태그 ('ALL'이면 전체 스캔)
  const [scanningTag, setScanningTag] = useState(null);

  const [selectedCategoryTab, setSelectedCategoryTab] = useState(categories[0]);
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState('');
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewFilter, setViewFilter] = useState(0);
  const [lengthFilter, setLengthFilter] = useState('all'); // 'all' | 'shorts' | 'long'
  const [ttoTtoMode, setTtoTtoMode] = useState(false);
  const [sortType, setSortType] = useState('multiplier');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'scrapbook'
  
  const [checkedVideos, setCheckedVideos] = useState([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  
  const [commentModal, setCommentModal] = useState({ isOpen: false, videoTitle: '', comments: [], loading: false });
  const [notesModal, setNotesModal] = useState({ isOpen: false, channel: null, newNoteText: '', saving: false });

  useEffect(() => { localStorage.setItem('yt_crm_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('yt_crm_saved_videos', JSON.stringify(savedVideos)); }, [savedVideos]);

  // 채널 목록은 더 이상 브라우저에만 저장하지 않고, 클라우드(Cosmos DB)에서 불러옵니다.
  const loadChannelsFromCloud = async () => {
    setChannelsLoading(true);
    try {
      const res = await fetch(`${FUNCTION_API_BASE}/channels`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '채널 목록을 불러오지 못했습니다.');
      setSavedChannels(data.channels || []);
    } catch (err) {
      setError(`채널 목록 로딩 실패: ${err.message} (Function App CORS 설정을 확인해주세요)`);
    } finally {
      setChannelsLoading(false);
    }
  };

  useEffect(() => { loadChannelsFromCloud(); }, []);

  const API_BASE = "https://www.googleapis.com/youtube/v3";

  const getDaysDiff = (uploadDate) => {
    const today = new Date();
    const upDate = new Date(uploadDate);
    return Math.max(1, Math.ceil(Math.abs(today - upDate) / (1000 * 60 * 60 * 24)));
  };

  // 큰 숫자를 한국식으로 축약 (예: 25000 -> 2.5만, 1200000 -> 120만)
  const formatCompactKo = (num) => {
    const n = Number(num) || 0;
    if (n >= 100000000) return `${(n / 100000000).toFixed(1).replace(/\.0$/, '')}억`;
    if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}만`;
    return n.toLocaleString();
  };

  const parseDuration = (durationStr) => {
    const match = durationStr.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return { isShorts: false, formatted: '00:00' };
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const isShorts = totalSeconds <= 61; // 60초 이하 (여유분 1초 포함)
    
    let formatted = '';
    if (hours > 0) formatted += `${hours}:`;
    formatted += `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return { isShorts, formatted };
  };

  // 1단계: 입력값으로 채널 정보만 미리 불러오기 (아직 저장 안 함)
  const handlePreviewChannel = async () => {
    if (!newChannelInput.trim()) return;
    setPreviewLoading(true); setError(''); setChannelPreview(null);
    try {
      const res = await fetch(`${FUNCTION_API_BASE}/channel-preview?handle=${encodeURIComponent(newChannelInput.trim())}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '채널을 불러오지 못했습니다.');

      if (savedChannels.some(c => c.id === data.channel.id)) {
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

  const cancelChannelPreview = () => {
    setChannelPreview(null); setNewChannelInput(''); setNewChannelTags([]); setNewChannelNote('');
  };

  // 2단계: 미리보기 확인 후, 태그/언어/첫 기록과 함께 실제 저장
  const handleSaveChannel = async () => {
    if (!channelPreview) return;
    setLoading(true); setError(''); setProgressMsg('채널 저장 중...');
    try {
      const res = await fetch(`${FUNCTION_API_BASE}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: newChannelInput.trim(), tags: newChannelTags, language: newChannelLang, note: newChannelNote }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '채널 추가에 실패했습니다.');

      setSavedChannels(prev => [...prev, data.channel]);
      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg('채널이 클라우드에 성공적으로 추가되었습니다! (최초 분석 시 영상 최대 250개를 수집합니다)');
      cancelChannelPreview();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  // 일괄 추가: 텍스트 영역의 여러 줄(핸들/링크)을 한 번에 등록 (POST /channels/bulk)
  const handleBulkAdd = async () => {
    const handles = bulkInput.split('\n').map((l) => l.trim()).filter(Boolean);
    if (handles.length === 0) { setError('등록할 채널을 한 줄에 하나씩 입력해주세요.'); return; }

    setBulkLoading(true); setError(''); setBulkResult(null);
    setProgressMsg(`${handles.length}개 채널 일괄 등록 중... (채널 수에 따라 시간이 걸릴 수 있어요)`);
    try {
      const res = await fetch(`${FUNCTION_API_BASE}/channels/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handles, tags: newChannelTags, language: newChannelLang }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '일괄 추가에 실패했습니다.');

      setBulkResult(data);
      if (newChannelTags[0]) setSelectedCategoryTab(newChannelTags[0]);
      setProgressMsg(`일괄 추가 완료! ${data.total}개 중 ${data.added}개 성공`);
      await loadChannelsFromCloud(); // 새로 추가된 채널들을 화면에 반영
    } catch (err) {
      setError(err.message);
    } finally {
      setBulkLoading(false);
      setTimeout(() => setProgressMsg(''), 5000);
    }
  };

  const resetBulkAdd = () => {
    setBulkInput(''); setBulkResult(null); setAddMode('single'); setNewChannelTags([]);
  };

  const deleteChannel = async (id, category) => {
    try {
      const res = await fetch(`${FUNCTION_API_BASE}/channels/${id}?category=${encodeURIComponent(category)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '채널 삭제에 실패했습니다.');
      setSavedChannels(prev => prev.filter(c => c.id !== id));
      setSelectedChannelIds(prev => prev.filter(cId => cId !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleNewChannelTag = (tag) => {
    setNewChannelTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const openNotesModal = (channel) => setNotesModal({ isOpen: true, channel, newNoteText: '', saving: false });

  const addChannelNote = async () => {
    const text = notesModal.newNoteText.trim();
    if (!text || !notesModal.channel) return;
    setNotesModal(prev => ({ ...prev, saving: true }));
    try {
      const { id, category } = notesModal.channel;
      const res = await fetch(`${FUNCTION_API_BASE}/channels/${id}/notes?category=${encodeURIComponent(category)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '기록 저장에 실패했습니다.');

      setSavedChannels(prev => prev.map(c => c.id === data.channel.id ? data.channel : c));
      setNotesModal({ isOpen: true, channel: data.channel, newNoteText: '', saving: false });
    } catch (err) {
      setError(err.message);
      setNotesModal(prev => ({ ...prev, saving: false }));
    }
  };

  const toggleChannelSelection = (id) => {
    setSelectedChannelIds(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  };

  const fetchSelectedChannels = async () => {
    if (selectedChannelIds.length === 0) { setError('분석할 채널을 하나 이상 선택해주세요.'); return; }

    setLoading(true); setError(''); setVideos([]); setCheckedVideos([]); setActiveTab('dashboard');
    setProgressMsg('클라우드에 저장된 영상 데이터를 불러오는 중...');

    try {
      const res = await fetch(`${FUNCTION_API_BASE}/videos?channelIds=${selectedChannelIds.join(',')}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '영상 데이터를 불러오지 못했습니다.');

      // 백엔드 필드명(camelCase) -> 화면에서 쓰는 필드명으로 변환 + daysOld/views_per_day는 매번 새로 계산
      const mapped = (data.videos || []).map(v => {
        const daysOld = getDaysDiff(v.uploadDate);
        return {
          videoId: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          upload_date: v.uploadDate,
          channel_title: v.channelTitle,
          channel_id: v.channelId,
          language: v.language,
          daysOld,
          view_count: v.viewCount || 0,
          like_count: v.likeCount || 0,
          like_ratio: v.likeRatio || 0,
          duration: v.duration || '00:00',
          isShorts: v.isShorts || false,
          multiplier: v.multiplier || 0,
          views_per_day: Math.round((v.viewCount || 0) / daysOld),
        };
      });

      setVideos(mapped);
      if (mapped.length === 0) {
        setProgressMsg('아직 수집된 영상이 없습니다. 먼저 "지금 스캔"을 눌러 데이터를 모아주세요.');
      } else {
        setProgressMsg(`불러오기 완료! 총 ${mapped.length}개의 영상을 가져왔습니다.`);
      }
      setTimeout(() => setProgressMsg(''), 3000);
    } catch (err) {
      setError(`${err.message} (Function App CORS 설정을 확인해주세요)`); setProgressMsg('');
    } finally {
      setLoading(false);
    }
  };

  // "지금 스캔" / "이 태그만 스캔" 버튼: Function App에 새벽 자동 스캔과 똑같은 작업을 즉시 1회 실행시킴
  // tag가 있으면 그 태그(결)에 속한 채널만, 없으면 전체 채널을 스캔
  const runScanRequest = async (tag) => {
    setIsScanning(true); setScanningTag(tag || 'ALL'); setError('');
    setProgressMsg(`${tag ? `'${tag}' 태그 채널` : '전체 채널'} 스캔 중... (채널 수와 영상 양에 따라 1분 이상 걸릴 수 있어요)`);
    try {
      const url = tag ? `${FUNCTION_API_BASE}/scan?tag=${encodeURIComponent(tag)}` : `${FUNCTION_API_BASE}/scan`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '스캔에 실패했습니다.');

      const totalNew = (data.results || []).reduce((sum, r) => sum + (r.newVideosFound || 0), 0);
      const ttoTtoCount = (data.results || []).reduce((sum, r) => sum + (r.ttoTtoCandidates?.length || 0), 0);
      setProgressMsg(`스캔 완료! 신규 영상 ${totalNew}개 발견${ttoTtoCount > 0 ? `, 또터또 후보 ${ttoTtoCount}개 발견!` : ''}`);

      await loadChannelsFromCloud(); // 채널 통계(구독자/평균조회수 등)도 같이 갱신됐으니 새로고침
      // 지금 선택된 채널이 있으면 화면 데이터도 같이 새로고침
      if (selectedChannelIds.length > 0) await fetchSelectedChannels();
    } catch (err) {
      setError(`스캔 실패: ${err.message}`);
    } finally {
      setIsScanning(false); setScanningTag(null);
      setTimeout(() => setProgressMsg(''), 5000);
    }
  };

  const handleManualScan = () => runScanRequest(null);
  const handleTagScan = (tag) => runScanRequest(tag);

  // 태그 이름 일괄 변경: 해당 태그가 붙은 모든 채널의 태그/카테고리를 한 번에 변경 (GET /tags/rename)
  const startRenameCategory = (cat) => { setRenamingCategory(cat); setRenameValue(cat); };
  const cancelRenameCategory = () => { setRenamingCategory(null); setRenameValue(''); };

  const confirmRenameCategory = async () => {
    const from = renamingCategory;
    const to = renameValue.trim();
    if (!from || !to || from === to) { cancelRenameCategory(); return; }
    if (categories.includes(to)) { setError('이미 존재하는 카테고리 이름입니다.'); return; }

    setRenameLoading(true); setError('');
    try {
      const res = await fetch(`${FUNCTION_API_BASE}/tags/rename?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '태그 이름 변경에 실패했습니다.');

      setCategories(prev => prev.map(c => (c === from ? to : c)));
      if (selectedCategoryTab === from) setSelectedCategoryTab(to);
      setProgressMsg(`'${from}' → '${to}'로 변경 완료 (채널 ${data.channelsAffected}개 영향)`);
      await loadChannelsFromCloud();
      cancelRenameCategory();
    } catch (err) {
      setError(err.message);
    } finally {
      setRenameLoading(false);
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  const fetchTopComments = async (videoId, videoTitle) => {
    if (!apiKey) { setError('API Key가 필요합니다.'); return; }
    setCommentModal({ isOpen: true, videoTitle, comments: [], loading: true });
    
    try {
      const res = await fetch(`${API_BASE}/commentThreads?part=snippet&videoId=${videoId}&order=relevance&maxResults=10&key=${apiKey}`);
      const data = await res.json();
      if (data.error) {
        if (data.error.errors[0].reason === 'commentsDisabled') throw new Error('이 영상은 댓글이 사용 중지되었습니다.');
        throw new Error(data.error.message);
      }

      const comments = data.items ? data.items.map(item => ({
        id: item.id,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textOriginal,
        likeCount: item.snippet.topLevelComment.snippet.likeCount
      })) : [];

      setCommentModal({ isOpen: true, videoTitle, comments, loading: false });
    } catch (err) {
      setCommentModal({ isOpen: true, videoTitle, comments: [], error: err.message, loading: false });
    }
  };

  const filteredAndSortedVideos = useMemo(() => {
    let result = [...videos];
    if (searchKeyword) result = result.filter(v => v.title.toLowerCase().includes(searchKeyword.toLowerCase()));
    if (viewFilter > 0) result = result.filter(v => v.view_count >= viewFilter);
    if (lengthFilter === 'shorts') result = result.filter(v => v.isShorts);
    else if (lengthFilter === 'long') result = result.filter(v => !v.isShorts);
    if (ttoTtoMode) result = result.filter(v => v.daysOld >= 180);

    if (sortType === 'date') result.sort((a, b) => a.daysOld - b.daysOld); 
    else if (sortType === 'views') result.sort((a, b) => b.view_count - a.view_count);
    else if (sortType === 'multiplier') result.sort((a, b) => b.multiplier - a.multiplier); 
    else if (sortType === 'viral') result.sort((a, b) => b.views_per_day - a.views_per_day);
    else if (sortType === 'likes') result.sort((a, b) => b.like_ratio - a.like_ratio);

    return result;
  }, [videos, searchKeyword, viewFilter, lengthFilter, ttoTtoMode, sortType]);

  const toggleCheckVideo = (videoId) => {
    setCheckedVideos(prev => prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]);
  };

  const toggleScrapVideo = (video) => {
    setSavedVideos(prev => {
      const isSaved = prev.some(v => v.videoId === video.videoId);
      if (isSaved) return prev.filter(v => v.videoId !== video.videoId);
      return [...prev, video];
    });
  };

  const isVideoSaved = (videoId) => savedVideos.some(v => v.videoId === videoId);

  const copyAI_RemakePrompt = (targetVideos) => {
    if (targetVideos.length === 0) return;
    
    let prompt = `다음은 내가 벤치마킹을 위해 수집한 글로벌 타채널의 '떡상(Viral)' 영상 목록이야.\n\n`;
    targetVideos.forEach((v, idx) => {
      const langLabel = LANGUAGES.find(l => l.code === v.language)?.label || '';
      prompt += `${idx + 1}. [${langLabel}] 원본 제목: "${v.title}"\n   (조회수: ${v.view_count.toLocaleString()}회 / 찐팬 참여도(좋아요): ${v.like_ratio}% / 포맷: ${v.isShorts ? '쇼츠' : '롱폼'})\n\n`;
    });

    prompt += `\n[요청 사항]\n1. 위 영상들의 원본 제목을 한국어로 자연스럽게 번역해 줘.\n2. 이 영상들이 평소보다 몇 배씩 터질 수 있었던 '핵심 후킹 포인트(소재의 참신함 등)'를 분석해 줘.\n3. 이 과거의 영광을 '2026년 현재 한국 유튜브 트렌드'에 맞게 리메이크한다면 어떻게 해야 할까? 가장 자극적이고 클릭을 유도할 수 있는 [새로운 제목 3가지]와 [대본 인트로 뼈대]를 제안해 줘.`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 font-sans text-slate-800">
      
      {/* 댓글 모달창 */}
      {commentModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-indigo-500" />
                찐팬 반응 분석 (Top 10)
              </h3>
              <button onClick={() => setCommentModal({ isOpen: false, videoTitle: '', comments: [], loading: false })} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 text-sm font-medium text-indigo-900 line-clamp-1">
              원본 영상: {commentModal.videoTitle}
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {commentModal.loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" /> 댓글 데이터를 불러오는 중...
                </div>
              ) : commentModal.error ? (
                <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100">{commentModal.error}</div>
              ) : commentModal.comments.length === 0 ? (
                <div className="text-center py-10 text-slate-500">조회된 댓글이 없습니다.</div>
              ) : (
                commentModal.comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm text-slate-800">@{comment.author}</span>
                      <span className="flex items-center gap-1 text-xs text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                        <ThumbsUp className="w-3 h-3" /> {comment.likeCount > 0 ? comment.likeCount.toLocaleString() : '0'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 채널 분석/기록 모달창 */}
      {notesModal.isOpen && notesModal.channel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                {notesModal.channel.title} - 분석 기록
              </h3>
              <button onClick={() => setNotesModal({ isOpen: false, channel: null, newNoteText: '', saving: false })} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <textarea
                value={notesModal.newNoteText}
                onChange={(e) => setNotesModal(prev => ({ ...prev, newNoteText: e.target.value }))}
                placeholder="예) 또 떡상함, 패턴인듯 / 시니어롱폼 소재로 쓰기 좋음 / 톤이 우리 채널이랑 비슷함..."
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none resize-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
              <button
                onClick={addChannelNote}
                disabled={notesModal.saving || !notesModal.newNoteText.trim()}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {notesModal.saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                기록 추가
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {(!notesModal.channel.notes || notesModal.channel.notes.length === 0) ? (
                <div className="text-center py-10 text-slate-400 text-sm">아직 기록이 없어요. 위에서 첫 기록을 남겨보세요!</div>
              ) : (
                notesModal.channel.notes.map((note, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-400 mb-1">{new Date(note.date).toLocaleString('ko-KR')}</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ================= 좌측: CRM 패널 ================= */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" /> 타임머신 CRM
            </h1>
            
            <div className="mb-4">
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="YouTube API Key (댓글 스캔에만 필요)" className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            {/* 채널 추가 폼 */}
            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-indigo-800 block">새 채널 모니터링 추가</label>
                <div className="flex items-center gap-2">
                  {!channelPreview && (
                    <div className="flex bg-white rounded-md border border-indigo-200 overflow-hidden text-[10px] font-bold">
                      <button onClick={() => setAddMode('single')} className={`px-2 py-1 transition-colors ${addMode === 'single' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}>단일</button>
                      <button onClick={() => setAddMode('bulk')} className={`px-2 py-1 transition-colors ${addMode === 'bulk' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}>일괄</button>
                    </div>
                  )}
                  <button onClick={() => setIsEditingCategory(!isEditingCategory)} className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold whitespace-nowrap">
                    <Settings className="w-3 h-3" /> 카테고리 설정
                  </button>
                </div>
              </div>
              
              {isEditingCategory && (
                <div className="mb-3 p-2 bg-white rounded border border-indigo-200 shadow-inner">
                  <div className="flex gap-1 mb-2">
                    <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="새 카테고리명" className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded" />
                    <button onClick={() => { if(newCategoryName && !categories.includes(newCategoryName)) { setCategories([...categories, newCategoryName]); setNewCategoryName(''); } }} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold whitespace-nowrap"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {categories.map(cat => (
                      renamingCategory === cat ? (
                        <span key={cat} className="inline-flex items-center gap-1 px-1 py-0.5 bg-white border border-indigo-300 rounded ring-1 ring-indigo-200">
                          <input
                            autoFocus
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') confirmRenameCategory(); if (e.key === 'Escape') cancelRenameCategory(); }}
                            className="text-[10px] px-1 py-0.5 w-16 border border-slate-200 rounded outline-none"
                          />
                          <button onClick={confirmRenameCategory} disabled={renameLoading} className="text-emerald-600 hover:text-emerald-800">
                            {renameLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                          </button>
                          <button onClick={cancelRenameCategory} className="text-slate-400 hover:text-slate-600"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      ) : (
                        <span key={cat} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">
                          {cat}
                          <button onClick={() => startRenameCategory(cat)} className="text-indigo-400 hover:text-indigo-600" title="이름 변경 (이 태그가 붙은 모든 채널에 일괄 반영)"><Settings className="w-2.5 h-2.5" /></button>
                          <button onClick={() => setCategories(categories.filter(c => c !== cat))} className="text-red-400 hover:text-red-600"><Trash2 className="w-2.5 h-2.5" /></button>
                        </span>
                      )
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5">⚙️ 아이콘으로 이름 변경 시, 이 태그가 붙은 모든 채널에 클라우드에서 즉시 반영됩니다.</p>
                </div>
              )}

              {addMode === 'bulk' ? (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder={'핸들 / 채널링크 / 영상링크를 한 줄에 하나씩 붙여넣으세요\n예)\n@channel1\nhttps://youtube.com/@channel2\nhttps://youtu.be/xxxxxxxxxxx'}
                    className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none font-mono text-xs"
                    rows={5}
                    disabled={bulkLoading}
                  />
                  <p className="text-[10px] text-slate-500">{bulkInput.split('\n').map(l => l.trim()).filter(Boolean).length}개 줄 인식됨</p>

                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">태그 선택 (전체 일괄 적용, 여러 개 가능)</p>
                    <div className="flex flex-wrap gap-1">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleNewChannelTag(cat)}
                          className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${newChannelTags.includes(cat) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <select value={newChannelLang} onChange={(e) => setNewChannelLang(e.target.value)} className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium">
                    {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
                  </select>

                  <button onClick={handleBulkAdd} disabled={bulkLoading || !bulkInput.trim()} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors">
                    {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {bulkLoading ? '일괄 등록 중...' : '일괄 등록'}
                  </button>

                  {bulkResult && (
                    <div className="p-2 bg-white rounded-lg border border-indigo-200 text-xs space-y-1 max-h-32 overflow-y-auto">
                      <p className="font-bold text-slate-700">총 {bulkResult.total}개 중 {bulkResult.added}개 성공</p>
                      {bulkResult.results.filter(r => !r.success).map((r, i) => (
                        <p key={i} className="text-red-500 truncate">✗ {r.handle}: {r.error}</p>
                      ))}
                      <button onClick={resetBulkAdd} className="mt-1 w-full text-center text-indigo-600 hover:text-indigo-800 font-semibold">닫기</button>
                    </div>
                  )}
                </div>
              ) : !channelPreview ? (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newChannelInput}
                      onChange={(e) => setNewChannelInput(e.target.value)}
                      placeholder="핸들 / 채널링크 / 영상링크"
                      className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handlePreviewChannel()}
                    />
                    <button onClick={handlePreviewChannel} disabled={previewLoading} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap">
                      {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      채널 미리보기
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">아직 저장하지 않고 채널 정보만 먼저 확인합니다.</p>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-200">
                  {/* 미리보기 카드 */}
                  <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-200">
                    <img src={channelPreview.thumbnail} alt="" className="w-9 h-9 rounded-full border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{channelPreview.title}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">✓ 채널 확인됨</p>
                    </div>
                    <button onClick={cancelChannelPreview} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">태그 선택 (여러 개 가능, 안 골라도 OK)</p>
                    <div className="flex flex-wrap gap-1">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleNewChannelTag(cat)}
                          className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${newChannelTags.includes(cat) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <select value={newChannelLang} onChange={(e) => setNewChannelLang(e.target.value)} className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium">
                    {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
                  </select>

                  <textarea
                    value={newChannelNote}
                    onChange={(e) => setNewChannelNote(e.target.value)}
                    placeholder="첫 기록 메모 (선택) - 예) 시니어롱폼 소재용, 톤 비슷함"
                    className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none"
                    rows={2}
                  />

                  <div className="flex gap-2">
                    <button onClick={cancelChannelPreview} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors">취소</button>
                    <button onClick={handleSaveChannel} disabled={loading} className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors">채널 저장</button>
                  </div>
                  <p className="text-[10px] text-slate-500">채널을 클라우드 목록에 저장합니다. 영상 수집은 스캔 시 진행됩니다.</p>
                </div>
              )}
            </div>

            {/* 카테고리(태그) 폴더 리스트 */}
            <div className="space-y-1">
              {categories.map(cat => {
                const count = savedChannels.filter(c => c.tags?.includes(cat)).length;
                return (
                  <div key={cat} className="flex items-center gap-1">
                    <button onClick={() => setSelectedCategoryTab(cat)} className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${selectedCategoryTab === cat ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                      <span className="flex items-center gap-2"><FolderOpen className={`w-4 h-4 ${selectedCategoryTab === cat ? 'text-indigo-200' : 'text-slate-400'}`} /> {cat}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategoryTab === cat ? 'bg-indigo-500/50 text-indigo-100' : 'bg-slate-200 text-slate-500'}`}>{count}</span>
                    </button>
                    <button
                      onClick={() => handleTagScan(cat)}
                      disabled={isScanning || count === 0}
                      title={`'${cat}' 태그 채널만 새 영상 여부를 확인합니다`}
                      aria-label={`'${cat}' 태그만 스캔`}
                      className="p-2 text-slate-400 hover:text-emerald-600 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      {scanningTag === cat ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">태그 옆 새로고침 버튼은 선택한 태그의 채널만 새 영상 여부를 확인합니다.</p>
            
            <hr className="my-4 border-slate-100" />
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {channelsLoading ? (
                <p className="text-sm text-slate-400 text-center py-4 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> 클라우드에서 채널 불러오는 중...</p>
              ) : savedChannels.filter(c => c.tags?.includes(selectedCategoryTab)).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">저장된 채널이 없습니다.</p>
              ) : (
                savedChannels.filter(c => c.tags?.includes(selectedCategoryTab)).map(channel => (
                  <div key={channel.id} className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${selectedChannelIds.includes(channel.id) ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
                    <button onClick={() => toggleChannelSelection(channel.id)} className="text-indigo-600 focus:outline-none shrink-0">
                      {selectedChannelIds.includes(channel.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
                    </button>
                    <img src={channel.thumbnail} alt="" className="w-7 h-7 rounded-full border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate" title={channel.title}>{channel.title}</p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-[10px] font-medium text-slate-500">{LANGUAGES.find(l => l.code === channel.language)?.label}</span>
                        {channel.stats && (
                          <>
                            <span className="text-[9px] text-slate-400" title="구독자 수">👤{formatCompactKo(channel.stats.subscriberCount)}</span>
                            <span className="text-[9px] text-slate-400" title="전체 영상 수">🎬{formatCompactKo(channel.stats.totalVideoCount)}</span>
                            <span className="text-[9px] text-slate-400" title="평균 조회수">👁️{formatCompactKo(channel.stats.avgViewCount)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button onClick={() => openNotesModal(channel)} className="relative p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0" title="분석/기록 남기기">
                      <History className="w-4 h-4" />
                      {channel.notes?.length > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{channel.notes.length}</span>}
                    </button>
                    <button onClick={() => deleteChannel(channel.id, channel.category)} className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={fetchSelectedChannels} 
              disabled={loading || selectedChannelIds.length === 0}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${loading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : selectedChannelIds.length > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400'}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {loading ? '저장된 영상 불러오는 중...' : `저장된 영상 불러오기 (${selectedChannelIds.length}개 채널)`}
            </button>
            <p className="mt-1.5 text-[10px] text-slate-500 text-center">이미 수집되어 저장된 영상만 불러옵니다. 유튜브 API를 새로 호출하지 않습니다.</p>
            {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
            {progressMsg && !error && <p className="mt-2 text-xs text-indigo-600 text-center font-medium">{progressMsg}</p>}
          </div>
        </div>

        {/* ================= 우측: 메인 뷰어 ================= */}
        <div className="lg:col-span-3 flex flex-col h-full space-y-4">
          
          {/* 탭 네비게이션 */}
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-indigo-100' : 'bg-slate-200/50 text-slate-500 hover:bg-white hover:shadow-sm'}`}>
              <Search className="w-4 h-4" /> 분석 대시보드
            </button>
            <button onClick={() => setActiveTab('scrapbook')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'scrapbook' ? 'bg-white shadow-sm text-yellow-600 ring-1 ring-yellow-100' : 'bg-slate-200/50 text-slate-500 hover:bg-white hover:shadow-sm'}`}>
              <Bookmark className="w-4 h-4" /> 영구 스크랩북 <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{savedVideos.length}</span>
            </button>
          </div>

          {activeTab === 'dashboard' ? (
            <>
              {/* 컨트롤 바 */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-20">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="제목 검색..." className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-40 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>

                  <select value={viewFilter} onChange={(e) => setViewFilter(Number(e.target.value))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium">
                    <option value={0}>👁️ 조회수 전체</option>
                    <option value={100000}>🔥 10만 이상</option>
                    <option value={500000}>🔥🔥 50만 이상</option>
                    <option value={1000000}>👑 100만 이상</option>
                  </select>

                  <select value={lengthFilter} onChange={(e) => setLengthFilter(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium">
                    <option value="all">🎬 길이 전체</option>
                    <option value="shorts">📱 쇼츠만</option>
                    <option value="long">🎞️ 롱폼만</option>
                  </select>

                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button onClick={() => setSortType('multiplier')} className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${sortType === 'multiplier' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>대박지수</button>
                    <button onClick={() => setSortType('viral')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${sortType === 'viral' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}>화제성(일평균)</button>
                    <button onClick={() => setSortType('date')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${sortType === 'date' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>최신순</button>
                    <button onClick={() => setSortType('likes')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${sortType === 'likes' ? 'bg-white shadow text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}>참여율(좋아요)</button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={handleManualScan}
                    disabled={isScanning}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${isScanning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  >
                    {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    {isScanning ? '새 영상 수집 중...' : '유튜브 새 영상 수집'}
                  </button>
                  <p className="max-w-[220px] text-[10px] leading-snug text-slate-500">유튜브 API를 호출해 새 영상을 확인합니다. 이미 저장된 영상은 중복 저장하지 않고 갱신합니다.</p>
                </div>

                <button 
                  onClick={() => setTtoTtoMode(!ttoTtoMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all duration-300 shadow-sm ${ttoTtoMode ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 ring-2 ring-rose-200 ring-offset-1 scale-105' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
                >
                  <Rocket className={`w-5 h-5 ${ttoTtoMode ? 'animate-bounce' : ''}`} />
                  또터또 발굴 (6개월+)
                </button>
              </div>

              {checkedVideos.length > 0 && (
                <div className="bg-indigo-900 rounded-xl p-4 flex justify-between items-center shadow-lg animate-in slide-in-from-top-4">
                  <span className="text-indigo-100 font-medium text-sm"><span className="text-white font-bold text-lg">{checkedVideos.length}</span>개 선택됨</span>
                  <div className="flex flex-col items-end gap-1">
                    <button onClick={() => copyAI_RemakePrompt(videos.filter(v => checkedVideos.includes(v.videoId)))} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg font-bold shadow-md transition-transform hover:scale-105">
                      {copiedPrompt ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copiedPrompt ? '복사 완료! AI에게 붙여넣으세요' : 'AI 리메이크 프롬프트 복사'}
                    </button>
                    <p className="text-[10px] text-indigo-100">선택한 영상으로 리메이크 요청문을 만들어 클립보드에 복사합니다.</p>
                  </div>
                </div>
              )}

              {/* 데이터 테이블 */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 relative flex flex-col min-h-[600px]">
                <p className="px-4 pt-3 text-[10px] text-slate-500">댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다. 저장된 영상 불러오기와는 별도 기능입니다.</p>
                {videos.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-50">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4"><Youtube className="w-10 h-10 text-indigo-300" /></div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">벤치마킹 데이터 대기 중</h3>
                    <p className="text-slate-500 max-w-md">좌측에서 채널을 선택하고 분석을 시작하세요.<br/>글로벌 떡상 트렌드와 찐팬 반응이 여기에 펼쳐집니다.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto overflow-y-auto flex-1">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 shadow-sm z-10">
                        <tr>
                          <th className="px-3 py-3 text-center">선택</th>
                          <th className="px-2 py-3 text-center">저장</th>
                          <th className="px-3 py-3">영상 정보 (제목/길이/댓글)</th>
                          <th className="px-3 py-3 text-right">총 조회수</th>
                          <th className="px-3 py-3 text-right text-indigo-700 font-bold">대박지수</th>
                          <th className="px-3 py-3 text-right text-rose-600 font-bold">참여율(좋아요)</th>
                          <th className="px-3 py-3 text-right">경과일</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAndSortedVideos.length === 0 ? (
                          <tr><td colSpan="7" className="text-center py-10 text-slate-500">필터 조건에 맞는 영상이 없습니다.</td></tr>
                        ) : (
                          filteredAndSortedVideos.map((v) => (
                            <tr key={v.videoId} className={`transition-colors ${checkedVideos.includes(v.videoId) ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                              <td className="px-3 py-4 text-center">
                                <button onClick={() => toggleCheckVideo(v.videoId)} className="focus:outline-none">
                                  {checkedVideos.includes(v.videoId) ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-300 hover:text-indigo-400" />}
                                </button>
                              </td>
                              <td className="px-2 py-4 text-center">
                                <button onClick={() => toggleScrapVideo(v)} className="p-1 rounded-full hover:bg-yellow-100 transition-colors group">
                                  <Star className={`w-5 h-5 ${isVideoSaved(v.videoId) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 group-hover:text-yellow-400'}`} />
                                </button>
                              </td>
                              <td className="px-3 py-4 max-w-[350px]">
                                <div className="flex gap-3">
                                  <img src={v.thumbnail} alt="" className="w-24 h-14 object-cover rounded shadow-sm border border-slate-200 shrink-0" />
                                  <div className="flex flex-col justify-between">
                                    <a href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noreferrer" className="font-bold text-slate-800 hover:text-indigo-600 line-clamp-2 leading-tight mb-1">{v.title}</a>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{LANGUAGES.find(l => l.code === v.language)?.label || '🌐'}</span>
                                      {v.isShorts ? (
                                        <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-bold">📱 Shorts ({v.duration})</span>
                                      ) : (
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> {v.duration}</span>
                                      )}
                                      <button onClick={() => fetchTopComments(v.videoId, v.title)} title="YouTube API로 댓글 Top 10을 조회합니다." className="text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-1.5 py-0.5 rounded font-semibold border border-indigo-100 flex items-center gap-1 transition-colors">
                                        <MessageSquareText className="w-3 h-3" /> 댓글 Top 10 보기
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4 text-right">
                                <span className="font-bold text-slate-700">{v.view_count.toLocaleString()}</span>
                              </td>
                              <td className="px-3 py-4 text-right">
                                <span className={`inline-flex items-center gap-1 font-extrabold px-2 py-1 rounded-lg ${v.multiplier >= 3 ? 'bg-rose-100 text-rose-700' : v.multiplier >= 1.5 ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'}`}>
                                  {v.multiplier >= 3 && <TrendingUp className="w-3 h-3" />}
                                  {v.multiplier.toFixed(1)}x
                                </span>
                              </td>
                              <td className="px-3 py-4 text-right">
                                <div className="flex flex-col items-end">
                                  <span className={`text-sm font-bold ${v.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-600'}`}>{v.like_ratio}%</span>
                                  <span className="text-[10px] text-slate-400">👍 {v.like_count.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="px-3 py-4 text-right">
                                <span className={`text-xs font-medium ${v.daysOld >= 180 ? 'text-orange-600 bg-orange-50 px-2 py-1 rounded' : 'text-slate-500'}`}>
                                  {v.daysOld}일 전<br/><span className="text-[10px] text-slate-400 font-normal">({v.upload_date})</span>
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 overflow-y-auto min-h-[600px] animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-yellow-500 fill-yellow-500" /> 영구 보관 스크랩북
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">별표(⭐️)를 눌러 모아둔 나만의 영감 보관소입니다. (브라우저를 닫아도 유지됩니다)</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button onClick={() => copyAI_RemakePrompt(savedVideos)} disabled={savedVideos.length === 0} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${savedVideos.length > 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-md hover:scale-105' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                    <Lightbulb className="w-5 h-5" /> AI 리메이크 프롬프트 복사
                  </button>
                  <p className="max-w-[260px] text-right text-[10px] text-slate-500">스크랩한 영상 전체로 리메이크 요청문을 만들어 클립보드에 복사합니다.</p>
                </div>
              </div>

              {savedVideos.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">스크랩된 영상이 없습니다.</h3>
                  <p className="text-slate-500">분석 대시보드에서 ⭐️ 버튼을 눌러 레퍼런스 영상을 모아보세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedVideos.map((video) => (
                    <div key={video.videoId} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group bg-white flex flex-col">
                      <div className="relative">
                        <img src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt="thumb" className="w-full aspect-video object-cover" />
                        <div className="absolute top-2 left-2 flex gap-1">
                          {video.isShorts && <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">Shorts</span>}
                        </div>
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          <span className="bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{video.duration}</span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="font-bold text-slate-800 line-clamp-2 text-sm hover:text-indigo-600 mb-2 leading-snug" title={video.title}>{video.title}</a>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{video.channel_title}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">조회수 / 참여율</p>
                            <p className="font-bold text-slate-800 text-sm">{video.view_count.toLocaleString()} <span className="text-xs text-rose-500 ml-1">({video.like_ratio}%)</span></p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => fetchTopComments(video.videoId, video.title)} className="p-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="댓글 Top 10 보기 - YouTube API로 댓글을 조회합니다">
                              <MessageSquareText className="w-4 h-4" />
                            </button>
                            <button onClick={() => toggleScrapVideo(video)} className="p-1.5 text-slate-400 bg-slate-50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="스크랩 해제">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
