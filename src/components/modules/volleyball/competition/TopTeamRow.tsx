import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { RankingRecordDto } from '@/constant/interface';

type TopTeamRowProps = {
  rank: number;
  record: RankingRecordDto;
  stats: string;
};

export const TopTeamRow: React.FC<TopTeamRowProps> = ({
  rank,
  record,
  stats,
}) => {
  const { team, statistics } = record || { team: {} };

  return (
    <CustomLink
      href={`/`}
      className='cursor-pointer border-b border-dark-time-tennis bg-transparent last:border-none'
      target='_parent'
      disabled
    >
      <div className='item-hover flex items-center justify-between lg:py-2 lg:pl-1.5 '>
        <div className='flex items-center'>
          <span className='w-4 text-center font-primary text-csm text-white'>
            {rank}
          </span>
          <div className='flex w-10 justify-center lg:w-16'>
            <Avatar
              id={team?.id as string}
              type='competitor'
              width={36}
              height={36}
              isBackground={false}
              rounded={false}
              isSmall
            />
          </div>
          <div className='flex flex-col gap-1'>
            <span
              className='min-w-0 truncate text-left text-csm text-sm font-normal leading-5 text-white'
              style={{ listStyle: 'outside' }}
            >
              {team.shortName || team.name}
            </span>
            {/* <span
            className='min-w-0 truncate text-left text-msm font-normal leading-5'
            style={{ listStyle: 'outside' }}
          >
            NBA
            {team.competition.short_name || team.name}
          </span> */}
          </div>
        </div>
        <span className='w-12 text-center font-primary text-csm text-white'>
          {statistics[stats]}
        </span>
      </div>
    </CustomLink>
  );
};
