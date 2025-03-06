import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { handleObjectScore, isValEmpty } from '@/utils';
import { useMemo } from 'react';
import tw from 'twin.macro';

const RoundOfMatchSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  
  const i18n = useTrans();

  const { homeTeam, awayTeam, scores } = matchData || {};

  const handleScore = useMemo(() => {
    if(!isValEmpty(scores)) return handleObjectScore(scores)
    return {}
  }, [scores]);

  if (isValEmpty(scores)) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className=''>Team</div>
        <div className='flex'>
          {['FT', 1, 2, 3, 4, 5].map((it) => (
            <div key={it} className='w-10 text-center'>
              {it}
            </div>
          ))}
        </div>
      </TwQWRoundOfMatchRow>
      {/* bottom */}
      <RoundOfMatchRow
        team={homeTeam}
        dataScore={handleScore}
        type='homeScore'
      />
      <RoundOfMatchRow
        team={awayTeam}
        dataScore={handleScore}
        type='awayScore'
      />
    </TwQWRoundOfMatchContainer>
  );
};
export default RoundOfMatchSection;

export const TwQWRoundOfMatchContainer = tw.div`rounded-md px-4 py-2 pt-0 mb-4`;
export const TwQWRoundOfMatchRow = tw.div`flex justify-between items-center py-2 text-csm`;

// Round Of Match Row component
export const RoundOfMatchRow = ({ team, dataScore = {}, type }: any) => {
  const formatScore = (score: string) => (score === '' ? '0' : score);

  const handleTextColor = (idx: number) => {
    if (dataScore.homeScore[idx].pScore !== '-' && dataScore.awayScore[idx].pScore !== '-') {
      if (type === 'homeScore') {
        return dataScore.homeScore[idx].pScore > dataScore.awayScore[idx].pScore
          ? 'text-dark-hl'
          : 'text-black dark:text-white';
      } else {
        return dataScore.homeScore[idx].pScore < dataScore.awayScore[idx].pScore
          ? 'text-dark-hl'
          : 'text-black dark:text-white';
      }
    }
    return 'text-black dark:text-white';
  };

  const handleScoreColor = () => {
    if (dataScore?.score?.ft) {
      if (type === 'homeScore') {
        return dataScore?.score?.ft[0] > dataScore?.score?.ft[1]
          ? 'text-dark-hl'
          : 'text-black dark:text-white';
      } else {
        return dataScore?.score?.ft[0] < dataScore?.score?.ft[1]
          ? 'text-dark-hl'
          : 'text-black dark:text-white';
      }
    }
    return 'text-black dark:text-white';
  };

  return (
    <TwQWRoundOfMatchRow>
      <div className='flex items-center gap-[6px]'>
        <Avatar id={team?.id} type='team' width={24} height={24} className='basis-6 grow-0 shrink-0' />
        <strong className='text-black dark:text-white'>{team?.name}</strong>
      </div>
      <div className='flex'>
        {/* <TennisBall className='w-[14px] h-[14px]' /> */}
        {dataScore?.score?.pt && (
          <div
            className={`flex w-12 items-center justify-end gap-1 font-bold text-dark-green`}
          >
            {formatScore(dataScore?.score?.pt[type === 'homeScore' ? 0 : 1])}
          </div>
        )}
        <div className={`w-10 text-center ${handleScoreColor()}`}>
          {dataScore?.score?.ft &&
            dataScore?.score?.ft[type === 'homeScore' ? 0 : 1]}
        </div>
        {dataScore[type] &&
          dataScore[type].map((score: any, index: number) => (
            <div
              key={`${score.pScore}-${index}-id`}
              className={`w-10 text-center ${handleTextColor(index)}`}
            >
              {score.pScore}
              {/* {score.xScore !== '-' && <sup>{score.xScore}</sup>} */}
            </div>
          ))}
      </div>
    </TwQWRoundOfMatchRow>
  );
};
