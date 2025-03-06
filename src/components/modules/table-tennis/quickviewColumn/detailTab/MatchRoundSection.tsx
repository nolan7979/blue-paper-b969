import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useMatchScoresTableTennis } from '@/hooks/useTableTennis';
import useTrans from '@/hooks/useTrans';
// import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
import tw from 'twin.macro';
const headerScoresDefault = ['FT', '1', '2', '3'];

const MatchRoundSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();

  const matchScores = useMatchScoresTableTennis(matchData);

  const handleKeyScore = (length: number) => {
    if (length >= 1)
      return [
        'FT',
        ...Array.from({ length: length }, (_, index) => `${index + 1}`),
      ];
    return ['FT', '1', '2', '3'];
  };
  const headerScores = handleKeyScore(
    Object.keys(matchScores).filter((key) => key != 'ft').length
  );

  const { homeTeam, awayTeam, scores = {}, status } = matchData || {};

  if (isValEmpty(scores)) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className=''>{i18n.titles.player}</div>
        <div className='flex'>
          {headerScores.map((it) => (
            <div key={it} className='w-10 text-center lg:w-12'>
              {it}
            </div>
          ))}
        </div>
      </TwQWRoundOfMatchRow>
      {/* bottom */}
      <div className='space-y-2'>
        <RoundOfMatchRow
          scores={matchScores}
          type='home'
          matchId={homeTeam?.id}
          name={homeTeam?.shortName || homeTeam?.name}
        />
        <RoundOfMatchRow
          scores={matchScores}
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
  name
}: {
  scores: Record<string, any>;
  matchId: string;
  type: 'home' | 'away';
  name?: string;
}) => {
  return (
    <div className='flex justify-between'>
      <div className='flex justify-start items-center gap-x-2'>
        <Avatar
          id={matchId}
          isSmall
          type='team'
          width={24}
          height={24}
          isBackground
          sport={SPORT.TABLE_TENNIS}
        />
        <span className='text-ccsm dark:text-white truncate'>{name}</span>
      </div>
      <div className='flex justify-end'>
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
                  ? `${score[0] ?? '-'}`
                  : `${score[1] ?? '-'}`)) ||
                '-'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
