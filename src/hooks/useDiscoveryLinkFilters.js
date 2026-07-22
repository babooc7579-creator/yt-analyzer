import { useMemo, useState } from 'react';

import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
} from '../constants/discoveryLinks';
import {
  getDiscoveryLinkFilterModel,
  getDiscoveryLinksRouteContext,
} from '../utils/discoveryLinkFilters';

const ALL_LINK_STATUS_OPTION = ALL_DISCOVERY_LINK_STATUS_OPTION;
const ALL_RIGHTS_STATUS_OPTION = ALL_DISCOVERY_RIGHTS_STATUS_OPTION;

export function useDiscoveryLinkFilters(links, {
  initialSearchQuery = '',
  initialSearchSource = '',
  initialTargetDiscoveryLinkId = '',
} = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL_LINK_STATUS_OPTION.value);
  const [rightsFilter, setRightsFilter] = useState(ALL_RIGHTS_STATUS_OPTION.value);
  const [searchQuery, setSearchQuery] = useState(() => String(initialSearchQuery || '').trim());
  const [targetDiscoveryLinkId, setTargetDiscoveryLinkId] = useState(() => String(initialTargetDiscoveryLinkId || '').trim());
  const {
    filteredDiscoveryLinkUrlList,
    filteredLinks,
    hasActiveDiscoveryFilters,
    rightsFilterOptions,
    statusFilterOptions,
  } = useMemo(() => getDiscoveryLinkFilterModel({
    links,
    rightsFilter,
    searchQuery,
    statusFilter,
    targetDiscoveryLinkId,
  }), [links, rightsFilter, searchQuery, statusFilter, targetDiscoveryLinkId]);
  const routeContext = useMemo(() => getDiscoveryLinksRouteContext({
    searchQuery,
    source: initialSearchSource,
    targetDiscoveryLinkId,
  }), [initialSearchSource, searchQuery, targetDiscoveryLinkId]);

  const changeSearchQuery = (value) => {
    setTargetDiscoveryLinkId('');
    setSearchQuery(value);
  };

  const changeRightsFilter = (value) => {
    setTargetDiscoveryLinkId('');
    setRightsFilter(value);
  };

  const changeStatusFilter = (value) => {
    setTargetDiscoveryLinkId('');
    setStatusFilter(value);
  };

  const clearDiscoveryFilters = () => {
    setStatusFilter(ALL_LINK_STATUS_OPTION.value);
    setRightsFilter(ALL_RIGHTS_STATUS_OPTION.value);
    setSearchQuery('');
    setTargetDiscoveryLinkId('');
  };

  return {
    clearDiscoveryFilters,
    filteredDiscoveryLinkUrlList,
    filteredLinks,
    hasActiveDiscoveryFilters,
    rightsFilter,
    rightsFilterOptions,
    routeContext,
    searchQuery,
    setRightsFilter: changeRightsFilter,
    setSearchQuery: changeSearchQuery,
    setStatusFilter: changeStatusFilter,
    statusFilter,
    statusFilterOptions,
    targetDiscoveryLinkId,
  };
}
