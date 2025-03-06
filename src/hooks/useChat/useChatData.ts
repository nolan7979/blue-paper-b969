import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface SendMessagePayload {
  matchId: string;
  msg: string;
  sport?: string;
}

const fetchAllMessageChatOfTheMatch = async (
  matchId: string
): Promise<string[]> => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_CHAT_BASE_URL}/messages/${matchId}`,
    headers: {},
  };

  return await axios.request(config).then((response) => {
    return response.data.data;
  });
};

const useGetAllMessageOfMatch = (matchId: string) => {
  return useQuery({
    queryKey: ['chat', matchId],
    queryFn: () => fetchAllMessageChatOfTheMatch(matchId),
    cacheTime: 0,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const sendMessage = async (
  payload: SendMessagePayload,
  token: string
): Promise<number> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_CHAT_BASE_URL}/messages/send`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.code;
};

const useSendMessage = (token: string) => {
  return useMutation((payload: SendMessagePayload) =>
    sendMessage(payload, token)
  );
};

export { useGetAllMessageOfMatch, useSendMessage };
