import { useMemo, useState } from 'react';

import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
} from '../constants/discoveryLinks';
import { getDiscoveryLinkFilterModel } from '../utils/discoveryLinkFilters';

const ALL_LINK_STATUS_OPTION = ALL_DISCOVERY_LINK_STATUS_OPTION;
const ALL_RIGHTS_STATUS_OPTION = ALL_DISCOVERY_RIGHTS_STATUS_OPTION;

export function useDiscoveryLinkFilters(links) {
  const [statusFilter, setStatusFilter] = useState(ALL_LINK_STATUS_OPTION.value);
  const [rightsFilter, setRightsFilter] = useState(ALL_RIGHTS_STATUS_OPTION.value);
  const [searchQuery, setSearchQuery] = useState('');
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
  }), [links, rightsFilter, searchQuery, statusFilter]);

  const clearDiscoveryFilters = () => {
    setStatusFilter(ALL_LINK_STATUS_OPTION.value);
    setRightsFilter(ALL_RIGHTS_STATUS_OPTION.value);
    setSearchQuery('');
  };

  return {
    clearDiscoveryFilters,
    filteredDiscoveryLinkUrlList,
    filteredLinks,
    hasActiveDiscoveryFilters,
    rightsFilter,
    rightsFilterOptions,
    searchQuery,
    setRightsFilter,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
    statusFilterOptions,
  };
}
