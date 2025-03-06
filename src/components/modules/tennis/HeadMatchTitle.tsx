import {
  TwTeamScoreCol,
  TwTitleHeader,
} from '@/components/modules/football/tw-components';
import { twMerge } from 'tailwind-merge';
import vi from '~/lang/vi';

export const HeadMatchTitle: React.FC<{ i18n?: any; className?: string }> = ({
  i18n = vi,
  className,
}) => {
  return (
    <div
      className={twMerge(
        'dark:bg-header-title flex items-center rounded-lg p-4 text-csm bg-white',
        className
      )}
    >
      <div className='flex w-14 flex-col-reverse items-center justify-evenly md:flex-row lg:w-12'>
        <TwTitleHeader>{i18n.menu.time}</TwTitleHeader>
      </div>
      <TwTeamScoreCol>
        <TwTitleHeader className=''>Player</TwTitleHeader>
      </TwTeamScoreCol>
    </div>
  );
};
