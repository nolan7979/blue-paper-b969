import {
  TwBorderLinearBox,
  TwQuickViewTitleV2,
} from '@/components/modules/common';
import { TwQVDetailTabContainer } from '@/components/modules/football/tw-components/TwQuickview.module';
// import QuickViewForm from '@/components/modules/table-tennis/quickviewColumn/QuickViewForm';
// import MatchPerfomanceSection from '@/components/modules/table-tennis/quickviewColumn/detailTab/MatchPerfomanceSection';
import MatchRoundSection from '@/components/modules/table-tennis/quickviewColumn/detailTab/MatchRoundSection';
// import PrematchStandingSection from '@/components/modules/table-tennis/quickviewColumn/detailTab/PrematchStandingSection';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
// import { useHistoricalRecentMatch } from '@/hooks/useTennis';
import useTrans from '@/hooks/useTrans';
// import clsx from 'clsx';
// import { Tooltip } from 'flowbite-react';
// import { useTranslation } from 'next-i18next';
import React from 'react';
import tw from 'twin.macro';
// import tw from 'twin.macro';
import vi from '~/lang/vi';
import AddressSVG from '/public/svg/address.svg';
import CapacitySVG from '/public/svg/capacity.svg';
import OddDownSVG from '/public/svg/odd-down.svg';
import OddUpSVG from '/public/svg/odd-up.svg';
import StadiumSVG from '/public/svg/stadium_icon.svg';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import TournamentInfo from '@/components/modules/common/TournamentInfo';
import { TwQuickViewSection } from '@/components/modules/football/tw-components';

const QuickViewDetailTab = ({
  matchData,
  setActiveTab,
  sport = 'table-tennis',
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  managerData?: any;
  setActiveTab?: (e: string) => void;
  sport?: string;
  setTabActive?: (e: string) => void;
  isDetail?: boolean;
}) => {
  const i18n = useTrans();
  // const {
  //   homeTeam,
  //   awayTeam,
  // } = matchData || {};
  // const { data: homeData } = useHistoricalRecentMatch(homeTeam?.id as string);
  // const { data: awayData } = useHistoricalRecentMatch(awayTeam?.id as string);

  return (
    <div className='space-y-8'>
      <MatchRoundSection matchData={matchData} />

      {/* <AttackMomentumSection matchData={matchData} /> */}

      {/* <MatchPerfomanceSection matchData={matchData} /> */}
      <TwQVDetailTabContainer className='space-y-8 pb-8'>
        <div className='space-y-8 px-2.5 lg:px-0'>
          {/* PHONG DO */}
          {/* <QuickViewForm
            homeData={homeData}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            awayData={awayData}
          /> */}

          {/* TRƯỚC TRẬN ĐẤU */}
          {/* <PrematchStandingSection
            matchData={matchData}
            i18n={i18n}
            setActiveTab={setActiveTab}
          /> */}
          {/* <TeamH2HSection matchData={matchData} i18n={i18n} /> */}
          {/* TRỌNG TÀI */}
          {/* <RefereeSection i18n={i18n} matchData={matchData} /> */}
          {/* SÂN VẬN ĐỘNG */}
          <VenueSection i18n={i18n} matchData={matchData} />
        </div>
      </TwQVDetailTabContainer>
    </div>
  );
};

export default QuickViewDetailTab;

export const VenueSection = ({
  matchData,
  i18n = vi,
}: {
  matchData: SportEventDto;
  i18n?: any;
}) => {
  const { venue } = matchData;
  return (
    <TwMbQuickViewWrapper className='pt-2 dark:pt-0'>
      <TwQuickViewTitleV2 className='text-center'>
        {i18n.titles.venue}
      </TwQuickViewTitleV2>
      <TwBorderLinearBox className='dark:border-linear-box space-y-2 p-4 dark:bg-primary-gradient'>
        {venue && Object.keys(venue).length > 0 && (
          <React.Fragment>
            <TwQuickViewSection className='space-y-2 p-4'>
              <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
                <div className='flex gap-x-2'>
                  <StadiumSVG className='h-6 w-6' />
                  <TwContentVenue>{i18n?.qv.name}</TwContentVenue>
                </div>
                <TwContentVenue className='text-black dark:!text-white'>
                  {venue?.name || ''}
                </TwContentVenue>
              </div>
              <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
                <div className='flex gap-x-2'>
                  <AddressSVG className='h-6 w-6' />
                  <TwContentVenue>{i18n?.qv.location}</TwContentVenue>
                </div>
                <TwContentVenue className='text-black dark:!text-white'>
                  {venue?.city || ''}
                </TwContentVenue>
              </div>
              <div className='flex justify-between  border-b border-dashed border-[#272a31] pb-1'>
                <div className='flex gap-x-2'>
                  <CapacitySVG className='h-6 w-6' />
                  <TwContentVenue>{i18n?.competitor.capacity}</TwContentVenue>
                </div>
                <TwContentVenue className='text-black dark:!text-white'>
                  {venue?.capacity}
                </TwContentVenue>
              </div>
            </TwQuickViewSection>
          </React.Fragment>
        )}

        <TournamentInfo
          tournament={matchData?.uniqueTournament}
          startTimestamp={matchData?.startTimestamp}
          roundInfo={matchData?.roundInfo}
        />
      </TwBorderLinearBox>
    </TwMbQuickViewWrapper>
  );
};

export const TwContentVenue = tw.span`text-csm dark:text-dark-text`;
