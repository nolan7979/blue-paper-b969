import { TwFilterBtn } from '@/components/modules/football/tw-components';
import clsx from 'clsx';
import React, { MouseEventHandler } from 'react';

export interface TabNumberProps {
  index: number;
  disabled?: boolean;
  active?: boolean;
  icon?: React.FC<React.SVGAttributes<SVGAElement>>;
  title?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  logo?: React.ReactNode;
}

export const TabNumber: React.FC<TabNumberProps> = ({
  title,
  active,
  onClick,
  logo,
}) => {
  if (logo) {
    return (
      <div
        className={clsx(
          'relative mx-auto mt-1 flex h-8 w-full items-center justify-center  gap-3 rounded-md border px-10 ',
          {
            'cursor-pointer': !!onClick,
            'border-all-blue bg-all-blue': !!active,
            'bg-light-match dark:border-dark-button dark:bg-dark-match':
              !active,
          }
        )}
        onClick={onClick}
      >
        {logo}
      </div>
    );
  }
  return (
    <div
      className={clsx(
        'relative flex items-center gap-3 whitespace-nowrap py-[15px]',
        {
          'cursor-pointer': !!onClick,
          'border-b border-all-blue': !!active,
        }
      )}
      onClick={onClick}
    >
      <span
        className={clsx(
          'w-full text-xs uppercase',
          active
            ? 'font-semibold text-all-blue'
            : 'text-light-default dark:text-dark-text'
        )}
      >
        {title}
      </span>
    </div>
  );
};
