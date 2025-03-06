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
  currIdClub?: string;
};

export const StandingRow: React.FC<StandingRowProps> = ({ rank, record , locale, currIdClub}) => {
  const { goals, goals_against, loss, overtime_loss, overtime_win, points, shootout_loss, shootout_win, total, win, team } = record;

  const localePath = useMemo(() => locale && locale !== 'en' ? `/${locale}` : '', [locale]);

  return (
    <li
      className='!mt-0 border-b border-line-default dark:border-head-tab last:border-none w-full'
      key={'uniqueKey'}
    >
      <CustomLink
        href={`${localePath}/hockey/competitor/${getSlug(team.name || team.shortname)}/${team.id}`}
        target='_parent'
        className='flex w-full items-center'
      >
        <div className={`flex h-8 w-full items-center justify-between font-primary text-sm text-black dark:text-white ${currIdClub === team?.id ? 'bg-[#093794]' : 'bg-white dark:bg-dark-card'}`}>
          <div className={`flex h-full border-r border-line-default dark:border-head-tab ${currIdClub === team?.id ? 'bg-[#093794]' : 'bg-white dark:bg-dark-card'} items-center pl-1.5 sticky left-0 z-[2] grow-0 shrink-0 basis-48 lg:basis-60 py-0.5`}>
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
                sport={SPORT.ICE_HOCKEY}
              />
            </div>
            <div className='w-28 block truncate lg:w-36'>
              <span className='text-left text-msm lg:text-csm'>
                {team.name || team.shortname}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className={`flex items-center py-0.5 h-full ${currIdClub === team?.id ? 'bg-[#093794]' : 'bg-white dark:bg-dark-card'}`}>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {points}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {win}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {loss}
            </div>
            <div className='w-14 text-center text-msm uppercase lg:w-16 lg:text-csm'>
              {`${overtime_loss} - ${overtime_win}`}
            </div>
            <div className='w-14 text-center text-msm uppercase lg:w-16 lg:text-csm'>
            {`${shootout_loss} - ${shootout_win}`}
            </div>
            <div className='w-14 text-center text-msm uppercase lg:w-16 lg:text-csm'>
            {`${goals} - ${goals_against}`}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {total}
            </div>
          </div>
        </div>
      </CustomLink>
    </li>
  );
};
