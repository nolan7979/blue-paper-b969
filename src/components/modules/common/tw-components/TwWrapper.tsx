import { twMerge } from 'tailwind-merge';
import tw from 'twin.macro';

export const TwWrapperBorderLinearBox = tw.div`rounded-md dark:border dark:border-line-default bg-white dark:border-0`;

export const WrapperBorderLinearBox = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <TwWrapperBorderLinearBox
      className={twMerge(
        'dark:border-linear-box dark:bg-primary-gradient',
        className
      )}
    >
      {children}
    </TwWrapperBorderLinearBox>
  );
};

export const baseClassesScores = 'flex h-full min-w-[1.375rem] items-center justify-center rounded-t-[4px] py-[2px] text-xs text-light-green dark:text-dark-green font-semibold';
