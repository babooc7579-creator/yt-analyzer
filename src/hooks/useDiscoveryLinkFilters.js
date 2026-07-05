import { useMemo, useState } from 'react';

import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
} from '../constants/discoveryLinks';
import {
  countDiscoveryLinksByRightsStatus,
  countDiscoveryLinksByStatus,
  filterDiscoveryLinksByRightsStatus,
  filterDiscoveryLinksBySearchQuery,
  filterDiscoveryLinksByStatus,
  getDiscoveryLinkUrlListItems,
} from '../utils/discoveryLinks';
import { formatNumberedUrlList } from '../utils/urls';

const LINK_STATUS_OPTIONS = DISCOVERY_LINK_STATUS_OPTIONS;
const ALL_LINK_STATUS_OPTION = ALL_DISCOVERY_LINK_STATUS_OPTION;
const RIGHTS_STATUS_OPTIONS = DISCOVERY_RIGHTS_STATUS_OPTIONS;
const ALL_RIGHTS_STATUS_OPTION = ALL_DISCOVERY_RIGHTS_STATUS_OPTION;

export function useDiscoveryLinkFilters(links) {
  const [statusFilter, setStatusFilter] = useState(ALL_LINK_STATUS_OPTION.value);
  const [rightsFilter, setRightsFilter] = useState(ALL_RIGHTS_STATUS_OPTION.value);
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const statusCounts = useMemo(() => (
    countDiscoveryLinksByStatus(links)
  ), [links]);

  const rightsCounts = useMemo(() => (
    countDiscoveryLinksByRightsStatus(links)
  ), [links]);

  const statusMatchedLinks = useMemo(() => (
    filterDiscoveryLinksByStatus(links, statusFilter, ALL_LINK_STATUS_OPTION.value)
  ), [links, statusFilter]);

  const rightsMatchedLinks = useMemo(() => (
    filterDiscoveryLinksByRightsStatus(statusMatchedLinks, rightsFilter, ALL_RIGHTS_STATUS_OPTION.value)
  ), [rightsFilter, statusMatchedLinks]);

  const filteredLinks = useMemo(() => (
    filterDiscoveryLinksBySearchQuery(rightsMatchedLinks, normalizedSearchQuery)
  ), [normalizedSearchQuery, rightsMatchedLinks]);

  const hasActiveDiscoveryFilters = statusFilter !== ALL_LINK_STATUS_OPTION.value
    || rightsFilter !== ALL_RIGHTS_STATUS_OPTION.value
    || Boolean(normalizedSearchQuery);

  const filteredDiscoveryLinkUrlList = useMemo(() => (
    formatNumberedUrlList(
      getDiscoveryLinkUrlListItems(filteredLinks)
    )
  ), [filteredLinks]);

  const statusFilterOptions = useMemo(() => ([
    { ...ALL_LINK_STATUS_OPTION, count: links.length },
    ...LINK_STATUS_OPTIONS.map((option) => ({
      ...option,
      count: statusCounts[option.value] || 0,
    })),
  ]), [links.length, statusCounts]);

  const rightsFilterOptions = useMemo(() => ([
    { ...ALL_RIGHTS_STATUS_OPTION, count: links.length },
    ...RIGHTS_STATUS_OPTIONS.map((option) => ({
      ...option,
      count: rightsCounts[option.value] || 0,
    })),
  ]), [links.length, rightsCounts]);

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
