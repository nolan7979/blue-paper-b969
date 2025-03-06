import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchDailyOddsData = async (
  dataDate?: string,
  provider = '1',
  market?: string
) => {
  if (!dataDate) return [];

  let config = {};

  if (market) {
    config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/football/odds/${provider}/${dataDate}/${market}`,
      headers: {},
    };
  } else {
    config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${getAPIDetectedIP()}/sport/football/odds/${provider}/${dataDate}`,
      headers: {},
    };
  }

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.odds;
    })
    .catch((error) => {
      console.log(error);
    });

  return data || {};
};

const useDailyOddsData = (
  dataDate?: string,
  provider = '1',
  market?: string
) => {
  const bookMaker = provider || process.env.NEXT_PUBLIC_BOOK_MAKER || '1';

  return useQuery({
    queryKey: ['football', 'daily-odds', dataDate, bookMaker, market],
    queryFn: () => fetchDailyOddsData(dataDate, bookMaker, market),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

const fetchDailyOddsCompactData = async (dataDate?: string, provider = '1') => {
  if (!dataDate) return [];
  const timeZoneOffset = new Date().getTimezoneOffset();
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/sport/football/odds/${provider}/${dataDate}/offset/${timeZoneOffset}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data.odds;
    })
    .catch((error) => {
      console.log(error);
    });

  return data || [];
};

const useDailyOddsCompactData = (dataDate?: string, provider = '31') => {
  const bookMaker = provider || process.env.NEXT_PUBLIC_BOOK_MAKER || '31';

  return useQuery({
    queryKey: ['football', 'daily-odds-compact', dataDate, bookMaker],
    queryFn: () => fetchDailyOddsCompactData(dataDate, bookMaker),
    cacheTime: 500,
    staleTime: 500,
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });
};

const fetchMatchOddsData = async (sportEventId?: string, provider = 1) => {
  if (!sportEventId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${sportEventId}/odds/${provider}/all/v2`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
    });
  return data || {};
};

const useMatchOddsData = (sportEventId?: string, provider = 1) => {
  return useQuery({
    queryKey: ['football', 'match-odds', sportEventId, provider],
    queryFn: () => fetchMatchOddsData(sportEventId, provider),
    cacheTime: 15000,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    // refetchInterval: 5000,
  });
};

const fetchMatchCompareMarketsOddsData = async (
  sportEventId: string,
  half: number,
  compareType: string
) => {
  if (!sportEventId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${sportEventId}/odds/half/${half}/market/${compareType}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data || {};
};

const useMatchCompareMarketsOddsData = (
  sportEventId: string,
  half: number,
  compareType: string
) => {
  return useQuery({
    queryKey: ['football', 'match-odds', sportEventId, half, compareType],
    queryFn: () =>
      fetchMatchCompareMarketsOddsData(sportEventId, half, compareType),
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    // refetchInterval: 2000,
  });
};

const fetchWinningOddsData = async (sportEventId?: string, provider = 1) => {
  if (!sportEventId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${sportEventId}/provider/8/winning-odds`,
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

const useWinningOddsData = (sportEventId?: string, provider = 8) => {
  return useQuery({
    queryKey: ['football', 'winning-odds', sportEventId, provider],
    queryFn: () => fetchWinningOddsData(sportEventId, provider),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

const fetchTeamStreaksBettingOddsData = async (sportEventId?: string) => {
  if (!sportEventId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${sportEventId}/team-streaks/betting-odds/1`,
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

const useTeamStreaksBettingOddsData = (sportEventId?: string) => {
  return useQuery({
    queryKey: ['football', 'team-streaks-betting-odds', sportEventId],
    queryFn: () => fetchTeamStreaksBettingOddsData(sportEventId),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

const fetchDroppingOddsData = async (sportCode: string) => {
  if (!sportCode) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/odds/1/dropping/${sportCode}`, // football
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

const useDroppingOddsData = (sportCode: string) => {
  return useQuery({
    queryKey: ['football', 'dropping-odds', sportCode],
    queryFn: () => fetchDroppingOddsData(sportCode),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

const fetchBookmakersData = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/odds/isports/companies`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data || {};
};

const fetchAllBookmakersData = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/odds/isports/companies-all`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data || {};
};

const useBookmakersData = () => {
  return useQuery({
    queryKey: ['odds/isports/companies'],
    queryFn: () => fetchBookmakersData(),
    cacheTime: 3600000 * 24,
    staleTime: 3600000 * 24,
    refetchOnWindowFocus: false,
  });
};

const useAllBookmakersData = () => {
  return useQuery({
    queryKey: ['odds/isports/companies/all'],
    queryFn: () => fetchAllBookmakersData(),
    cacheTime: 3600000 * 24,
    staleTime: 3600000 * 24,
    refetchOnWindowFocus: false,
  });
};

const fetchMatchOddsChangeData = async (
  sportEventId: string,
  providerId: string,
  market: string,
  half = 0
) => {
  if (!sportEventId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${sportEventId}/odds-changes/book/${providerId}/market/${market}/half/${half}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data || {};
};

const useMatchOddsChangeData = (
  sportEventId: string,
  providerId: string,
  market: string,
  half = 0
) => {
  return useQuery({
    queryKey: [
      'football',
      'match-odds-changes',
      sportEventId,
      providerId,
      market,
      half,
    ],
    queryFn: () =>
      fetchMatchOddsChangeData(sportEventId, providerId, market, half),
    cacheTime: 15000,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchInterval: 5000,
  });
};

const fetchMatchOddsAnalysisData = async (
  sportEventId: string,
  providerId: string
) => {
  if (!sportEventId || !providerId) return {};

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/event/${sportEventId}/odds-analysis/book/${providerId}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data || {};
};

const useMatchOddsAnalysisData = (sportEventId: string, providerId: string) => {
  return useQuery({
    queryKey: ['football', 'match-odds-analysis', sportEventId, providerId],
    queryFn: () => fetchMatchOddsAnalysisData(sportEventId, providerId),
    cacheTime: 15000,
    staleTime: 2000,
  });
};

export {
  useAllBookmakersData,
  useBookmakersData,
  useDailyOddsCompactData,
  useDailyOddsData,
  useDroppingOddsData,
  useMatchCompareMarketsOddsData,
  useMatchOddsAnalysisData,
  useMatchOddsChangeData,
  useMatchOddsData,
  useTeamStreaksBettingOddsData,
  useWinningOddsData,
};
