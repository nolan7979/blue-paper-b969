import { SPORT } from "@/constant/common";
import { MatchStateHockey, SportEventDtoWithStat, StandingSeasonDto, TournamentInfoDto } from "@/constant/interface";
import { MatchCommentary } from "@/models/interface";
import { isMatchNotStartedHockey } from "@/utils";
import { getAPIDetectedIP } from "@/utils/detectIPAPI";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSelectedMatch = async (
  selectedMatchId: string | undefined,
  sport: SPORT | string
): Promise<SportEventDtoWithStat | null> => {
  if (!selectedMatchId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/event/${selectedMatchId}`,
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
  sport: SPORT | string,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: [sport, 'matches', sportEventId],
    queryFn: () => fetchSelectedMatch(sportEventId, sport),
    cacheTime: 30000,
    staleTime: 3000,
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

export const useSelectedMatchAllData = (sportEventIds: {id: string, sport: string | SPORT}[]) => {
  return useQuery({
    queryKey: ['matches', sportEventIds],
    queryFn: () =>
      Promise.all(
        sportEventIds.map((sportEventId) => fetchSelectedMatch(sportEventId.id, sportEventId.sport))
      ),
    cacheTime: 30000,
    staleTime: 3000,
    refetchOnWindowFocus: true,
  });
};


const fetchSelectedMatchBestPlayersData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  status: number,
  sport: SPORT
) => {
  if (!selectedMatchId || MatchStateHockey.NotStarted === status) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/event/${selectedMatchId}/home/${homeTeamId}/away/${awayTeamId}/best-players`,
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
  status: number,
  sport: SPORT
) => {
  return useQuery({
    queryKey: [sport, 'matches', 'best-players', sportEventId],
    queryFn: () =>
      fetchSelectedMatchBestPlayersData(
        sportEventId,
        homeTeamId,
        awayTeamId,
        status,
        sport
      ),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchEventIncidents = async (selectedMatchId: string, status: number, sport: SPORT) => {
  if (!selectedMatchId || isMatchNotStartedHockey(status)) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/event/${selectedMatchId}/incidents`,
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

const useFetchEventIncidents = (sportEventId: string, status: number, sport: SPORT) => {
  return useQuery({
    queryKey: [sport, 'matches', 'incidents', sportEventId],
    queryFn: () => fetchEventIncidents(sportEventId, status, sport),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};


const fetchTeamCommonEventH2HData = async (
  selectedMatchId: string,
  homeId: string,
  awayId: string,
  sport: SPORT
) => {
  if (!selectedMatchId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/home/${homeId}/away/${awayId}/h2h`,

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
  awayId: string,
  sport: SPORT
) => {
  return useQuery({
    queryKey: ['football', 'matches', 'h2h-team-event', selectedMatchId],
    queryFn: () => fetchTeamCommonEventH2HData(selectedMatchId, homeId, awayId, sport),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};


const fetchH2HData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  startTime: number,
  sport: SPORT
) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/event/${selectedMatchId}/home/${homeTeamId}/away/${awayTeamId}/start-time/${startTime}/h2h`, // TODO use selectedMatchId

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
  startTime: number,
  sport: SPORT
) => {
  return useQuery({
    queryKey: [sport, 'matches', 'h2h', selectedMatchId],
    queryFn: () =>
      fetchH2HData(selectedMatchId, homeTeamId, awayTeamId, startTime, sport),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchStandingSeasonData = async (
  seasonId: string,
  sport: SPORT
) => {
  if (!seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/unique-tournament/season/${seasonId}/standings`,

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

const useStandingSeasonData = (
  seasonId: string,
  sport: SPORT
) => {
  return useQuery({
    queryKey: [sport, 'club', 'season', seasonId],
    queryFn: () =>
      fetchStandingSeasonData(seasonId, sport),
    cacheTime: 1500000,
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });
};

const fetchLeagueInfo = async (
  leagueId: string | undefined,
  sport: SPORT | string
): Promise<SportEventDtoWithStat | null> => {
  if (!leagueId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/unique-tournament/${leagueId}`,
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

const useFetchLeagueData = (
  leagueId: string,
  sport: SPORT | string,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: [sport, 'matches', leagueId],
    queryFn: () => fetchLeagueInfo(leagueId, sport),
    cacheTime: 30000,
    staleTime: 3000,
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

const useLeagueInfo = (leagueId: string, sport: SPORT) => {
  return useQuery({
    queryKey: [sport, 'league-info', leagueId],
    queryFn: () => fetchLeagueInfo(leagueId, sport),
    cacheTime: 600000,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
};

const fetchPlayerCommonInfo = async (
  playerId: string | undefined,
  sport: SPORT | string
): Promise<SportEventDtoWithStat | null> => {
  if (!playerId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/player/${playerId}`,
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

const useFetchPlayerCommonData = (
  playerId: string,
  sport: SPORT | string,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: [sport, 'player', playerId],
    queryFn: () => fetchPlayerCommonInfo(playerId, sport),
    cacheTime: 30000,
    staleTime: 3000,
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

const fetchTeamCommonInfo = async (
  teamId: string | undefined,
  sport: SPORT | string
): Promise<SportEventDtoWithStat | null> => {
  if (!teamId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/team/${teamId}`,
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

const useFetchTeamCommonData = (
  teamId: string,
  sport: SPORT | string,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: [sport, 'team', teamId],
    queryFn: () => fetchTeamCommonInfo(teamId, sport),
    cacheTime: 30000,
    staleTime: 3000,
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


const fetchCommentaryData = async (
  matchDetailId: string,
  sport: SPORT,
  locale: string
): Promise<MatchCommentary> => {
  if (!matchDetailId) return { comments: [] };

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/event/${matchDetailId}/tlives/${locale}`,
    headers: {},
  };

  const commentaryData = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return commentaryData || { comments: [] };
};

const useCommentaryData = (
  selectedMatchId: string,
  sport: SPORT,
  locale: string
) => {
  return useQuery({
    queryKey: [sport, 'matches', 'commentary', selectedMatchId, locale],
    queryFn: () => fetchCommentaryData(selectedMatchId, sport, locale),
    cacheTime: 30000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
}

const fetchSeasonCommonData = async (
  sport: string,
  tournamentId: string
): Promise<SportEventDtoWithStat> => {
  if (!tournamentId) return {} as SportEventDtoWithStat;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/unique-tournament/${tournamentId}/seasons`,
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

const useSeasonCommonData = (sport:string, tournamentId: string) => {
  return useQuery({
    queryKey: [sport, 'season', tournamentId],
    queryFn: () => fetchSeasonCommonData(sport, tournamentId),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: !!tournamentId,
  });
};

const fetchSeasonStandingCommon = async (
  tournamentId: string,
  seasonId: string,
  sport: string,
): Promise<StandingSeasonDto> => {
  if (!tournamentId || !seasonId) return {} as StandingSeasonDto;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/unique-tournament/${tournamentId}/season/${seasonId}/standings`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSeasonStandingCommonData = (tournamentId: string, seasonId: string, sport: string,) => {
  return useQuery({
    queryKey: [sport, 'standing', 'season', tournamentId, seasonId],
    queryFn: () => fetchSeasonStandingCommon(tournamentId, seasonId, sport),
    cacheTime: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!tournamentId && !!seasonId,
  });
};

export { useSelectedMatchData, useSelectedMatchBestPlayersData, useFetchEventIncidents, useTeamCommonEventH2HData, useH2HData, useStandingSeasonData, useLeagueInfo, useFetchLeagueData, useFetchPlayerCommonData, useFetchTeamCommonData, useCommentaryData, useSeasonCommonData, useSeasonStandingCommonData };
