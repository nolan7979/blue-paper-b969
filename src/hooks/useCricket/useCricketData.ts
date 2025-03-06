import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import {
  CupTreeDto,
  Inning,
  SportEventDtoWithStat,
  StandingSeasonDto,
} from '@/constant/interface';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';

const fetchSelectedMatch = async (
  selectedMatchId?: string
): Promise<SportEventDtoWithStat | null> => {
  if (!selectedMatchId) return null;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/cricket/event/${selectedMatchId}`,
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

export const useSelectedMatchData = (
  sportEventId: string,
  cacheTime = 300000,
  staleTime = 30000,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: ['cricket', 'matches', sportEventId],
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

const fetchSelectedMatchLineups = async (selectedMatchId?: string) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/cricket/event/${selectedMatchId}/lineups`,
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

export const useSelectedMatchLineupsData = (
  sportEventId: string,
  onSuccessCallback?: (value: boolean) => void
) => {
  return useQuery({
    queryKey: ['cricket', 'matches', 'lineups', sportEventId],
    queryFn: () => fetchSelectedMatchLineups(sportEventId),
    cacheTime: 30000,
    staleTime: 15000,
    refetchOnWindowFocus: false,
    onSuccess: (fetchedData) => {
      if (onSuccessCallback) {
        if (fetchedData && fetchedData.length > 0) {
          onSuccessCallback(false);
        } else {
          onSuccessCallback(true);
        }
      }
    },
  });
};

const fetchSeasonStandings = async (seasonId?: string) => {
  if (!seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/cricket/unique-tournament/season/${seasonId}/standings`,
    headers: {},
  };

  const standings = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return standings || {};
};

export const useSeasonStandingsData = (
  seasonId?: string,
  onSuccessCallback?: (value: boolean) => void
) => {
  return useQuery({
    queryKey: ['season', 'cricket', 'standings', seasonId],
    queryFn: () => fetchSeasonStandings(seasonId),
    cacheTime: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    onSuccess: (fetchedData) => {
      if (onSuccessCallback) {
        if (fetchedData && fetchedData?.standings?.length > 0) {
          onSuccessCallback(false);
        } else {
          onSuccessCallback(true);
        }
      }
    },
  });
};

const fetchIncidentsMatchData = async (
  selectedMatchId?: string
): Promise<Inning[]> => {
  if (!selectedMatchId) return [];
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/cricket/event/${selectedMatchId}/incidents`,
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

  return data;
};

export const useIncidentsMatchData = (
  sportEventId: string,
  cacheTime = 300000,
  staleTime = 30000,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: ['cricket', 'incidents', sportEventId],
    queryFn: () => fetchIncidentsMatchData(sportEventId),
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

const fetchFeatureMatch = async (
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/cricket/unique-tournament/${tournamentId}/featured-events`,
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

export const useFeaturedMatch = (seasonId: string) => {
  return useQuery({
    queryKey: ['cricket', 'featured-match', seasonId],
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
    url: `${getAPIDetectedIP()}/cricket/unique-tournament/season/${leagueId}/events/${type}/0`,
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

export const useMatchLeague = (leagueId: string, type: string) => {
  return useQuery({
    queryKey: ['cricket', 'match-league', leagueId, type],
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
    url: `${getAPIDetectedIP()}/cricket/unique-tournament/season/${seasonId}/standings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

export const useSeasonStandingData = (seasonId: string) => {
  return useQuery({
    queryKey: ['cricket', 'standing', 'season', seasonId],
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
    url: `${getAPIDetectedIP()}/cricket/season/${seasonId}/cuptrees/structured`,
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

export const useCupTree = (seasonId: string) => {
  return useQuery({
    queryKey: ['cricket', 'cup-tree', seasonId],
    queryFn: () => fetchCupTree(seasonId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};
