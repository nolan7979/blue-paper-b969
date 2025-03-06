'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  useMatchMomentumGraphData,
  useTimelineData,
} from '@/hooks/useFootball';

import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { footballStatusCodeMapping } from '@/models';
import { GraphPoint, Incident } from '@/models/interface';
import { isMatchLive } from '@/utils';

import Rectangle from '@/components/common/skeleton/Rectangle';
import useTrans from '@/hooks/useTrans';
import { useTimeLineStore } from '@/stores/timeline-store';
import TimeLineChart from '../chart';
import MatchNote from '../note';
import TimeBar from '../timeBar';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';
import { SPORT } from '@/constant/common';

const REQUEST_TIME = 1000; // 30 seconds

const useMatchData = (matchId: string, status: StatusDto) => {
  const {
    data: momentumData,
    isLoading,
    isError,
    refetch,
  } = useMatchMomentumGraphData(matchId, status?.code);

  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isEventError,
    refetch: refetchEvents,
  } = useTimelineData(matchId, status?.code);

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
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const status: StatusDto = matchData?.status;
  const shouldRefetching = isMatchLive(status?.code);
  const { addMore } = useTimeLineStore();
  const { momentumData, events, isLoading, isError, refetch, refetchEvents } =
  useMatchData(matchData?.id, status);
  // const clearCurrentInterval = () => {
    //   if (intervalRef.current) {
      //     clearInterval(intervalRef.current);
      //     intervalRef.current = null;
      //   }
      // };

  const processMatchData = useCallback(
    (data?: GraphPoint[], events?: Incident[] | string) => {
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
    },
    [labels, timeLines,setTimelines]
  );

  useEffect(() => {
    if (events) addMore({ id: matchData?.id, timeline: events });
  }, [addMore, events, matchData?.id]);

  useEffect(() => {
    processMatchData(momentumData?.graphPoints, events);
    if(momentumData?.graphPoints?.length === 0 ||momentumData && Object.keys(momentumData).length === 0) {
      setLabels([]);
      setTimelines([]);
    }
  }, [momentumData, events, matchData?.id]);

  useEffect(() => {
    if (shouldRefetching) {
      const intervalId = setInterval(() => {
        refetch();
      }, 30000);

      const intervalIdEvents = setInterval(() => {
        refetchEvents();
      }, 5000);

      return () => {
        clearInterval(intervalId);
        clearInterval(intervalIdEvents);
      };
    }
  }, [refetch, shouldRefetching, refetchEvents]);

  // useEffect(() => {

  //   if (!isMatchNotStarted(matchData.status.code)) {
  //     clearCurrentInterval();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [matchData.status.code]);

 
  const memoizedLabels = useMemo(() => labels, [labels]);
  const memoizedTimeLines = useMemo(() => timeLines, [timeLines]);

  if (isLoading && momentumData && Object.keys(momentumData).length > 0 && !matchData) {
    return (
      <div className='bg-primary-gradient'>
        <Rectangle classes='w-full h-64' fullWidth />
      </div>
    );
  }

  if (isError || memoizedTimeLines?.length === 0) {
    return <></>; // TODO
  }

  return (
    <TwBorderLinearBox
      className='dark:border-linear-box bg-white dark:bg-primary-gradient'
      test-id='penalty-section'
    >
      <div className='highlight-score-content p-4'>
        <div className='timeline-content'>
          <div className='team-content'>
            <div className='home'>
              <AvatarTeamCommon
                team={matchData?.homeTeam}
                size={20}
                sport={SPORT.FOOTBALL}
                onlyImage
              />
            </div>
            <div className='guest'>
              <AvatarTeamCommon
                team={matchData?.awayTeam}
                size={20}
                sport={SPORT.FOOTBALL}
                onlyImage
              />
            </div>
          </div>
          <div className='chart-content'>
            <div style={{ height: 125 }}>
              {labels?.length > 0 && timeLines?.length > 0 && (
                <TimeLineChart
                  labels={memoizedLabels}
                  data={memoizedTimeLines}
                  breakTime={footballStatusCodeMapping(matchData?.status?.code)}
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
            breakTime={footballStatusCodeMapping(matchData?.status?.code)}
          />
        </div>
        <MatchNote i18n={i18n} />
      </div>
    </TwBorderLinearBox>
  );
};

export default memo(Match, (prev, next) => {
  return prev.matchData?.id === next.matchData?.id && prev.matchData?.status?.code === next.matchData?.status?.code 
  && prev.matchData?.time?.currentPeriodStartTimestamp === next.matchData?.time?.currentPeriodStartTimestamp &&
  prev.matchData?.startTimestamp === next.matchData?.startTimestamp;
});
