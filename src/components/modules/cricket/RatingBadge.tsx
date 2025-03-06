import tw from 'twin.macro';

import { genRatingColor, isValEmpty, roundNumber } from '@/utils';
import clsx from 'clsx';

export const RatingBadge = ({
  point,
  isSmall = true,
  className,
}: {
  point: number;
  isSmall?: boolean;
  className?: string;
}) => {
  if (!point) {
    return <></>;
  }

  const color = genRatingColor(point);

  return (
    <div
      className={clsx(
        className,
        color +
          ' flex place-content-center items-center rounded-cmd px-[1px] font-oswald text-[10px] font-medium leading-3 tracking-tighter dark:text-white'
      )}
      css={[isSmall && tw`h-5 w-fit`, !isSmall && tw`h-6 w-fit`]}
    >
      <span className='px-1' test-id='team-rate'>{roundNumber(point, 2)}</span>
    </div>
  );
};

export const AttributeBadge = ({
  point,
  color = '',
}: {
  point: number;
  color?: string;
}) => {
  if (!point) {
    return <></>;
  }

  let genColor = color;
  if (isValEmpty(color)) {
    genColor = genRatingColor(point);
  }

  return (
    <div
      className={
        genColor +
        ' flex h-5 w-fit place-content-center items-center rounded-cmd text-xs font-semibold leading-3 tracking-tighter text-black'
      }
    >
      <span className='px-1'>{roundNumber(point, 2)}</span>
    </div>
  );
};
