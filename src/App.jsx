import React, { useState, useEffect, useMemo } from 'react';
import { Play, AlertCircle, Loader2, Youtube, FileSpreadsheet, Star, Lightbulb, Trash2, History, Search, Filter, FolderOpen, Sparkles, Copy, CheckCircle2, Plus, Globe, Settings, ThumbsUp, MessageSquareText, X, Bookmark, RefreshCw } from 'lucide-react';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from './services/storage';
import { clearVideoUserRecords, createChannel, createChannelNote, createChannelsBulk, deleteScrapbookVideo, fetchChannelPreview, fetchChannels, fetchScrapbook, fetchStoredVideosByChannelIds, fetchVideoUserRecords, removeChannel, renameTag, saveScrapbookVideos, saveVideoUserRecord, scanChannels, scanSelectedChannels as scanSelectedChannelsRequest, updateChannel } from './services/functionApi';
import { fetchTopComments as fetchTopCommentsFromYoutube } from './services/youtubeApi';
import { filterAndSortVideos, isTtoTtoCandidate, mapCloudVideoToViewModel } from './utils/video';
import { formatCoverageRate, formatOptionalNumber } from './utils/formatters';
import { DEFAULT_CATEGORIES } from './constants/categories';
import { CREATOR_OS_PRODUCT_MAP, getCreatorOsItem } from './constants/creatorOs';
import { LANGUAGES } from './constants/languages';
import { CHANNEL_STATUS, PRODUCTION_STATUS, RADAR_HIDDEN_VIDEO_STATUSES, VIDEO_STATUS, hasAnyVideoStatus, isChannelScannable, withRecordStatus } from './constants/status';
import ChannelAddForm from './components/ChannelAddForm';
import ChannelList from './components/ChannelList';
import ChannelTagTabs from './components/ChannelTagTabs';
import LoadStoredVideosButton from './components/LoadStoredVideosButton';
import HomeRadarSummary from './components/HomeRadarSummary';
import ProductionKanban from './components/ProductionKanban';
import RadarCandidateStrip from './components/RadarCandidateStrip';
import ReferenceVaultSummary from './components/ReferenceVaultSummary';
import VideoCard from './components/VideoCard';
import VideoListTable from './components/VideoListTable';
import VideoToolbar from './components/VideoToolbar';

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
  const [updatingChannelId, setUpdatingChannelId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [savedVideos, setSavedVideos] = useState(() => {
    return readJsonStorage(STORAGE_KEYS.savedVideos, []) || [];
  });
  const [videoUserRecords, setVideoUserRecords] = useState(() => {
    return readJsonStorage(STORAGE_KEYS.videoUserRecords, {}) || {};
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
  useEffect(() => { writeJsonStorage(STORAGE_KEYS.videoUserRecords, videoUserRecords); }, [videoUserRecords]);

  useEffect(() => {
    let isCancelled = false;

    const syncVideoUserRecordsFromCloud = async () => {
      try {
        const data = await fetchVideoUserRecords();
        if (!data.success) throw new Error(data.error || '영상 판단 기록을 불러오지 못했습니다.');
        if (isCancelled) return;
        setVideoUserRecords(data.records || {});
      } catch {
        // Cloud sync is best-effort for now. Local records remain available as a fallback.
      }
    };

    syncVideoUserRecordsFromCloud();
    return () => { isCancelled = true; };
  }, []);

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

  const updateChannelMetadata = async (channel, updates) => {
    setUpdatingChannelId(channel.id);
    setError('');

    try {
      const data = await updateChannel({ id: channel.id, category: channel.category, updates });
      if (!data.success) throw new Error(data.error || '채널 정보를 저장하지 못했습니다.');

      setSavedChannels(prev => prev.map(c => c.id === data.channel.id ? data.channel : c));
      if (updates.status && updates.status !== CHANNEL_STATUS.ACTIVE) {
        setSelectedChannelIds(prev => prev.filter(id => id !== data.channel.id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingChannelId(null);
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
    const selectedChannelsForScan = savedChannels.filter(channel => (
      selectedChannelIds.includes(channel.id) && isChannelScannable(channel)
    ));
    const channelIdsForScan = selectedChannelsForScan.map(channel => channel.id);

    if (scanSelectedChannels && channelIdsForScan.length === 0) {
      setError('운영중 상태의 채널을 하나 이상 선택해 주세요. 보류/제외 채널은 새 영상 수집에서 제외됩니다.');
      return;
    }

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

  const markRadarVideoStatus = async (videoId, status, extraUpdates = {}) => {
    const record = withRecordStatus({
      ...(videoUserRecords[videoId] || {}),
      videoId,
    }, status, {
      ...extraUpdates,
      updatedAt: new Date().toISOString(),
    });

    setVideoUserRecords(prev => ({
      ...prev,
      [videoId]: record,
    }));

    try {
      await saveVideoUserRecord(record);
      return true;
    } catch {
      // Keep the local decision so the daily workflow is not blocked by a temporary cloud error.
      return false;
    }
  };

  const updateVideoUserRecord = async (videoId, updates) => {
    const record = {
      ...(videoUserRecords[videoId] || {}),
      videoId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setVideoUserRecords(prev => ({
      ...prev,
      [videoId]: record,
    }));

    try {
      await saveVideoUserRecord(record);
      return true;
    } catch {
      // Local edits remain visible even if cloud sync is temporarily unavailable.
      return false;
    }
  };

  const promoteVideoToProduction = async (video) => {
    if (!isVideoSaved(video.videoId)) {
      await toggleScrapVideo(video);
    }
    await markRadarVideoStatus(video.videoId, PRODUCTION_STATUS.CANDIDATE);
  };

  const restoreVideoToRadar = async (videoId) => {
    const existingRecord = videoUserRecords[videoId] || {};
    const keptStatusIds = Array.isArray(existingRecord.statusIds)
      ? existingRecord.statusIds.filter(status => !RADAR_HIDDEN_VIDEO_STATUSES.includes(status))
      : [];

    const record = {
      ...existingRecord,
      videoId,
      status: VIDEO_STATUS.UNSEEN,
      statusIds: [...new Set([...keptStatusIds, VIDEO_STATUS.UNSEEN])],
      updatedAt: new Date().toISOString(),
    };

    setVideoUserRecords(prev => ({
      ...prev,
      [videoId]: record,
    }));

    try {
      await saveVideoUserRecord(record);
      return true;
    } catch {
      return false;
    }
  };

  const clearRadarDecisions = async () => {
    setVideoUserRecords({});
    try {
      await clearVideoUserRecords();
    } catch {
      // Local reset still gives the user a clean radar; cloud can be retried on next change.
    }
  };

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
  const scannableChannelCount = savedChannels.filter(isChannelScannable).length;
  const activeSelectedChannelCount = savedChannels.filter(channel => (
    selectedChannelIds.includes(channel.id) && isChannelScannable(channel)
  )).length;
  const getScannableChannelCount = (category) => (
    savedChannels.filter(channel => channel.tags?.includes(category) && isChannelScannable(channel)).length
  );
  const ttoTtoAssetCount = videos.filter(isTtoTtoCandidate).length;
  const visibleScrapCount = videos.filter(v => isVideoSaved(v.videoId)).length;
  const loadedDecisionCount = videos.filter(video => (
    hasAnyVideoStatus(videoUserRecords[video.videoId], RADAR_HIDDEN_VIDEO_STATUSES)
  )).length;
  const openRadarCandidateCount = Math.max(videos.length - loadedDecisionCount, 0);
  const productionCandidateCount = videos.filter(video => (
    hasAnyVideoStatus(videoUserRecords[video.videoId], [VIDEO_STATUS.PRODUCTION_CANDIDATE, PRODUCTION_STATUS.CANDIDATE])
  )).length;

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
                <HomeRadarSummary
                  savedChannelCount={savedChannels.length}
                  loadedVideoCount={videos.length}
                  savedVideoCount={savedVideos.length}
                  latestScanText={latestScanText}
                  ttoTtoAssetCount={ttoTtoAssetCount}
                  openRadarCandidateCount={openRadarCandidateCount}
                  productionCandidateCount={productionCandidateCount}
                />

                <RadarCandidateStrip
                  videos={videos}
                  savedVideos={savedVideos}
                  videoUserRecords={videoUserRecords}
                  isVideoSaved={isVideoSaved}
                  onToggleScrap={toggleScrapVideo}
                  onMarkVideoStatus={markRadarVideoStatus}
                  onPromoteToProduction={promoteVideoToProduction}
                  onRestoreVideo={restoreVideoToRadar}
                  onClearDecisions={clearRadarDecisions}
                  onOpenVault={() => openCreatorView({ id: 'vault-all' })}
                  onOpenScrapbook={() => openCreatorView({ id: 'studio-scrapbook' })}
                />

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
            <ChannelAddForm
              addMode={addMode}
              setAddMode={setAddMode}
              bulkInput={bulkInput}
              setBulkInput={setBulkInput}
              bulkLoading={bulkLoading}
              bulkResult={bulkResult}
              resetBulkAdd={resetBulkAdd}
              handleBulkAdd={handleBulkAdd}
              categories={categories}
              setCategories={setCategories}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              isEditingCategory={isEditingCategory}
              setIsEditingCategory={setIsEditingCategory}
              renamingCategory={renamingCategory}
              renameValue={renameValue}
              setRenameValue={setRenameValue}
              renameLoading={renameLoading}
              startRenameCategory={startRenameCategory}
              confirmRenameCategory={confirmRenameCategory}
              cancelRenameCategory={cancelRenameCategory}
              newChannelInput={newChannelInput}
              setNewChannelInput={setNewChannelInput}
              newChannelTags={newChannelTags}
              toggleNewChannelTag={toggleNewChannelTag}
              newChannelLang={newChannelLang}
              setNewChannelLang={setNewChannelLang}
              newChannelNote={newChannelNote}
              setNewChannelNote={setNewChannelNote}
              channelPreview={channelPreview}
              previewLoading={previewLoading}
              handlePreviewChannel={handlePreviewChannel}
              cancelChannelPreview={cancelChannelPreview}
              handleSaveChannel={handleSaveChannel}
              loading={loading}
            />

            {/* 카테고리(태그) 폴더 리스트 */}
            <ChannelTagTabs
              categories={categories}
              channels={savedChannels}
              selectedCategory={selectedCategoryTab}
              getScannableChannelCount={getScannableChannelCount}
              scanningTag={scanningTag}
              isScanning={isScanning}
              onSelectCategory={setSelectedCategoryTab}
              onScanTag={handleTagScan}
            />
            
            <hr className="my-4 border-slate-100" />
            
            <ChannelList
              channels={savedChannels}
              selectedCategory={selectedCategoryTab}
              selectedChannelIds={selectedChannelIds}
              channelsLoading={channelsLoading}
              getScanDisplay={getChannelScanDisplay}
              onToggleSelection={toggleChannelSelection}
              onOpenNotes={openNotesModal}
              onUpdateMetadata={updateChannelMetadata}
              updatingChannelId={updatingChannelId}
              onDelete={deleteChannel}
            />

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
                <ReferenceVaultSummary
                  videoCount={videos.length}
                  channelCount={savedChannels.length}
                  scrapCount={savedVideos.length}
                  visibleScrapCount={visibleScrapCount}
                  ttoTtoCount={ttoTtoAssetCount}
                />
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
              <VideoToolbar
                isReferenceVaultView={isReferenceVaultView}
                filteredCount={filteredAndSortedVideos.length}
                totalCount={videos.length}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                viewFilter={viewFilter}
                setViewFilter={setViewFilter}
                lengthFilter={lengthFilter}
                setLengthFilter={setLengthFilter}
                sortType={sortType}
                setSortType={setSortType}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showWorkPanel={showWorkPanel}
                setShowWorkPanel={setShowWorkPanel}
                isScanning={isScanning}
                selectedChannelCount={selectedChannelIds.length}
                activeSelectedChannelCount={activeSelectedChannelCount}
                scannableChannelCount={scannableChannelCount}
                handleManualScan={handleManualScan}
                ttoTtoMode={ttoTtoMode}
                setTtoTtoMode={setTtoTtoMode}
              />

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
                          isProductionCandidate={hasAnyVideoStatus(videoUserRecords[v.videoId], [VIDEO_STATUS.PRODUCTION_CANDIDATE, PRODUCTION_STATUS.CANDIDATE])}
                          showWorkPanel={showWorkPanel}
                          onToggleCheck={toggleCheckVideo}
                          onToggleScrap={toggleScrapVideo}
                          onPromoteToProduction={promoteVideoToProduction}
                          onFetchComments={fetchTopComments}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <VideoListTable
                    videos={filteredAndSortedVideos}
                    checkedVideos={checkedVideos}
                    isVideoSaved={isVideoSaved}
                    isProductionCandidate={(videoId) => hasAnyVideoStatus(videoUserRecords[videoId], [VIDEO_STATUS.PRODUCTION_CANDIDATE, PRODUCTION_STATUS.CANDIDATE])}
                    toggleCheckVideo={toggleCheckVideo}
                    toggleScrapVideo={toggleScrapVideo}
                    promoteVideoToProduction={promoteVideoToProduction}
                    fetchTopComments={fetchTopComments}
                  />
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

              {creatorView === 'studio-candidates' ? (
                <ProductionKanban
                  videos={savedVideos}
                  videoUserRecords={videoUserRecords}
                  onMoveVideo={markRadarVideoStatus}
                  onUpdateVideoRecord={updateVideoUserRecord}
                  onOpenReferenceVault={() => openCreatorView({ id: 'vault-all' })}
                />
              ) : savedVideos.length === 0 ? (
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
