import tw from 'twin.macro';

// H2HBadge interface
interface H2HBadgeProps {
  numMatch: number;
  isHome?: boolean;
  isDraw?: boolean;
  isAway?: boolean;
}

export const H2HBadge = ({
  numMatch,
  isHome,
  isDraw,
  isAway,
}: H2HBadgeProps) => {
  return (
    <div
      className='font-medium'
      css={[
        isHome && tw`text-logo-blue`,
        isDraw && tw`text-white`,
        isAway && tw`text-logo-yellow`,
      ]}
    >
      {numMatch}
    </div>
  );
};
