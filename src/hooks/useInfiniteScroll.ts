/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';

import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';

import { useFilterStore } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
type DataType = TournamentGroup | SportEventDtoWithStat;

const useInfiniteScroll = (initialData: DataType[]) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const countFetchingRef = useRef<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<DataType[]>(initialData);
  const [matchesToShow, setMatchesToShow] = useState<DataType[]>([]);
  const { matchTypeFilter, dateFilter } = useFilterStore();

  const loadMore = useCallback(() => {
    const totalDataLenght = JSON.stringify(totalData).length;
    const matchesToShowLength = JSON.stringify(matchesToShow).length;

    if (matchesToShowLength >= totalDataLenght) {
      setHasMore(false);
      return;
    }

    const nextData = totalData.slice(
      matchesToShow.length,
      matchesToShow.length + 20
    );
    setMatchesToShow((prevData: any) => [...prevData, ...nextData]);
  }, [matchesToShow, totalData]);

  const lastElementRef = useCallback(
    (node: Element | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadMore, hasMore]
  );

  useEffect(() => {
    const totalDataLenght = JSON.stringify(totalData).length;
    const matchesToShowLength = JSON.stringify(matchesToShow).length;
    const initializeMatches = () => {
      setMatchesToShow(totalData.slice(0, 20));
    };

    const updateMatchesToShow = () => {
      const recentPosition = matchesToShowLength || 20;
      setMatchesToShow(totalData.slice(0, recentPosition));
    };

    const checkHasMore = () => {
      if (
        ((matchTypeFilter === 'live' && totalDataLenght === 0) ||
          (totalDataLenght === matchesToShowLength &&
            matchesToShowLength > 0)) &&
        !!hasMore
      ) {
        setHasMore(false);
      }
    };

    const shouldInitializeMatches =
      matchesToShowLength === 0 && totalDataLenght > 0;

    const shouldUpdateMatches =
      dateFilter || matchTypeFilter || matchesToShowLength < totalDataLenght;

    if (shouldInitializeMatches || shouldUpdateMatches) {
      initializeMatches();
    }

    if (totalDataLenght > 0 && matchesToShowLength <= totalDataLenght) {
      updateMatchesToShow();
    }

    checkHasMore();

    countFetchingRef.current = totalDataLenght;
  }, [dateFilter, matchTypeFilter, hasMore, totalData]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    matchesToShow,
    lastElementRef,
    hasMore,
    setTotalData,
    setHasMore,
    totalData,
  };
};

export default useInfiniteScroll;
