import { SPORT } from '@/constant/common';
import {
  CupTreeDto,
  RankingDto,
  SportEventDto,
  SportEventDtoWithStat,
  StageDto,
  StandingSeasonDto,
  StatsTeamType,
  TeamDto,
} from '@/constant/interface';
import { isMatchNotStarted } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBasketballCategoryData = async ({
  sport = SPORT.BASKETBALL,
}: {
  sport?: string;
}) => {
  try {
    const { data } = await axios.get(
      `${getAPIDetectedIP()}/sport/${sport}/categories`
    );
    return data.data.categories || [];
  } catch (error) {
    console.error('Error fetching basketball category data:', error);
    return [];
  }
};

const useBkbCategoryData = (sport?: string) => {
  return useQuery({
    queryKey: ['basketball', 'categories'],
    queryFn: () => fetchBasketballCategoryData({ sport }),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchBkbDailySummaryData = async (dataDate?: string) => {
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/basketball/scheduled-events/${dataDate}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.events;
    })
    .catch((error) => {
      //console.log(error);
    });

  return data || [];
};

const useBkbDailySummaryData = (dataDate?: string) => {
  return useQuery({
    queryKey: ['basketball', 'matches', dataDate],
    queryFn: () => fetchBkbDailySummaryData(dataDate),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchBkbLiveMatches = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/basketball/events/live`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.events;
    })
    .catch((error) => {
      //console.log(error);
    });

  return data || [];
};

const useBkbLiveMatchData = () => {
  return useQuery({
    queryKey: ['basketball', 'matches', 'live'],
    queryFn: () => fetchBkbLiveMatches(),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

const fetchMoreBkbMatches = async (dataDate?: string) => {
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/basketball/scheduled-events/${dataDate}/inverse`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.events;
    })
    .catch((error) => {
      //console.log(error);
    });

  return data || [];
};

const useMoreBkbMatchData = (dataDate?: string) => {
  return useQuery({
    queryKey: ['basketball', 'matches', dataDate, 'more'],
    queryFn: () => fetchMoreBkbMatches(dataDate),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchTeamStreaksData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  time: number,
  i18n: string
) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${selectedMatchId}/home/${homeTeamId}/away/${awayTeamId}/start-time/${time}/team-streaks`,
    headers: {
      'x-custom-lang': i18n,
    },
  };

  // https://devapi.uniscore.vn/api/v1/basketball/event/ykcv4zx2e01hv5u/home/jz5xx7kasoarbib/away/jz5xx7kas6brbib/start-time/1722972600/team-streaks

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useMatchTeamStreaksData = (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  time: number,
  i18n: string
) => {
  return useQuery({
    queryKey: ['basketball', 'team-streaks', selectedMatchId],
    queryFn: () =>
      fetchMatchTeamStreaksData(
        selectedMatchId,
        homeTeamId,
        awayTeamId,
        time,
        i18n
      ),
    cacheTime: 150000,
    staleTime: 100000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchH2HData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  startTime: number
) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${selectedMatchId}/home/${homeTeamId}/away/${awayTeamId}/start-time/${startTime}/h2h`, // TODO use selectedMatchId

    headers: {},
  };

  const h2hData = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return h2hData || {};
};

const useH2HData = (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  startTime: number
) => {
  return useQuery({
    queryKey: ['basketball', 'matches', 'h2h', selectedMatchId],
    queryFn: () =>
      fetchH2HData(selectedMatchId, homeTeamId, awayTeamId, startTime),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchBasketballCategoryLeaguesData = async (categoryId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/category/${categoryId}/unique-tournaments`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.groups || [];
  });
};

const useBasketballCategoryLeaguesData = (categoryId: string) => {
  return useQuery({
    queryKey: ['basketball', 'categories', categoryId],
    queryFn: () => fetchBasketballCategoryLeaguesData(categoryId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchEventCounter = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/basketball/event-count`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {
      return { live: 0 };
    });

  return data;
};
const useBkbEventCounter = () => {
  return useQuery({
    queryKey: ['basketball', 'event-count'],
    queryFn: () => fetchEventCounter(),
    cacheTime: 3000,
    staleTime: 3000,
    refetchOnWindowFocus: true,
  });
};

const fetchSelectedMatch = async (
  selectedMatchId?: string
): Promise<SportEventDtoWithStat | null> => {
  if (!selectedMatchId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${selectedMatchId}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.event;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data;
};

const useSelectedMatchData = (
  sportEventId: string,
  cacheTime = 0,
  staleTime = 0,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: ['basketball', 'matches', sportEventId],
    queryFn: () => fetchSelectedMatch(sportEventId),
    cacheTime: cacheTime,
    staleTime: staleTime,
    refetchOnWindowFocus: true,
    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        // console.log('Default onSuccess action');
      }
    },
  });
};

