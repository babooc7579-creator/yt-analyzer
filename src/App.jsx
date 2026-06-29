import React, { useState, useEffect, useMemo } from 'react';
import { Play, AlertCircle, Loader2, Youtube, FileSpreadsheet, Star, Lightbulb, Trash2, History, Search, Filter, FolderOpen, CheckSquare, Square, Rocket, TrendingUp, Sparkles, Copy, CheckCircle2, Plus, Globe, Settings, Clock, ThumbsUp, MessageSquareText, X, Bookmark, RefreshCw } from 'lucide-react';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from './services/storage';
import { createChannel, createChannelNote, createChannelsBulk, deleteScrapbookVideo, fetchChannelPreview, fetchChannels, fetchScrapbook, fetchStoredVideosByChannelIds, removeChannel, renameTag, saveScrapbookVideos, scanChannels, scanSelectedChannels as scanSelectedChannelsRequest } from './services/functionApi';
import { fetchTopComments as fetchTopCommentsFromYoutube } from './services/youtubeApi';
import { filterAndSortVideos, hasStrongReaction, isTtoTtoCandidate, mapCloudVideoToViewModel, TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from './utils/video';
import { formatCoverageRate, formatOptionalNumber } from './utils/formatters';
import { DEFAULT_CATEGORIES } from './constants/categories';
import { CREATOR_OS_PRODUCT_MAP, getCreatorOsItem } from './constants/creatorOs';
import { LANGUAGES } from './constants/languages';
import ChannelTagTabs from './components/ChannelTagTabs';
import LoadStoredVideosButton from './components/LoadStoredVideosButton';
import VideoCard from './components/VideoCard';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  
  // 상태 관리
  const [categories, setCategories] = useState(() => {
    return readJsonStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES) || DEFAULT_CATEGORIES;
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const [savedChannels, setSavedChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [savedVideos, setSavedVideos] = useState(() => {
    return readJsonStorage(STORAGE_KEYS.savedVideos, []) || [];
  });
  const [scrapbookCloudReady, setScrapbookCloudReady] = useState(false);
  
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
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [showWorkPanel, setShowWorkPanel] = useState(false);
  const [creatorView, setCreatorView] = useState('home');
  
  const [checkedVideos, setCheckedVideos] = useState([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  
  const [commentModal, setCommentModal] = useState({ isOpen: false, videoTitle: '', comments: [], loading: false });
  const [notesModal, setNotesModal] = useState({ isOpen: false, channel: null, newNoteText: '', saving: false });

  useEffect(() => { writeJsonStorage(STORAGE_KEYS.categories, categories); }, [categories]);
  useEffect(() => { writeJsonStorage(STORAGE_KEYS.savedVideos, savedVideos); }, [savedVideos]);

  useEffect(() => {
    let isCancelled = false;

    const syncScrapbookFromCloud = async () => {
      const localSavedVideos = readJsonStorage(STORAGE_KEYS.savedVideos, []) || [];

      try {
        if (localSavedVideos.length > 0) {
          await saveScrapbookVideos(localSavedVideos);
        }

        const data = await fetchScrapbook();
        if (!data.success) throw new Error(data.error || '스크랩북을 불러오지 못했습니다.');
        if (isCancelled) return;

        setSavedVideos(data.videos || []);
        setScrapbookCloudReady(true);
      } catch {
        if (!isCancelled) setScrapbookCloudReady(false);
      }
    };

    syncScrapbookFromCloud();
    return () => { isCancelled = true; };
  }, []);

  // 채널 목록은 더 이상 브라우저에만 저장하지 않고, 클라우드(Cosmos DB)에서 불러옵니다.
  const loadChannelsFromCloud = async () => {
    setChannelsLoading(true);
    try {
      const data = await fetchChannels();
      if (!data.success) throw new Error(data.error || '채널 목록을 불러오지 못했습니다.');
      setSavedChannels(data.channels || []);
    } catch (err) {
      setError(`채널 목록 로딩 실패: ${err.message} (Function App CORS 설정을 확인해주세요)`);
    } finally {
      setChannelsLoading(false);
    }
  };

  useEffect(() => { loadChannelsFromCloud(); }, []);

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

  const formatRelativeTime = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';

    const diffMs = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const getScanStatusMeta = (status) => {
    if (status === 'success') return { label: 'success', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    if (status === 'partial') return { label: 'partial', className: 'bg-amber-50 text-amber-700 border-amber-100' };
    if (status === 'failed') return { label: 'failed', className: 'bg-red-50 text-red-700 border-red-100' };
    return { label: '미수집', className: 'bg-slate-50 text-slate-500 border-slate-200' };
  };

  const getChannelScanDisplay = (channel) => {
    const summary = channel.lastScanSummary || null;
    const scannedAt = summary?.scannedAt || channel.lastScannedAt || null;
    const status = summary?.status || (scannedAt ? 'success' : 'none');
    const coverageRate = formatCoverageRate(summary?.coverageRate);

    return {
      statusMeta: getScanStatusMeta(status),
      scannedText: scannedAt ? formatRelativeTime(scannedAt) : '미수집',
      newVideosFound: formatOptionalNumber(summary?.newVideosFound),
      statsRefreshed: formatOptionalNumber(summary?.statsRefreshed),
      coverageRate,
      hasSummary: Boolean(summary),
      error: summary?.error || null,
    };
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
      const data = await fetchChannelPreview(newChannelInput.trim());
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
      const data = await createChannel({ handle: newChannelInput.trim(), tags: newChannelTags, language: newChannelLang, note: newChannelNote });
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
      const data = await createChannelsBulk({ handles, tags: newChannelTags, language: newChannelLang });
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
      const data = await removeChannel({ id, category });
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
      const data = await createChannelNote({ id, category, text });
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
      const data = await fetchStoredVideosByChannelIds(selectedChannelIds);
      if (!data.success) throw new Error(data.error || '영상 데이터를 불러오지 못했습니다.');

      // 백엔드 필드명(camelCase) -> 화면에서 쓰는 필드명으로 변환 + daysOld/views_per_day는 매번 새로 계산
      const mapped = (data.videos || []).map((video) => (
        mapCloudVideoToViewModel(video, getDaysDiff(video.uploadDate))
      ));

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
    const scanSelectedChannels = !tag && selectedChannelIds.length > 0;
    const channelIdsForScan = [...selectedChannelIds];

    setIsScanning(true); setScanningTag(scanSelectedChannels ? 'SELECTED' : (tag || 'ALL')); setError('');
    setProgressMsg(`${scanSelectedChannels ? `선택 채널 ${channelIdsForScan.length}개` : tag ? `'${tag}' 태그 채널` : '전체 채널'} 새 영상 수집 중... (YouTube API 호출이 발생합니다)`);
    try {
      const data = scanSelectedChannels
        ? await scanSelectedChannelsRequest(channelIdsForScan)
        : await scanChannels({ tag });
      if (!data.success) throw new Error(data.error || '스캔에 실패했습니다.');

      const totalNew = (data.results || []).reduce((sum, r) => sum + (r.newVideosFound || 0), 0);
      const ttoTtoCount = (data.results || []).reduce((sum, r) => sum + (r.ttoTtoCandidates?.length || 0), 0);
      setProgressMsg(`스캔 완료! 신규 영상 ${totalNew}개 발견${ttoTtoCount > 0 ? `, 터또터 후보 ${ttoTtoCount}개 발견!` : ''}`);

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
      const data = await renameTag({ from, to });
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
      const data = await fetchTopCommentsFromYoutube({ videoId, apiKey });
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
    return filterAndSortVideos({ videos, searchKeyword, viewFilter, lengthFilter, ttoTtoMode, sortType });
  }, [videos, searchKeyword, viewFilter, lengthFilter, ttoTtoMode, sortType]);

  const toggleCheckVideo = (videoId) => {
    setCheckedVideos(prev => prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]);
  };

  const toggleScrapVideo = async (video) => {
    const isSaved = savedVideos.some(v => v.videoId === video.videoId);

    setSavedVideos(prev => {
      if (isSaved) return prev.filter(v => v.videoId !== video.videoId);
      return [...prev, video];
    });

    if (!scrapbookCloudReady) return;

    try {
      if (isSaved) await deleteScrapbookVideo(video.videoId);
      else await saveScrapbookVideos([video]);
    } catch {
      setScrapbookCloudReady(false);
    }
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

  const activeCreatorItem = getCreatorOsItem(creatorView);
  const readyCreatorViews = ['vault-all', 'vault-videos', 'vault-channels', 'studio-candidates', 'studio-scrapbook', 'ops-channels', 'ops-add-channel', 'ops-selected-scan'];
  const channelCreatorViews = ['vault-channels', 'ops-channels', 'ops-add-channel', 'ops-selected-scan'];
  const scrapbookCreatorViews = ['studio-candidates', 'studio-scrapbook'];
  const isHomeView = creatorView === 'home';
  const isComingSoonView = activeCreatorItem?.status === 'soon';
  const isLegacyWorkspaceView = readyCreatorViews.includes(creatorView);
  const isReferenceVaultView = creatorView === 'vault-all' || creatorView === 'vault-videos';
  const latestScannedAt = savedChannels.reduce((latest, channel) => {
    const value = channel.lastScanSummary?.scannedAt || channel.lastScannedAt;
    if (!value) return latest;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return latest;
    return !latest || date > latest ? date : latest;
  }, null);
  const latestScanText = latestScannedAt ? formatRelativeTime(latestScannedAt) : '수집 기록 없음';
  const ttoTtoAssetCount = videos.filter(isTtoTtoCandidate).length;
  const visibleScrapCount = videos.filter(v => isVideoSaved(v.videoId)).length;

  const openCreatorView = (item) => {
    setCreatorView(item.id);

    if (channelCreatorViews.includes(item.id)) {
      setActiveTab('dashboard');
      setShowWorkPanel(true);
      return;
    }

    if (scrapbookCreatorViews.includes(item.id)) {
      setActiveTab('scrapbook');
      setShowWorkPanel(false);
      return;
    }

    if (item.id === 'vault-all' || item.id === 'vault-videos') {
      setActiveTab('dashboard');
      setShowWorkPanel(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 font-sans text-slate-100">
      
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

      <div className="mx-auto flex w-full max-w-[2600px] flex-col gap-4 xl:flex-row">
        <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-48px)] xl:w-[350px] shrink-0 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/40 [scrollbar-color:#334155_transparent] [scrollbar-width:thin]">
          <div className="mb-5 rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-slate-950 to-indigo-950/80 p-4 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-200">타임머신 CRM</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Creator OS</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">유튜브 레퍼런스를 발굴하고 제작 자산으로 축적하는 지휘실입니다.</p>
          </div>

          <div className="space-y-5">
            {CREATOR_OS_PRODUCT_MAP.map(section => (
              <div key={section.title}>
                <div className="mb-2.5 px-1">
                  <p className="text-[11px] font-extrabold tracking-wide text-slate-100">{section.title}</p>
                  <p className="text-[10px] leading-snug text-slate-500">{section.description}</p>
                </div>
                <div className="space-y-1.5">
                  {section.items.map(item => {
                    const isActive = creatorView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openCreatorView(item)}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${isActive ? 'border-indigo-400/60 bg-indigo-500/15 text-white shadow-[inset_3px_0_0_rgba(129,140,248,0.9)]' : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-100'}`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold">{item.label}</span>
                          {item.status === 'soon' && (
                            <span className="shrink-0 rounded-full border border-slate-700/70 bg-slate-950/40 px-1.5 py-0.5 text-[8px] font-bold text-slate-500">준비중</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-300">{activeCreatorItem?.sectionTitle}</p>
                <h2 className="mt-1 text-2xl font-extrabold text-white">{activeCreatorItem?.label}</h2>
                <p className="mt-1 text-sm text-slate-400">{activeCreatorItem?.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
                  <p className="text-xl font-extrabold text-white">{savedChannels.length}</p>
                  <p className="text-[10px] font-semibold text-slate-500">채널</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
                  <p className="text-xl font-extrabold text-white">{videos.length}</p>
                  <p className="text-[10px] font-semibold text-slate-500">영상</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
                  <p className="text-xl font-extrabold text-white">{selectedChannelIds.length}</p>
                  <p className="text-[10px] font-semibold text-slate-500">선택 채널</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
                  <p className="text-xl font-extrabold text-white">{savedVideos.length}</p>
                  <p className="text-[10px] font-semibold text-slate-500">제작 후보</p>
                </div>
              </div>
            </div>
          </div>

          {isHomeView ? (
            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-indigo-500/15 p-4">
                    <Sparkles className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-indigo-300">오늘의 레이더</p>
                    <h3 className="mt-1 text-2xl font-extrabold text-white">오늘 볼 소재와 다음 행동을 먼저 정합니다</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">발굴 → 수집 → 보관 → 분석 → 제작 → 축적 흐름으로 레퍼런스 자산을 운영합니다.</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-[11px] font-bold text-slate-500">저장된 채널</p>
                    <p className="mt-2 text-3xl font-extrabold text-white">{savedChannels.length}</p>
                    <p className="mt-1 text-xs text-slate-400">레퍼런스를 모으는 채널 자산</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-[11px] font-bold text-slate-500">불러온 영상</p>
                    <p className="mt-2 text-3xl font-extrabold text-white">{videos.length}</p>
                    <p className="mt-1 text-xs text-slate-400">현재 보드에 올라온 영상</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-[11px] font-bold text-slate-500">스크랩 소재</p>
                    <p className="mt-2 text-3xl font-extrabold text-white">{savedVideos.length}</p>
                    <p className="mt-1 text-xs text-slate-400">제작 후보로 남긴 영상</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-4">
                    <p className="text-[11px] font-bold text-emerald-300">최근 수집 상태</p>
                    <p className="mt-2 text-lg font-extrabold text-white">{latestScanText}</p>
                    <p className="mt-1 text-xs text-emerald-100/70">채널의 마지막 수집 기록 기준</p>
                  </div>
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-950/30 p-4">
                    <p className="text-[11px] font-bold text-rose-300">터또터 후보</p>
                    <p className="mt-2 text-3xl font-extrabold text-white">{ttoTtoAssetCount}</p>
                    <p className="mt-1 text-xs text-rose-100/70">노출이 멈춘 검증된 영상</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <button onClick={() => openCreatorView({ id: 'ops-add-channel' })} className="group rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-300/50 hover:bg-indigo-500/15">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-indigo-200">1. 새 채널 등록</p>
                      <Plus className="h-4 w-4 text-indigo-300 transition-transform group-hover:scale-110" />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">소재를 모을 채널을 먼저 클라우드 목록에 저장합니다.</p>
                    <p className="mt-3 text-[10px] font-bold text-indigo-300">오퍼레이션 관제로 이동</p>
                  </button>
                  <button onClick={() => openCreatorView({ id: 'ops-selected-scan' })} className="group rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-300/50 hover:bg-emerald-500/15">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-emerald-200">2. 선택 채널 수집</p>
                      <RefreshCw className="h-4 w-4 text-emerald-300 transition-transform group-hover:rotate-45" />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">체크한 채널만 YouTube API로 새 영상 여부를 확인합니다.</p>
                    <p className="mt-3 text-[10px] font-bold text-emerald-300">수집 범위 직접 통제</p>
                  </button>
                  <button onClick={() => openCreatorView({ id: 'vault-all' })} className="group rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-blue-500/15">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-blue-200">3. 보관함 탐색</p>
                      <Bookmark className="h-4 w-4 text-blue-300 transition-transform group-hover:scale-110" />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">저장된 영상 보드에서 카드 보기와 리스트 보기로 후보를 고릅니다.</p>
                    <p className="mt-3 text-[10px] font-bold text-blue-300">레퍼런스 금고 열기</p>
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
                <p className="text-sm font-extrabold text-white">운영 기준</p>
                <div className="mt-4 space-y-3 text-sm text-slate-400">
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="font-bold text-emerald-200">수집은 API 호출</p>
                    <p className="mt-1 text-xs leading-relaxed">새 영상 수집은 YouTube API를 호출합니다. 필요한 채널만 체크해서 실행하세요.</p>
                  </div>
                  <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-4">
                    <p className="font-bold text-blue-200">불러오기는 저장 데이터 조회</p>
                    <p className="mt-1 text-xs leading-relaxed">저장된 영상 불러오기는 이미 DB에 있는 영상만 보여줍니다.</p>
                  </div>
                  <div className="rounded-xl border border-orange-400/20 bg-orange-500/10 p-4">
                    <p className="font-bold text-orange-200">터또터 기준</p>
                    <p className="mt-1 text-xs leading-relaxed">한 번 반응이 검증된 영상을 재편집해 다시 살릴 후보를 우선 확인합니다.</p>
                  </div>
                </div>
              </section>
            </div>
          ) : isComingSoonView ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/90 p-10 text-center shadow-xl shadow-slate-950/30">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                <Settings className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-5 text-sm font-extrabold text-indigo-300">{activeCreatorItem?.sectionTitle}</p>
              <h3 className="mt-2 text-2xl font-extrabold text-white">{activeCreatorItem?.label} 준비중</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{activeCreatorItem?.summary}</p>
              <p className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">이 화면은 안내 전용입니다. 클릭해도 새 API 호출, DB 변경, localStorage 삭제가 발생하지 않습니다.</p>
            </div>
          ) : isLegacyWorkspaceView ? (
      <div className={`w-full mx-auto grid grid-cols-1 gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${showWorkPanel ? 'max-w-[2400px] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]' : 'max-w-[2400px]'}`}>
        
        {/* ================= 좌측: CRM 패널 ================= */}
        <div className={`space-y-4 ${showWorkPanel ? '' : 'hidden'}`}>
          <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-300 p-4">
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" /> 타임머신 CRM
            </h1>
            <div className="mb-4 border border-indigo-100 bg-indigo-50/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-extrabold text-slate-900">오늘의 작업 흐름</p>
                  <p className="text-[11px] text-slate-500">채널 저장 → 새 영상 수집 → 저장된 영상 확인</p>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="bg-white border border-indigo-100 rounded-lg p-3">
                  <p className="text-xs font-bold text-slate-800">1. 먼저 채널 저장</p>
                  <p className="text-[11px] text-slate-500 mt-1">소재를 모을 유튜브 채널을 클라우드 목록에 추가합니다.</p>
                </div>
                <div className="bg-white border border-emerald-100 rounded-lg p-3">
                  <p className="text-xs font-bold text-emerald-700">2. 유튜브 새 영상 수집</p>
                  <p className="text-[11px] text-slate-500 mt-1">YouTube API를 호출해 새 영상 여부를 확인합니다.</p>
                </div>
                <div className="bg-white border border-blue-100 rounded-lg p-3">
                  <p className="text-xs font-bold text-blue-700">3. 저장된 영상 불러오기</p>
                  <p className="text-[11px] text-slate-500 mt-1">이미 저장된 데이터만 조회합니다. 새 API 호출은 없습니다.</p>
                </div>
              </div>
            </div>
            
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
            <ChannelTagTabs
              categories={categories}
              channels={savedChannels}
              selectedCategory={selectedCategoryTab}
              scanningTag={scanningTag}
              isScanning={isScanning}
              onSelectCategory={setSelectedCategoryTab}
              onScanTag={handleTagScan}
            />
            
            <hr className="my-4 border-slate-100" />
            
            <div className="space-y-3 max-h-[420px] xl:max-h-[520px] overflow-y-auto pr-1.5">
              {channelsLoading ? (
                <p className="text-sm text-slate-400 text-center py-4 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> 클라우드에서 채널 불러오는 중...</p>
              ) : savedChannels.filter(c => c.tags?.includes(selectedCategoryTab)).length === 0 ? (
                <div className="text-center py-5 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-600">저장된 채널이 없습니다.</p>
                  <p className="text-[11px] text-slate-500 mt-1">먼저 위에서 채널을 미리보기한 뒤 저장해 주세요.</p>
                </div>
              ) : (
                savedChannels.filter(c => c.tags?.includes(selectedCategoryTab)).map(channel => {
                  const scanDisplay = getChannelScanDisplay(channel);
                  return (
                    <div key={channel.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${selectedChannelIds.includes(channel.id) ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
                      <button onClick={() => toggleChannelSelection(channel.id)} className="text-indigo-600 focus:outline-none shrink-0 mt-1">
                        {selectedChannelIds.includes(channel.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
                      </button>
                      <img src={channel.thumbnail} alt="" className="w-9 h-9 rounded-full border border-slate-200 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2" title={channel.title}>{channel.title}</p>
                        <div className="flex items-center gap-x-2 gap-y-1 flex-wrap mt-1">
                          <span className="text-[10px] font-medium text-slate-500">{LANGUAGES.find(l => l.code === channel.language)?.label}</span>
                          {channel.stats && (
                            <>
                              <span className="text-[9px] text-slate-400" title="구독자 수">👤{formatCompactKo(channel.stats.subscriberCount)}</span>
                              <span className="text-[9px] text-slate-400" title="전체 영상 수">🎬{formatCompactKo(channel.stats.totalVideoCount)}</span>
                              <span className="text-[9px] text-slate-400" title="평균 조회수">👁️{formatCompactKo(channel.stats.avgViewCount)}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-2 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10px] font-semibold text-slate-500">최근 수집: {scanDisplay.scannedText}</span>
                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${scanDisplay.statusMeta.className}`}>{scanDisplay.statusMeta.label}</span>
                          </div>
                          <p className="mt-1 text-[10px] leading-snug text-slate-500 break-words" title={scanDisplay.error || undefined}>
                            {scanDisplay.hasSummary
                              ? `새 영상 ${scanDisplay.newVideosFound} · 갱신 ${scanDisplay.statsRefreshed}${scanDisplay.coverageRate ? ` · ${scanDisplay.coverageRate}` : ''}${scanDisplay.error ? ` · ${scanDisplay.error}` : ''}`
                              : '수집 요약 없음'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => openNotesModal(channel)} className="relative p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-1" title="분석/기록 남기기">
                        <History className="w-4 h-4" />
                        {channel.notes?.length > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{channel.notes.length}</span>}
                      </button>
                      <button onClick={() => deleteChannel(channel.id, channel.category)} className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0 mt-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  );
                })
              )}
            </div>

            <LoadStoredVideosButton
              loading={loading}
              selectedChannelCount={selectedChannelIds.length}
              onLoad={fetchSelectedChannels}
            />
            {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
            {progressMsg && !error && <p className="mt-2 text-xs text-indigo-600 text-center font-medium">{progressMsg}</p>}
          </div>
        </div>

        {/* ================= 우측: 메인 뷰어 ================= */}
        <div className="flex flex-col h-full space-y-4 min-w-0">
          
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
              {isReferenceVaultView ? (
                <div className="overflow-hidden rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm">
                  <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-indigo-700">Reference Vault</p>
                      <h3 className="mt-1 text-2xl font-extrabold text-slate-950">레퍼런스 금고</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">저장된 영상과 스크랩 소재를 한 곳에서 훑고, 제작에 활용할 후보를 고르는 작업 캔버스입니다.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                      <div className="rounded-xl border border-slate-300 bg-white/80 px-4 py-3">
                        <p className="text-[10px] font-bold text-slate-400">불러온 영상</p>
                        <p className="mt-1 text-xl font-extrabold text-slate-900">{videos.length}</p>
                      </div>
                      <div className="rounded-xl border border-slate-300 bg-white/80 px-4 py-3">
                        <p className="text-[10px] font-bold text-slate-400">저장 채널</p>
                        <p className="mt-1 text-xl font-extrabold text-slate-900">{savedChannels.length}</p>
                      </div>
                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                        <p className="text-[10px] font-bold text-yellow-600">스크랩 소재</p>
                        <p className="mt-1 text-xl font-extrabold text-slate-900">{savedVideos.length}</p>
                      </div>
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                        <p className="text-[10px] font-bold text-indigo-600">현재 보드 스크랩</p>
                        <p className="mt-1 text-xl font-extrabold text-slate-900">{visibleScrapCount}</p>
                      </div>
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                        <p className="text-[10px] font-bold text-rose-600">터또터 후보</p>
                        <p className="mt-1 text-xl font-extrabold text-slate-900">{ttoTtoAssetCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <RefreshCw className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-extrabold text-emerald-800">유튜브 새 영상 수집</p>
                        <p className="text-xs text-slate-600 mt-1">YouTube API를 호출해 신규 영상을 확인합니다. 새 영상이 필요할 때만 실행하세요.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <Play className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-extrabold text-blue-800">저장된 영상 불러오기</p>
                        <p className="text-xs text-slate-600 mt-1">클라우드에 이미 저장된 영상만 조회합니다. YouTube API를 새로 호출하지 않습니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 컨트롤 바 */}
              <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-4 flex flex-col 2xl:flex-row gap-4 justify-between items-stretch z-20">
                <div className="flex flex-col gap-3 min-w-0 flex-1">
                  {isReferenceVaultView && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">보관함 도구막대</p>
                        <p className="text-[11px] text-slate-500">검색, 필터, 정렬, 보기 방식을 바꿔 제작 소재를 좁혀봅니다.</p>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500">현재 표시 {filteredAndSortedVideos.length}개 / 전체 {videos.length}개</p>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 w-full">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="제목 검색..." className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-56 focus:ring-2 focus:ring-indigo-500 outline-none" />
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

                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button onClick={() => setViewMode('card')} className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>카드 보기</button>
                    <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>리스트 보기</button>
                  </div>

                  <button
                    onClick={() => setShowWorkPanel(!showWorkPanel)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border ${showWorkPanel ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-700'}`}
                  >
                    {showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기'}
                  </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 2xl:max-w-[520px]">
                  <button
                    onClick={handleManualScan}
                    disabled={isScanning}
                    className={`shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isScanning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  >
                    {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    {isScanning ? '새 영상 수집 중...' : selectedChannelIds.length > 0 ? `선택 채널 새 영상 수집 (${selectedChannelIds.length}개)` : '전체 채널 새 영상 수집'}
                  </button>
                  <p className="max-w-[260px] text-[10px] leading-snug text-slate-600">
                    {selectedChannelIds.length > 0
                      ? '체크한 채널만 YouTube API로 새 영상 여부를 확인합니다. 체크하지 않은 채널은 수집하지 않습니다.'
                      : '선택한 채널이 없으면 전체 채널을 YouTube API로 확인합니다. 특정 채널만 수집하려면 먼저 채널을 체크하세요.'}
                  </p>
                </div>

                <button 
                  onClick={() => setTtoTtoMode(!ttoTtoMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all duration-300 shadow-sm ${ttoTtoMode ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 ring-2 ring-rose-200 ring-offset-1 scale-105' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
                >
                  <Rocket className={`w-5 h-5 ${ttoTtoMode ? 'animate-bounce' : ''}`} />
                  터또터 발굴 (6개월+)
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
              <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 overflow-hidden flex-1 relative flex flex-col min-h-[600px]">
                <p className="px-4 pt-3 text-[10px] text-slate-500">댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다. 저장된 영상 불러오기와는 별도 기능입니다.</p>
                {videos.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
                    <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
                      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5"><Bookmark className="w-10 h-10 text-indigo-400" /></div>
                      <h3 className="text-2xl font-extrabold text-slate-800 mb-2">레퍼런스 금고가 비어 있습니다</h3>
                      <p className="text-sm text-slate-500 mb-6">채널을 저장하고, 필요한 경우 새 영상을 수집한 뒤, 저장된 데이터를 불러오면 금고에 제작 소재가 쌓입니다.</p>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
                        <div className="border border-indigo-100 bg-indigo-50/60 rounded-xl p-4">
                          <p className="text-sm font-bold text-indigo-800">1. 채널 저장</p>
                          <p className="text-xs text-slate-600 mt-2">작업 패널에서 채널을 미리보기한 뒤 클라우드 목록에 저장합니다.</p>
                        </div>
                        <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-4">
                          <p className="text-sm font-bold text-emerald-800">2. 새 영상 수집</p>
                          <p className="text-xs text-slate-600 mt-2">새 데이터가 필요할 때만 실행합니다. 이 단계는 YouTube API를 호출합니다.</p>
                        </div>
                        <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                          <p className="text-sm font-bold text-blue-800">3. 저장 데이터 조회</p>
                          <p className="text-xs text-slate-600 mt-2">“저장된 영상 불러오기”는 DB에 저장된 영상만 조회합니다. 새 YouTube API 호출은 없습니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : filteredAndSortedVideos.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                    <div className="mx-auto max-w-xl text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 shadow-sm">
                      <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-base font-bold text-slate-700">필터 조건에 맞는 영상이 없습니다</p>
                      <p className="text-sm text-slate-500 mt-2">필터를 낮추거나, 새 영상이 필요하면 “유튜브 새 영상 수집”을 실행해 주세요.</p>
                    </div>
                  </div>
                ) : viewMode === 'card' ? (
                  <div className={`flex-1 overflow-y-auto bg-slate-100 ${showWorkPanel ? 'p-5' : 'p-6'}`}>
                    <div className={`grid gap-6 ${showWorkPanel ? 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2300px]:grid-cols-5'}`}>
                      {filteredAndSortedVideos.map((v, index) => (
                        <VideoCard
                          key={v.videoId}
                          video={v}
                          rank={index + 1}
                          isChecked={checkedVideos.includes(v.videoId)}
                          isSaved={isVideoSaved(v.videoId)}
                          showWorkPanel={showWorkPanel}
                          onToggleCheck={toggleCheckVideo}
                          onToggleScrap={toggleScrapVideo}
                          onFetchComments={fetchTopComments}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto overflow-y-auto flex-1">
                    <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 shadow-sm z-10">
                        <tr>
                          <th className="px-3 py-3 text-center">AI 검토</th>
                          <th className="px-2 py-3 text-center">스크랩</th>
                          <th className="px-3 py-3">영상 정보 (제목/길이/댓글)</th>
                          <th className="px-3 py-3 text-right">총 조회수</th>
                          <th className="px-3 py-3 text-right text-indigo-700 font-bold">대박지수</th>
                          <th className="px-3 py-3 text-right text-rose-600 font-bold">참여율(좋아요)</th>
                          <th className="px-3 py-3 text-right">경과일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedVideos.map((v) => (
                            <tr key={v.videoId} className={`group transition-all ${checkedVideos.includes(v.videoId) ? 'bg-indigo-50 ring-1 ring-indigo-200' : hasStrongReaction(v) || isTtoTtoCandidate(v) ? 'bg-rose-50/70 ring-1 ring-rose-100 hover:ring-rose-200' : 'bg-white hover:bg-slate-50 ring-1 ring-slate-100 hover:ring-slate-200'}`}>
                              <td className="px-4 py-5 text-center rounded-l-2xl">
                                <button onClick={() => toggleCheckVideo(v.videoId)} title="AI 리메이크 프롬프트에 포함할 제작 검토 후보로 선택" className="focus:outline-none rounded-lg p-1 hover:bg-white transition-colors">
                                  {checkedVideos.includes(v.videoId) ? <CheckSquare className="w-6 h-6 text-indigo-600" /> : <Square className="w-6 h-6 text-slate-300 hover:text-indigo-400" />}
                                </button>
                              </td>
                              <td className="px-2 py-5 text-center">
                                <button onClick={() => toggleScrapVideo(v)} title="스크랩 소재로 저장/해제" className="p-2 rounded-full hover:bg-yellow-100 transition-colors">
                                  <Star className={`w-6 h-6 ${isVideoSaved(v.videoId) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 group-hover:text-yellow-400'}`} />
                                </button>
                              </td>
                              <td className="px-4 py-5 min-w-[520px]">
                                <div className="flex gap-5">
                                  <img src={v.thumbnail} alt="" className="w-36 h-20 object-cover rounded-xl shadow-sm border border-slate-200 shrink-0 bg-slate-100" />
                                  <div className="flex flex-col justify-center min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      {isVideoSaved(v.videoId) && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold text-yellow-700">
                                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" /> 스크랩 소재
                                        </span>
                                      )}
                                      {checkedVideos.includes(v.videoId) && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                                          <CheckSquare className="w-3 h-3" /> AI 리메이크 검토
                                        </span>
                                      )}
                                      {(hasStrongReaction(v) || isTtoTtoCandidate(v)) && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
                                          <Rocket className="w-3 h-3" /> 터또터 후보
                                        </span>
                                      )}
                                      {hasStrongReaction(v) && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                                          <TrendingUp className="w-3 h-3" /> 강한 반응
                                        </span>
                                      )}
                                    </div>
                                    <a href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noreferrer" className="text-base font-extrabold text-slate-900 hover:text-indigo-600 line-clamp-2 leading-snug mb-2">{v.title}</a>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200 font-semibold">{LANGUAGES.find(l => l.code === v.language)?.label || '🌐'}</span>
                                      {v.isShorts ? (
                                        <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-bold">📱 Shorts ({v.duration})</span>
                                      ) : (
                                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> {v.duration}</span>
                                      )}
                                      <button onClick={() => fetchTopComments(v.videoId, v.title)} title="YouTube API로 댓글 Top 10을 조회합니다." className="text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-full font-bold border border-indigo-100 flex items-center gap-1 transition-colors">
                                        <MessageSquareText className="w-3 h-3" /> 댓글 Top 10 보기
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-5 text-right">
                                <div className="inline-flex min-w-[120px] flex-col rounded-xl bg-white/80 border border-slate-200 px-3 py-2 shadow-sm">
                                  <span className="text-[10px] font-bold text-slate-400">총 조회수</span>
                                  <span className="text-base font-extrabold text-slate-800">{v.view_count.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="px-4 py-5 text-right">
                                <div className={`inline-flex min-w-[110px] flex-col rounded-xl border px-3 py-2 shadow-sm ${hasStrongReaction(v) ? 'bg-rose-600 border-rose-600 text-white' : v.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
                                  <span className={`text-[10px] font-bold ${hasStrongReaction(v) ? 'text-rose-100' : 'text-slate-400'}`}>대박지수</span>
                                  <span className="inline-flex items-center justify-end gap-1 text-lg font-extrabold">
                                    {hasStrongReaction(v) && <TrendingUp className="w-4 h-4" />}
                                    {v.multiplier.toFixed(1)}x
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-5 text-right">
                                <div className="inline-flex min-w-[110px] flex-col rounded-xl bg-white/80 border border-slate-200 px-3 py-2 shadow-sm">
                                  <span className="text-[10px] font-bold text-slate-400">참여율</span>
                                  <span className={`text-base font-extrabold ${v.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-700'}`}>{v.like_ratio}%</span>
                                  <span className="text-[10px] text-slate-400">👍 {v.like_count.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="px-4 py-5 text-right rounded-r-2xl">
                                <div className={`inline-flex min-w-[120px] flex-col rounded-xl border px-3 py-2 shadow-sm ${v.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
                                  <span className="text-[10px] font-bold text-slate-400">경과일</span>
                                  <span className="text-base font-extrabold">{v.daysOld}일 전</span>
                                  <span className="text-[10px] text-slate-400 font-normal">({v.upload_date})</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-6 flex-1 overflow-y-auto min-h-[600px] animate-in fade-in duration-300">
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
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 px-6">
                  <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-extrabold text-slate-700 mb-2">스크랩된 영상이 없습니다</h3>
                  <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-left">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-slate-700">1. 채널 저장</p>
                      <p className="text-xs text-slate-500 mt-2">먼저 소재를 모을 채널을 저장합니다.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-slate-700">2. 영상 불러오기</p>
                      <p className="text-xs text-slate-500 mt-2">“저장된 영상 불러오기”로 영상을 확인합니다.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-slate-700">3. 별표 저장</p>
                      <p className="text-xs text-slate-500 mt-2">분석 대시보드에서 별표 버튼을 눌러 모읍니다.</p>
                    </div>
                  </div>
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

        <aside className="hidden">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-extrabold text-slate-900 mb-3">오늘의 다음 행동</p>
            <div className="space-y-3">
              <div className="border border-indigo-100 bg-indigo-50/60 rounded-xl p-3">
                <p className="text-xs font-bold text-indigo-800">1. 채널 저장</p>
                <p className="text-[11px] text-slate-600 mt-1">아직 없는 채널은 왼쪽에서 먼저 저장합니다.</p>
              </div>
              <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-800">2. 새 영상 수집</p>
                <p className="text-[11px] text-slate-600 mt-1">새 데이터가 필요할 때만 실행합니다.</p>
              </div>
              <div className="border border-blue-100 bg-blue-50 rounded-xl p-3">
                <p className="text-xs font-bold text-blue-800">3. 저장 영상 조회</p>
                <p className="text-[11px] text-slate-600 mt-1">저장된 데이터만 보고 싶을 때 사용합니다.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-extrabold text-slate-900 mb-3">현재 상태</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-slate-800">{selectedChannelIds.length}</p>
                <p className="text-[11px] text-slate-500">선택 채널</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-slate-800">{videos.length}</p>
                <p className="text-[11px] text-slate-500">불러온 영상</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-slate-800">{savedVideos.length}</p>
                <p className="text-[11px] text-slate-500">스크랩</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-slate-800">{checkedVideos.length}</p>
                <p className="text-[11px] text-slate-500">선택 영상</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-extrabold text-slate-900 mb-3">수집과 조회 차이</p>
            <div className="space-y-3 text-[11px] text-slate-600 leading-relaxed">
              <p><span className="font-bold text-emerald-700">유튜브 새 영상 수집</span>은 YouTube API를 호출해 새 영상 여부를 확인합니다.</p>
              <p><span className="font-bold text-blue-700">저장된 영상 불러오기</span>는 이미 저장된 데이터만 조회합니다.</p>
              <p className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-amber-800">API 호출이 필요한 작업은 필요한 때만 실행하세요.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-extrabold text-slate-900 mb-3">터또터 발굴 기준</p>
            <div className="space-y-2 text-[11px] text-slate-600">
              <p>업로드 후 6개월 이상 지난 영상</p>
              <p>채널 평균보다 반응이 컸던 영상</p>
              <p>지금 다시 써도 소재로 확장 가능한 영상</p>
            </div>
          </div>
        </aside>
      </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
