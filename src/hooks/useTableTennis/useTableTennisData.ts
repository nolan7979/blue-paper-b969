// import { CupTreeDto, SportEventDto, SportEventDtoWithStat, StageDto, TeamDto, TournamentDto, TournamentInfoDto } from '@/constant/interface';
// import { isMatchNotStarted } from '@/utils';
import { CupTreeDto, SportEventDto, SportEventDtoWithStat, StandingSeasonDto } from '@/constant/interface';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchMatchStats = async (
  selectedMatchId: string,
  i18n: string
) => {
  if (!selectedMatchId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/event/${selectedMatchId}/statistics`, // TODO use selectedMatchId
    headers: {
      'x-custom-lang': i18n,
    },
  };
  // table-tennis/event/:sport_event_id/statistics
  const statistics = await axios
    .request(config)
    .then((response) => {
      return response.data.data.statistics;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return statistics || [];
};
//
const useMatchStatsData = (
  sportEventId: string,
  i18n?: string
) => {
  return useQuery({
    queryKey: ['table-tennis', 'matches', 'statistics', sportEventId],
    queryFn: () => fetchMatchStats(sportEventId, i18n ?? ''),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    // refetchInterval: 30000,
  });
};

const fetchListMatchPlayer = async (
  playerId: string
): Promise<SportEventDtoWithStat[]> => {
  if (!playerId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/player/${playerId}/events/last/0`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.events || [];
  });
};

const useListMatchPlayerData = (playerId: string) => {
  return useQuery({
    queryKey: ['table-tennis', 'list-match', 'player', playerId],
    queryFn: () => fetchListMatchPlayer(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchCupTree = async (seasonId: string): Promise<CupTreeDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/season/${seasonId}/cuptrees/structured`,
    headers: {},
  };
  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.cupTrees || [];
    })
    .catch(() => {
      return [];
    });

  return data;
};

const useCupTree = (seasonId: string) => {
  return useQuery({
    queryKey: ['table-tennis', 'cup-tree', seasonId],
    queryFn: () => fetchCupTree(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchFeatureMatch = async (
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/unique-tournament/${tournamentId}/featured-events`,
    headers: {},
  };
  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data || {};
    })
    .catch(() => {
      return {};
    });

  return data;
};

const useFeaturedMatch = (seasonId: string) => {
  return useQuery({
    queryKey: ['table-tennis', 'featured-match', seasonId],
    queryFn: () => fetchFeatureMatch(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchLeague = async (
  leagueId: string,
  type: string
): Promise<CupTreeDto[]> => {
  if (!leagueId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/unique-tournament/season/${leagueId}/events/${type}`,
    headers: {},
  };
  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events || [];
    })
    .catch(() => {
      return [];
    });

  return data;
};

const useMatchLeague = (leagueId: string, type: string) => {
  return useQuery({
    queryKey: ['table-tennis', 'match-league', leagueId, type],
    queryFn: () => fetchMatchLeague(leagueId, type),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchSeasonStanding = async (
  seasonId: string
): Promise<StandingSeasonDto> => {
  if (!seasonId) return {} as StandingSeasonDto;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/unique-tournament/season/${seasonId}/standings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSeasonStandingData = (seasonId: string) => {
  return useQuery({
    queryKey: ['table-tennis', 'standing', 'season', seasonId],
    queryFn: () => fetchSeasonStanding(seasonId),
    cacheTime: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId,
  });
};

const fetchFeaturedMatchPlayer = async (
  playerId: string
): Promise<SportEventDtoWithStat> => {
  if (!playerId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/player/${playerId}/featured-events`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useFeatureMatchPlayerData = (playerId: string) => {
  return useQuery({
    queryKey: ['table-tennis', 'player', 'feature-match', playerId],
    queryFn: () => fetchFeaturedMatchPlayer(playerId),
    cacheTime: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!playerId,
  });
};

const fetchListMatchByStageTeam = async (
  seasonId: string,
  stageId?: string
): Promise<SportEventDto[]> => {
  if (!seasonId) return [];

  const page = !stageId ? 0 : '';

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/table-tennis/unique-tournament/season/${seasonId}/events/last/page=${page}`,
    headers: {},
  };

  return await axios
    .request(config)
    .then((response) => {
      // Handle the response structure you provided.
      const events = response?.data?.data?.events || [];
      return events; // Return only the events array
    })
    .catch((_error) => {
      console.error(_error);
      return []; // In case of error, return an empty array
    });
};


const useListMatchByStageTeamData = (
  seasonId: string,
  stageId?: string
) => {
  return useQuery({
    queryKey: [
      'tennis',
      'listMatch',
      'stages',
      seasonId,
      stageId,
    ],
    queryFn: () => fetchListMatchByStageTeam(seasonId, stageId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};


export {
  useMatchStatsData,
  useListMatchPlayerData,
  useCupTree,
  useFeaturedMatch,
  useMatchLeague,
  useSeasonStandingData,
  useFeatureMatchPlayerData,
  useListMatchByStageTeamData
};
