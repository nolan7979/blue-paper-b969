import {
  TwScoreColHeader,
  TwTeamScoreCol,
  TwTitleHeader,
} from '@/components/modules/football/tw-components';
import { twMerge } from 'tailwind-merge';
import vi from '~/lang/vi';

const HeadMatchTitle: React.FC<{ i18n?: any; className?: string }> = ({
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
        <TwTitleHeader>{i18n.time.hours}</TwTitleHeader>
      </div>
      <TwTeamScoreCol className=''>
        <TwTitleHeader className=''>{i18n.menu.team}</TwTitleHeader>
      </TwTeamScoreCol>
      <TwScoreColHeader className='text-black dark:text-white'>
        FT
      </TwScoreColHeader>
    </div>
  );
};
export default HeadMatchTitle;
