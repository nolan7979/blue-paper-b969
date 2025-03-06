'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  useMatchMomentumGraphData,
  useTimelineData,
} from '@/hooks/useFootball';

import Avatar from '@/components/common/Avatar';
import {
  TwBorderLinearBox,
  TwSkeletonRectangle,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { footballStatusCodeMapping } from '@/models';
import { EventProps, GraphPoint, Incident } from '@/models/interface';
import { isMatchLive, isMatchNotStarted } from '@/utils';

import { useTimeLineStore } from '@/stores/timeline-store';
import TimeLineChart from '../chart';
import MatchNote from '../note';
import TimeBar from '../timeBar';
import Rectangle from '@/components/common/skeleton/Rectangle';
import useTrans from '@/hooks/useTrans';
import React from 'react';

const REQUEST_TIME = 30000; // 30 seconds

const useMatchData = (matchId: string, status: StatusDto) => {
  const {
    data: momentumData,
    isLoading,
    isError,
    refetch,
  } = useMatchMomentumGraphData(matchId, status.code);

  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isEventError,
    refetch: refetchEvents,
  } = useTimelineData(matchId, status.code);

  return {
    momentumData,
    events,
    isLoading: isLoading || isLoadingEvents,
    isError: isError || isEventError,
    refetch,
    refetchEvents,
  };
};

const Match = ({ matchData }: { matchData: SportEventDtoWithStat }) => {
  const i18n = useTrans();
  const [labels, setLabels] = useState<number[]>([]);
  const [timeLines, setTimelines] = useState<any[]>([]);
  const [breakTime, setBreakTime] = useState<string>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const status: StatusDto = matchData?.status;
  const shouldRefetching = isMatchLive(status?.code);
  const { addMore } = useTimeLineStore();
  const { momentumData, events, isLoading, isError, refetch, refetchEvents } =
    useMatchData(matchData?.id, status);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const processMatchData = (data?: GraphPoint[], events?: Incident[] | string) => {
    if (data && Array.isArray(events)) {
      const graphPoints = data;
      const incidents = events.filter((item) => item.incidentType !== 'period');
  
      setLabels(graphPoints.map((item) => item.minute));
      setTimelines(
        graphPoints.map((item) => ({
          x: item.minute,
          y: item.value,
          incidents: incidents.filter(
            (incident) => incident.time === item.minute
          ),
        }))
      );
  
      setBreakTime(incidents[0]?.text);
    }
  };

  useEffect(() => {
    if (events) addMore({ id: matchData?.id, timeline: events });
  }, [addMore, events, matchData?.id]);

  useEffect(() => {
    processMatchData(momentumData?.graphPoints, events);
  }, [momentumData, events]);

  useEffect(() => {
    if (shouldRefetching && REQUEST_TIME > 0) {
      intervalRef.current = setInterval(() => {
        refetch();
        refetchEvents();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refetch, shouldRefetching, refetchEvents, REQUEST_TIME]);

  useEffect(() => {

  }, [intervalRef.current]);

  useEffect(() => {

    if (!isMatchNotStarted(matchData.status.code)) {
      clearCurrentInterval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchData.status.code]);

  const memoizedLabels = useMemo(() => labels, [labels]);
  const memoizedTimeLines = useMemo(() => timeLines, [timeLines]);

  if (isLoading) {
    return (
      <div className='bg-primary-gradient'>
        <Rectangle classes='w-full h-64' fullWidth />
      </div>
    );
  }

  if (isError || memoizedTimeLines.length === 0) {
    return <></>; // TODO
  }

  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <div className='highlight-score-content p-4'>
        <div className='timeline-content'>
          <div className='team-content'>
            <div className='home'>
              <Avatar
                id={matchData.homeTeam.id}
                type='team'
                width={24}
                height={24}
                isBackground={false}
                rounded={false}
                isSmall
              />
            </div>
            <div className='guest'>
              <Avatar
                id={matchData.awayTeam.id}
                type='team'
                width={24}
                height={24}
                isBackground={false}
                rounded={false}
                isSmall
              />
            </div>
          </div>
          <div className='chart-content'>
            <div style={{ height: 125 }}>
              {labels?.length > 0 && timeLines?.length > 0 && (
                <TimeLineChart
                  labels={memoizedLabels}
                  data={memoizedTimeLines}
                  breakTime={footballStatusCodeMapping(matchData.status.code)}
                />
              )}
            </div>
          </div>
        </div>
        <div className='time-bar-wrap mt-14 lg:mt-0'>
          <TimeBar
            startTime={matchData?.startTimestamp}
            duration={90}
            status={matchData?.status}
            currentPeriodTime={matchData?.time?.currentPeriodStartTimestamp}
            breakTime={footballStatusCodeMapping(matchData.status.code)}
          />
          <MatchNote i18n={i18n} />
        </div>
      </div>
    </TwBorderLinearBox>
  );
};

export default Match;
