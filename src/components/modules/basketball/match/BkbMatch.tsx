'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Avatar from '@/components/common/Avatar';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { footballStatusCodeMapping } from '@/models';
import { EventProps, GraphPoint, Incident } from '@/models/interface';
import { isMatchLive, isMatchNotStarted } from '@/utils';

import { useTimeLineStore } from '@/stores/timeline-store';
// import MatchNote from '../note';
// import TimeBar from '../timeBar';
import Rectangle from '@/components/common/skeleton/Rectangle';
import BkbTimeLineChart from '@/components/modules/basketball/chart';
import {
  useBkbMatchMomentumGraphData,
  useFetchEventIncidents,
} from '@/hooks/useBasketball';

const REQUEST_TIME = 30000;

const useMatchData = (matchId: string, status: StatusDto) => {
  const {
    data: momentumData,
    isLoading,
    isError,
    refetch,
  } = useBkbMatchMomentumGraphData(matchId, status.code);

  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isEventError,
    refetch: refetchEvents,
  } = useFetchEventIncidents(matchId, status.code);

  return {
    momentumData,
    events,
    isLoading: isLoading || isLoadingEvents,
    isError: isError || isEventError,
    refetch,
    refetchEvents,
  };
};

const BkbMatch = ({ matchData }: { matchData: SportEventDtoWithStat }) => {
  const [eventsGraph, setEventsGraph] = useState<number>(0);
  const [incidentData, setIncidentData] = useState<number>(0);
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

  const processMatchData = (
    data?: GraphPoint[],
    events?: { incidents: Incident[] }
  ) => {
    if (data && events?.incidents) {
      const graphPoints = data;
      const incidents = events?.incidents?.filter(
        (item) => item.incidentType !== 'period'
      );

      setEventsGraph(graphPoints?.length);
      setIncidentData(incidents?.length);

      setLabels(graphPoints?.map((item) => item.minute));
      setTimelines(
        graphPoints?.map((item) => ({
          x: item.minute,
          y: item.value,
          incidents: incidents?.filter(
            (incident) => incident.time === item.minute
          ),
        }))
      );

      setBreakTime(incidents[0]?.text);
    } else {
      setEventsGraph(0);
      setIncidentData(0);
    }
  };

  useEffect(() => {
    if (events) addMore({ id: matchData?.id, timeline: events });
  }, [addMore, events, matchData?.id]);

  useEffect(() => {
    processMatchData(momentumData?.graphPoints, events);
  }, [momentumData, events]);

  useEffect(() => {
    if (shouldRefetching) {
      intervalRef.current = setInterval(() => {
        refetch();
        refetchEvents();
      }, REQUEST_TIME);
    }

    return () => {
      clearCurrentInterval();
    };
  }, [refetch, shouldRefetching, refetchEvents]);

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

  if (isError || (eventsGraph <= 0 && incidentData <= 0)) {
    return <></>; // TODO
  }

  return (
    <TwBorderLinearBox className='dark:border-linear-box bg-white dark:bg-primary-gradient !mt-2.5'>
      <div className='highlight-score-content p-4' test-id='simulator'>
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
              />
            </div>
          </div>
          <div className='chart-content'>
            <div style={{ height: '100%' }}>
              {labels?.length > 0 && timeLines?.length > 0 && (
                <BkbTimeLineChart
                  labels={memoizedLabels}
                  data={memoizedTimeLines}
                  breakTime={footballStatusCodeMapping(matchData.status.code)}
                />
              )}
            </div>
          </div>
        </div>
        <div className='time-bar-wrap'></div>
      </div>
    </TwBorderLinearBox>
  );
};

export default BkbMatch;
