import clsx from 'clsx';
import tw from 'twin.macro';

export const TwTransferFeeText = tw.div`text-xs font-normal not-italic leading-5 dark:text-dark-text`;
export const TwTransferValueText = tw.div`text-xs font-normal leading-5 text-dark-text`;
export const TwSectionContainer = tw.div`flex flex-col gap-3 lg:flex-row`;
export const TwMainColContainer = tw.div`flex flex-col lg:flex-row`;

export const Divider = ({
  className,
  height,
}: {
  className?: string;
  height?: string;
}) => {
  return (
    <div
      className={clsx(
        className,
        `h-${height || '0.5'} bg-light-match dark:bg-dark-hl-3`
      )}
    ></div>
  );
};
