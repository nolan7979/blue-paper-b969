import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { CompetitorDto, TeamDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { useMemo } from 'react';
import tw from 'twin.macro';

const headerScoresDefault = ['FT', '1', '2', '3', '4' ];

const RoundOfMatchSection = ({
  matchScores,
  homeTeam,
  awayTeam,
}: {
  matchScores: { [key: string]: any };
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
}) => {
  const i18n = useTrans();
  const scoresNotStarted = ['p1', 'p2', 'p3', 'p4'];

  if (
    Object.values(matchScores).length === 0
  ) {
    return <></>;
  }
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box text-xs bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className='text-black dark:text-white'>{i18n.qv.team}</div>
        <div className='flex w-full justify-end gap-x-4'>
          {(Object.keys(matchScores).length > 0
            ? Object.keys(matchScores).map(period => ({
              key: period,
              label: period === 'ft' ? 'FT' : period === 'ot' ? 'OT' : period === 'ap' ? 'SO' : period.replace('p', '')
            }))
            : headerScoresDefault.map(period => ({
              key: period,
              label: period
            }))
          ).map(({ key, label }) => (
            <div key={key} className='min-w-11 text-center uppercase text-black dark:text-white'>
              {label}
            </div>
          ))}
        </div>
      </TwQWRoundOfMatchRow>
      <div className='mb-2 h-[1px] w-full bg-bkg-border-gradient'></div>
      {/* bottom */}
      {homeTeam?.id && awayTeam?.id && (
        <div className='space-y-4'>
          <RoundOfMatchRow
            scores={matchScores}
            matchId={homeTeam?.id}
            type='home'
          />
          <RoundOfMatchRow
            scores={matchScores}
            matchId={awayTeam?.id}
            type='away'
          />
        </div>
      )}
    </TwQWRoundOfMatchContainer>
  );
};
export default RoundOfMatchSection;

export const TwQWRoundOfMatchContainer = tw.div`rounded-md px-4 py-2 pt-0 mb-4`;
export const TwQWRoundOfMatchRow = tw.div`flex justify-between items-center py-2 text-csm`;

// Round Of Match Row component
export const RoundOfMatchRow = ({
  scores,
  matchId,
  type,
}: {
  scores: Record<string, any>;
  matchId: string;
  type: 'home' | 'away';
}) => {
  return (
    <div className='flex justify-between'>
      <div>
        <Avatar
          id={matchId}
          isSmall
          type='team'
          width={24}
          height={24}
          isBackground
          sport={SPORT.ICE_HOCKEY}
        />
      </div>
      <div className='flex justify-end gap-x-4'>
        {(Object.values(scores).length > 0
          ? Object.values(scores)
          : headerScoresDefault
        ).map((score: any, index: number) => {
          return (
            <div key={`home-score-${index}`} className={`min-w-11 text-center ${type === 'home' && score[0] > score[1] || type === 'away' && score[0] < score[1] ? 'text-light-active' : ''}`}>
              {Array.isArray(score) && (type === 'home' ? Number(score[0]) || '0' : Number(score[1]) || '0') || '-'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
