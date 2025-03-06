import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBkbDailyOddsData = async (dataDate?: string) => {
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/basketball/odds/1/${dataDate}`,
    headers: {},
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.odds;
    })
    .catch((error) => {
      //console.log(error);
    });

  return data || {};
};

const useBkbDailyOddsData = (dataDate?: string) => {
  return useQuery({
    queryKey: ['basketball', 'daily-odds', dataDate],
    queryFn: () => fetchBkbDailyOddsData(dataDate),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

// const fetchMatchOddsData = async (sportEventId?: string) => {
//   if (!sportEventId) return {};

//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${sportEventId}/odds/1/all`,
//     headers: { }
//   };

//   const data = await axios.request(config)
//   .then((response) => {
//     return response.data;
//   })
//   .catch((error) => {
//     //console.log(error);
//   });

//   return data || {};
// }

// const useMatchOddsData = (sportEventId?: string) => {
//   return useQuery({
//     queryKey: ['football', 'match-odds', sportEventId],
//     queryFn: () => fetchMatchOddsData(sportEventId),
//     cacheTime: 15000,
//     staleTime: 5000,
//     refetchOnWindowFocus: false,
//   })
// }

// const fetchWinningOddsData = async (sportEventId?: string) => {
//   if (!sportEventId) return {};

//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${sportEventId}/provider/1/winning-odds`,
//     headers: { }
//   };

//   const data = await axios.request(config)
//   .then((response) => {
//     return response.data;
//   })
//   .catch((error) => {
//     //console.log(error);
//   });

//   return data || {};
// }

// const useWinningOddsData = (sportEventId?: string) => {
//   return useQuery({
//     queryKey: ['football', 'winning-odds', sportEventId],
//     queryFn: () => fetchWinningOddsData(sportEventId),
//     cacheTime: 15000,
//     staleTime: 5000,
//     refetchOnWindowFocus: false,
//   })
// }

// const fetchTeamStreaksBettingOddsData = async (sportEventId?: string) => {
//   if (!sportEventId) return {};

//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${sportEventId}/team-streaks/betting-odds/1`,
//     headers: { }
//   };

//   const data = await axios.request(config)
//   .then((response) => {
//     return response.data;
//   })
//   .catch((error) => {
//     //console.log(error);
//   });

//   return data || {};
// }

// const useTeamStreaksBettingOddsData = (sportEventId?: string) => {
//   return useQuery({
//     queryKey: ['football', 'team-streaks-betting-odds', sportEventId],
//     queryFn: () => fetchTeamStreaksBettingOddsData(sportEventId),
//     cacheTime: 15000,
//     staleTime: 5000,
//     refetchOnWindowFocus: false,
//   })
// }

// const fetchDroppingOddsData = async (sportCode: string) => {
//   if (!sportCode) return {};

//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/odds/1/dropping/${sportCode}`, // football
//     headers: { }
//   };

//   const data = await axios.request(config)
//   .then((response) => {
//     return response.data;
//   })
//   .catch((error) => {
//     //console.log(error);
//   });

//   return data || {};
// }

// const useDroppingOddsData = (sportCode: string) => {
//   return useQuery({
//     queryKey: ['football', 'dropping-odds', sportCode],
//     queryFn: () => fetchDroppingOddsData(sportCode),
//     cacheTime: 15000,
//     staleTime: 5000,
//     refetchOnWindowFocus: false,
//   })
// }

export {
  useBkbDailyOddsData,
  // useDroppingOddsData,
  // useMatchOddsData,
  // useTeamStreaksBettingOddsData,
  // useWinningOddsData
};
