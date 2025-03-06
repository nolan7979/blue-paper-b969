import { fetchAPI } from '@/utils/api';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchFollowersFavorite = async (matchId: string): Promise<any> => {
  await fetchAPI(`${getAPIDetectedIP()}/favorite/${matchId}`, 'GET')
    .then((res) => {
      return res.data.data;
    })
    .catch((error) => console.error(error));
};

export const useFollowersFavorite = async (matchId: string) => {
  return useQuery({
    queryKey: ['followers', matchId],
    queryFn: () => fetchFollowersFavorite(matchId),
    cacheTime: 600000,
    staleTime: 10000,
    enabled: !!matchId,
    refetchOnWindowFocus: true,
  });
};
