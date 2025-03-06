import { useTimelineData } from '@/hooks/useFootball';

import { TeamPenShootout } from '@/components/modules/football/match/TeamPenShootout';
import {
  TwBorderLinearBox,
  TwTitle,
} from '@/components/modules/football/tw-components';

import { SportEventDtoWithStat } from '@/constant/interface';

export const PenaltyShootoutSection = ({
  matchData,
  i18n,
}: {
  matchData: SportEventDtoWithStat;
  i18n: any;
}) => {
  const { id, homeTeam = {}, awayTeam = {} } = matchData || {};
  const { data = [], isLoading } = useTimelineData(id, matchData?.status?.code);
  
  if (isLoading) return <></>;
  
  const penEvents = Array.isArray(data) ? data.filter((event: any) => event.incidentType === 'penaltyShootout').sort((a: any, b: any) => a.sequence - b.sequence) : [];

  if (penEvents.length === 0) return <></>;

  if (!matchData) {
    return <></>;
  }
  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <div className='space-y-4 p-2.5'>
        <TwTitle>{i18n.football.pen_shootout || 'Penalty Shootout'}</TwTitle>
        <div className='space-y-4 px-2'>
          <TeamPenShootout
            homeTeam={homeTeam}
            penEvents={penEvents}
            isHome={true}
            winnerCode={matchData.winnerCode}
          ></TeamPenShootout>
          <TeamPenShootout
            homeTeam={awayTeam}
            penEvents={penEvents}
            isHome={false}
            winnerCode={matchData.winnerCode}
          ></TeamPenShootout>
        </div>
      </div>
    </TwBorderLinearBox>
  );
};
