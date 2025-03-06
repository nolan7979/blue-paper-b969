import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { usePerformanceGraphData } from '@/hooks/useFootball';

import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  TWDataMessage,
  TwFilterButton,
} from '@/components/modules/football/tw-components';

import { useLeagueStore } from '@/stores/league-store';

import {
  formatTimestamp,
  generateTicks,
  genStatusText,
  isValEmpty,
} from '@/utils';

export default function PerformanceGraph({
  tournamentId,
  seasonId,
  team1,
  team2,
  showPerformanceGraph,
  numTeams,
  i18n,
}: {
  tournamentId: any;
  seasonId: any;
  team1: any;
  team2?: any;
  showPerformanceGraph?: boolean;
  numTeams?: number;
  i18n?: any;
}) {
  const { setShowPerformanceGraph } = useLeagueStore();
  const [breakPoint, setBreakPoint] = useState<number>(50);

  const {
    data: data1,
    isLoading: isLoading1,
    isFetching: isFetching1,
    isError: isError1,
  } = usePerformanceGraphData(tournamentId, seasonId, team1?.id);

  const {
    data: data2,
    isLoading: isLoading2,
    isFetching: isFetching2,
    isError: isError2,
  } = usePerformanceGraphData(tournamentId, seasonId, team2?.id);

  useEffect(() => {
    if (isError1 || isValEmpty(data1)) {
      setShowPerformanceGraph(false);
    } else {
      setShowPerformanceGraph(true);
    }
  }, [data1, isError1, setShowPerformanceGraph]);

  useEffect(() => {
    if (!isValEmpty(data1)) {
      const { graphData = [] } = data1;
      setBreakPoint(graphData.length);
    }
  }, [data1, data2, setBreakPoint]);

  if (isLoading1 || isFetching1 || !data1) {
    return <div>Loading...</div>;
  }
  if (isLoading2 || isFetching2) {
    return <div>Loading...</div>;
  }

  const { graphData: graphData1 = [] } = data1 || {};
  const { graphData: graphData2 = [] } = data2 || {};

  if (isError1 || !graphData1 || !showPerformanceGraph) {
    return <></>;
  }
  if (graphData1.length === 0) {
    // TODO i18n
    return <TWDataMessage className=''>{i18n.common.nodata}</TWDataMessage>;
  }

  const refData: any = {};
  graphData1.forEach((rankItem: any, idx: number) => {
    const { week, position } = rankItem || {};
    refData[week] = {
      t1: rankItem,
    };
  });

  const points = (
    (!isValEmpty(graphData2) && graphData2) ||
    graphData1 ||
    []
  ).map((rankItem: any, idx: number) => {
    const { week, position } = rankItem || {};
    refData[week]['t2'] = rankItem; // TODO

    if (week < breakPoint) {
      return {
        name: week,
        y1a: position,
        y1b: null,
        y2a: refData[week]['t1']?.position,
        y2b: null,
      };
    } else if (week === breakPoint) {
      return {
        name: week,
        y1a: position,
        y1b: position,
        y2a: refData[week]['t1']?.position,
        y2b: refData[week]['t1']?.position,
      };
    }

    return {
      name: week,
      y1a: null,
      y1b: position,
      y2a: null,
      y2b: refData[week]['t1']?.position,
    };
  });

  const selecteds1 = graphData1.filter((item: any) => item.week === breakPoint);
  const selecteds2 = graphData2.filter((item: any) => item.week === breakPoint);
  const selected1 = selecteds1 && selecteds1.length > 0 ? selecteds1[0] : {};
  const selected2 = selecteds2 && selecteds2.length > 0 ? selecteds2[0] : {};
  const { events: events1 = [] } = selected1;
  const { events: events2 = [] } = selected2;
  const maxTick = Math.max(numTeams || 0, Math.round(points.length / 2) + 1);

  return (
    <div className=' text-sm'>
      <div className='dev space-y-2.5 rounded-lg bg-light-match p-2 pb-6 dark:bg-dark-match'>
        <div className=''>
          <div className='flex justify-between font-medium'>
            <div className='text-logo-blue'>{selected1.position}</div>
            <div className='text-csm'>{i18n.competition.position}</div>
            <div className='text-logo-yellow'>{selected2.position}</div>
          </div>
          <div className='flex justify-between '>
            <div>{breakPoint}</div>
            <div className='text-csm text-dark-text'>{`Week ( ${formatTimestamp(
              selected1.timeframeStart,
              'yyyy/MM/dd'
            )} - ${formatTimestamp(
              selected1.timeframeEnd,
              'yyyy/MM/dd'
            )} )`}</div>
            <div>{breakPoint}</div>
          </div>
        </div>
        <div className=' flex place-content-center'>
          <div className=' h-72 w-96'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={points}
                margin={{
                  // top: 5,
                  right: 10,
                  left: 10,
                  // bottom: 5,
                }}
                style={{
                  fontSize: '0.75vw',
                  padding: '0',
                }}
              >
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='name'
                  interval={0}
                  style={{
                    fontSize: '0.75vw',
                  }}
                  angle={-30}
                />
                <YAxis
                  reversed
                  name='Week'
                  style={{
                    fontSize: '0.75vw',
                  }}
                  ticks={generateTicks(maxTick, 2)}
                  domain={[1, maxTick]}
                  width={15}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#222',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                  }}
                />
                <Line
                  dataKey='y1a'
                  stroke='#F6B500'
                  activeDot={{ r: 5 }}
                  name={team2?.name}
                  width={15}
                  type='linear'
                  strokeWidth={1.3}
                  dot={false}
                />

                <Line
                  type='linear'
                  dataKey='y1b'
                  stroke='#b79f5e'
                  activeDot={{ r: 5 }}
                  name={team2?.name}
                  width={15}
                  strokeWidth={1.3}
                  dot={false}
                />

                <Line
                  type='linear'
                  dataKey='y2a'
                  stroke='#2187E5'
                  name={team1?.name}
                  activeDot={{ r: 5 }}
                  strokeWidth={1.3}
                  dot={false}
                />
                <Line
                  type='linear'
                  dataKey='y2b'
                  stroke='#3d5e7c'
                  name={team1?.name}
                  activeDot={{ r: 5 }}
                  strokeWidth={1.3}
                  dot={false}
                />

                <ReferenceLine
                  x={breakPoint}
                  stroke='#666'
                  strokeWidth={1}
                  // label={breakPoint}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className='flex h-20 justify-between gap-4'>
        <div className='flex items-center'>
          <TwFilterButton
            onClick={() => {
              setBreakPoint(Math.max(breakPoint - 1, 1));
            }}
            className='item-hover'
          >
            {i18n.filter.previous}
          </TwFilterButton>
        </div>
        <div className=' divide-list-x flex flex-1 justify-center'>
          {events1.length > 0 && (
            <ul className=' flex flex-col place-content-center items-center gap-2 px-4'>
              {events1.map((event: any, idx: number) => {
                const {
                  homeTeam = {},
                  awayTeam = {},
                  homeScore = {},
                  awayScore = {},
                  status,
                } = event || {};

                const { code = -1 } = status || {};
                const isScoreAvailable = code > 90;

                return (
                  <li key={idx} className='  flex items-center gap-2'>
                    <div>
                      <SoccerTeam
                        team={homeTeam}
                        showName={false}
                        logoSize={18}
                      ></SoccerTeam>
                    </div>
                    <div className='flex items-center justify-between gap-1'>
                      {isScoreAvailable ? (
                        <>
                          <div>{homeScore.display}</div>
                          <div>-</div>
                          <div>{awayScore.display}</div>
                        </>
                      ) : (
                        <div className='truncate text-xs text-dark-text'>
                          {genStatusText(status, i18n)}
                        </div>
                      )}
                    </div>
                    <div>
                      <SoccerTeam
                        team={awayTeam}
                        showName={false}
                        logoSize={18}
                      ></SoccerTeam>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {events2.length > 0 && (
            <ul className=' flex flex-col place-content-center items-center gap-2 px-4'>
              {events2.map((event: any, idx: number) => {
                const {
                  homeTeam = {},
                  awayTeam = {},
                  homeScore = {},
                  awayScore = {},
                  status,
                } = event || {};

                const { code = -1 } = status || {};
                const isScoreAvailable = code > 90;

                return (
                  <li key={idx} className='  flex items-center gap-2'>
                    <div>
                      <SoccerTeam
                        team={homeTeam}
                        showName={false}
                        logoSize={18}
                      ></SoccerTeam>
                    </div>
                    <div className='flex items-center justify-between gap-1'>
                      {isScoreAvailable ? (
                        <>
                          <div>{homeScore.display}</div>
                          <div>-</div>
                          <div>{awayScore.display}</div>
                        </>
                      ) : (
                        <div className='truncate text-xs text-dark-text'>
                          {genStatusText(status, i18n)}
                        </div>
                      )}
                    </div>
                    <div>
                      <SoccerTeam
                        team={awayTeam}
                        showName={false}
                        logoSize={18}
                      ></SoccerTeam>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className='flex items-center'>
          <TwFilterButton
            className='item-hover'
            onClick={() => {
              setBreakPoint(Math.min(breakPoint + 1, graphData1.length));
            }}
          >
            Next
          </TwFilterButton>
        </div>
      </div>
    </div>
  );
}
