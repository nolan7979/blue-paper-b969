import { useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import {
  InjuryTime,
  MileStone,
} from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import { EventSeparator } from '@/components/modules/football/quickviewColumn/quickviewDetailTab/EventSeparator';
import TimeLineEventCardAway from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventCardAway';
import TimeLineEventCardHome from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventCardHome';
import TimeLineEventScoreAway from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventScoreAway';
import TimeLineEventScoreHome from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventScoreHome';
import TimeLineEventSubAway from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventSubAway';
import TimeLineEventSubHome from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventSubHome';
import TimeLineEventVarAway from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventVarAway';
import TimeLineEventVarHome from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventVarHome';
import { TwTitle } from '@/components/modules/football/tw-components';

import { useTimeLineStore } from '@/stores/timeline-store';

import { isValEmpty } from '@/utils';
import { determineScoreColor } from '@/utils/matchingColor';
import React from 'react';

const MatchEventSection = React.memo(
  ({
    showTitle = true,
    matchData = {},
    isDetail,
  }: {
    showTitle?: boolean;
    matchData?: any;
    isDetail?: boolean;
  }) => {
    const i18n = useTrans();
    const { idWithData } = useTimeLineStore();
    const [data, setData] = useState(
      idWithData.find((i) => i?.id === matchData?.id)
    );

    const { startTimestamp } = matchData || {};
    useEffect(() => {
      setData(idWithData.find((i) => i?.id === matchData?.id));
    }, [idWithData, matchData?.id]);

    if (isValEmpty(data?.timeline)) {
      return <></>;
    }

    if (!matchData || !data) {
      return <></>;
    }
    const onBenchEvents = Array.isArray(data.timeline)
      ? data.timeline?.filter(
          (event: any) =>
            event.time < 0 ||
            event.reason === 'player_on_bench' ||
            !isValEmpty(event.manager)
        )
      : [];

    return (
      <div className='space-y-2 p-2.5 px-0 lg:p-0'>
        {/* Time */}
        {/* <div className='py-2.5 text-center text-xs' test-id='date-time-line'>
          <span>{formatTimestamp(startTimestamp)}</span>
        </div> */}

        {showTitle && (
          <TwTitle className='text-center '>{i18n.qv.timeline}</TwTitle>
        )}
        <div className={`${isDetail && '-p-3'}`}>
          {/* <ul className='dev2 h-96 overflow-scroll'> */}
          <ul className='dev2'>
            {Array.isArray(data.timeline) ? (
              data.timeline?.map((event: any, idx: number) => {
                if (
                  event.time < 0 ||
                  event.reason === 'player_on_bench' ||
                  !isValEmpty(event.manager)
                ) {
                  return <div key={idx}></div>;
                } else if (event.incidentType === 'period') {
                  if (event) {
                    return (
                      <MileStone
                        key={idx}
                        className={determineScoreColor(
                          event.homeScore,
                          event.awayScore
                        )}
                        content={`${event.text}: ${event.homeScore} - ${event.awayScore}`}
                      ></MileStone>
                    );
                  } else {
                    return <></>;
                  }
                } else if (event.incidentType === 'card') {
                  return (
                    <div key={idx}>
                      {event.isHome ? (
                        <TimeLineEventCardHome
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      ) : (
                        <TimeLineEventCardAway
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      )}
                      <EventSeparator key={`s-${idx}`} />
                    </div>
                  );
                } else if (
                  event.incidentType === 'goal' ||
                  event.incidentType === 'inGamePenalty'
                ) {
                  return (
                    <div key={idx}>
                      {event.isHome ? (
                        <TimeLineEventScoreHome
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      ) : (
                        <TimeLineEventScoreAway
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      )}
                      <EventSeparator key={`s-${idx}`} />
                    </div>
                  );
                } else if (event.incidentType === 'substitution') {
                  return (
                    <div key={idx}>
                      {event.isHome ? (
                        <TimeLineEventSubHome
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      ) : (
                        <TimeLineEventSubAway
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      )}
                      <EventSeparator key={`s-${idx}`} />
                    </div>
                  );
                } else if (event.incidentType === 'penaltyShootout') {
                  return (
                    <div key={idx}>
                      {event.isHome ? (
                        <TimeLineEventScoreHome
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      ) : (
                        <TimeLineEventScoreAway
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      )}
                      <EventSeparator key={`s-${idx}`} />
                    </div>
                  );
                } else if (event.incidentType === 'injuryTime') {
                  return <InjuryTime key={idx} content={event.length} />;
                } else if (event.incidentType === 'varDecision') {
                  return (
                    <div key={idx}>
                      {event.isHome ? (
                        <TimeLineEventVarHome
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      ) : (
                        <TimeLineEventVarAway
                          key={idx}
                          event={event}
                          matchData={matchData}
                        />
                      )}
                      <EventSeparator key={`s-${idx}`} />
                    </div>
                  );
                }
              })
            ) : (
              <></>
            )}
            {!isValEmpty(onBenchEvents) && (
              <MileStone
                key='m-on_bench'
                content={i18n.timeline.on_bench}
              ></MileStone>
            )}
            {onBenchEvents?.map((event: any, idx: number) => {
              if (event.incidentType === 'card') {
                return (
                  <div key={idx}>
                    {event.isHome ? (
                      <TimeLineEventCardHome
                        key={idx}
                        event={event}
                        matchData={matchData}
                      />
                    ) : (
                      <TimeLineEventCardAway
                        key={idx}
                        event={event}
                        matchData={matchData}
                      />
                    )}
                    <EventSeparator key={`s-${idx}`} />
                  </div>
                );
              }
            })}
          </ul>
          {/* <PlayerStatsPopUpContentContainer></PlayerStatsPopUpContentContainer> */}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.matchData === nextProps.matchData &&
      prevProps?.isDetail === nextProps.isDetail &&
      prevProps?.showTitle === nextProps.showTitle
    );
  }
);

export default MatchEventSection;
