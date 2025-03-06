import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// const fetchTeamSeasonStatsData = async (teamId: string, tournamentId: string, seasonId: string) => {
//   if (!teamId || !tournamentId || !seasonId) return {};

//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${getAPIDetectedIP()}/team/${teamId}/unique-tournament/${tournamentId}/season/${seasonId}/statistics/overall`,
//     headers: { }
//   };

//   return await axios.request(config)
//   .then((response) => {
//     return response.data.data || {};
//   })

// }

// const useTeamSeasonStatsData = (teamId: string, tournamentId: string, seasonId: string) => {
//   return useQuery({
//     queryKey: ['football', 'team', 'season-stats', teamId, tournamentId, seasonId],
//     queryFn: () => fetchTeamSeasonStatsData(teamId, tournamentId, seasonId),
//     cacheTime: 6000000,
//     staleTime: 600000,
//     refetchOnWindowFocus: false,
//     retry: false,
//   })
// }

// const fetchTeamSeasonStandingsData = async (tournamentId: string, seasonId: string, type: string) => {
//   if (!tournamentId || !seasonId || !type) return {};

//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${getAPIDetectedIP()}/competition/${tournamentId}/season/${seasonId}/standings/${type}`,
//     headers: { }
//   };

//   return await axios.request(config)
//   .then((response) => {
//     return response.data.data || {};
//   })

// }

// const useTeamSeasonStandingsData = (tournamentId: string, seasonId: string, type: string) => {
//   return useQuery({
//     queryKey: ['football', 'team', 'season-standings', tournamentId, seasonId, type],
//     queryFn: () => fetchTeamSeasonStandingsData(tournamentId, seasonId, type),
//     cacheTime: 6000000,
//     staleTime: 600000,
//     refetchOnWindowFocus: false,
//     retry: false,
//   })
// }

