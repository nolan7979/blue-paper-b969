import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { CupTreeDto } from '@/constant/interface';

const fetchH2HData = async (
  selectedMatchId: string,
  homeTeamId: string,
  awayTeamId: string,
  sport: string
) => {
  if (!selectedMatchId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/home/${homeTeamId}/away/${awayTeamId}/h2h`,

    headers: {},
  };

  const h2hData = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events;
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
  sport = 'snooker'
) => {
  return useQuery({
    queryKey: [
      'snooker',
      'matches',
      'h2h',
      sport,
      selectedMatchId,
      homeTeamId,
      awayTeamId,
    ],
    queryFn: () => fetchH2HData(selectedMatchId, homeTeamId, awayTeamId, sport),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
  });
};

const fetchFeaturedEvents = async (tournamentId: string) => {
  if (!tournamentId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/snooker/unique-tournament/${tournamentId}/featured-events`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || {};
  });
};

const useSnookerFeaturedEvents = (tournamentId: string) => {
  return useQuery({
    queryKey: ['snooker', 'uniqueTournament', 'featured-events', tournamentId],
    queryFn: () => fetchFeaturedEvents(tournamentId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const fetchMatchLeague = async (leagueId: string, type: string): Promise<CupTreeDto[]> => {
  if (!leagueId) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/snooker/unique-tournament/season/${leagueId}/events/${type}/0`,
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
    queryKey: ['snooker', 'match-league', leagueId, type],
    queryFn: () => fetchMatchLeague(leagueId, type),
    cacheTime: 30000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export { useH2HData, useSnookerFeaturedEvents, useMatchLeague };
