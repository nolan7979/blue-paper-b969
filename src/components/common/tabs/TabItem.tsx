import clsx from 'clsx';
import React, { ComponentProps } from 'react';

export interface TabItemProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: string;
  completed?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  icon?: React.FC<React.SVGAttributes<SVGAElement>>;
  logo?: React.ReactNode;
  /**
   * Show title on content section
   */
}

export const TabItem: React.FC<TabItemProps> = ({
  children,
  className,
  active,
  ...props
}) => {
  return (
    <div
      className={clsx(className, {
        'opacity-50': props.disabled,
        'font-semibold': active,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