const fetchPlayerEventsData = async (
  playerId: string,
  type = 'last',
  page = 0
) => {
  if (!playerId) return {};

  if ((type === 'last' && page > 0) || (type === 'next' && page < 0)) {
    return {};
  }

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/events/${type}/${Math.abs(
      page
    )}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerEventsData = (playerId: string, type = 'last', page = 0) => {
  return useQuery({
    queryKey: ['football', 'player', 'events', playerId, type, page],
    queryFn: () => fetchPlayerEventsData(playerId, type, page),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerNationalStatsData = async (playerId: string) => {
  if (!playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/national-team-statistics`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.statistics || [];
  });
};

const usePlayerNationalStatsData = (playerId: string) => {
  return useQuery({
    queryKey: ['football', 'player', 'national-stats', playerId],
    queryFn: () => fetchPlayerNationalStatsData(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerStatsSeasonsData = async (playerId: string) => {
  if (!playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/statistics/seasons`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerStatsSeasonsData = (playerId: string) => {
  return useQuery({
    queryKey: ['football', 'player', 'stats-seasons', playerId],
    queryFn: () => fetchPlayerStatsSeasonsData(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerStatsOverallData = async (
  playerId: string,
  uniqueTournamentId: string,
  seasonId: string
) => {
  if (!playerId || !uniqueTournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/unique-tournament/${uniqueTournamentId}/season/${seasonId}/statistics/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerStatsOverallData = (
  playerId: string,
  uniqueTournamentId: string,
  seasonId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'player',
      'stats-overall',
      playerId,
      uniqueTournamentId,
      seasonId,
    ],
    queryFn: () =>
      fetchPlayerStatsOverallData(playerId, uniqueTournamentId, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerLastRatingsData = async (
  playerId: string,
  uniqueTournamentId: string,
  seasonId: string
) => {
  if (!playerId || !uniqueTournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/unique-tournament/${uniqueTournamentId}/season/${seasonId}/last-ratings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerLastRatingsData = (
  playerId: string,
  uniqueTournamentId: string,
  seasonId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'player',
      'last-ratings',
      playerId,
      uniqueTournamentId,
      seasonId,
    ],
    queryFn: () =>
      fetchPlayerLastRatingsData(playerId, uniqueTournamentId, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerLastYearSummaryData = async (playerId: string) => {
  if (!playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/last-year-summary`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerLastYearSummaryData = (playerId: string) => {
  return useQuery({
    queryKey: ['football', 'player', 'last-year-summary', playerId],
    queryFn: () => fetchPlayerLastYearSummaryData(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchManagerEventsData = async (
  managerId: string,
  type = 'last',
  page = 0
) => {
  if (!managerId) return {};

  if ((type === 'last' && page > 0) || (type === 'next' && page < 0)) {
    return {};
  }

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/manager/${managerId}/events/${type}/${Math.abs(
      page
    )}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useManagerEventsData = (managerId: string, type = 'last', page = 0) => {
  return useQuery({
    queryKey: ['football', 'manager', 'events', managerId, type, page],
    queryFn: () => fetchManagerEventsData(managerId, type, page),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchRefereeEventsData = async (
  managerId: string,
  type = 'last',
  page = 0
) => {
  if (!managerId) return {};

  if ((type === 'last' && page > 0) || (type === 'next' && page < 0)) {
    return {};
  }

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/referee/${managerId}/events/${type}/${Math.abs(
      page
    )}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useRefereeEventsData = (managerId: string, type = 'last', page = 0) => {
  return useQuery({
    queryKey: ['football', 'manager', 'events', managerId, type, page],
    queryFn: () => fetchRefereeEventsData(managerId, type, page),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerHeatmapData = async (
  sportEventId: string,
  playerId: string
) => {
  if (!sportEventId || !playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${sportEventId}/player/${playerId}/heatmap`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerHeatmapData = (sportEventId: string, playerId: string) => {
  return useQuery({
    queryKey: ['football', 'player', 'match-heatmap', sportEventId, playerId],
    queryFn: () => fetchPlayerHeatmapData(sportEventId, playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerSeasonHeatmapData = async (
  uniqueTournamentId: string,
  seasonId: string,
  playerId: string
) => {
  if (!uniqueTournamentId || !seasonId || !playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/unique-tournament/${uniqueTournamentId}/season/${seasonId}/heatmap/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerSeasonHeatmapData = (
  uniqueTournamentId: string,
  seasonId: string,
  playerId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'player',
      'season-heatmap',
      uniqueTournamentId,
      seasonId,
      playerId,
    ],
    queryFn: () =>
      fetchPlayerSeasonHeatmapData(uniqueTournamentId, seasonId, playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerAttributeOverviewData = async (playerId: string) => {
  if (!playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/attribute-overviews`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerAttributeOverviewData = (playerId: string) => {
  return useQuery({
    queryKey: ['football', 'player', 'attribute-overviews', playerId],
    queryFn: () => fetchPlayerAttributeOverviewData(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchSearchPlayerData = async (term: string) => {
  if (!term) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/search/players/${term}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSearchPlayerData = (term: string) => {
  return useQuery({
    queryKey: ['football', 'search', 'players', term],
    queryFn: () => fetchSearchPlayerData(term),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerCharacteristicsData = async (playerId: string) => {
  if (!playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/characteristics`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerCharacteristicsData = (playerId: string) => {
  return useQuery({
    queryKey: ['football', 'player', 'characteristics', playerId],
    queryFn: () => fetchPlayerCharacteristicsData(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchTeamPlayerData = async (teamId: string) => {
  if (!teamId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/players`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamPlayerDataClub = (teamId: string) => {
  return useQuery({
    queryKey: ['football', 'search', 'players', teamId],
    queryFn: () => fetchTeamPlayerData(teamId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

export {
  useManagerEventsData,
  usePlayerAttributeOverviewData,
  usePlayerCharacteristicsData,
  usePlayerEventsData,
  usePlayerHeatmapData,
  usePlayerLastRatingsData,
  usePlayerLastYearSummaryData,
  usePlayerNationalStatsData,
  usePlayerSeasonHeatmapData,
  usePlayerStatsOverallData,
  usePlayerStatsSeasonsData,
  useRefereeEventsData,
  useSearchPlayerData,
  useTeamPlayerDataClub,
};
