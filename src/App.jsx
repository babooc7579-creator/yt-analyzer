import React, { useState, useEffect, useMemo } from 'react';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from './services/storage';
import { clearVideoUserRecords, createChannel, createChannelNote, createChannelsBulk, deleteScrapbookVideo, fetchChannelPreview, fetchChannels, fetchScrapbook, fetchStoredVideosByChannelIds, fetchVideoUserRecords, removeChannel, renameTag, saveScrapbookVideos, saveVideoUserRecord, scanChannels, scanSelectedChannels as scanSelectedChannelsRequest, updateChannel } from './services/functionApi';
import { fetchTopComments as fetchTopCommentsFromYoutube } from './services/youtubeApi';
import { filterAndSortVideos, isTtoTtoCandidate, mapCloudVideoToViewModel } from './utils/video';
import { formatRelativeTime, getChannelScanDisplay } from './utils/channelScanDisplay';
import { getDaysDiff } from './utils/dates';
import { buildAIRemakePrompt } from './utils/prompts';
import { DEFAULT_CATEGORIES } from './constants/categories';
import { CHANNEL_CREATOR_VIEWS, READY_CREATOR_VIEWS, REFERENCE_VAULT_VIEWS, SCRAPBOOK_CREATOR_VIEWS, getCreatorOsItem } from './constants/creatorOs';
import { CHANNEL_STATUS, PRODUCTION_STATUS, RADAR_HIDDEN_VIDEO_STATUSES, VIDEO_STATUS, hasAnyVideoStatus, isChannelScannable, withRecordStatus } from './constants/status';
import ChannelNotesModal from './components/ChannelNotesModal';
import ComingSoonView from './components/ComingSoonView';
import CreatorSidebar from './components/CreatorSidebar';
import CreatorWorkspaceHeader from './components/CreatorWorkspaceHeader';
import HiddenLegacyAside from './components/HiddenLegacyAside';
import HomeActionShortcuts from './components/HomeActionShortcuts';
import HomeOperatingGuidelines from './components/HomeOperatingGuidelines';
import LegacyChannelPanel from './components/LegacyChannelPanel';
import HomeRadarSummary from './components/HomeRadarSummary';
import RadarCandidateStrip from './components/RadarCandidateStrip';
import ScrapbookWorkspace from './components/ScrapbookWorkspace';
import TopCommentsModal from './components/TopCommentsModal';
import VideoDashboardControls from './components/VideoDashboardControls';
import VideoResultsPanel from './components/VideoResultsPanel';
import WorkspaceTabs from './components/WorkspaceTabs';

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
    const prompt = buildAIRemakePrompt(targetVideos);

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const activeCreatorItem = getCreatorOsItem(creatorView);
  const isHomeView = creatorView === 'home';
  const isComingSoonView = activeCreatorItem?.status === 'soon';
  const isLegacyWorkspaceView = READY_CREATOR_VIEWS.includes(creatorView);
  const isReferenceVaultView = REFERENCE_VAULT_VIEWS.includes(creatorView);
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

    if (CHANNEL_CREATOR_VIEWS.includes(item.id)) {
      setActiveTab('dashboard');
      setShowWorkPanel(true);
      return;
    }

    if (SCRAPBOOK_CREATOR_VIEWS.includes(item.id)) {
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
      
      <TopCommentsModal
        modal={commentModal}
        onClose={() => setCommentModal({ isOpen: false, videoTitle: '', comments: [], loading: false })}
      />

      <ChannelNotesModal
        modal={notesModal}
        onChangeText={(value) => setNotesModal(prev => ({ ...prev, newNoteText: value }))}
        onAddNote={addChannelNote}
        onClose={() => setNotesModal({ isOpen: false, channel: null, newNoteText: '', saving: false })}
      />

      <div className="mx-auto flex w-full max-w-[2600px] flex-col gap-4 xl:flex-row">
        <CreatorSidebar
          activeView={creatorView}
          onOpenView={openCreatorView}
        />

        <div className="min-w-0 flex-1 space-y-4">
          <CreatorWorkspaceHeader
            item={activeCreatorItem}
            channelCount={savedChannels.length}
            videoCount={videos.length}
            selectedChannelCount={selectedChannelIds.length}
            savedVideoCount={savedVideos.length}
          />

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

                <HomeActionShortcuts
                  onOpenAddChannel={() => openCreatorView({ id: 'ops-add-channel' })}
                  onOpenSelectedScan={() => openCreatorView({ id: 'ops-selected-scan' })}
                  onOpenVault={() => openCreatorView({ id: 'vault-all' })}
                />
              </section>

              <HomeOperatingGuidelines />
            </div>
          ) : isComingSoonView ? (
            <ComingSoonView item={activeCreatorItem} />
          ) : isLegacyWorkspaceView ? (
      <div className={`w-full mx-auto grid grid-cols-1 gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${showWorkPanel ? 'max-w-[2400px] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]' : 'max-w-[2400px]'}`}>
        
        <LegacyChannelPanel
          addMode={addMode}
          apiKey={apiKey}
          bulkInput={bulkInput}
          bulkLoading={bulkLoading}
          bulkResult={bulkResult}
          cancelChannelPreview={cancelChannelPreview}
          cancelRenameCategory={cancelRenameCategory}
          categories={categories}
          channelPreview={channelPreview}
          channelsLoading={channelsLoading}
          confirmRenameCategory={confirmRenameCategory}
          error={error}
          getChannelScanDisplay={getChannelScanDisplay}
          getScannableChannelCount={getScannableChannelCount}
          handleBulkAdd={handleBulkAdd}
          handlePreviewChannel={handlePreviewChannel}
          handleSaveChannel={handleSaveChannel}
          handleTagScan={handleTagScan}
          isEditingCategory={isEditingCategory}
          isScanning={isScanning}
          loading={loading}
          newCategoryName={newCategoryName}
          newChannelInput={newChannelInput}
          newChannelLang={newChannelLang}
          newChannelNote={newChannelNote}
          newChannelTags={newChannelTags}
          onChangeApiKey={setApiKey}
          onDeleteChannel={deleteChannel}
          onLoadStoredVideos={fetchSelectedChannels}
          onOpenNotes={openNotesModal}
          onToggleChannelSelection={toggleChannelSelection}
          onUpdateChannelMetadata={updateChannelMetadata}
          previewLoading={previewLoading}
          progressMsg={progressMsg}
          renameLoading={renameLoading}
          renameValue={renameValue}
          renamingCategory={renamingCategory}
          resetBulkAdd={resetBulkAdd}
          savedChannels={savedChannels}
          scanningTag={scanningTag}
          selectedCategoryTab={selectedCategoryTab}
          selectedChannelIds={selectedChannelIds}
          setAddMode={setAddMode}
          setBulkInput={setBulkInput}
          setCategories={setCategories}
          setIsEditingCategory={setIsEditingCategory}
          setNewCategoryName={setNewCategoryName}
          setNewChannelInput={setNewChannelInput}
          setNewChannelLang={setNewChannelLang}
          setNewChannelNote={setNewChannelNote}
          setRenameValue={setRenameValue}
          setSelectedCategoryTab={setSelectedCategoryTab}
          showWorkPanel={showWorkPanel}
          startRenameCategory={startRenameCategory}
          toggleNewChannelTag={toggleNewChannelTag}
          updatingChannelId={updatingChannelId}
        />

        {/* ================= 우측: 메인 뷰어 ================= */}
        <div className="flex flex-col h-full space-y-4 min-w-0">
          
          {/* 탭 네비게이션 */}
          <WorkspaceTabs
            activeTab={activeTab}
            savedVideoCount={savedVideos.length}
            onSelectTab={setActiveTab}
          />

          {activeTab === 'dashboard' ? (
            <>
              <VideoDashboardControls
                activeSelectedChannelCount={activeSelectedChannelCount}
                checkedVideos={checkedVideos}
                copiedPrompt={copiedPrompt}
                filteredCount={filteredAndSortedVideos.length}
                isReferenceVaultView={isReferenceVaultView}
                isScanning={isScanning}
                lengthFilter={lengthFilter}
                onCopyPrompt={() => copyAI_RemakePrompt(videos.filter(v => checkedVideos.includes(v.videoId)))}
                onManualScan={handleManualScan}
                savedChannelCount={savedChannels.length}
                savedVideoCount={savedVideos.length}
                scannableChannelCount={scannableChannelCount}
                searchKeyword={searchKeyword}
                selectedChannelCount={selectedChannelIds.length}
                setLengthFilter={setLengthFilter}
                setSearchKeyword={setSearchKeyword}
                setShowWorkPanel={setShowWorkPanel}
                setSortType={setSortType}
                setTtoTtoMode={setTtoTtoMode}
                setViewFilter={setViewFilter}
                setViewMode={setViewMode}
                showWorkPanel={showWorkPanel}
                sortType={sortType}
                totalVideoCount={videos.length}
                ttoTtoAssetCount={ttoTtoAssetCount}
                ttoTtoMode={ttoTtoMode}
                viewFilter={viewFilter}
                viewMode={viewMode}
                visibleScrapCount={visibleScrapCount}
              />

              {/* 컨트롤 바 */}
              {/* 데이터 테이블 */}
              <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 overflow-hidden flex-1 relative flex flex-col min-h-[600px]">
                <p className="px-4 pt-3 text-[10px] text-slate-500">댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다. 저장된 영상 불러오기와는 별도 기능입니다.</p>
                <VideoResultsPanel
                  checkedVideos={checkedVideos}
                  filteredVideos={filteredAndSortedVideos}
                  isProductionCandidate={(videoId) => hasAnyVideoStatus(videoUserRecords[videoId], [VIDEO_STATUS.PRODUCTION_CANDIDATE, PRODUCTION_STATUS.CANDIDATE])}
                  isVideoSaved={isVideoSaved}
                  onFetchComments={fetchTopComments}
                  onPromoteToProduction={promoteVideoToProduction}
                  onToggleCheck={toggleCheckVideo}
                  onToggleScrap={toggleScrapVideo}
                  showWorkPanel={showWorkPanel}
                  videos={videos}
                  viewMode={viewMode}
                />
              </div>
            </>
          ) : (
            <ScrapbookWorkspace
              creatorView={creatorView}
              savedVideos={savedVideos}
              videoUserRecords={videoUserRecords}
              onCopyPrompt={() => copyAI_RemakePrompt(savedVideos)}
              onFetchComments={fetchTopComments}
              onMoveVideo={markRadarVideoStatus}
              onOpenReferenceVault={() => openCreatorView({ id: 'vault-all' })}
              onRemoveScrap={toggleScrapVideo}
              onUpdateVideoRecord={updateVideoUserRecord}
            />
          )}

        </div>

        <HiddenLegacyAside
          checkedVideoCount={checkedVideos.length}
          savedVideoCount={savedVideos.length}
          selectedChannelCount={selectedChannelIds.length}
          videoCount={videos.length}
        />
      </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
