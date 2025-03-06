import Avatar from '@/components/common/Avatar';
import { CompetitorDto } from '@/constant/interface';
import clsx from 'clsx';

type PlayByPlayHeaderProps = {
  team: CompetitorDto;
  subTitle?: string;
  className?: string;
};

const PlayByPlayHeader: React.FC<PlayByPlayHeaderProps> = ({
  team,
  subTitle,
  className,
}) => {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <Avatar
        id={team?.id}
        type='team'
        width={36}
        height={36}
        className='shrink-0 grow-0 basis-6'
        isBackground={false}
        isSmall
        rounded={false}
      />
      <div className='flex flex-col gap-1'>
        <p className='text-csm dark:text-white'>{team?.name || ''}</p>
        <p className='text-msm dark:text-dark-text'>{subTitle || ''}</p>
      </div>
    </div>
  );
};

export default PlayByPlayHeader;
