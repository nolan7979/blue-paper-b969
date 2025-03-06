import { cn } from '@/utils/tailwindUtils';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  testId = 'tw-card',
}) => {
  return (
    <div
      test-id={testId}
      className={cn(
        'rounded-sm border border-none bg-light font-normal text-light-default dark:border-dark-stroke dark:bg-dark-gray dark:text-dark-default dark:shadow-dark-stroke md:rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
