import Avatar from '@/components/common/Avatar';
import { TwQuickViewTitleV2 } from '@/components/modules/common';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useMatchScoresTableTennis } from '@/hooks/useTableTennis';
import useTrans from '@/hooks/useTrans';
// import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
import tw from 'twin.macro';
const headerScoresDefault = ['FT'];

const MatchRoundSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();

  const { homeTeam, awayTeam, scores = {}, status } = matchData || {};

  if (isValEmpty(scores)) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow className='justify-start'>
        <div className='flex-1'>{i18n.titles.player}</div>
        <div className='flex flex-1 justify-start'>
          <div className='w-10 text-center text-[11px] lg:w-12'>FT</div>
        </div>
      </TwQWRoundOfMatchRow>
      {/* bottom */}
      <div className='space-y-2'>
        <RoundOfMatchRow
          scores={scores}
          type='home'
          matchId={homeTeam?.id}
          name={homeTeam?.shortName || homeTeam?.name}
        />
        <RoundOfMatchRow
          scores={scores}
          type='away'
          matchId={awayTeam?.id}
          name={awayTeam?.shortName || awayTeam?.name}
        />
      </div>
    </TwQWRoundOfMatchContainer>
  );
};
export default MatchRoundSection;

export const TwQWRoundOfMatchContainer = tw.div`rounded-md px-4 py-2 pt-0 mb-4`;
export const TwQWRoundOfMatchRow = tw.div`flex justify-between items-center py-2 text-[11px]`;

// Round Of Match Row component
export const RoundOfMatchRow = ({
  scores,
  matchId,
  type,
  name,
}: {
  scores: Record<string, any>;
  matchId: string;
  type: 'home' | 'away';
  name?: string;
}) => {
  return (
    <div className='flex'>
      <div className='flex flex-1 items-center justify-start gap-x-2'>
        <Avatar
          id={matchId}
          isSmall
          type='competitor'
          width={24}
          height={24}
          isBackground
          sport={SPORT.SNOOKER}
        />
        <span className='truncate text-ccsm dark:text-white'>{name}</span>
      </div>
      <div className='flex flex-1 justify-start'>
        {(Object.values(scores).length > 0
          ? Object.values(scores)
          : headerScoresDefault
        ).map((score: any, index: number) => {
          return (
            <div
              key={`home-score-${index}`}
              className={`w-10 text-center text-[11px] lg:w-12 ${
                (type === 'home' && score[0] > score[1]) ||
                (type === 'away' && score[0] < score[1])
                  ? 'text-light-active'
                  : ''
              }`}
            >
              {(Array.isArray(score) &&
                (type === 'home'
                  ? Number(score[0]) || '0'
                  : Number(score[1]) || '0')) ||
                '-'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
