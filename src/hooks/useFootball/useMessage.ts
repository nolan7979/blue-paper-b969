import { MatchState } from '@/constant/interface';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const subscribeTopicMessage = async (
  id: string,
  isSubscribe: boolean,
  locale: string,
  type?: string
) => {
  // Check if matchId is empty or not a string
  if (!id || typeof id !== 'string') {
    throw new Error('matchId must be a non-empty string');
  }

  const clientId = localStorage.getItem('fcmToken');
  if (!clientId) return {};

  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/push-noti/subscribe/v2`,
    headers: {},
    data: {
      id,
      clientId,
      isSubscribe,
      locale,
      type: id == 'global' ? 'match' : type,
    },
  };

  try {
    const response = await axios.request(config);
    return response.data.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const useMessage = () => {
  return useMutation(
    (data: {
      matchId: string;
      isSubscribe: boolean;
      locale: string;
      type?: string;
    }) => {
      if (!data.matchId || typeof data.matchId !== 'string') {
        throw new Error('matchId must be a non-empty string');
      }

      return subscribeTopicMessage(
        data.matchId,
        data.isSubscribe,
        data.locale,
        data.type
      );
    }
  );
};

export { useMessage };
