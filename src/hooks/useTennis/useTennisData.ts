import { CupTreeDto, SportEventDto, SportEventDtoWithStat, StageDto, TeamDto, TournamentDto, TournamentInfoDto } from '@/constant/interface';
import { isMatchNotStarted } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTennisCategoryData = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/tennis/categories`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.categories || [];
  });
};

const useTennisCategoryData = () => {
  return useQuery({
    queryKey: ['tennis', 'categories'],
    queryFn: () => fetchTennisCategoryData(),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

const fetchTennisDailySummaryData = async (dataDate?: string) => {
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/tennis/scheduled-events/${dataDate}`,
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

const useTennisDailySummaryData = (dataDate?: string) => {
  return useQuery({
    queryKey: ['tennis', 'matches', dataDate],
    queryFn: () => fetchTennisDailySummaryData(dataDate),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchTennisLiveMatches = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/tennis/events/live`,
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

const useTennisLiveMatchData = () => {
  return useQuery({
    queryKey: ['tennis', 'matches', 'live'],
    queryFn: () => fetchTennisLiveMatches(),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

const fetchMoreTennisMatches = async (dataDate?: string) => {
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/tennis/scheduled-events/${dataDate}/inverse`,
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

const useMoreTennisMatches = (dataDate?: string) => {
  return useQuery({
    queryKey: ['tennis', 'matches', dataDate, 'more'],
    queryFn: () => fetchMoreTennisMatches(dataDate),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchSelectedMatch = async (
  selectedMatchId?: string
): Promise<SportEventDtoWithStat | null> => {
  if (!selectedMatchId) return null;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/event/${selectedMatchId}`,
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
    queryKey: ['tennis', 'matches', sportEventId],
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

const fetchFeatureMatch = async (
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/unique-tournament/${tournamentId}/featured-events`,
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
    queryKey: ['tennis', 'featured-match', seasonId],
    queryFn: () => fetchFeatureMatch(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchLeagueInfo = async (
  leagueId: string
): Promise<TournamentInfoDto> => {
  if (!leagueId) return {} as TournamentInfoDto;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/unique-tournament/${leagueId}`,
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

const useLeagueInfo = (leagueId: string) => {
  return useQuery({
    queryKey: ['tennis', 'league-info', leagueId],
    queryFn: () => fetchLeagueInfo(leagueId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchCupTree = async (seasonId: string): Promise<CupTreeDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/season/${seasonId}/cuptrees/structured`,
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
    queryKey: ['tennis', 'cup-tree', seasonId],
    queryFn: () => fetchCupTree(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
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
    url: `${getAPIDetectedIP()}/tennis/unique-tournament/season/${seasonId}/events/last/page=${page}`,
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


const fetchTeamOfLeague = async (tournamentId: string): Promise<TeamDto[]> => {
  if (!tournamentId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/unique-tournament/${tournamentId}/teams`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.teams || [];
  });
};

const useTeamOfLeagueData = (tournamentId: string) => {
  return useQuery({
    queryKey: ['tennis', 'tournament', 'teams', tournamentId],
    queryFn: () => fetchTeamOfLeague(tournamentId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchEachTeamEventH2HData = async (teamId?: string) => {
  if (!teamId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/team/${teamId}/match-h2h-recent`, // tennis/team/:competitor_id/match-h2h-recent
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

const useEachTeamEventH2HData = (teamIds: string[]) => {
  return useQuery({
    queryKey: ['tennis', 'matches', 'h2h-team-events', teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachTeamEventH2HData(id))),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    // enabled: teamIds.length > 0, // Ensure the query is enabled only if there are teamIds
  });
};

const fetchHistoricalRecentMatch = async (id: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/player/${id}/historical-recent-match`,
    headers: {},
  };
  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.error(error));

  return data;
};

const useHistoricalRecentMatch = (id: string) => {
  return useQuery({
    queryKey: ['tennis', 'historical', id],
    queryFn: () => fetchHistoricalRecentMatch(id),
    cacheTime: 30000,
    staleTime: 10000,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

const fetchEventCounter = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/tennis/event-count`,
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
const useEventCounter = () => {
  return useQuery({
    queryKey: ['tennis', 'event-count'],
    queryFn: () => fetchEventCounter(),
    cacheTime: 3000,
    staleTime: 3000,
    refetchOnWindowFocus: true,
  });
};

const fetchMatchStats = async (
  selectedMatchId: string,
  i18n: string
) => {
  if (!selectedMatchId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/event/${selectedMatchId}/statistics`, // TODO use selectedMatchId
    headers: {
      'x-custom-lang': i18n,
    },
  };
  // tennis/event/:sport_event_id/statistics
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
    queryKey: ['tennis', 'matches', 'statistics', sportEventId],
    queryFn: () => fetchMatchStats(sportEventId, i18n ?? ''),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    // refetchInterval: 30000,
  });
};

const fetchStage = async (seasonId?: string): Promise<StageDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/season/${seasonId}/matches/stages`,
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
    queryKey: ['tennis', 'stages', seasonId],
    queryFn: () => fetchStage(seasonId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    enabled: !!seasonId,
  });
};

const fetchEventIncidents = async (selectedMatchId: string, status: number) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/event/${selectedMatchId}/incidents`,
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
    queryKey: ['tennis', 'matches', 'incidents', sportEventId],
    queryFn: () => fetchEventIncidents(sportEventId, status),
    cacheTime: 15000,
    staleTime: 10000,
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
    url: `${getAPIDetectedIP()}/tennis/event/${selectedMatchId}/graph`,
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

const useMatchMomentumGraphData = (sportEventId: string, status: number) => {
  return useQuery({
    queryKey: ['tennis', 'matches', 'momentum', sportEventId, status],
    queryFn: () => fetchMatchMomentumGraphData(sportEventId, status),
    cacheTime: 1000,
    staleTime: 1000, // TODO
    refetchOnWindowFocus: false, // TODO
    retry: false,
  });
};

const fetchTennisTournamentSeasonsData = async (competitionId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/tennis/unique-tournament/${competitionId}/seasons`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.seasons || [];
  });
};

const useTennisTournamentSeasonsData = (competitionId: string) => {
  return useQuery({
    queryKey: ['tennis', 'tournament', 'seasons', competitionId],
    queryFn: () => fetchTennisTournamentSeasonsData(competitionId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};


export {
  useMoreTennisMatches,
  useTennisCategoryData,
  useTennisDailySummaryData,
  useTennisLiveMatchData,
  useSelectedMatchData,
  useEachTeamEventH2HData,
  useHistoricalRecentMatch,
  useEventCounter,
  useMatchStatsData,
  useFetchEventIncidents,
  useMatchMomentumGraphData,
  useFeaturedMatch,
  // useTeamOfLeagueData,
  useListMatchByStageTeamData,
  useStagesData,
  useTennisTournamentSeasonsData,
  useLeagueInfo,
  useCupTree,
};
