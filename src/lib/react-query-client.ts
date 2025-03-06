import { QueryClient } from '@tanstack/react-query';

export const queryKeys = {
  user: 'user',
  matches: 'matches', // TODO depends on api
};

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  // const title =
  //   error instanceof Error ? error.message : 'Error connecting to servers';
  // prevent duplicate toasts
  // toast.closeAll();
  // toast({ title, status: 'error', variant: 'subtle', isClosable: true });
  // console.log(title); // TODO: replace with toast
  // alert(title);
}

export function generateQueryClient(props?: object): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        onError: queryErrorHandler,
        // staleTime: 10000, // 10 seconds
        // cacheTime: 300000, // default cacheTime is 5 minutes; doesn't make sense for staleTime to exceed cacheTime
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        // refetchOnReconnect: true,
        ...props,
      },
      mutations: {
        onError: queryErrorHandler,
      },
    },
  });
}

export const queryClient = generateQueryClient();
