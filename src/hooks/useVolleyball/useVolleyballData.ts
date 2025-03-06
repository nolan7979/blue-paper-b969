import {
  CupTreeDto,
  SportEventDtoWithStat,
  StandingSeasonDto,
  TeamDto,
} from '@/constant/interface';
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
    url: `${getAPIDetectedIP()}/volleyball/event/${selectedMatchId}`,
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
    queryKey: ['volleyball', 'matches', sportEventId],
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

const fetchEachVlbTeamEventH2HData = async (teamId?: string) => {
  if (!teamId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/volleyball/team/${teamId}/match-h2h-recent`, // tennis/team/:competitor_id/match-h2h-recent
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

const useEachVlbTeamEventH2HData = (teamIds: string[]) => {
  return useQuery({
    queryKey: ['volleyball', 'matches', 'h2h-team-events', teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachVlbTeamEventH2HData(id))),
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
    url: `${getAPIDetectedIP()}/volleyball/event/home/${homeTeamId}/away/${awayTeamId}/h2h`, // TODO use selectedMatchId
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

const useVlbH2HData = (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
) => {
  return useQuery({
    queryKey: ['volleyball', 'matches', 'h2h', selectedMatchId, homeTeamId, awayTeamId],
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

const fetchFeatureMatch = async (
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/volleyball/unique-tournament/${tournamentId}/featured-events`,
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
    queryKey: ['volleyball', 'featured-match', seasonId],
    queryFn: () => fetchFeatureMatch(seasonId),
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
    url: `${getAPIDetectedIP()}/volleyball/unique-tournament/season/${seasonId}/standings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSeasonStandingData = ( seasonId: string) => {
  return useQuery({
    queryKey: ['volleyball', 'standing', 'season', seasonId],
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
    url: `${getAPIDetectedIP()}/volleyball/season/${seasonId}/cuptrees/structured`,
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
    queryKey: ['volleyball', 'cup-tree', seasonId],
    queryFn: () => fetchCupTree(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchLeague = async (
  seasonId: string,
  type: string
): Promise<CupTreeDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/volleyball/unique-tournament/season/${seasonId}/events/${type}/0`,
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

const useMatchLeague = (seasonId: string, type: string) => {
  return useQuery({
    queryKey: ['volleyball', 'match-league', seasonId, type],
    queryFn: () => fetchMatchLeague(seasonId, type),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export {
  useSelectedMatchData,
  useEachVlbTeamEventH2HData,
  useVlbH2HData,
  useVlbStandingSeasonData,
  useVlbListClubData,
  useFeaturedMatch,
  useSeasonStandingData,
  useCupTree,
  useMatchLeague,
};