const fetchSelectedMatchBestPlayersData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  status: number
) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${selectedMatchId}/home/${homeTeamId}/away/${awayTeamId}/best-players`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data || {};
};

const useSelectedMatchBestPlayersData = (
  sportEventId: string,
  homeTeamId: string,
  awayTeamId: string,
  status: number
) => {
  return useQuery({
    queryKey: ['basketball', 'matches', 'best-players', sportEventId],
    queryFn: () =>
      fetchSelectedMatchBestPlayersData(
        sportEventId,
        homeTeamId,
        awayTeamId,
        status
      ),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchEventIncidents = async (selectedMatchId: string, status: number) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${selectedMatchId}/incidents`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data || {};
};

const useFetchEventIncidents = (sportEventId: string, status: number) => {
  return useQuery({
    queryKey: ['basketball', 'matches', 'incidents', sportEventId],
    queryFn: () => fetchEventIncidents(sportEventId, status),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchTeamCommonEventH2HData = async (
  selectedMatchId: string,
  homeId: string,
  awayId: string
) => {
  if (!selectedMatchId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${selectedMatchId}/home/${homeId}/away/${awayId}/h2h`, // TODO use selectedMatchId

    headers: {},
  };

  const events = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return events || [];
};

const useBkbTeamCommonEventH2HData = (
  selectedMatchId: string,
  homeId: string,
  awayId: string
) => {
  return useQuery({
    queryKey: ['basketball', 'matches', 'h2h-team-event', selectedMatchId],
    queryFn: () => fetchTeamCommonEventH2HData(selectedMatchId, homeId, awayId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

const fetchEachTeamEventH2HData = async (teamId?: string) => {
  if (!teamId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/team/${teamId}/events/last/0`,
    headers: {},
  };

  let lastEvents = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events || {};
    })
    .catch((_error) => {
      //console.log(error);
    });
  lastEvents = lastEvents || [];

  return lastEvents || [];
};

const useBkbEachTeamEventH2HData = (teamIds: string[]) => {
  return useQuery({
    queryKey: ['basketball', 'matches', 'h2h-team-events', teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachTeamEventH2HData(id))),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchMomentumGraphData = async (
  selectedMatchId: string,
  status: number
) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${selectedMatchId}/graph`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data || {};
};

const useBkbMatchMomentumGraphData = (sportEventId: string, status: number) => {
  return useQuery({
    queryKey: ['basketball', 'matches', 'momentum', sportEventId],
    queryFn: () => fetchMatchMomentumGraphData(sportEventId, status),
    cacheTime: 1000,
    staleTime: 1000, // TODO
    refetchOnWindowFocus: false, // TODO
    retry: false,
  });
};

const fetchTeamOfLeague = async (tournamentId: string): Promise<TeamDto[]> => {
  if (!tournamentId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/unique-tournament/${tournamentId}/teams`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.teams || [];
  });
};

