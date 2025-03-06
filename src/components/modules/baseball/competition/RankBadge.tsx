import clsx from 'clsx';

type RankBadgeProps = {
  rank: number;
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
  return (
    <div
      className={clsx('flex h-4 w-4 items-center justify-center rounded-full', {
        'border border-dark-green text-dark-green': rank < 4,
      })}
    >
      <span className='text-msm font-normal'>{rank}</span>
    </div>
  );
};
