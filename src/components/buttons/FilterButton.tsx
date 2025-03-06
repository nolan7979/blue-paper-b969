import clsx from 'clsx';
import { memo } from 'react';
interface ITwFilterButton {
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  testId?: string;
}

export const TwFilterButtonV2: React.FC<ITwFilterButton> = memo(({
  isActive,
  className = '',
  children,
  onClick,
  testId,
  icon,
  disabled = false,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={clsx(
      className,
      'flex place-content-center gap-1 py-3 text-csm dark:hover:brightness-75',
      {
        'border-b-4 border-light-active fill-light-active text-light-active  dark:hover:brightness-100':
          isActive,
        'text-light-secondary dark:text-white': !isActive,
      }
    )}
    id={testId}
    aria-label={testId}
  >
    {icon}
    {children}
  </button>
), (prevProps, nextProps) => {
  return prevProps?.isActive === nextProps.isActive
    && prevProps?.disabled === nextProps.disabled;
});
