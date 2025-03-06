import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { MatchStateBasketBall, isValEmpty } from '@/utils';
import tw from 'twin.macro';

const RoundOfMatchSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  
  const i18n = useTrans();

  const { homeTeam, awayTeam, awayScore = {} as any, homeScore = {} as any } = matchData || {};

  const statusCodeOverTime = matchData?.status?.code === MatchStateBasketBall.OverTime;

  if (isValEmpty(homeScore) || isValEmpty(awayScore)) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className='text-black dark:text-white'>{i18n.qv.team}</div>
        <div className='flex'test-id='home_scores'>
          <div className='w-10 text-center font-bold text-black dark:text-white'>{i18n.menu.total}</div>
          {[1,2,3,4].map(it => (<div key={it} className='w-10 text-center text-black dark:text-white'>{it}</div>))}
          {homeScore?.overtime != 0 && awayScore?.overtime != 0 && <div className='w-10 text-center text-black dark:text-white'>OT</div>}
        </div>
      </TwQWRoundOfMatchRow>
      <div className='w-full h-[1px] bg-bkg-border-gradient mb-2'></div>
      {/* bottom */}
      <RoundOfMatchRow team={homeTeam} homeScore={homeScore} awayScore={awayScore} isOverTime={statusCodeOverTime}/>
      <RoundOfMatchRow team={awayTeam} homeScore={awayScore} awayScore={homeScore} isOverTime={statusCodeOverTime}/>
    </TwQWRoundOfMatchContainer>
  );
};
export default RoundOfMatchSection;

export const TwQWRoundOfMatchContainer = tw.div`rounded-md px-4 py-2 pt-0 mb-4`;
export const TwQWRoundOfMatchRow = tw.div`flex justify-between items-center py-2 text-csm`;

// Round Of Match Row component
export const RoundOfMatchRow = ({ team, awayScore, homeScore, isOverTime}: {team: Record<string,any>, awayScore: Record<string,any>, homeScore: Record<string,any> , isOverTime?:boolean}) => {
  return (
    <TwQWRoundOfMatchRow>
<div className='flex items-center gap-2 dark:text-white' test-id='round-backetball-box'>
        <Avatar id={team?.id} type='team' width={24} height={24} isBackground={false} rounded={false} />
        {team?.name}
      </div>
      <div className='flex'>
        <div className={`w-10 text-center font-bold ${homeScore?.display > awayScore?.display ? 'text-logo-blue' : 'text-black dark:text-white'}`}>{homeScore?.display}</div>
        {[1,2,3,4].map((score:number) => (<div key={score} className={`w-10 text-center ${homeScore[`period${score}`] > awayScore[`period${score}`] ? 'text-logo-blue' : 'text-black dark:text-white'}`}>{homeScore[`period${score}`]}</div>))}
        {homeScore?.overtime != 0 && awayScore?.overtime != 0 && <div className={`w-10 text-center ${homeScore?.overtime > awayScore?.overtime ? 'text-logo-blue' : 'text-black dark:text-white'}`}>{homeScore?.overtime}</div>}
      </div>
    </TwQWRoundOfMatchRow>
  )
}
