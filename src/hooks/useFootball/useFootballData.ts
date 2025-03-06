/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { IRoundItemV2 } from '@/stores';

import { SportEventDto, SportEventDtoWithStat, StageDto } from '@/constant/interface';
import { IHighlight } from '@/models';
import { IOddsCompany } from '@/models/football/common';
import { isMatchNotStarted } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { SearchType } from '@/components/search/SearchModal';
import { SPORT } from '@/constant/common';

const fetchTopLeagues = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/competition/top-leagues`,
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

const useTopLeagues = () => {
  return useQuery({
    queryKey: ['football', 'top-leagues'],
    queryFn: () => fetchTopLeagues(),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

// const fetchEventCounter = async () => {
//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${getAPIDetectedIP()}/sport/football/event-count`,
//     headers: {},
//   };

//   const data = await axios
//     .request(config)
//     .then((response) => {
//       return response.data.data;
//     })
//     .catch(() => {
//       return { live: 0 };
//     });

//   return data;
// };
// const useEventCounter = () => {
//   return useQuery({
//     queryKey: ['football', 'event-count'],
//     queryFn: () => fetchEventCounter(),
//     cacheTime: 3000,
//     staleTime: 3000,
//     refetchOnWindowFocus: true,
//   });
// };
const fetchDailySummaryData = async (dataDate?: string) => {
  if (!dataDate) return [];
  const timeZoneOffset = new Date().getTimezoneOffset();

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/football/scheduled-events/${dataDate}/offset/${timeZoneOffset}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events;
    })
    .catch((_error) => { });

  return data || [];
};

