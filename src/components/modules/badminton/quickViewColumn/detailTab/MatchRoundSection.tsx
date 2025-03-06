import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
import { useMemo } from 'react';
import tw from 'twin.macro';

const MatchRoundSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const { homeTeam, awayTeam, scores = {} } = matchData || {};

  const handleScore = useMemo(() => {
    const getKey = Object.keys(scores).filter(
      (key: string) => key !== 'ft' && key !== 'pt' && !key.includes('x')
    );
    let homeScore = [],
      awayScore = [];
    if (getKey.length > 0) {
      homeScore = [1, 2, 3].map((it) => ({
        pScore: scores[`p${it}`] ? scores[`p${it}`][0] : '-',
        xScore: scores[`x${it}`] ? scores[`x${it}`][0] : '-',
      }));
      awayScore = [1, 2, 3].map((it) => ({
        pScore: scores[`p${it}`] ? scores[`p${it}`][1] : '-',
        xScore: scores[`x${it}`] ? scores[`x${it}`][1] : '-',
      }));
    } else {
      homeScore = [1, 2, 3].map((it) => '-');
      awayScore = [1, 2, 3].map((it) => '-');
    }
    return {
      score: scores,
      homeScore,
      awayScore,
    };
  }, [scores]);

  if (isValEmpty(scores)) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className=''>{i18n.titles.player}</div>
        <div className='flex'>
          {['FT', 1, 2, 3].map((it) => (
            <div key={it} className='w-10 text-center'>
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
      />
      <RoundOfMatchRow
        team={awayTeam}
        dataScore={handleScore}
        type='awayScore'
      />
    </TwQWRoundOfMatchContainer>
  );
};
export default MatchRoundSection;

export const TwQWRoundOfMatchContainer = tw.div`rounded-md px-4 py-2 pt-0 mb-4`;
export const TwQWRoundOfMatchRow = tw.div`flex justify-between items-center py-2 text-csm`;

// Round Of Match Row component
export const RoundOfMatchRow = ({ team, dataScore = {}, type }: any) => {
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
        <HandleGroupAvatar team={team} sport={'badminton'} size={20}></HandleGroupAvatar>
        <strong className='text-black dark:text-white truncate max-w-40'>{team?.name}</strong>
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
              {score.pScore} {score.xScore !== '-' && <sup>{score.xScore}</sup>}
            </div>
          ))}
      </div>
    </TwQWRoundOfMatchRow>
  );
};

const backupHtml = () => {
  return (
    <>
      <div className='mb-4 flex justify-end'>
        <div className='text-[8px]'>Match time</div>
        {['3:39', '1:13', '1:06', '1:20', '-', '-'].map((it) => (
          <div key={it} className='w-10 text-center text-[8px]'>
            {it}
          </div>
        ))}
      </div>
      <div className='mb-2 h-[1px] w-full bg-bkg-border-gradient'></div>

      <div>
        <div className='mb-2 text-[11px]'>Current Game</div>
        <ul className='mb-2 flex justify-center gap-1'>
          {[1, 2, 3, 4].map((it: any) => (
            <li
              key={it}
              className='flex cursor-default gap-1 rounded-sm border border-dark-time-tennis p-1 text-[8px] font-bold text-black dark:text-white'
            >
              <span>0:15</span>
              <span
                className={`${
                  it === 2 ? 'bg-dark-hl' : 'bg-dark-stadium-line'
                } rounded-sm px-[2px]`}
              >
                SP
              </span>
            </li>
          ))}
          <li className='flex cursor-default gap-1 rounded-sm border border-dark-time-tennis p-1 text-[8px] font-bold text-black dark:text-white'>
            <span>0:15</span>
          </li>
        </ul>
      </div>
    </>
  );
};
