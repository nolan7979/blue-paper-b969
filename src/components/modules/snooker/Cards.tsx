import tw from 'twin.macro';

export const RedCard = ({
  numCards = 1,
  size = 'md',
  isLineUp = false,
}: {
  numCards?: number;
  size?: string;
  isLineUp?: boolean;
}) => {
  if (numCards < 1) return <></>;

  return (
    <>
      <span
        css={[
          tw`bg-red-neg text-xs text-center text-white rounded-sm`,
          size === 'xxs' && tw`h-2.5 w-1.5`,
          size === 'xs' && tw`h-3.5 min-w-fit w-2.5`,
          size === 'sm' && tw`h-4 min-w-fit w-3`,
          size === 'md' && tw`h-4 w-3`,
          size === 'lg' && tw`h-5 w-4`,
          numCards > 0 ? tw`inline-block` : tw`hidden`,
        ]}
      >
        {/* <sup className='absolute top-2 left-1 '>{numCards > 1 ? numCards : ''}</sup> */}
        <span className='md:hidden'>{numCards > 1 ? numCards : ''}</span>
      </span>
      {isLineUp ? (
        <span className='hidden text-xs text-white md:inline'>
          {numCards > 1 ? `x${numCards}` : ''}
        </span>
      ) : (
        <span className='hidden text-cxs md:inline'>
          {numCards > 1 ? `x${numCards}` : ''}
        </span>
      )}
    </>
  );
};

export const YellowCard = ({
  numCards = 1,
  size = 'md',
  isLineUp = false,
}: {
  numCards?: number;
  size?: string;
  isLineUp?: boolean;
}) => {
  if (numCards < 1) return <></>;

  return (
    <>
      <span
        css={[
          tw`bg-yellow-card text-xs text-black text-center rounded-sm mr-1`,
          size === 'xxs' && tw`h-2.5 w-1.5`,
          size === 'xs' && tw`h-3.5 min-w-fit w-2.5`,
          size === 'sm' && tw`h-4 min-w-fit w-3`,
          size === 'md' && tw`h-[0.729rem] w-[0.583rem]`,
          size === 'lg' && tw`h-5 w-4`,
          numCards > 0 ? tw`inline-block` : tw`hidden`,
        ]}
      >
        <span className='md:hidden'>{numCards > 1 ? numCards : ''}</span>
      </span>
      {isLineUp ? (
        <span className='hidden text-xs text-white md:inline'>
          {numCards > 1 ? `x${numCards}` : ''}
        </span>
      ) : (
        <span className='hidden text-cxs md:inline'>
          {numCards > 1 ? `x${numCards}` : ''}
        </span>
      )}
    </>
  );
};
