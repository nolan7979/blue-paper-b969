import Button from '@/components/buttons/Button';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';
import { useHomeStore } from '@/stores';
import { memo } from 'react';
import { twMerge } from 'tailwind-merge';
import ExcludeSVG from '~/svg/exclude.svg';

interface IButtonLiveMatch {
  className?: string;
}

const ButtonLiveMatch: React.FC<IButtonLiveMatch> = memo(({ className }) => {
  const { matchLiveInfo, setMatchLiveInfo } = useHomeStore();
  return (
    <TwBorderLinearBox className='border-linear-form'>
      <Button
        className={twMerge(
          'flex min-w-[6.375rem] h-6 items-center justify-center gap-x-2 rounded-full !border-none !bg-dark-button hover:brightness-125',
          className
        )}
        onClick={() => setMatchLiveInfo(!matchLiveInfo)}
      >
        <ExcludeSVG className='h-4 w-4' />
      </Button>
    </TwBorderLinearBox>
  );
});
export default ButtonLiveMatch;
