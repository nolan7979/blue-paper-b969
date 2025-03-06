import { cn } from '@/utils/tailwindUtils';

const ScoreStats = ({
  highlight,
  score,
  type,
  ...rest
}: {
  highlight: boolean;
  score: number | string;
  type: 'away' | 'home';
  [key: string]: any;
}) => {
  return (
    <div>
      <span
        className={cn(
          'py-1',
          !highlight
            ? 'text-black dark:text-white'
            : `rounded-full px-[10px] font-medium text-white  ${
                type === 'away'
                  ? 'bg-light-detail-away dark:text-dark-card'
                  : 'bg-light-active dark:text-white'
              }`
        )}
        {...rest}
      >
        {score}
      </span>
    </div>
  );
};

export default ScoreStats;
