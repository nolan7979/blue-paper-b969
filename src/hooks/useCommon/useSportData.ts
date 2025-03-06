import { SPORT } from "@/constant/common";
import { fetchAPI } from "@/utils/api";
import { getAPIDetectedIP } from "@/utils/detectIPAPI";
import { getItemByTimestamp, setItemByTimestamp } from "@/utils/localStorageUtils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";



const fetchCategoryData = async ({ sport }: { sport: string }) => {
  try {
    const { data } = await axios.get(
      `${getAPIDetectedIP()}/sport/${sport}/categories`
    );
    return data.data.categories || data.data || [];
  } catch (error) {
    console.error('Error fetching category data:', error);
    return [];
  }
};

const useCategoryData = (sport: string) => {
  return useQuery({
    queryKey: ['categories', sport],
    queryFn: () => fetchCategoryData({ sport }),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};


const fetchCategoryLeaguesData = async (categoryId: string, sport: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/category/${categoryId}/unique-tournaments`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data || [];
  });
};

const useCategoryLeaguesData = (categoryId: string, sport: string) => {
  return useQuery({
    queryKey: [sport, 'categories', categoryId],
    queryFn: () => fetchCategoryLeaguesData(categoryId, sport),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: categoryId !== ''
  });
};

const fetchTopLeagues = async ({ sport }: { sport: string }) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/competition/top-leagues`,
    headers: {},
  };
  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {
      return {};
    });

  return data;
};

const useTopLeagues = (sport: string) => {
  return useQuery({
    queryKey: [sport, 'top-leagues'],
    queryFn: () => fetchTopLeagues({ sport: sport }),
    cacheTime: 3000,
    staleTime: 3000,
    refetchOnWindowFocus: false,
  });
};


const fetchDailySummaryData = async (
  dataDate?: string,
  sport = 'football',
  hasFormat = false
) => {
  const currentDate = new Date();
  const timeZoneOffsetInMinutes = currentDate.getTimezoneOffset();
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/${sport}/scheduled-events/${dataDate}/offset/${timeZoneOffsetInMinutes}${hasFormat ? '?format=2' : ''
      }`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.events;
    })
    .catch((error) => {
      // //console.log(error);
    });

  return data || [];
};

const useDailySummaryData = (
  dataDate?: string,
  sport = 'football',
  matchFilter?: string,
  hasFormat = false
) => {
  return useQuery({
    queryKey: [sport, 'matches', dataDate, hasFormat],
    queryFn: () => fetchDailySummaryData(dataDate, sport, hasFormat),
    cacheTime: 300000,
    staleTime: 30000,
    refetchOnWindowFocus: matchFilter !== 'live',
  });
};

const fetchAllEventCounter = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event-count`,
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
const useAllEventCounter = () => {
  return useQuery({
    queryKey: ['all-sport', 'event-count'],
    queryFn: () => fetchAllEventCounter(),
    cacheTime: 5000,
    staleTime: 3000,
    refetchOnWindowFocus: true,
  });
};


const fetchEachTeamEventH2HData = async (teamId: string, sport: string) => {
  if (!teamId) return [];

  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/${sport}/team/${teamId}/match-h2h-recent`,
      headers: {},
    };

    const response = await axios.request(config);
    return response?.data?.data?.events || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const useEachTeamEventH2HData = (teamIds: string[], sport: string) => {
  return useQuery({
    queryKey: ['matches', sport, teamIds],
    queryFn: () =>
      Promise.all(teamIds.map((id) => fetchEachTeamEventH2HData(id, sport))),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: false,
    enabled: teamIds.length > 0, // Ensure the query is enabled only if there are teamIds
  });
};


const fetchFootyEventData = async (eventId: string, sport: string) => {
  if (!eventId || !sport) return {};

  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/${sport}/event/${eventId}/analytics`,
      headers: {},
    };

    const response = await axios.request(config);
    return response?.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const useFootyEventData = (eventId: string, sport = SPORT.FOOTBALL) => {
  return useQuery({
    queryKey: ['footy', eventId, sport],
    queryFn: () => fetchFootyEventData(eventId, sport),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });
};

const fetchCategoryDataV2 = async ({ sport, dataDate }: { sport: string, dataDate?: string }) => {
  const currentDate = new Date();
  const timeZoneOffsetInMinutes = currentDate.getTimezoneOffset();
  try {
    const { data } = await axios.get(
      `${getAPIDetectedIP()}/sport/${sport}/${dataDate}/categories/offset/${timeZoneOffsetInMinutes}`
    );
    return data.data.categories || [];
  } catch (error) {
    console.error('Error fetching basketball category data:', error);
    return [];
  }
};

const useCategoryDataV2 = (sport: string, dataDate?: string) => {
  return useQuery({
    queryKey: [sport, 'categories', sport],
    queryFn: () => fetchCategoryDataV2({ sport, dataDate }),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};


export {
  useCategoryData,
  useCategoryLeaguesData,
  useTopLeagues,
  useDailySummaryData,
  useAllEventCounter,
  useEachTeamEventH2HData,
  useFootyEventData,
  useCategoryDataV2
};
