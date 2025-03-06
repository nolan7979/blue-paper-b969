import clsx from 'clsx';
import { genBorderColors, getSlug } from '@/utils';
import CustomLink from '@/components/common/CustomizeLink';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { RankBadge } from '@/components/modules/hockey/competition/RankBadge';
import { useMemo } from 'react';

type StandingRowProps = {
  rank: number;
  record: any;
  locale?: string;
  homeId?: string;
  awayId?: string;
};

export const StandingRow: React.FC<StandingRowProps> = ({ rank, record , locale, homeId, awayId}) => {
  const { team, matches, wins, losses } = record;

  const formatPtc = (matches: number, wins: number) => {
    if (matches === 0) {
      return '0';
    }
    return `${(wins / matches).toFixed(2)}`;
  };

  const localePath = useMemo(() => locale && locale !== 'en' ? `/${locale}` : '', [locale]);

  return (
    <li
      className='!mt-0 border-b border-light-theme dark:border-head-tab last:border-none w-full'
      key={'uniqueKey'}
    >
      <CustomLink
        href={`${localePath}/basketball/competitor/${getSlug(team.name || team.shortname)}/${team.id}`}
        target='_parent'
        className='flex w-full items-center'
      >
        <div className={clsx(`flex h-8 w-full items-center justify-between font-primary text-sm text-black dark:text-white bg-white dark:bg-dark-card`, {
          '!bg-[#ebeff6] dark:!bg-[#041840]' : homeId === team?.id,
          '!bg-[#fff9ec] dark:!bg-[#2a1e04]' : awayId === team?.id,
        })}>
          <div className={clsx(`flex h-full items-center pl-1.5 sticky left-0 z-[2] grow-0 shrink-0 basis-48 lg:basis-60 py-0.5 bg-white dark:bg-dark-card`, {
            '!bg-[#ebeff6] dark:!bg-[#041840]' : homeId === team?.id,
            '!bg-[#fff9ec] dark:!bg-[#2a1e04]' : awayId === team?.id,
          })}>
            <div className='flex w-4 justify-center'>
              <RankBadge rank={rank} />
            </div>
            {/* Team name */}
            <div className='flex w-10 justify-center lg:w-16'>
              <Avatar
                id={team.id}
                type='team'
                height={24}
                width={24}
                isSmall
                isBackground={false}
                sport={SPORT.BASKETBALL}
              />
            </div>
            <div className='w-28 block truncate lg:w-36'>
              <span className='text-left text-msm lg:text-csm'>
                {team.name || team.shortname}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className={clsx(`flex items-center py-0.5 h-full bg-white dark:bg-dark-card`,
            {
              '!bg-[#ebeff6] dark:!bg-[#041840]' : homeId === team?.id,
              '!bg-[#fff9ec] dark:!bg-[#2a1e04]' : awayId === team?.id,
            }
          )}>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {matches}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {wins}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {losses}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {formatPtc(matches, wins)}
            </div>
          </div>
        </div>
      </CustomLink>
    </li>
  );
};
