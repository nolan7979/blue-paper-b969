import { useEffect, useState } from 'react';
import tw from 'twin.macro';

export const PeriodSwitcher = ({
  options,
  valGetter,
  half = 0,
}: {
  options: any[];
  valGetter: (x: any) => void;
  half: number;
}) => {
  const [choice, setChoice] = useState<number>(options[half || 0].value);

  useEffect(() => {
    valGetter(choice);
  }, [choice, valGetter]);

  return (
    <div className='flex items-center'>
      <button
        className='item-hover w-14 rounded-s-lg px-3 py-1.5 text-sm '
        onClick={() => setChoice(options[0].value)}
        css={[
          choice === options[0].value && tw`bg-logo-blue text-white`,
          choice === options[1].value && tw`bg-light-match dark:bg-dark-match`,
        ]}
      >
        {options[0].name}
      </button>
      <button
        className='item-hover w-14 rounded-e-lg px-3 py-1.5 text-sm '
        onClick={() => setChoice(options[1].value)}
        css={[
          choice === options[1].value && tw`bg-logo-blue text-white`,
          choice === options[0].value && tw`bg-light-match dark:bg-dark-match`,
        ]}
      >
        {options[1].name}
      </button>
    </div>
  );
};
