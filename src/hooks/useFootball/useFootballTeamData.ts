import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTeamSeasonStatsData = async (
  teamId: string,
  tournamentId: string,
  seasonId: string
) => {
  if (!teamId || !tournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/unique-tournament/${tournamentId}/season/${seasonId}/statistics/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamSeasonStatsData = (
  teamId: string,
  tournamentId: string,
  seasonId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'team',
      'season-stats',
      teamId,
      tournamentId,
      seasonId,
    ],
    queryFn: () => fetchTeamSeasonStatsData(teamId, tournamentId, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchTeamSeasonStandingsData = async (
  tournamentId: string,
  seasonId: string,
  type: string
) => {
  if (!tournamentId || !seasonId || !type) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/competition/${tournamentId}/season/${seasonId}/standings/${type}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamSeasonStandingsData = (
  tournamentId: string,
  seasonId: string,
  type: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'team',
      'season-standings',
      tournamentId,
      seasonId,
      type,
    ],
    queryFn: () => fetchTeamSeasonStandingsData(tournamentId, seasonId, type),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchTeamRecentPerformanceData = async (teamId: string) => {
  if (!teamId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/performance`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamRecentPerformanceData = (teamId: string) => {
  return useQuery({
    queryKey: ['football', 'team', 'recent-performance', teamId],
    queryFn: () => fetchTeamRecentPerformanceData(teamId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

export {
  useTeamRecentPerformanceData,
  useTeamSeasonStandingsData,
  useTeamSeasonStatsData,
};
