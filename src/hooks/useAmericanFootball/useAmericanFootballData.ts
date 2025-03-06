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
import { getItemByTimestamp, setItemByTimestamp } from '@/utils/localStorageUtils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchSelectedMatch = async (
  selectedMatchId?: string
): Promise<SportEventDtoWithStat | null> => {
  if (!selectedMatchId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/am-football/sport-event/${selectedMatchId}`,
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
    queryKey: ['am-football', 'matches', sportEventId],
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

const fetchEventIncidents = async (selectedMatchId: string, status: number) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/am-football/event/${selectedMatchId}/incidents`,
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
    queryKey: ['am-football', 'matches', 'incidents', sportEventId],
    queryFn: () => fetchEventIncidents(sportEventId, status),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
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
    url: `${getAPIDetectedIP()}/am-football/event/${selectedMatchId}/statistics`, // TODO use selectedMatchId
  };
  
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
    queryKey: ['am-football', 'matches', 'statistics', sportEventId],
    queryFn: () => fetchMatchStats(sportEventId, i18n ?? ''),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    // refetchInterval: 30000,
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
    url: `${getAPIDetectedIP()}/am-football/event/${selectedMatchId}/home/${homeId}/away/${awayId}/h2h`, // TODO use selectedMatchId

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

const useTeamCommonEventH2HData = (
  selectedMatchId: string,
  homeId: string,
  awayId: string
) => {
  return useQuery({
    queryKey: ['am-football', 'matches', 'h2h-team-event', selectedMatchId],
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
    url: `${getAPIDetectedIP()}/am-football/team/${teamId}/events/last/0`,
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
    queryKey: ['am-football', 'matches', 'h2h-team-events', teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachTeamEventH2HData(id))),
    cacheTime: 1500000,
    staleTime: 1000000,
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
    url: `${getAPIDetectedIP()}/am-football/unique-tournament/${tournamentId}/featured-events`,
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
    queryKey: ['am-football', 'featured-match', seasonId],
    queryFn: () => fetchFeatureMatch(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchLeague = async (leagueId: string, type: string): Promise<CupTreeDto[]> => {
  if (!leagueId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/am-football/unique-tournament/season/${leagueId}/events/${type}/0`,
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
    queryKey: ['am-football', 'match-league', leagueId, type],
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
    url: `${getAPIDetectedIP()}/am-football/unique-tournament/season/${seasonId}/standings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSeasonStandingData = ( seasonId: string) => {
  return useQuery({
    queryKey: ['am-football', 'standing', 'season', seasonId],
    queryFn: () => fetchSeasonStanding(seasonId),
    cacheTime: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId,
  });
};

const fetchCupTree = async (seasonId: string): Promise<CupTreeDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/am-football/season/${seasonId}/cuptrees/structured`,
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
    queryKey: ['am-football', 'cup-tree', seasonId],
    queryFn: () => fetchCupTree(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export {
  useSelectedMatchData,
  useFetchEventIncidents,
  useMatchStatsData,
  useTeamCommonEventH2HData,
  useEachTeamEventH2HData,
  useFeaturedMatch,
  useMatchLeague,
  useSeasonStandingData,
  useCupTree,
};
