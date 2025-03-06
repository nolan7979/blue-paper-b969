import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTennisDailyOddsData = async (dataDate?: string) => {
  if (!dataDate) return [];

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sport/tennis/odds/1/${dataDate}`,
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

const useTennisDailyOddsData = (dataDate?: string) => {
  return useQuery({
    queryKey: ['tennis', 'daily-odds', dataDate],
    queryFn: () => fetchTennisDailyOddsData(dataDate),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};

export { useTennisDailyOddsData };
