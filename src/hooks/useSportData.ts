import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getAPIDetectedIP } from '@/utils/detectIPAPI';

const fetchDailySummaryData = async (
  dataDate?: string,
  sport = 'football',
) => {
  const currentDate = new Date();
  const timeZoneOffsetInMinutes = currentDate.getTimezoneOffset();
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/${sport}/scheduled-events/${dataDate}/offset/${timeZoneOffsetInMinutes}`,
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
  locale?: string,
  parseData?: (data: string | undefined | null) => any[]
) => {
  return useQuery({
    queryKey: [sport, 'matches', dataDate, locale, matchFilter],
    queryFn: () => fetchDailySummaryData(dataDate, sport),
    cacheTime: 300000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchInterval: matchFilter === 'live' ? 30000 : false,
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
      return parsedData.reduce((acc, match) => {
        if (match?.id) {
          acc[match.id] = match;
        }
        return acc;
      }, {} as Record<string, any>);
    },
  });
};

const fetchLiveMatches = async (sport = 'football') => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/${sport}/events/live`,
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

const useLiveMatchData = (sport = 'football', parseData?: (data: string | undefined | null) => any[]) => {
  return useQuery({
    queryKey: [sport, 'matches', 'live'],
    queryFn: () => fetchLiveMatches(sport),
    cacheTime: 1000,
    staleTime: 800, 
    refetchOnWindowFocus: true,
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
      return parsedData.reduce((acc, match) => {
        if (match?.id) {
          acc[match.id] = match;
        }
        return acc;
      }, {} as Record<string, any>);
    },
  });
};

const fetchLiveMatchesTLK = async (sport = 'football') => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/${sport}/events/live`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.events || [];
    })
    .catch((error) => {
      console.log(error);
    });

  // const mapMatches = data.reduce(function(obj: any, item: any) {
  //   obj[`${item?.id}`] = item;
  //   return obj;
  // }, {});
  // return mapMatches || {};

  return data || [];
};

const useLiveMatchDataTLK = (sport = 'football') => {
  return useQuery({
    queryKey: [sport, 'tlk', 'matches', 'live'],
    queryFn: () => fetchLiveMatchesTLK(sport),
    cacheTime: 10000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    // refetchInterval: 2000,
  });
};
// TODO optimize sql later
const fetchLiveMatchesOddsTLK = async (sport = 'football', provider = '31') => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/${sport}/tlk/odds/${provider}/live`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.odds || {};
    })
    .catch((error) => {
      console.log(error);
    });

  // const mapMatches = data.reduce(function(obj: any, item: any) {
  //   obj[`${item?.id}`] = item;
  //   return obj;
  // }, {});
  // console.log('mapMatches', mapMatches);

  return data || {};
};
// TODO optimize sql later
const useLiveMatchOddsDataTLK = (sport = 'football', provider = '31') => {
  return useQuery({
    queryKey: [sport, 'tlk', 'matches', 'live', 'odds', provider],
    queryFn: () => fetchLiveMatchesOddsTLK(sport, provider),
    cacheTime: 3000,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};

const fetchMoreMatches = async (dataDate?: string, sport = 'football') => {
  if (!dataDate) return [];
  const currentDate = new Date();
  const timeZoneOffsetInMinutes = currentDate.getTimezoneOffset();

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/${sport}/scheduled-events/${dataDate}/inverse`,
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

const useMoreMatchData = (dataDate?: string, sport = 'football') => {
  return useQuery({
    queryKey: [sport, 'matches', dataDate, 'more'],
    queryFn: () => fetchMoreMatches(dataDate, sport),
    cacheTime: 15000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
};

// const fetchDailyOddsData = async (dataDate?: string, sport = 'football') => {
//   if (!dataDate) return [];

//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${getAPIDetectedIP()}/sport/${sport}/odds/1/${dataDate}`,
//     headers: { }
//   };

//   const data = await axios.request(config)
//   .then((response) => {
//     return response.data.odds;
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//   return data || {};
// }

// const useDailyOddsData = (dataDate?: string, sport = 'football') => {
//   return useQuery({
//     queryKey: [sport, 'daily-odds', dataDate],
//     queryFn: () => fetchDailyOddsData(dataDate, sport),
//     cacheTime: 15000,
//     staleTime: 5000,
//     refetchOnWindowFocus: false,
//   })
// }

const fetchDailyOddsData = async (
  dataDate?: string,
  sport = 'football',
  provider = '1',
  market?: string
) => {
  if (!dataDate) return [];

  let config = {};

  if (market) {
    config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/${sport}/odds/${provider}/${dataDate}/${market}`,
      headers: {},
    };
  } else {
    config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/${sport}/odds/${provider}/${dataDate}`,
      headers: {},
    };
  }

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.odds;
    })
    .catch((error) => {
      console.log(error);
    });
  return data || {};
};

// TODO optimize sql later
const useDailyOddsData = (
  dataDate?: string,
  sport = 'football',
  provider = '1',
  market?: string
) => {
  const bookMaker = provider || process.env.NEXT_PUBLIC_BOOK_MAKER || '1';

  return useQuery({
    queryKey: [sport, 'daily-odds', dataDate, bookMaker, market],
    queryFn: () => fetchDailyOddsData(dataDate, sport, bookMaker, market),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

const fetchCategoryData = async (sport: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/${sport}/categories`,
    headers: {},
  };


  const data = await axios.request(config).then((response) => {
    return response.data.data.categories || [];
  });
  return data || [];
};

const useCategoryData = (sport = 'football') => {
  return useQuery({
    queryKey: [sport, 'categories'],
    queryFn: () => fetchCategoryData(sport),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: sport !== '',
  });
};

const fetchCategoryLeaguesData = async (sport: string, categoryId: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/${sport}/category/${categoryId}/unique-tournaments`,
    headers: {},
  };

  const data = await axios.request(config).then((response) => {
    return response.data.data.groups || [];
  });

  return data || [];
};

const useCategoryLeaguesData = (sport: string, categoryId: string) => {
  return useQuery({
    queryKey: [sport, 'categories', categoryId],
    queryFn: () => fetchCategoryLeaguesData(sport, categoryId),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export {
  useCategoryData, useCategoryLeaguesData, useDailyOddsData,
  useDailySummaryData,
  useLiveMatchData,
  useLiveMatchDataTLK,
  useLiveMatchOddsDataTLK,
  useMoreMatchData
};

