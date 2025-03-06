import clsx from 'clsx';
import { genBorderColors } from '@/utils';
import CustomLink from '@/components/common/CustomizeLink';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { RankBadge } from '@/components/modules/basketball/competition/RankBadge';

type StandingRowProps = {
  rank: number;
  record: any;
};

export const StandingRow: React.FC<StandingRowProps> = ({ rank, record }) => {
  const { team, matches, wins, losses } = record;

  const formatPtc = (matches: number, wins: number) => {
    if (matches === 0) {
      return '0';
    }
    return `${(wins / matches).toFixed(2)}`;
  };

  return (
    <li
      className='!mt-0 border-b border-line-default dark:border-dark-time-tennis py-0.5 last:border-none'
      key={'uniqueKey'}
    >
      <CustomLink
        disabled
        href={`basketball/competitor/`} // TODO: Add href later
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
                id={team.id}
                type='team'
                height={24}
                width={24}
                isSmall
                isBackground={false}
                sport={SPORT.BASKETBALL}
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
