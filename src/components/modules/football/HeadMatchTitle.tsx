import {
  TwScoreColHeader,
  TwTeamScoreCol,
  TwTitleHeader,
} from '@/components/modules/football/tw-components';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import CornerSVG from 'public/svg/corner.svg';
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
        <TwTitleHeader>{i18n.menu.time}</TwTitleHeader>
      </div>
      <TwTeamScoreCol className=''>
        <TwTitleHeader className=''>{i18n.menu.team}</TwTitleHeader>
      </TwTeamScoreCol>
      <div className='flex gap-1 xl:gap-3'>
        <TwScoreColHeader className='text-black dark:text-white'>
          FT
        </TwScoreColHeader>
        <TwScoreColHeader className='text-black dark:text-white'>
          HT
        </TwScoreColHeader>
        <div className='flex flex-row items-center gap-1'>
          <Tippy content={i18n.menu.corner}>
            <span>
              <CornerSVG />
            </span>
          </Tippy>
        </div>
      </div>
    </div>
  );
};
export default HeadMatchTitle;
