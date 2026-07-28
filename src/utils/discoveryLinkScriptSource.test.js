import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  getDiscoveryLinkIdFromScriptSourceId,
  getDiscoveryLinkScriptSaveUpdates,
  getDiscoveryLinkScriptSource,
  getDiscoveryLinkScriptSources,
  getScriptSourceRecordMap,
  isDiscoveryLinkScriptSourceId,
} from './discoveryLinkScriptSource';

describe('discoveryLinkScriptSource utils', () => {
  const candidateLink = {
    id: 'default:link-1',
    platform: 'web',
    status: 'candidate',
    title: '발견한 소재',
    url: 'https://example.com/article',
  };

  it('maps only candidate links into script source items', () => {
    const sources = getDiscoveryLinkScriptSources([
      candidateLink,
      { ...candidateLink, id: 'link-2', status: 'inbox' },
    ]);

    expect(sources).toEqual([{
      channelTitle: 'Web · example.com',
      discoveryLinkId: 'default:link-1',
      sourceType: 'discovery_link',
      sourceUrl: 'https://example.com/article',
      title: '발견한 소재',
      videoId: 'discovery-link:default:link-1',
    }]);
    expect(getDiscoveryLinkScriptSource({})).toBeNull();
  });

  it('keeps a stable reversible source id', () => {
    const sourceId = getDiscoveryLinkScriptSource(candidateLink).videoId;

    expect(isDiscoveryLinkScriptSourceId(sourceId)).toBe(true);
    expect(getDiscoveryLinkIdFromScriptSourceId(sourceId)).toBe('default:link-1');
    expect(isDiscoveryLinkScriptSourceId('youtube-video')).toBe(false);
  });

  it('shows an unsaved link candidate as a script candidate without mutating video records', () => {
    const originalRecords = {
      'video-1': { status: PRODUCTION_STATUS.ACTIVE },
    };
    const records = getScriptSourceRecordMap({
      discoveryLinks: [candidateLink],
      videoUserRecords: originalRecords,
    });

    expect(records['video-1']).toEqual(originalRecords['video-1']);
    expect(records['discovery-link:default:link-1']).toMatchObject({
      status: PRODUCTION_STATUS.CANDIDATE,
      statusIds: [PRODUCTION_STATUS.CANDIDATE],
    });
    expect(originalRecords['discovery-link:default:link-1']).toBeUndefined();
  });

  it('adds the production candidate status only on the first link-script save', () => {
    const sourceId = 'discovery-link:default:link-1';

    expect(getDiscoveryLinkScriptSaveUpdates({
      sourceId,
      updates: { scriptBody: '초안' },
      videoUserRecords: {},
    })).toEqual({
      scriptBody: '초안',
      status: PRODUCTION_STATUS.CANDIDATE,
      statusIds: [PRODUCTION_STATUS.CANDIDATE],
    });

    expect(getDiscoveryLinkScriptSaveUpdates({
      sourceId,
      updates: { scriptBody: '수정본' },
      videoUserRecords: {
        [sourceId]: { status: PRODUCTION_STATUS.ACTIVE },
      },
    })).toEqual({ scriptBody: '수정본' });
  });
});
