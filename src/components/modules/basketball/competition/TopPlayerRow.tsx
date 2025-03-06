import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { RankingRecordDto } from '@/constant/interface';

type TopTeamRowProps = {
  rank: number;
  record: RankingRecordDto;
  stats: string;
};

export const TopPlayerRow: React.FC<TopTeamRowProps> = ({
  rank,
  record,
  stats,
}) => {
  const { player, team, statistics } = record || { team: {}, player: {} };

  return (
    <CustomLink
      href={`/basketball/player/${team?.slug}/${player?.id}`}
      className='cursor-pointer border-b border-dark-time-tennis bg-transparent last:border-none'
      target='_parent'
    >
      <div className='item-hover flex items-center justify-between py-2 lg:pl-1.5 '>
        <div className='flex items-center gap-1.5'>
          <span className='w-4 text-center font-primary text-csm text-black dark:text-white'>
            {rank}
          </span>
          <div className='flex w-10 justify-center lg:w-16'>
            <Avatar
              id={player?.id as string}
              type='player'
              width={36}
              height={36}
              isSmall
            />
          </div>
          <div className='flex flex-col gap-1'>
            <span
              className='min-w-0 truncate text-left text-csm text-sm font-normal leading-5 text-black dark:text-white'
              style={{ listStyle: 'outside' }}
            >
              {player?.shortName || player?.name}
            </span>
            <span className='flex items-center gap-1'>
              <Avatar
                id={team?.id as string}
                type='team'
                width={15}
                height={15}
                isBackground={false}
                rounded={false}
                isSmall
              />
              <span className='font-primary text-msm'>
                {team?.name || team?.shortName}
              </span>
            </span>
          </div>
        </div>
        <span className='w-12 text-center font-primary text-csm text-black dark:text-white'>
          {statistics[stats]}
        </span>
      </div>
    </CustomLink>
  );
};
