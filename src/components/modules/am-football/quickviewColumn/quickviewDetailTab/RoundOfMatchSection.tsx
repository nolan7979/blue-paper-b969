import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
import { useMemo } from 'react';
import tw from 'twin.macro';

const RoundOfMatchSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  
  const i18n = useTrans();

  const { homeTeam, awayTeam, scores = {} as any } = matchData || {};

  const handleObjectScore = (score:any) => {
    const homeS = [1,2,3,4].map((it:any) => score[`p${it}`]?.[0] ? score[`p${it}`][0] : 0)
    const awayS = [1,2,3,4].map((it:any) => score[`p${it}`]?.[1] ? score[`p${it}`][1] : 0)
    return {
      scores: score,
      homeS,
      awayS
    }
  }

  const handleScore:any = useMemo(() => {
    if(!isValEmpty(scores)) return handleObjectScore(scores)
    return {}
  }, [scores]);

  if (isValEmpty(scores)) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className=''>{i18n.qv.team}</div>
        <div className='flex'>
          {[1,2,3,4].map(it => (<div key={it} className='w-10 text-center '>Q{it}</div>))}
          <div className='w-10 text-center font-bold '>FT</div>
          {scores?.ot && <div className='w-10 text-center font-bold '>AOT</div>}
        </div>
      </TwQWRoundOfMatchRow>
      <div className='w-full h-[1px] bg-bkg-border-gradient mb-2'></div>
      {/* bottom */}
      <RoundOfMatchRow team={homeTeam} inputScore={handleScore} type={'home'} />
      <RoundOfMatchRow team={awayTeam} inputScore={handleScore} type={'away'} />
    </TwQWRoundOfMatchContainer>
  );
};
export default RoundOfMatchSection;

export const TwQWRoundOfMatchContainer = tw.div`rounded-md px-4 py-2 pt-0 mb-4`;
export const TwQWRoundOfMatchRow = tw.div`flex justify-between items-center py-2 text-csm`;

// Round Of Match Row component
export const RoundOfMatchRow = ({ team, inputScore, type}: {team:any, inputScore:any, type:string}) => {
  return (
    <TwQWRoundOfMatchRow>
      <div className='flex items-center gap-1'>
        <Avatar id={team?.id} type='team' width={24} height={24} isBackground={false} rounded={false} sport='am-football' />
        <span>{team?.short_name || team?.name}</span>
      </div>
      <div className='flex'>
        {inputScore[type == 'home' ? 'homeS' : 'awayS'].map((score:number, index:number) => (
          <div key={`${score}-${index}-${type}`} className={`w-10 text-center ${inputScore[type == 'home' ? 'homeS' : 'awayS'][index] > inputScore[type == 'home' ? 'awayS' : 'homeS'][index] ? 'text-black dark:text-white' : ''}`}>
            {score}
            </div>
          )
        )}
        <div className={`w-10 text-center font-bold ${inputScore.scores.ft[type == 'home' ? 0 : 1] > inputScore.scores.ft[type == 'home' ? 1 : 0] ? 'text-black dark:text-white' : ''}`}>{inputScore.scores.ft[type == 'home' ? 0 : 1]}</div>
        {inputScore.scores?.ot && (
          <div
            className={`w-10 text-center font-bold ${
              inputScore.scores.ot?.[type == 'home' ? 0 : 1] >
              inputScore.scores.ot?.[type == 'home' ? 1 : 0]
                ? 'text-black dark:text-white'
                : ''
            }`}
          >
            {inputScore.scores.ot?.[type == 'home' ? 0 : 1]}
          </div>
        )}
      </div>
    </TwQWRoundOfMatchRow>
  )
}
