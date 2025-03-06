import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { getItemByTimestamp, setItemByTimestamp } from '@/utils/localStorageUtils';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IVoteResponse {
  vote: {
    home: number;
    draw: number;
    away: number;
  };
}
const fetchTotalVoteOfTheMatch = async (
  matchId: string
): Promise<IVoteResponse> => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/vote/${matchId}`,
    headers: {},
  };
 
  const data = await axios.request(config).then((response) => {
    return response.data.data;
  });
  return data || [];
};

const useGetVoteOfMatchById = (matchId: string) => {
  return useQuery({
    queryKey: ['vote', matchId],
    queryFn: () => fetchTotalVoteOfTheMatch(matchId),
    cacheTime: 6000000,
    staleTime: 10000,
    enabled: !!matchId,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const postNewVoteToMatch = async (matchId: string, voteSelect: string) => {
  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/vote/${matchId}`,
    headers: {},
    data: {
      vote: voteSelect,
    },
  };

  try {
    const response = await axios.request(config);
  } catch (err) {
    console.log(err);
  }
};

const usePostNewVote = () => {
  return useMutation((data: { matchId: string; voteSelect: string }) => {
    if (!data.matchId || typeof data.matchId !== 'string') {
      throw new Error('matchId must be a non-empty string');
    }

    return postNewVoteToMatch(data.matchId, data.voteSelect);
  });
};

export { useGetVoteOfMatchById, usePostNewVote };
