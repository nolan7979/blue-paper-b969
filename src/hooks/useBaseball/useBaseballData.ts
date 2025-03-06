import {
  CupTreeDto,
  SportEventDtoWithStat,
  StandingSeasonDto
} from '@/constant/interface';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchSelectedMatchBB = async (
  selectedMatchId?: string
): Promise<SportEventDtoWithStat | null> => {
  if (!selectedMatchId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/baseball/event/${selectedMatchId}`,
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

const useSelectedMatchBBData = (
  sportEventId: string,
  cacheTime = 0,
  staleTime = 0,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: ['baseball', 'matches', sportEventId],
    queryFn: () => fetchSelectedMatchBB(sportEventId),
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

const fetchEachTeamEventH2HData = async (teamId?: string) => {
  if (!teamId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/baseball/team/${teamId}/match-h2h-recent`, // tennis/team/:competitor_id/match-h2h-recent
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

const useEachTeamEventH2HDataBaseball = (teamIds: string[]) => {
  return useQuery({
    queryKey: ['baseball', 'matches', 'h2h-team-events', teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachTeamEventH2HData(id))),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    // enabled: teamIds.length > 0, // Ensure the query is enabled only if there are teamIds
  });
};

const fetchH2HData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/baseball/home/${homeTeamId}/away/${awayTeamId}/h2h`, // TODO use selectedMatchId
    // https://devapi.uniscore.vn/api/v1/volleyball/event/home/:home_team_id/away/:away_team_id/h2h

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

const useH2HDataBaseball = (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
) => {
  return useQuery({
    queryKey: ['baseball', 'matches', 'h2h', selectedMatchId],
    queryFn: () =>
      fetchH2HData(selectedMatchId, homeTeamId, awayTeamId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchStandingSeasonData = async (
  seasonId: string,
) => {
  if (!seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/volleyball/unique-tournament/season/${seasonId}/standings`, 

    headers: {},
  };

  const seasonData = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return seasonData || {};
};

const useVlbStandingSeasonData = (
  seasonId: string
) => {
  return useQuery({
    queryKey: ['volleyball', 'club', 'season', seasonId],
    queryFn: () =>
      fetchStandingSeasonData(seasonId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchListClubData = async (
  tournamentId: string,
) => {
  if (!tournamentId) return {};
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/volleyball/season/${tournamentId}/clubs`, 

    headers: {},
  };

  const clubData = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return clubData || {};
};

const useVlbListClubData = (
  tournamentId: string
) => {
  return useQuery({
    queryKey: ['volleyball', 'clubs', tournamentId],
    queryFn: () =>
      fetchListClubData(tournamentId),
    cacheTime: 1500000,
    staleTime: 1000000,
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
    url: `${getAPIDetectedIP()}/baseball/event/${selectedMatchId}/statistics`,
    headers: {
      'x-custom-lang': i18n,
    },
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
    queryKey: ['baseball', 'matches', 'statistics', sportEventId],
    queryFn: () => fetchMatchStats(sportEventId, i18n ?? ''),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    // refetchInterval: 30000,
  });
};

const fetchFeatureMatch = async (
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/baseball/unique-tournament/${tournamentId}/featured-events`,
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
    queryKey: ['baseball', 'featured-match', seasonId],
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
    url: `${getAPIDetectedIP()}/baseball/unique-tournament/season/${leagueId}/events/${type}/0`,
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
    queryKey: ['baseball', 'match-league', leagueId, type],
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
    url: `${getAPIDetectedIP()}/baseball/unique-tournament/season/${seasonId}/standings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSeasonStandingData = ( seasonId: string) => {
  return useQuery({
    queryKey: ['baseball', 'standing', 'season', seasonId],
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
    url: `${getAPIDetectedIP()}/baseball/unique-tournament/season/${seasonId}/cuptrees/structured`,
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
    queryKey: ['baseball', 'cup-tree', seasonId],
    queryFn: () => fetchCupTree(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export {
  useSelectedMatchBBData,
  useEachTeamEventH2HDataBaseball,
  useH2HDataBaseball,
  useVlbStandingSeasonData,
  useVlbListClubData,
  useMatchStatsData,
  useFeaturedMatch,
  useMatchLeague,
  useSeasonStandingData,
  useCupTree,
};
