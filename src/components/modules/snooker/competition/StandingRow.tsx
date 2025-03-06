import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SPORT } from '@/constant/common';
import { RankBadge } from '@/components/modules/basketball/competition/RankBadge';
import React, { useMemo } from 'react';
import { getSlug } from '@/utils';
import { FormBadgeWithHover } from '@/components/modules/football/quickviewColumn/QuickViewComponents';

type StandingRowProps = {
  rank: number;
  record: any;
  locale?: string;
};

export const StandingRow: React.FC<StandingRowProps> = ({
  rank,
  record,
  locale
}) => {
  const { team, matches, scoresDiff, points, wins, losses, draws } =
    record || {};

  const formatPtc = (matches: number, wins: number) => {
    if (matches === 0) {
      return '0';
    }
    return `${(wins / matches).toFixed(2)}`;
  };

  const localePath = useMemo(
    () => (locale && locale !== 'en' ? `/${locale}` : ''),
    [locale]
  );

  return (
    <li
      className='!mt-0 border-b border-line-default dark:border-dark-time-tennis py-0.5 last:border-none'
      key={'uniqueKey'}
    >
      <CustomLink
        href={`${localePath}/football/competitor/${getSlug(
          team?.name || team?.shortname
        )}/${team?.id}`}
        target='_parent'
        className='flex w-full items-center'
      >
        <div className='flex h-8 w-full items-center font-primary text-sm text-black dark:text-white'>
          <div className='flex h-full w-full items-center pl-1.5'>
            <div className='flex w-4 justify-center'>
              <RankBadge rank={rank} />
            </div>
            {/* Team name */}
            <div className='flex w-10 justify-center lg:w-16'>
              <Avatar
                id={team?.id}
                type='team'
                height={24}
                width={24}
                isSmall
                isBackground={false}
                sport={SPORT.FOOTBALL}
              />
            </div>
            <div className='w-30 flex justify-start lg:w-36'>
              <span className='text-left text-msm lg:text-csm'>
                {team?.name || team?.shortname}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className='flex'>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {matches}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {scoresDiff}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {points}
            </div>
            <div  className='flex items-center justify-center gap-0.5 min-w-24'>
              {wins > 0 &&
                Array.from({ length: 5 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <FormBadgeWithHover
                      isSmall
                      isDraw={false}
                      isWin={true}
                      isLoss={false}
                      team={team}
                      disabled
                    />
                  </React.Fragment>
                ))}
              {losses > 0 &&
                Array.from({ length: 5 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <FormBadgeWithHover
                      isSmall
                      isDraw={false}
                      isWin={false}
                      isLoss={true}
                      team={team}
                      disabled
                    />
                  </React.Fragment>
                ))}
              {draws > 0 &&
                Array.from({ length: 5 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <FormBadgeWithHover
                      isSmall
                      isDraw={true}
                      isWin={false}
                      isLoss={false}
                      team={team}
                      disabled
                    />
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      </CustomLink>
    </li>
  );
};
