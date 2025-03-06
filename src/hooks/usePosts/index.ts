import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '@/lib';

const fetchPosts = async (limit = 10) => {
  const response = await axiosInstance(
    'https://jsonplaceholder.typicode.com/posts'
  );
  const parsed = response.data;
  return parsed.filter((x: { id: number }) => x?.id <= limit);
};

const usePosts = (limit: number) => {
  return useQuery({
    queryKey: ['posts', limit],
    queryFn: () => fetchPosts(limit),
  });
};

export { fetchPosts, usePosts };
