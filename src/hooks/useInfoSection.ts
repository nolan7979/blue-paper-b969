import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchInfoSection = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.uni-tech.xyz/wp-json/wp/v2/pages/6`,
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

  return data || [];
};

const useInfoSection = () => {
  return useQuery({
    queryKey: ['infoSection'],
    queryFn: () => fetchInfoSection(),
    cacheTime: 15000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });
};
export { useInfoSection };
