import Tippy from '@tippyjs/react';
import { BsInfoCircleFill } from 'react-icons/bs';

import { BellOn } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { useOddsStore } from '@/stores';
import useTrans from '@/hooks/useTrans';

export const MatchListHeader = () => {
  const { showOdds } = useOddsStore();
  const i18n = useTrans();

  return (
    <div className='h-auto p-2 !px-0 text-csm dark:bg-dark-wrap-match md:px-2.5 dark:lg:bg-transparent'>
      <div className='flex items-center rounded-md md:px-2'>
        <div className='flex w-14 flex-col-reverse items-center justify-evenly md:flex-row lg:w-12'>
          {/* <TwFavoriteCol className=''></TwFavoriteCol> */}
          <div className='flex w-auto flex-col place-content-center items-center text-black dark:text-white'>
            {i18n.menu.time}
          </div>
        </div>
        <div className='flex flex-1 gap-2 pl-2'>
          <div className='flex w-auto flex-col place-content-center items-center text-black dark:text-white'>
            Player
          </div>

          {showOdds && (
            <>
              {/* <TwOddsColHeader className='flex dev8'>
                <OddsFilters></OddsFilters>
              </TwOddsColHeader> */}

              {/* <OddsSettingsMainCol showAll={true}></OddsSettingsMainCol> */}
            </>
          )}
        </div>
        <div className='flex gap-1 xl:gap-2.5'>
          <div className='flex w-4 flex-col place-content-center gap-1 text-center text-black dark:text-white lg:w-5 lg:gap-2'>
            FT
          </div>
        </div>
        <div className='flex w-8 flex-col items-center justify-between'>
          <Tippy
            content={
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-1'>
                  <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />: {i18n.info.add_to_my_favorite}
                </div>
                <div className='flex items-center gap-1'>
                  <BellOn />: {i18n.info.follow_receive_notifications_match}
                </div>
              </div>
            }
          >
            <span>
              <BsInfoCircleFill />
            </span>
          </Tippy>
        </div>
      </div>
    </div>
  );
};
