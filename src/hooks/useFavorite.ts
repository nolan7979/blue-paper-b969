import { MatchState } from '@/constant/interface';
import { getAPIDetectedIP } from '@/utils/detectIPAPI';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IFavoriteItem {
  id: string;
  name: string;
  shortName?: string;
  sportType: number;
  isFavorite: boolean;
}

export interface IListFavorite {
  competitions: IFavoriteItem[];
  teams: IFavoriteItem[];
  players: IFavoriteItem[];
}

const subsFavoriteByList = async (
  session:any,
  dataFavorite: IListFavorite
) => {
  if (!session) return null;

  const headers = {
    'user-id': session?.userId,
    'access-token': session?.accessToken,
    'Content-Type': 'application/json'
  }

  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/favorite`,
    headers,
    data: dataFavorite,
  };

  try {
    const response = await axios.request(config);
    // console.log(response)
    return response.data.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const useSubsFavoriteByList = () => {
  return useMutation(
    (data: {
      session: any;
      dataFavorite: any;
    }) => {
      if (!data.session) {
        throw new Error(`You are not logged in.`);
      }
      return subsFavoriteByList(
        data.session,
        data.dataFavorite
      );
    }
  );
};

const subsFavoriteById = async (
  session:any,
  dataFavoriteId: any
) => {
  if (!session) return null;

  const headers = {
    'user-id': session?.userId,
    'access-token': session?.accessToken,
    'Content-Type': 'application/json'
  }

  const config = {
    method: 'PUT',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/favorite/users`,
    headers,
    data: dataFavoriteId,
  };

  try {
    const response = await axios.request(config);
    // console.log(response)
    return response.data.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const useSubsFavoriteById = () => {
  return useMutation(
    (data: {
      session: any;
      dataFavoriteId: any;
    }) => {
      if (!data.session) {
        throw new Error(`You are not logged in.`);
      }
      return subsFavoriteById(
        data.session,
        data.dataFavoriteId
      );
    }
  );
};

const fetchFavoriteData = async (
  session?: any
): Promise<any | null> => {
  if (!session) return null;

  const headers = {
    'user-id': session?.userId,
    'access-token': session?.accessToken,
  }

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${getAPIDetectedIP()}/favorite/users`,
    headers,
  };

  const data = await axios
    .request(config)
    .then((response) => {
      return response.data.data;
    })
    .catch((_error) => {
      //console.log(error);
    });

  return data;
};

const useFetchFavoriteData = (
  session:any
) => {
  return useQuery({
    queryKey: ['favorite', session?.accessToken],
    queryFn: () => fetchFavoriteData(session),
    cacheTime: 1500000,
    staleTime: 1000000,
    refetchOnWindowFocus: true,
    retry: 10,
    enabled: session && Object.keys(session).length > 0 || false,
  });
};

export { useFetchFavoriteData, useSubsFavoriteByList, useSubsFavoriteById };