const useTeamOfLeagueData = (tournamentId: string) => {
  return useQuery({
    queryKey: ['basketball', 'tournament', 'teams', tournamentId],
    queryFn: () => fetchTeamOfLeague(tournamentId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamInfo = async (teamId: string): Promise<TeamDto> => {
  if (!teamId) return {} as TeamDto;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/team/${teamId}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamData = (teamIds: string[]) => {
  return useQuery({
    queryKey: ['basketball', 'team-info', teamIds],
    queryFn: () => Promise.all(teamIds.map((teamId) => fetchTeamInfo(teamId))),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!teamIds?.length,
  });
};

const fetchSeasonStanding = async (
  tournamentId: string,
  seasonId: string
): Promise<StandingSeasonDto> => {
  if (!tournamentId || !seasonId) return {} as StandingSeasonDto;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/unique-tournament/${tournamentId}/season/${seasonId}/standings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSeasonStandingData = (tournamentId: string, seasonId: string) => {
  return useQuery({
    queryKey: ['basketball', 'standing', 'season', tournamentId, seasonId],
    queryFn: () => fetchSeasonStanding(tournamentId, seasonId),
    cacheTime: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!tournamentId && !!seasonId,
  });
};

const fetchPlayerOfTeamData = async (teamId?: string) => {
  if (!teamId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/team/${teamId}/players`,
    headers: {},
  };

  return await axios
    .request(config)
    .then((response) => {
      return response.data.data.players || {};
    })
    .catch((_error) => {
      //console.log(error);
    });
};

const useBkbPlayerOfTeamData = (teamId: string) => {
  return useQuery({
    queryKey: ['basketball', 'player', 'player-of-team', teamId],
    queryFn: () => fetchPlayerOfTeamData(teamId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchListMatchPlayer = async (playerId: string): Promise<TeamDto[]> => {
  if (!playerId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/player/${playerId}/events/last/0`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || [];
  });
};

const useListMatchPlayerData = (playerId: string) => {
  return useQuery({
    queryKey: ['basketball', 'list-match', 'player', playerId],
    queryFn: () => fetchListMatchPlayer(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchStage = async (seasonId?: string): Promise<StageDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/season/${seasonId}/matches/stages`,
    headers: {},
  };

  return await axios
    .request(config)
    .then((response) => {
      return response.data.data.stages || [];
    })
    .catch((_error) => {
      //console.log(error);
    });
};

const useStagesData = (seasonId: string) => {
  return useQuery({
    queryKey: ['basketball', 'stages', seasonId],
    queryFn: () => fetchStage(seasonId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    enabled: !!seasonId,
  });
};

const fetchListMatchByStageTeam = async (
  seasonId: string,
  teamIds?: string[],
  stageId?: string
): Promise<SportEventDto[]> => {
  if (!seasonId) return [];
  const filteredTeamIds = teamIds?.filter((item) => !!item) || [];
  let team_ids = '';

  if (filteredTeamIds.length === 2) {
    team_ids = filteredTeamIds.join(',');
  } else if (filteredTeamIds.length === 1) {
    team_ids = filteredTeamIds[0];
  }

  const page = !team_ids && !stageId ? 0 : '';

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/season/${seasonId}/matches?team_ids=${team_ids}&stage_id=${stageId}&page=${page}`,
    headers: {},
  };

  return await axios
    .request(config)
    .then((response) => {
      return response.data.data || [];
    })
    .catch((_error) => {
      //console.log(error);
    });
};

const useListMatchByStageTeamData = (
  seasonId: string,
  teamIds?: string[],
  stageId?: string
) => {
  return useQuery({
    queryKey: [
      'basketball',
      'listMatch',
      'teams',
      'stages',
      seasonId,
      teamIds,
      stageId,
    ],
    queryFn: () => fetchListMatchByStageTeam(seasonId, teamIds, stageId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchBkbPlayerStatsSeasonsData = async (playerId: string) => {
  if (!playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/player/${playerId}/player-statistics/seasons`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useBkbPlayerStatsSeasonsData = (playerId: string) => {
  return useQuery({
    queryKey: ['basketball', 'player', 'stats-seasons', playerId],
    queryFn: () => fetchBkbPlayerStatsSeasonsData(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchBkbPlayerStatsOverallData = async (
  playerId: string,
  type: number,
  seasonId: string
) => {
  if (!playerId || !type || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/player/${playerId}/season/${seasonId}/type/${type}/statistics/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.statistics || {};
  });
};

const useBkbPlayerStatsOverallData = (
  playerId: string,
  type: number,
  seasonId: string
) => {
  return useQuery({
    queryKey: [
      'basketball',
      'player',
      'stats-overall',
      playerId,
      type,
      seasonId,
    ],
    queryFn: () => fetchBkbPlayerStatsOverallData(playerId, type, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchSeasonalTeamStatTye = async (
  seasonId: string
): Promise<StatsTeamType[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/season/${seasonId}/seasonal-team-statistics/types`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || [];
  });
};

const useSeasonalTeamStatTyeData = (seasonId: string) => {
  return useQuery({
    queryKey: ['basketball', 'seasonal', 'team', 'stat-type', seasonId],
    queryFn: () => fetchSeasonalTeamStatTye(seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId,
  });
};

const fetchTopTeamSeason = async (
  seasonId: string,
  type: number
): Promise<RankingDto> => {
  if (!seasonId || !type) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/season/${seasonId}/top-teams/types/${type}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.topTeams || {};
  });
};

const useTopTeamBySeasonData = (seasonId: string, type: number) => {
  return useQuery({
    queryKey: ['basketball', 'seasonal', 'team', 'stat-type', seasonId, type],
    queryFn: () => fetchTopTeamSeason(seasonId, type),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId && !!type,
  });
};

const fetchSeasonalPlayerStatTye = async (
  seasonId: string
): Promise<StatsTeamType[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/season/${seasonId}/seasonal-player-statistics/types`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || [];
  });
};

const useSeasonalPlayerStatTyeData = (seasonId: string) => {
  return useQuery({
    queryKey: ['basketball', 'seasonal', 'player', 'stat-type', seasonId],
    queryFn: () => fetchSeasonalPlayerStatTye(seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId,
  });
};

const fetchTopPlayerSeason = async (
  seasonId: string,
  type: number
): Promise<RankingDto> => {
  if (!seasonId || !type) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/season/${seasonId}/top-players/types/${type}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.topPlayers || {};
  });
};

const useTopPlayerBySeasonData = (seasonId: string, type: number) => {
  return useQuery({
    queryKey: ['basketball', 'seasonal', 'player', 'stat-type', seasonId, type],
    queryFn: () => fetchTopPlayerSeason(seasonId, type),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId && !!type,
  });
};

const fetchTopLeagues = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/competition/top-leagues`,
    headers: {},
  };
  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {
      return [];
    });

  return data;
};

const useTopLeagues = () => {
  return useQuery({
    queryKey: ['basketball', 'top-leagues'],
    queryFn: () => fetchTopLeagues(),
    cacheTime: 300000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchCupTree = async (seasonId: string): Promise<CupTreeDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/season/${seasonId}/cuptrees/structured`,
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
    queryKey: ['basketball', 'cup-tree', seasonId],
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
    url: `${getAPIDetectedIP()}/basketball/unique-tournament/${tournamentId}/featured-events`,
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
    queryKey: ['basketball', 'featured-match', seasonId],
    queryFn: () => fetchFeatureMatch(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchSeasonData = async (
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/unique-tournament/${tournamentId}/seasons`,
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

const useSeasonData = (tournamentId: string) => {
  return useQuery({
    queryKey: ['basketball', 'season', tournamentId],
    queryFn: () => fetchSeasonData(tournamentId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchBoxScoreData = async (
  eventId: string, homeId: string, awayId: string
): Promise<any> => {
  if (!eventId || !homeId || !awayId) return {} as any;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/basketball/event/${eventId}/home/${homeId}/away/${awayId}/lineups`,
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

const useBoxScoreData = (eventId: string, homeId: string, awayId: string) => {
  return useQuery({
    queryKey: ['basketball', 'box-score', eventId, homeId, awayId],
    queryFn: () => fetchBoxScoreData(eventId, homeId, awayId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export {
  useBasketballCategoryLeaguesData,
  useBkbCategoryData,
  useBkbDailySummaryData,
  useBkbEventCounter,
  useBkbLiveMatchData,
  useH2HData,
  useMatchTeamStreaksData,
  useSelectedMatchData,
  useSelectedMatchBestPlayersData,
  useFetchEventIncidents,
  useBkbTeamCommonEventH2HData,
  useBkbEachTeamEventH2HData,
  useBkbMatchMomentumGraphData,
  useTeamOfLeagueData,
  useTeamData,
  useSeasonStandingData,
  useBkbPlayerOfTeamData,
  useListMatchPlayerData,
  useStagesData,
  useListMatchByStageTeamData,
  useBkbPlayerStatsSeasonsData,
  useBkbPlayerStatsOverallData,
  useSeasonalTeamStatTyeData,
  useTopTeamBySeasonData,
  useTopLeagues,
  useSeasonalPlayerStatTyeData,
  useTopPlayerBySeasonData,
  useCupTree,
  useFeaturedMatch,
  useSeasonData,
  useBoxScoreData,
};
