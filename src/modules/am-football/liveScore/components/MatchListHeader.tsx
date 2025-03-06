import Tippy from '@tippyjs/react';
import { useTranslation } from 'next-i18next';
import { BsInfoCircleFill } from 'react-icons/bs';

import { BellOn } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { TwMatchListContainer } from '@/components/modules/football';
import {
  TwBellCol,
  TwMatchHeader,
  TwScoreColHeader,
  TwTeamScoreCol,
  TwTitleHeader,
} from '@/components/modules/football/tw-components';

import { useOddsStore } from '@/stores';
import useTrans from '@/hooks/useTrans';

export const MatchListHeader = () => {
  const { showOdds } = useOddsStore();
  const i18n = useTrans();

  return (
    <TwMatchListContainer className='h-auto !px-0 text-csm dark:bg-dark-wrap-match dark:lg:bg-transparent'>
      <TwMatchHeader className=''>
        <div className='flex w-14 flex-col-reverse items-center justify-evenly md:flex-row lg:w-12'>
          {/* <TwFavoriteCol className=''></TwFavoriteCol> */}
          <TwTitleHeader>{i18n.time.hours}</TwTitleHeader>
        </div>
        <TwTeamScoreCol className=''>
          <TwTitleHeader className=''>{i18n.menu.team}</TwTitleHeader>

          {showOdds && (
            <>
              {/* <TwOddsColHeader className='flex dev8'>
                <OddsFilters></OddsFilters>
              </TwOddsColHeader> */}

              {/* <OddsSettingsMainCol showAll={true}></OddsSettingsMainCol> */}
            </>
          )}
        </TwTeamScoreCol>
        <div className='flex gap-1 xl:gap-2.5'>
          <TwScoreColHeader className='text-black dark:text-white'>
            FT
          </TwScoreColHeader>
        </div>
        <TwBellCol className=''>
          <Tippy
            content={
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-1'>
                  <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />: {i18n.info.add_to_my_favorite}
                </div>
                <div className='flex items-center gap-1'>
                  <BellOn />
                  {`: ${i18n.info.follow_receive_notifications_match}`}
                </div>
              </div>
            }
          >
            <span>
              <BsInfoCircleFill />
            </span>
          </Tippy>
        </TwBellCol>
      </TwMatchHeader>
    </TwMatchListContainer>
  );
};
