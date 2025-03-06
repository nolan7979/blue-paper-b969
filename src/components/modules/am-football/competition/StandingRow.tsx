import clsx from 'clsx';
import { genBorderColors, getSlug } from '@/utils';
import CustomLink from '@/components/common/CustomizeLink';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { RankBadge } from '@/components/modules/basketball/competition/RankBadge';

type StandingRowProps = {
  rank: number;
  record: any;
  teamPageId?: String;
};

export const StandingRow: React.FC<StandingRowProps> = ({ rank, record, teamPageId }) => {
  const { team, win_rate, win, loss, goals, goals_against, total, draw } = record;

  const formatPtc = (matches: number, wins: number) => {
    if (matches === 0) {
      return '0';
    }
    return `${(wins / matches * 100).toFixed(1)}`;
  };

  return (
    <li
      className='!mt-0 border-b border-line-default dark:border-dark-time-tennis py-0.5 last:border-none'
      key={'uniqueKey'}
    >
      <CustomLink
        href={`/am-football/competitor/${getSlug(team?.short_name || team?.name)}/${team?.id}`} // TODO: Add href later
        target='_parent'
        className='flex w-full items-center'
      >
        <div className={`flex h-8 w-full items-center font-primary text-sm text-black dark:text-white ${team?.id === teamPageId && 'bg-primary-mask'}`}>
          <div className='flex h-full w-full items-center pl-1.5'>
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
                sport={SPORT.AMERICAN_FOOTBALL}
              />
            </div>
            <div className='w-30 flex justify-start lg:w-36'>
              <span className='text-left text-msm lg:text-csm'>
                {team.name || team.shortname}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className='flex'>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {win}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {draw}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {loss}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {`${goals}:${goals_against}`}
            </div>
            <div className='w-10 text-center text-msm uppercase lg:w-12 lg:text-csm'>
              {formatPtc(total, win)}
            </div>
          </div>
        </div>
      </CustomLink>
    </li>
  );
};
