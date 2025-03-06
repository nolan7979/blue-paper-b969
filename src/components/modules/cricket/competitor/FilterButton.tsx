import clsx from 'clsx';
import { TwBorderLinearBox } from '@/components/modules/common';

type FilterButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

export const FilterButton: React.FC<FilterButtonProps> = ({
  isActive,
  label,
  onClick,
}) => {
  return (
    <TwBorderLinearBox
      className={`h-8 !rounded-full lg:w-fit lg:!min-w-[120px] ${
        isActive ? 'border-linear-form' : ''
      }`}
    >
      <button
        className={clsx(
          'flex h-full w-full items-center justify-center rounded-full px-4 ',
          {
            'dark:bg-button-gradient cursor-default bg-dark-button text-white':
              isActive,
          }
        )}
        onClick={onClick}
      >
        <span className='text-csm'>{label}</span>
      </button>
    </TwBorderLinearBox>
  );
};
