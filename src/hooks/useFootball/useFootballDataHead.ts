import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { isMatchNotStarted } from '@/utils';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { fetchAPI } from '@/utils/api';

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
    ? `${getAPIDetectedIP()}/${tournament}/${competitionId}/season/${seasonId}/stage/${stageId}/standings/${type}`
    : `${getAPIDetectedIP()}/${tournament}/${competitionId}/season/${seasonId}/standings/${type}`;

  const config = {
    method: 'head',
    maxBodyLength: Infinity,
    url,
    headers: {},
  };

  const standings = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      //console.log(error);
    });

  return standings || [];
};

const useSeasonStandingsDataHead = (
  competitionId?: string,
  seasonId?: string,
  stageId?: string,
  type?: string,
  unique = false
) => {
  return useQuery({
    queryKey: [
      'head',
      'football',
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
    cacheTime: 60000,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchStats = async (
  selectedMatchId: string,
  homeId: string,
  awayId: string,
  status: number
) => {
  if (!selectedMatchId || isMatchNotStarted(status)) return {};

  const config = {
    method: 'head',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${selectedMatchId}/home/${homeId}/away/${awayId}/statistics`,
    headers: {},
  };

  const res = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      //console.log(error);
    });

  return res || {};
};

const useMatchStatsDataHead = (
  sportEventId: string,
  homeId: string,
  awayId: string,
  status: number
) => {
  return useQuery({
    queryKey: ['head', 'football', 'matches', 'statistics', sportEventId],
    queryFn: () => fetchMatchStats(sportEventId, homeId, awayId, status),
    cacheTime: 60000,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

const fetchSelectedMatchLineups = async (
  selectedMatchId: string,
  lineup: number
) => {
  if (!selectedMatchId || lineup == 0) return {};

  const config = {
    method: 'head',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${selectedMatchId}/lineups`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      // console.log(error)
    });

  return data || {};
};

const fetchSeasonStandingsFormHead = async (
  competitionId?: string,
  seasonId?: string,
  type?: string,
  unique = false
) => {
  if (!competitionId || !seasonId || !type) return [];
  let tournament = 'tournament';
  if (unique) {
    tournament = 'unique-tournament';
  }

  const config = {
    method: 'head',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${tournament}/${competitionId}/season/${seasonId}/team-events/${type}`, // TODO use selectedMatchId

    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      //console.log(error);
    });

  return data || {};
};

const useSeasonStandingsFormDataHead = (
  competitionId?: string,
  seasonId?: string,
  type?: string,
  unique = false
) => {
  return useQuery({
    queryKey: [
      'head',
      'football',
      'season',
      'form',
      competitionId,
      seasonId,
      type,
      unique,
    ],
    queryFn: () =>
      fetchSeasonStandingsFormHead(competitionId, seasonId, type, unique),
    cacheTime: 60000,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

const fetchLocaleStatsData = async () => {
  try {
    const response = await fetchAPI('locale/list', 'GET');
    return response;
  } catch (error) {
    console.error(error);
  }
};

const useLocaleStatsHead = () => {
  return useQuery({
    queryKey: ['locale', 'list'],
    queryFn: () => fetchLocaleStatsData(),
    cacheTime: 60000,
    staleTime: 20000,
    refetchOnWindowFocus: false,
  });
};

const fetchLocaleStatsDetail = async (id: string) => {
  try {
    const response = await fetchAPI(`locale/${id}`, 'GET');
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};

const useLocaleStatsDetailHead = (id: string) => {
  return useQuery({
    queryKey: ['locale', 'detail', id],
    queryFn: () => fetchLocaleStatsDetail(id),
    cacheTime: 60000,
    staleTime: 20000,
    refetchOnWindowFocus: false,
  });
};

export {
  useMatchStatsDataHead,
  useSeasonStandingsDataHead,
  useSeasonStandingsFormDataHead,
  useLocaleStatsHead,
  useLocaleStatsDetailHead,
};