const useDailySummaryData = (dataDate?: string) => {
  return useQuery({
    queryKey: ['football', 'matches', dataDate],
    queryFn: () => fetchDailySummaryData(dataDate),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchLiveMatches = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/football/events/live`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events;
    })
    .catch((_error) => {
      //console.log(error);
    });
  return data || [];
};

const useLiveMatchData = () => {
  return useQuery({
    queryKey: ['football', 'matches', 'live'],
    queryFn: () => fetchLiveMatches(),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
  });
};

const fetchMoreMatches = async (dataDate?: string, _sport = 'football') => {
  if (!dataDate) return [];
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/football/scheduled-events/${dataDate}/inverse`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data || [];
};

const useMoreMatchData = (dataDate?: string, sport = 'football') => {
  return useQuery({
    queryKey: [sport, 'matches', dataDate, 'more'],
    queryFn: () => fetchMoreMatches(dataDate, sport),
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
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}`,
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
  cacheTime = 300000,
  staleTime = 30000,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: ['football', 'matches', sportEventId],
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

const fetchHighlightMatchData = async (
  selectedMatchId?: string
): Promise<IHighlight[] | null> => {
  if (!selectedMatchId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/highlights/${selectedMatchId}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.highlights;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data;
};

const useHighlightMatchData = (
  sportEventId: string,
  enabled = true,
  cacheTime = 0,
  staleTime = 0,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: ['highlight', sportEventId],
    queryFn: () => fetchHighlightMatchData(sportEventId),
    cacheTime: cacheTime,
    staleTime: staleTime,
    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        // console.log('Default onSuccess action');
      }
    },
    enabled: !!sportEventId && enabled,
  });
};

const fetchSelectedMatchLineups = async (selectedMatchId?: string) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/lineups`,
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

const useSelectedMatchLineupsData = (
  sportEventId: string,
  onSuccessCallback?: (value: boolean) => void
) => {
  return useQuery({
    queryKey: ['football', 'matches', 'lineups', sportEventId],
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

const fetchManagers = async (selectedMatchId?: string) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/managers`, // TODO use selectedMatchId
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

const useManagerData = (sportEventId: string) => {
  return useQuery({
    queryKey: ['football', 'matches', 'managers', sportEventId],
    queryFn: () => fetchManagers(sportEventId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchTimeline = async (selectedMatchId: string, status: number) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/incidents`, // TODO use selectedMatchId
    headers: {},
  };

  const incidents = await axios
    .request(config)
    .then((response) => {
      return [
        ...(response?.data?.data?.incidents || []),
        ...(response?.data?.data?.corners || []),
      ];
    })
    .catch((_error) => {
      //console.log(error);
    });

  return incidents || [];
};

const useTimelineData = (
  sportEventId: string,
  status: number,
  onSuccessCallback?: (value: boolean) => void
) => {
  return useQuery({
    queryKey: ['football', 'matches', 'incidents', sportEventId],
    queryFn: () => fetchMatchTimeline(sportEventId, status),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    onSuccess: (fetchedData) => {
      if (onSuccessCallback) {
        if (fetchedData && fetchedData.length > 0) {
          onSuccessCallback(true);
        } else {
          onSuccessCallback(false);
        }
      }
    },
  });
};

const fetchMatchStats = async (
  selectedMatchId: string,
  homeId: string,
  awayId: string,
  i18n: string
) => {
  if (!selectedMatchId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/home/${homeId}/away/${awayId}/statistics`, // TODO use selectedMatchId
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
  homeId: string,
  awayId: string,
  i18n?: string
) => {
  return useQuery({
    queryKey: ['football', 'matches', 'statistics', sportEventId],
    queryFn: () => fetchMatchStats(sportEventId, homeId, awayId, i18n ?? ''),
    cacheTime: 1000,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    // refetchInterval: 30000,
  });
};

const fetchSeasonStandings = async (
  competitionId?: string,
  seasonId?: string,
  stageId?: string,
  type?: string,
  unique = false
) => {
  if (!competitionId || !seasonId || !type) return [];

  let tournament = 'tournament';
  if (unique) {
    tournament = 'unique-tournament';
  }
  const url = stageId
    ? `${getAPIDetectedIP()}/football/${tournament}/${competitionId}/season/${seasonId}/stage/${stageId}/standings/${type}`
    : `${getAPIDetectedIP()}/football/${tournament}/${competitionId}/season/${seasonId}/standings/${type}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,

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

  return standings || [];
};

const useSeasonStandingsData = (
  competitionId?: string,
  seasonId?: string,
  stageId?: string,
  type?: string,
  unique = false,
  onSuccessCallback?: (value: boolean) => void,
  isReconnect?: boolean | 'always'
) => {
  return useQuery({
    queryKey: [
      'season',
      'stage',
      'standings',
      competitionId,
      seasonId,
      stageId,
      type,
      unique,
    ],
    queryFn: () =>
      fetchSeasonStandings(competitionId, seasonId, stageId, type, unique),
    cacheTime: 15000,
    staleTime: 6000,
    enabled: !!type,
    refetchOnWindowFocus: false,
    refetchInterval: type === 'total/realtime' ? 10000 : false,
    refetchOnReconnect: isReconnect,
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

const fetchSeasonStandingsForm = async (
  competitionId?: string,
  seasonId?: string,
  stageId?: string,
  type?: string,
  unique = false
) => {
  if (!competitionId || !seasonId || !type) return [];
  if (type === 'total/realtime') type = 'total';
  let tournament = 'tournament';
  if (unique) {
    tournament = 'unique-tournament';
  }
  const url = stageId
    ? `${getAPIDetectedIP()}/football/${tournament}/${competitionId}/season/${seasonId}/stage/${stageId}/team-events/${type}`
    : `${getAPIDetectedIP()}/football/${tournament}/${competitionId}/season/${seasonId}/team-events/${type}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url, // TODO use selectedMatchId

    headers: {},
  };

  const events = await axios
    .request(config)
    .then((response) => {
      if ('tournamentTeamEvents' in response.data.data) {
        return response.data.data.tournamentTeamEvents;
      }
      return response.data.data.teamEvents;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return events || {};
};

const useSeasonStandingsFormData = (
  competitionId?: string,
  seasonId?: string,
  stageId?: string,
  type?: string,
  unique = false
) => {
  return useQuery({
    queryKey: [
      'football',
      'season',
      'stage',
      'form',
      competitionId,
      seasonId,
      stageId,
      type,
      unique,
    ],
    queryFn: () =>
      fetchSeasonStandingsForm(competitionId, seasonId, stageId, type, unique),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    enabled: !!type,
  });
};

const fetchPregameForm = async (selectedMatchId?: string) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/pregame-form`, // TODO use selectedMatchId

    headers: {},
  };

  const pregameFormData = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return pregameFormData || {};
};

const usePregameFormData = (selectedMatchId?: string) => {
  return useQuery({
    queryKey: ['football', 'matches', 'pregame-form', selectedMatchId],
    queryFn: () => fetchPregameForm(selectedMatchId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchH2HData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  startTime: number,
  sport: string
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
  sport: string
) => {
  return useQuery({
    queryKey: ['football', 'matches', 'h2h', selectedMatchId, sport],
    queryFn: () =>
      fetchH2HData(selectedMatchId, homeTeamId, awayTeamId, startTime, sport),
    cacheTime: 1500000,
    staleTime: 1000000,
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
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/home/${homeId}/away/${awayId}/h2h`, // TODO use selectedMatchId

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
    queryKey: ['football', 'matches', 'h2h-team-event', selectedMatchId],
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
    url: `${getAPIDetectedIP()}/football/team/${teamId}/events/last/0`,
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
    queryKey: ['football', 'matches', 'h2h-team-events', teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachTeamEventH2HData(id))),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    // enabled: teamIds.length > 0, // Ensure the query is enabled only if there are teamIds
  });
};
const fetchSeasonMatchesData = async (
  competitionId?: string,
  seasonId?: string
) => {
  if (!competitionId || !seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/season/${seasonId}/events/last/0`,
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

  const nextConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/season/${seasonId}/events/next/0`,
    headers: {},
  };

  let nextEvents = await axios
    .request(nextConfig)
    .then((response) => {
      return response.data.data.events || {};
    })
    .catch((_error) => {
      //console.log(error);
    });
  nextEvents = nextEvents || [];

  const allEvents = [...nextEvents, ...lastEvents];

  return allEvents || [];
};

const useSeasonMatchesData = (competitionId?: string, seasonId?: string) => {
  return useQuery({
    queryKey: ['football', 'season', 'matches', competitionId, seasonId],
    queryFn: () => fetchSeasonMatchesData(competitionId, seasonId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchGroupMatchData = async (
  tournamentId?: string,
  seasonId?: string,
  stageId?: string
) => {
  if (!tournamentId || !seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/tournament/${tournamentId}/season/${seasonId}/stage/${stageId}/events`, // TODO use selectedMatchId

    headers: {},
  };

  const events = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return events || {};
};

const useGroupMatchData = (
  tournamentId?: string,
  seasonId?: string,
  stageId?: string
) => {
  // console.log('tournamentId:', tournamentId, 'seasonId:', seasonId);
  return useQuery({
    queryKey: ['football', 'matches', 'group', tournamentId, seasonId, stageId],
    queryFn: () => fetchGroupMatchData(tournamentId, seasonId, stageId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchCupBracketData = async (
  tournamentId?: string,
  seasonId?: string
) => {
  if (!tournamentId || !seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/unique-tournament/${tournamentId}/season/${seasonId}/cuptrees/structured`, // TODO use selectedMatchId

    headers: {},
  };

  const cupTrees = await axios
    .request(config)
    .then((response) => {
      return response.data.data.cupTrees;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return cupTrees || [];
};

const useCupBracketData = (tournamentId?: string, seasonId?: string) => {
  return useQuery({
    queryKey: ['football', 'matches', 'brackets', tournamentId, seasonId],
    queryFn: () => fetchCupBracketData(tournamentId, seasonId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

interface RoundResponseV2 {
  currentRound: IRoundItemV2;
  rounds: IRoundItemV2[];
}

const fetchSeasonRoundListData = async (
  tournamentId?: string,
  seasonId?: string
): Promise<RoundResponseV2 | null> => {
  if (!tournamentId || !seasonId) return null;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/season/${seasonId}/rounds/v2`,
    headers: {},
  };

  try {
    const response = await axios.request(config);
    return response.data.data as RoundResponseV2;
  } catch (error) {
    console.error('Error fetching season round list data:', error);
    return null;
  }
};

const useSeasonRoundListData = (tournamentId?: string, seasonId?: string) => {
  return useQuery({
    queryKey: ['football', 'matches', 'list-rounds', tournamentId, seasonId],
    queryFn: () => fetchSeasonRoundListData(tournamentId, seasonId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchSeasonGroupListData = async (
  tournamentId?: string,
  seasonId?: string
) => {
  if (!tournamentId || !seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/unique-tournament/${tournamentId}/season/${seasonId}/groups`,

    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.groups;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data || {};
};

const useSeasonGroupListData = (tournamentId?: string, seasonId?: string) => {
  return useQuery({
    queryKey: ['football', 'matches', 'list-groups', tournamentId, seasonId],
    queryFn: () => fetchSeasonGroupListData(tournamentId, seasonId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

const fetchSeasonNextMatchesData = async (
  competitionId?: string,
  seasonId?: string,
  page = 0
) => {
  if (!competitionId || !seasonId || page < 0) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/unique-tournament/season/${seasonId}/events/next/${page}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSeasonNextMatchesData = (
  competitionId?: string,
  seasonId?: string,
  page?: number
) => {
  return useQuery({
    queryKey: [
      'football',
      'season',
      'next-matches',
      competitionId,
      seasonId,
      page,
    ],
    queryFn: () => fetchSeasonNextMatchesData(competitionId, seasonId, page),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchSeasonLastMatchesData = async (
  competitionId?: string,
  seasonId?: string,
  page = 0,
  reverse?: boolean
) => {
  if (!competitionId || !seasonId || page > 0) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/unique-tournament/season/${seasonId}/events/last/${Math.abs(
      page
    )}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return reverse
      ? response.data.data.events.reverse() || []
      : response.data.data.events || [];
  });
};

const useSeasonLastMatchesData = (
  competitionId?: string,
  seasonId?: string,
  page?: number,
  reverse?: boolean
) => {
  return useQuery({
    queryKey: [
      'football',
      'season',
      'last-matches',
      competitionId,
      seasonId,
      page,
    ],
    queryFn: () =>
      fetchSeasonLastMatchesData(competitionId, seasonId, page, reverse),
    cacheTime: 15000,
    staleTime: 10000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

const fetchRoundMatchesData = async (
  competitionId: string,
  seasonId: string,
  stageId: string,
  roundNumber: string
) => {
  if (!competitionId || !seasonId || !stageId || !roundNumber) return [];

  const url = `${getAPIDetectedIP()}/unique-tournament/${competitionId}/season/${seasonId}/stage/${stageId}/events/round/${roundNumber}`;

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const data = await axios.request(config).then((response) => {
    return response.data.data || {};
  });
  return data || {};
};

const useRoundMatchesData = (
  competitionId: string,
  seasonId: string,
  stageId: string,
  roundNumber: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'season',
      'stage',
      'rounds',
      competitionId,
      seasonId,
      stageId,
      roundNumber,
    ],
    queryFn: () =>
      fetchRoundMatchesData(competitionId, seasonId, stageId, roundNumber),
    cacheTime: 15000,
    staleTime: 10000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

const fetchTeamNextMatchesData = async (teamId?: string, page = 0) => {
  if (!teamId || page < 0) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/events/next/${page}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamNextMatchesData = (teamId?: string, page?: number) => {
  return useQuery({
    queryKey: ['football', 'team', 'next-matches', teamId, page],
    queryFn: () => fetchTeamNextMatchesData(teamId, page),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamLastMatchesData = async (teamId?: string, page = 0) => {
  if (!teamId || page > 0) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/events/last/${Math.abs(page)}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamLastMatchesData = (teamId?: string, page?: number) => {
  return useQuery({
    queryKey: ['football', 'team', 'last-matches', teamId, page],
    queryFn: () => fetchTeamLastMatchesData(teamId, page),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamPlayerData = async (teamId?: string) => {
  if (!teamId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/players`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.events || [];
  });
};

const useTeamPlayerData = (teamId?: string) => {
  return useQuery({
    queryKey: ['football', 'team', 'players', teamId],
    queryFn: () => fetchTeamPlayerData(teamId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchCompetitionSeasonData = async (tournamentId?: string) => {
  if (!tournamentId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/unique-tournament/${tournamentId}/seasons`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data?.seasons || [];
  });
};

const useCompetitionSeasonData = (tournamentId?: string) => {
  return useQuery({
    queryKey: ['football', 'tournament', 'seasons', tournamentId],
    queryFn: () => fetchCompetitionSeasonData(tournamentId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchCompetitionInfoData = async (tournamentId?: string) => {
  if (!tournamentId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/unique-tournament/${tournamentId}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useCompetitionInfoData = (tournamentId?: string) => {
  return useQuery({
    queryKey: ['football', 'tournament', 'info', tournamentId],
    queryFn: () => fetchCompetitionInfoData(tournamentId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchFootballCategoryData = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/football/categories`,
    headers: {},
  };

  const data = await axios.request(config).then((response) => {
    return response.data.data.categories || [];
  });
  return data || [];

};

const fetchFootballCategoryDataWithDate = async (date: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/football/${date}/categories`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.categories || [];
  });
};

const useFootballCategoryData = () => {
  return useQuery({
    queryKey: ['football', 'categories'],
    queryFn: () => fetchFootballCategoryData(),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const useFootballCategoryDataWithDate = (date: string) => {
  return useQuery({
    queryKey: ['football', 'categories', date],
    queryFn: () => fetchFootballCategoryDataWithDate(date),
    cacheTime: 60000,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchFootballCategoryLeaguesData = async (categoryId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/category/${categoryId}/unique-tournaments`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.groups || [];
  });
};

const fetchFootballCategoryLeaguesDataWithDate = async (
  categoryId: string,
  date: string
) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/category/${categoryId}/${date}/unique-tournaments`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.groups || [];
  });
};

const useFootballCategoryLeaguesData = (categoryId: string) => {
  return useQuery({
    queryKey: ['football', 'categories', categoryId],
    queryFn: () => fetchFootballCategoryLeaguesData(categoryId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const useFootballCategoryLeaguesDataWithDate = (
  categoryId: string,
  date: string
) => {
  return useQuery({
    queryKey: ['football', 'categories', categoryId, date],
    queryFn: () => fetchFootballCategoryLeaguesDataWithDate(categoryId, date),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchLeagueTopPlayersData = async (
  tournamentId: string,
  seasonId: string
) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/season/${seasonId}/top-players/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useLeagueTopPlayersData = (tournamentId: string, seasonId: string) => {
  return useQuery({
    queryKey: ['football', 'season', 'top-players', tournamentId, seasonId],
    queryFn: () => fetchLeagueTopPlayersData(tournamentId, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    enabled: !!tournamentId && !!seasonId,
    refetchOnWindowFocus: false,
  });
};

const fetchLeagueTopPlayersPerGameData = async (
  tournamentId: string,
  seasonId: string
) => {
  if (!tournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/season/${seasonId}/top-players-per-game/all/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useLeagueTopPlayersPerGameData = (
  tournamentId: string,
  seasonId: string
): any => {
  return useQuery({
    queryKey: [
      'football',
      'season',
      'top-players-per-game',
      tournamentId,
      seasonId,
    ],
    queryFn: () => fetchLeagueTopPlayersPerGameData(tournamentId, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchLeagueTopTeamsData = async (
  tournamentId: string,
  seasonId: string
) => {
  if (!tournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/season/${seasonId}/top-teams/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useLeagueTopTeamsData = (tournamentId: string, seasonId: string) => {
  return useQuery({
    queryKey: ['football', 'season', 'top-teams', tournamentId, seasonId],
    queryFn: () => fetchLeagueTopTeamsData(tournamentId, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamOfTheWeekData = async (
  tournamentId: string,
  seasonId: string,
  roundId: string
) => {
  if (!tournamentId || !seasonId || !roundId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/unique-tournament/${tournamentId}/season/${seasonId}/team-of-the-week/${roundId}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamOfTheWeekData = (
  tournamentId: string,
  seasonId: string,
  roundId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'season',
      'team-of-the-week',
      tournamentId,
      seasonId,
      roundId,
    ],
    queryFn: () => fetchTeamOfTheWeekData(tournamentId, seasonId, roundId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamOfTheWeekRoundData = async (
  tournamentId: string,
  seasonId: string
) => {
  if (!tournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/season/${seasonId}/team-of-the-week/rounds`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamOfTheWeekRoundData = (tournamentId: string, seasonId: string) => {
  return useQuery({
    queryKey: [
      'football',
      'season',
      'team-of-the-week-rounds',
      tournamentId,
      seasonId,
    ],
    queryFn: () => fetchTeamOfTheWeekRoundData(tournamentId, seasonId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchPlayerMatchStatsData = async (
  sportEventId: string,
  playerId: string
) => {
  if (!sportEventId || !playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${sportEventId}/player/${playerId}/statistics`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerMatchStatsData = (sportEventId: string, playerId: string) => {
  return useQuery({
    queryKey: ['football', 'match', 'player-stats', sportEventId, playerId],
    queryFn: () => fetchPlayerMatchStatsData(sportEventId, playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchPlayerMatchHeatmapData = async (
  sportEventId: string,
  playerId: string
) => {
  if (!sportEventId || !playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${sportEventId}/player/${playerId}/heatmap`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerMatchHeatmapData = (sportEventId: string, playerId: string) => {
  return useQuery({
    queryKey: ['football', 'match', 'player-heatmap', sportEventId, playerId],
    queryFn: () => fetchPlayerMatchHeatmapData(sportEventId, playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchPlayerMatchShotmapData = async (
  sportEventId: string,
  playerId: string
) => {
  if (!sportEventId || !playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${sportEventId}/shotmap/player/${playerId}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerMatchShotmapData = (sportEventId: string, playerId: string) => {
  return useQuery({
    queryKey: ['football', 'match', 'player-shotmap', sportEventId, playerId],
    queryFn: () => fetchPlayerMatchShotmapData(sportEventId, playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchPlayerLastMatchesData = async (playerId: string) => {
  if (!playerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/player/${playerId}/events/last/0`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const usePlayerLastMatchesData = (playerId: string) => {
  return useQuery({
    queryKey: ['football', 'player', 'last-matches', playerId],
    queryFn: () => fetchPlayerLastMatchesData(playerId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTournamentFeaturedEvents = async (tournamentId: string) => {
  if (!tournamentId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/featured-events`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data.event || {};
  });
};

const useTournamentFeaturedEvents = (tournamentId: string) => {
  return useQuery({
    queryKey: ['football', 'tournament', 'featured-events', tournamentId],
    queryFn: () => fetchTournamentFeaturedEvents(tournamentId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchSearchData = async (term: string, page = 0, sport: string, type: SearchType | null) => {
  if (!term) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    // url: `https://apisf.p2pcdn.xyz/api/v1/search/all?q=${term}&page=${page}`,
    url: `${getAPIDetectedIP()}/search/all?q=${term}&sport=${sport}${type ? `&index=${type}`: ''}&page=${page}`,
    // url: `${getAPIDetectedIP()}/search/all?q=${term}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.results || [];
  });
};

const useSearchData = (term: string, sport: string, type: SearchType | null) => {
  return useInfiniteQuery({
    queryKey: ['search' , sport, type, term],
    queryFn: ({ pageParam }) => fetchSearchData(term, pageParam, sport, type),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    getNextPageParam: (_, allPages) => {
      // Return the next incremented page number
      return allPages.length;
    },
  });
};

const fetchSuggestedSearchData = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    // url: `${getAPIDetectedIP()}/search/suggestions/default`,
    url: `https://api.sofascore.com/api/v1/search/suggestions/default`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.results || [];
  });
};

const useSuggestedSearchData = () => {
  return useQuery({
    queryKey: ['football', 'suggestions'],
    queryFn: () => fetchSuggestedSearchData(),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
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
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/home/${homeTeamId}/away/${awayTeamId}/start-time/${time}/team-streaks`,
    headers: {
      'x-custom-lang': i18n,
    },
  };

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
    queryKey: ['football', 'team-streaks', selectedMatchId],
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

const fetchPlayerStatsSeasonsData = async (teamId: string, sport: SPORT) => {
  if (!teamId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/team/${teamId}/player-statistics/seasons`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamPlayerStatsSeasonsData = (teamId: string, sport: SPORT) => {
  return useQuery({
    queryKey: [sport, 'team', 'player-statistics', 'seasons', teamId],
    queryFn: () => fetchPlayerStatsSeasonsData(teamId, sport),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamStatsSeasonListData = async (teamId: string) => {
  if (!teamId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/team-statistics/seasons`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamStatsSeasonListData = (teamId: string) => {
  return useQuery({
    queryKey: ['football', 'team', 'team-statistics', 'seasons', teamId],
    queryFn: () => fetchTeamStatsSeasonListData(teamId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamSeasonTopPlayersData = async (
  teamId: string,
  tournamentId: string,
  seasonId: string
) => {
  if (!teamId || !tournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/team/${teamId}/unique-tournament/${tournamentId}/season/${seasonId}/top-players/overall`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamSeasonTopPlayersData = (
  teamId: string,
  tournamentId: string,
  seasonId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'team',
      'season',
      'top-players',
      teamId,
      tournamentId,
      seasonId,
    ],
    queryFn: async () =>
      teamId &&
      tournamentId &&
      (await fetchTeamSeasonTopPlayersData(teamId, tournamentId, seasonId)),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchTeamStandingsSeasonListData = async (teamId: string) => {
  if (!teamId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/team/${teamId}/standings/seasons`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useTeamStandingsSeasonListData = (teamId: string) => {
  return useQuery({
    queryKey: ['football', 'team', 'standings-seasons', teamId],
    queryFn: () => fetchTeamStandingsSeasonListData(teamId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchSelectedMatchBestPlayersData = async (
  selectedMatchId: string,
  status: number
) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/best-players`,
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
  status: number
) => {
  return useQuery({
    queryKey: ['football', 'matches', 'best-players', sportEventId],
    queryFn: () => fetchSelectedMatchBestPlayersData(sportEventId, status),
    cacheTime: 600000,
    staleTime: 600000,
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
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/graph`,
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
    queryKey: ['football', 'matches', 'momentum', sportEventId],
    queryFn: () => fetchMatchMomentumGraphData(sportEventId, status),
    cacheTime: 1000,
    staleTime: 1000, // TODO
    refetchOnWindowFocus: false, // TODO
    retry: false,
  });
};

const fetchPerformanceGraphData = async (
  tournamentId: string,
  seasonId: string,
  teamId: string
) => {
  if (!tournamentId || !seasonId || !teamId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/season/${seasonId}/team/${teamId}/team-performance-graph-data`,
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

const usePerformanceGraphData = (
  tournamentId: string,
  seasonId: string,
  teamId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'team',
      'performance-graph',
      tournamentId,
      seasonId,
      teamId,
    ],
    queryFn: () => fetchPerformanceGraphData(tournamentId, seasonId, teamId),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchStatsInfoData = async (tournamentId: string, seasonId: string) => {
  if (!tournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/unique-tournament/${tournamentId}/season/${seasonId}/statistics/info`,
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

const useStatsInfoData = (tournamentId: string, seasonId: string) => {
  return useQuery({
    queryKey: ['football', 'team', 'stats-info', tournamentId, seasonId],
    queryFn: () => fetchStatsInfoData(tournamentId, seasonId),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchMatchShotmapData = async (selectedMatchId?: string) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/shotmap`,
    headers: {},
  };
  try {
    const data = await axios.request(config).then((response) => {
      return response.data.data;
    });
    return data;
  } catch (err) {
    return { live: null };
  }
};

const useMatchShotmapData = (sportEventId: string) => {
  return useQuery({
    queryKey: ['football', 'matches', 'shotmap', sportEventId],
    queryFn: () => fetchMatchShotmapData(sportEventId),
    cacheTime: 15000,
    staleTime: 5000, // TODO
    refetchOnWindowFocus: false, // TODO
    retry: false,
  });
};

const fetchPlayerSeasonPenaltyData = async (
  playerId: string,
  tournamentId: string,
  seasonId: string
) => {
  if (!playerId || !tournamentId || !seasonId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/player/${playerId}/penalty-history/unique-tournament/${tournamentId}/season/${seasonId}`,
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

const usePlayerSeasonPenaltyData = (
  playerId: string,
  tournamentId: string,
  seasonId: string
) => {
  return useQuery({
    queryKey: [
      'football',
      'player',
      'pen-history',
      playerId,
      tournamentId,
      seasonId,
    ],
    queryFn: () =>
      fetchPlayerSeasonPenaltyData(playerId, tournamentId, seasonId),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchDailySummaryByCountryIdData = async (
  dataDate: string,
  countryId: string
) => {
  const timeZoneOffset = new Date().getTimezoneOffset();
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/football/country/${countryId}/scheduled-events/${dataDate}/${timeZoneOffset}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events;
    })
    .catch((_error) => { });

  return data || [];
};

const useDailySummaryByCountryIdData = (
  dataDate: string,
  countryId: string,
  parseData?: (data: string | undefined | null) => any[]
) => {
  return useQuery({
    queryKey: ['football', 'matches', 'countryId', dataDate, countryId],
    queryFn: () => fetchDailySummaryByCountryIdData(dataDate, countryId),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    select(data) {
      if (!data) return {};

      if (!parseData || typeof data !== 'string') {
        return data;
      }
       // Parse data once and memoize result
       const parsedData = parseData(data);
       if (!Array.isArray(parsedData)) {
         return {};
       }
 
       // Convert array to object map
       return parsedData
    },
  });
};

const fetchFeatureMatchedDaily = async ({ locale }: { locale: string }) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/featured-events/locale/${locale}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.event;
    })
    .catch((_error) => { });

  return data || {};
};

const useFeaturedMatchdaily = ({ locale }: { locale: string }) => {
  return useQuery({
    queryKey: ['featured-match'],
    queryFn: () => fetchFeatureMatchedDaily({ locale }),
    cacheTime: 500000,
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });
};

const fetchFullStatPlayerSelectedMatch = async (selectedMatchId?: string) => {
  if (!selectedMatchId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/event/${selectedMatchId}/statistics_player`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data || {};
};

const usefetchFullStatPlayerSelectedMatch = (
  sportEventId: string,
  cacheTime = 0,
  staleTime = 0,
  onSuccessCallback?: () => void
) => {
  return useQuery({
    queryKey: ['full-stat-player', sportEventId],
    queryFn: () => fetchFullStatPlayerSelectedMatch(sportEventId),
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

const fetchOddsCompany = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/odd/companies`,
    headers: {},
  };

  const data: IOddsCompany[] = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      //console.log(error);
      console.error(error);
    });

  return data;
};

const useOddsCompany = () => {
  return useQuery({
    queryKey: ['football', 'odds-company'],
    queryFn: () => fetchOddsCompany(),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

const fetchHistoricalRecentMatch = async (id: string, sport: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/team/${id}/historical-recent-match`,
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

const useHistoricalRecentMatch = (id: string, sport: string) => {
  return useQuery({
    queryKey: [sport, 'historical', id],
    queryFn: () => fetchHistoricalRecentMatch(id, sport),
    cacheTime: 30000,
    staleTime: 10000,
    enabled: !!id,
    refetchOnWindowFocus: false,
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
    url: `${getAPIDetectedIP()}/football/season/${seasonId}/matches?team_ids=${team_ids}&stage_id=${stageId}&page=${page}`,
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
      'football',
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

const fetchStage = async (seasonId?: string): Promise<StageDto[]> => {
  if (!seasonId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/football/season/${seasonId}/matches/stages`,
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
    queryKey: ['football', 'stages', seasonId],
    queryFn: () => fetchStage(seasonId),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    enabled: !!seasonId,
  });
};

export {
  useListMatchByStageTeamData,
  useStagesData,
  useCompetitionInfoData,
  useCompetitionSeasonData,
  useCupBracketData,
  useDailySummaryByCountryIdData,
  useDailySummaryData,
  useEachTeamEventH2HData,
  // useEventCounter,
  useFeaturedMatchdaily,
  usefetchFullStatPlayerSelectedMatch,
  useFootballCategoryData,
  useFootballCategoryDataWithDate,
  useFootballCategoryLeaguesData,
  useFootballCategoryLeaguesDataWithDate,
  useGroupMatchData,
  useH2HData,
  useHighlightMatchData,
  useHistoricalRecentMatch,
  useLeagueTopPlayersData,
  useLeagueTopPlayersPerGameData,
  useLeagueTopTeamsData,
  useLiveMatchData,
  useManagerData,
  useMatchMomentumGraphData,
  useMatchShotmapData,
  useMatchStatsData,
  useMatchTeamStreaksData,
  useMoreMatchData,
  useOddsCompany,
  usePerformanceGraphData,
  usePlayerLastMatchesData,
  usePlayerMatchHeatmapData,
  usePlayerMatchShotmapData,
  usePlayerMatchStatsData,
  usePlayerSeasonPenaltyData,
  usePregameFormData,
  useRoundMatchesData,
  useSearchData,
  useSeasonGroupListData,
  useSeasonLastMatchesData,
  useSeasonMatchesData,
  useSeasonNextMatchesData,
  useSeasonRoundListData,
  useSeasonStandingsData,
  useSeasonStandingsFormData,
  useSelectedMatchBestPlayersData,
  useSelectedMatchData,
  useSelectedMatchLineupsData,
  useStatsInfoData,
  useSuggestedSearchData,
  useTeamCommonEventH2HData,
  useTeamLastMatchesData,
  useTeamNextMatchesData,
  useTeamOfTheWeekData,
  useTeamOfTheWeekRoundData,
  useTeamPlayerData,
  useTeamPlayerStatsSeasonsData,
  useTeamSeasonTopPlayersData,
  useTeamStandingsSeasonListData,
  useTeamStatsSeasonListData,
  useTimelineData,
  useTopLeagues,
  useTournamentFeaturedEvents
};
