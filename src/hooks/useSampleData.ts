import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/lib';

export const fetchSample = async () => {
  return (await axiosInstance.get(`/hello`)).data;
};

export const useSampleData = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchSample(),
    staleTime: 10000,
    cacheTime: 100000,
  });
};
