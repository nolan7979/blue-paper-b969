import Avatar from '@/components/common/Avatar';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';
import { SPORT } from '@/constant/common';
import {
  CompetitorDto,
  TeamInfoFooty,
  TournamentDto,
} from '@/constant/interface';
import {
  genStatsPointColor,
  renderScoreDisplay,
} from '@/utils/footyUtils';
import clsx from 'clsx';
import { FC } from 'react';

export const TeamHeader: FC<{ team: CompetitorDto; tournament: TournamentDto }> = ({
  team,
  tournament,
}) => (
  <WrapperBorderLinearBox className='flex items-center justify-between p-3'>
    <div className='flex gap-2'>
      <Avatar
        type='team'
        id={team?.id}
        isBackground={false}
        isSmall
        width={48}
        height={48}
        sport={SPORT.FOOTBALL}
      />
      <div className='flex flex-col gap-2'>
        <span className='text-csm font-bold dark:text-white'>
          {team?.shortName || team?.name}
        </span>
        <div className='flex items-center justify-center gap-2'>
          <Avatar
            type='country'
            id={tournament?.category?.id}
            isBackground={false}
            isSmall
            width={16}
            height={16}
            sport={SPORT.FOOTBALL}
          />
          <span className='text-csm dark:text-white'>{`${
            tournament?.category?.name || ''
          } - ${tournament?.name || ''}`}</span>
        </div>
      </div>
    </div>
  </WrapperBorderLinearBox>
);

export type HeaderTitle = {
  title: string;
  className: string;
};

export const ResultTable: FC<{ headerTitles: HeaderTitle[]; results: any[] }> = ({
  headerTitles,
  results,
}) => (
  <div>
    <HeaderTable headerTitles={headerTitles} />
    {results.map((item) => (
      <ResultRow key={item.label} {...item} />
    ))}
  </div>
);

export const StatsTable: FC<{ headerTitles: HeaderTitle[]; stats: any[] }> = ({
  headerTitles,
  stats,
}) => (
  <div>
    <HeaderTable headerTitles={headerTitles} />
    {stats.map((item) => (
      <div
        key={item.label}
        className='flex border-b dark:border-light-darkGray border-light-theme text-csm'
      >
        <div className='flex w-1/4 items-center justify-center p-[10px] text-center dark:text-white'>
          {item.label}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.overall.className
          )}
        >
          {item.overall.value}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.home.className
          )}
        >
          {item.home.value}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.away.className
          )}
        >
          {item.away.value}
        </div>
      </div>
    ))}
  </div>
);

export const ResultRow: FC<{ ppg: number; result: string[]; label: string }> = ({
  ppg,
  result,
  label,
}) => {
  const pointColor = genStatsPointColor(ppg);

  return (
    <div className='flex border-b dark:border-light-darkGray border-light-theme text-csm'>
      <div className='w-1/4 p-[10px] text-center dark:text-white'>{label}</div>
      <div className='w-1/2 p-[10px] text-center'>
        {!!result?.length && (
          <div className='flex justify-center gap-1'>
            {result?.map((item, index) => {
              const { score, style } = renderScoreDisplay(item);
              return (
                <span
                  key={index}
                  className={`flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full font-oswald text-mxs font-semibold text-white ${style}`}
                >
                  {score}
                </span>
              );
            })}
          </div>
        )}
      </div>
      {Number(ppg) > 0 && (
        <div className='flex w-1/4 items-center justify-center p-[10px] text-center'>
          <span
            className={`flex h-6 w-fit items-center rounded-sm px-2 text-center font-oswald text-[14px] font-semibold text-white ${pointColor}`}
          >
            {ppg}
          </span>
        </div>
      )}
    </div>
  );
};

const HeaderTable: FC<{ headerTitles: HeaderTitle[] }> = ({ headerTitles }) => (
  <div className='flex dark:bg-dark-gray bg-white text-csm text-current'>
    {headerTitles.map((item, index) => (
      <div
        key={index}
        className={clsx(
          'flex items-center justify-center p-[10px] text-center',
          item.className
        )}
      >
        {item.title}
      </div>
    ))}
  </div>
);

export const GoalsScoredTable: FC<{ headerTitles: HeaderTitle[]; stats: any[] }> = ({
  headerTitles,
  stats,
}) => (
  <div>
    <HeaderTable headerTitles={headerTitles} />
    {stats.map((item) => (
      <div
        key={item.label}
        className='flex border-b dark:border-light-darkGray border-light-theme text-csm'
      >
        <div className='w-1/3 p-[10px] dark:text-white'>
          {item.label}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.home.className
          )}
        >
          {item.home.value}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.away.className
          )}
        >
          {item.away.value}
        </div>
      </div>
    ))}
  </div>
);

export const OverUnderGoalsTable: FC<{ headerTitles: HeaderTitle[]; stats: any[] }> = ({
  headerTitles,
  stats,
}) => (
  <div>
    <HeaderTable headerTitles={headerTitles} />
    {stats.map((item) => (
      <div
        key={item.label}
        className='flex border-b border-light-theme text-csm dark:border-light-darkGray'
      >
        <div className='w-1/4 p-[10px] dark:text-white'>{item.label}</div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.home.className
          )}
        >
          {item.home.value}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.away.className
          )}
        >
          {item.away.value}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.avg.className
          )}
        >
          {item.avg.value}
        </div>
      </div>
    ))}
  </div>
);

export const TeamsAverageTable: FC<{
  headerTitles: HeaderTitle[];
  stats: any[];
}> = ({ headerTitles, stats }) => (
  <div>
    <HeaderTable headerTitles={headerTitles} />
    {stats.map((item) => (
      <div
        key={item.label}
        className='flex border-b border-light-theme text-csm dark:border-light-darkGray'
      >
        <div className='w-1/4 p-[10px] dark:text-white'>{item.label}</div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.home.className
          )}
        >
          {item.home.value}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.away.className
          )}
        >
          {item.away.value}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center p-[10px] text-center',
            item.avg.className
          )}
        >
          {item.avg.value}
        </div>
      </div>
    ))}
  </div>
);
