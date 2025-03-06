import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
import {
  MatchBaseballState,
  handleObjectScoreBaseball,
} from '@/utils/baseballUtils';
import { useMemo } from 'react';
import tw from 'twin.macro';

const RoundOfMatchSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const { status, homeTeam, awayTeam, scores } = matchData || {};
  const isMatchNortStarted = [MatchBaseballState.NOT_STARTED, MatchBaseballState.TO_BE_DETERMINED].includes(status?.code);
  const handleScore = useMemo(() => {
    if (!isValEmpty(scores)) return handleObjectScoreBaseball(scores);
    return {};
  }, [scores]);

  if (!scores) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className=''>{i18n.qv.team}</div>
        <div className='flex'>
          {!!scores?.ot &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 'EI', 'R', 'H', 'E'].map((it, idx) => (
              <div key={`round-${idx}`} className='w-6 text-center'>
                {it}
              </div>
            ))}
          {!scores?.ot &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 'R', 'H', 'E'].map((it, idx) => (
              <div key={`round-${idx}`} className='w-6 text-center'>
                {it}
              </div>
            ))}
        </div>
      </TwQWRoundOfMatchRow>
      <div className='mb-2 h-[1px] w-full bg-bkg-border-gradient'></div>
      {/* bottom */}
      <RoundOfMatchRow
        team={homeTeam}
        dataScore={handleScore}
        type='homeScore'
        isMatchNotStarted={isMatchNortStarted}
      />
      <RoundOfMatchRow
        isMatchNotStarted={isMatchNortStarted}
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
export const RoundOfMatchRow = ({
  team,
  dataScore = {},
  type,
  isMatchNotStarted,
}: any) => {
  const formatScore = (score: string) => (score === '' ? '0' : score);

  const handleTextColor = (idx: number) => {
    if (
      dataScore.homeScore[idx].pScore !== '-' &&
      dataScore.awayScore[idx].pScore !== '-'
    ) {
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

  const handleScoreColor = (key: string) => {
    const score = dataScore?.score?.[key];
    if (!score) return 'text-black dark:text-white';

    const [homeScore, awayScore] = score;
    const isHomeScore = type === 'homeScore';

    if (isHomeScore) {
      return homeScore > awayScore
        ? 'text-dark-hl'
        : 'text-black dark:text-white';
    } else {
      return homeScore < awayScore
        ? 'text-dark-hl'
        : 'text-black dark:text-white';
    }
  };

  return (
    <TwQWRoundOfMatchRow>
      <div className='flex items-center gap-[6px]'>
        <Avatar
          id={team?.id}
          type='team'
          width={24}
          height={24}
          className='shrink-0 grow-0 basis-6'
          isBackground={false}
          isSmall
          rounded={false}
        />
        {/* <strong className='text-black dark:text-white hidden lg:block'>{team?.name}</strong> */}
      </div>
      <div className='flex'>
        {/* <TennisBall className='w-[14px] h-[14px]' /> */}
        {dataScore?.score?.pt && (
          <div
            className={`flex w-7 items-center justify-end gap-1 font-bold text-dark-green`}
          >
            {formatScore(dataScore?.score?.pt[type === 'homeScore' ? 0 : 1])}
          </div>
        )}
        {dataScore[type] &&
          dataScore[type].map((score: any, index: number) => (
            <div
              key={`${score.pScore}-${index}-id`}
              className={`w-6 text-center ${handleTextColor(index)}`}
            >
              {!isMatchNotStarted && score.pScore || '-'}
            </div>
          ))}
        {!!dataScore?.score?.ot && (
          <div className={`w-6 text-center ${handleScoreColor('ot')}`}>
            {(dataScore?.score?.ot && !isMatchNotStarted &&
              dataScore?.score?.ot[type === 'homeScore' ? 0 : 1]) ||
              '-'}
          </div>
        )}
        <div className={`w-6 text-center ${handleScoreColor('ft')}`}>
          {(dataScore?.score?.ft &&
            !isMatchNotStarted &&
            dataScore?.score?.ft[type === 'homeScore' ? 0 : 1]) ||
            '-'}
        </div>
        <div className={`w-6 text-center ${handleScoreColor('h')}`}>
          {(dataScore?.score?.h && !isMatchNotStarted &&
            dataScore?.score?.h[type === 'homeScore' ? 0 : 1]) ||
            '-'}
        </div>
        <div className={`w-6 text-center ${handleScoreColor('e')}`}>
          {(dataScore?.score?.e && !isMatchNotStarted &&
            dataScore?.score?.e[type === 'homeScore' ? 0 : 1]) ||
            '-'}
        </div>
      </div>
    </TwQWRoundOfMatchRow>
  );
};
