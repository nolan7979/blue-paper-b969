import { CupTreeDto, SportEventDtoWithStat } from '@/constant/interface';
import { isMatchNotStarted } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchSelectedMatch = async (
  selectedMatchId?: string
): Promise<SportEventDtoWithStat | null> => {
  if (!selectedMatchId) return null;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/badminton/event/${selectedMatchId}`,
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
    queryKey: ['badminton', 'matches', sportEventId],
    queryFn: () => fetchSelectedMatch(sportEventId),
    cacheTime: cacheTime,
    staleTime: staleTime,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        // console.log('Default onSuccess action');
      }
    },
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
    url: `${getAPIDetectedIP()}/badminton/event/${selectedMatchId}/statistics`, // TODO use selectedMatchId
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
    queryKey: ['badminton', 'matches', 'statistics', sportEventId],
    queryFn: () => fetchMatchStats(sportEventId, i18n ?? ''),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    // refetchInterval: 30000,
  });
};

const fetchEventCounter = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/badminton/event-count`,
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
    queryKey: ['badminton', 'event-count'],
    queryFn: () => fetchEventCounter(),
    cacheTime: 3000,
    staleTime: 3000,
    refetchOnWindowFocus: true,
  });
};

const fetchTopLeaguesBadminton = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/badminton/unique-tournament/top-leagues`,
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

const useTopLeaguesBadminton = () => {
  return useQuery({
    queryKey: ['badminton', 'top-leagues'],
    queryFn: () => fetchTopLeaguesBadminton(),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchEachTeamEventH2HData = async (teamId?: string) => {
  if (!teamId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/badminton/team/${teamId}/match-h2h-recent`, // tennis/team/:competitor_id/match-h2h-recent
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
    queryKey: ['badminton', 'matches', 'h2h-team-events', teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachTeamEventH2HData(id))),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    // enabled: teamIds.length > 0, // Ensure the query is enabled only if there are teamIds
  });
};

const fetchFeatureMatch = async (
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/badminton/unique-tournament/${tournamentId}/featured-events`,
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
    queryKey: ['badminton', 'featured-match', seasonId],
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
    url: `${getAPIDetectedIP()}/badminton/unique-tournament/season/${leagueId}/events/${type}/0`,
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
    queryKey: ['badminton', 'match-league', leagueId, type],
    queryFn: () => fetchMatchLeague(leagueId, type),
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
    url: `${getAPIDetectedIP()}/badminton/season/${seasonId}/cuptrees/structured`,
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
    queryKey: ['badminton', 'cup-tree', seasonId],
    queryFn: () => fetchCupTree(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchAllLeaguesBmt = async ({ cateId }: { cateId: string }) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/badminton/category/${cateId}/unique-tournaments`,
    headers: {},
  };
  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.uniqueTournaments;
    })
    .catch(() => {
      return {};
    });

  return data;
};

const useAllLeaguesBmt = (cateId: string) => {
  return useQuery({
    queryKey: [cateId, 'all-leagues-badminton'],
    queryFn: () => fetchAllLeaguesBmt({ cateId }),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export { 
  useSelectedMatchData, 
  useEventCounter,
  useTopLeaguesBadminton,
  useEachTeamEventH2HData,
  useFeaturedMatch,
  useMatchLeague,
  useCupTree,
  useAllLeaguesBmt,
  useMatchStatsData
};
