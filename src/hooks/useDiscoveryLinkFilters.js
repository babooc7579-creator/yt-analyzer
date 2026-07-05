import { useMemo, useState } from 'react';

import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
  getDiscoveryLinkHost,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusValue,
} from '../constants/discoveryLinks';
import {
  getDiscoveryLinkStatusAndRightsLine,
  getSearchableDiscoveryLinkText,
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
    links.reduce((counts, link) => {
      const status = getDiscoveryLinkStatusValue(link);
      return {
        ...counts,
        [status]: (counts[status] || 0) + 1,
      };
    }, {})
  ), [links]);

  const rightsCounts = useMemo(() => (
    links.reduce((counts, link) => {
      const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
      return {
        ...counts,
        [rightsStatus]: (counts[rightsStatus] || 0) + 1,
      };
    }, {})
  ), [links]);

  const statusMatchedLinks = useMemo(() => {
    if (statusFilter === ALL_LINK_STATUS_OPTION.value) return links;
    return links.filter((link) => getDiscoveryLinkStatusValue(link) === statusFilter);
  }, [links, statusFilter]);

  const rightsMatchedLinks = useMemo(() => {
    if (rightsFilter === ALL_RIGHTS_STATUS_OPTION.value) return statusMatchedLinks;
    return statusMatchedLinks.filter((link) => (
      getDiscoveryLinkRightsStatusValue(link) === rightsFilter
    ));
  }, [rightsFilter, statusMatchedLinks]);

  const filteredLinks = useMemo(() => {
    if (!normalizedSearchQuery) return rightsMatchedLinks;
    return rightsMatchedLinks.filter((link) => (
      getSearchableDiscoveryLinkText(link).includes(normalizedSearchQuery)
    ));
  }, [normalizedSearchQuery, rightsMatchedLinks]);

  const hasActiveDiscoveryFilters = statusFilter !== ALL_LINK_STATUS_OPTION.value
    || rightsFilter !== ALL_RIGHTS_STATUS_OPTION.value
    || Boolean(normalizedSearchQuery);

  const filteredDiscoveryLinkUrlList = useMemo(() => (
    formatNumberedUrlList(
      filteredLinks.map((link) => {
        const title = link.title || getDiscoveryLinkHost(link.url);

        return link.url ? [
          title,
          link.url,
          getDiscoveryLinkStatusAndRightsLine(link),
        ] : null;
      })
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
