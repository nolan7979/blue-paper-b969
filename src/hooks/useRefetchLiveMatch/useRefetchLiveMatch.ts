import { useEffect, useState } from 'react';
import { useConnectionStore } from '@/stores/connection-store';

const useRefetchLiveMatch = (
  hasMatchLive: boolean,
  matchTypeFilter: string,
  refetch: () => void
) => {
  const { isConnected } = useConnectionStore();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (matchTypeFilter === 'live' && hasMatchLive && !isConnected) {
      const newIntervalId = setInterval(() => {
        refetch();
      }, 5000);
      setIntervalId(newIntervalId);
    }
  }, [refetch, matchTypeFilter, isConnected, hasMatchLive]);

  useEffect(() => {
    if (intervalId && isConnected) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
  }, [intervalId, isConnected]);
};

export default useRefetchLiveMatch;
