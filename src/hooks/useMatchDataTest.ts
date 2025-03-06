import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/lib';

export const fetchMatchByDate = async (dateYYYYMMDD: string) => {
  const response = await axiosInstance.get(`/scheduled-events/${dateYYYYMMDD}`);
  return response.data;
};

export const useMatchDataA = (dateYYYYMMDD: string) => {
  return useQuery({
    queryKey: ['match', dateYYYYMMDD],
    queryFn: () => fetchMatchByDate(dateYYYYMMDD),
    staleTime: 3000,
    cacheTime: 10000,
  });
};
