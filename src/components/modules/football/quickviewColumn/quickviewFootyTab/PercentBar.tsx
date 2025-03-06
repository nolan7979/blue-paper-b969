import clsx from 'clsx';
import { useMemo } from 'react';

const PercentBar = ({
  value,
  colorBase = 'bg-dark-draw/20 dark:bg-dark-main',
  colorMain = 'bg-line-dark-blue',
}: {
  value: number;
  colorBase?: string;
  colorMain?: string;
}) => {
  const formattedValue = useMemo(() => {
    return Math.min(Math.max(0, value), 100);
  }, [value]);

  return (
    <div
      className={clsx(
        'relative h-[5px] w-full overflow-hidden rounded-lg',
        colorBase
      )}
    >
      <div
        className={clsx('left-0 h-5', colorMain)}
        css={{ width: formattedValue + '%' }}
      />
    </div>
  );
};

export default PercentBar;
