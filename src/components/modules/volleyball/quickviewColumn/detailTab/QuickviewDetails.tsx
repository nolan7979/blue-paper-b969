/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

// import AggregateScoreSection from '@/components/modules/baseketball/quickviewColumn/quickviewDetailTab/AggregateScoreSection';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import { TwQVDetailTabContainer } from '@/components/modules/football/tw-components/TwQuickview.module';
import TeamH2HSection from '@/components/modules/volleyball/teams/TeamH2HSection';


import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';

import { TwBorderLinearBox } from '@/components/modules/common';
import RefereeSection from '@/components/modules/football/quickviewColumn/quickviewDetailTab/RefereeSection';
import MatchPerfomanceSection from '@/components/modules/volleyball/quickviewColumn/detailTab/MatchPerfomanceSection';
import PrematchStandingSection from '@/components/modules/volleyball/quickviewColumn/detailTab/PrematchStandingSection';
import RoundOfMatchSection from '@/components/modules/volleyball/quickviewColumn/detailTab/RoundOfMatchSection';
import { formatTimestamp } from '@/utils';
import vi from '~/lang/vi';
import AddressSVG from '/public/svg/address.svg';
import CapacitySVG from '/public/svg/capacity.svg';
import StadiumSVG from '/public/svg/stadium_icon.svg';

const QuickViewDetailTab = ({
  matchData,
  setActiveTab,
  sport = 'football',
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

  return (
    <div className='space-y-8'>
      {/* {isVisible && ( */}
      {/* <TwQuickViewTimeLine className='px-4 lg:!border-none lg:px-0 lg:dark:!bg-transparent'> */}
      {/* Thong so */}
      {/* {['football'].includes(sport) && (
        <>
          <AttackMomentumSectionV2 matchData={matchData} />

          <RenderIf isTrue={!isDetail}>
            {!isMatchNotStarted(matchData?.status?.code) && (
              <QuickViewPossessionRate matchData={matchData} i18n={i18n} />
            )}
          </RenderIf>

          <RatingSection matchData={matchData} setActiveTab={setActiveTab} />
          <PenaltyShootoutSection matchData={matchData} i18n={i18n} />
        </>
      )} */}

      {/* <BkbAttackMomentumSectionV2 matchData={matchData} />

      <RatingSection matchData={matchData} setActiveTab={setActiveTab} /> */}

      {/* The round of the match */}

      <RoundOfMatchSection matchData={matchData} />

      {/* match performance */}

      <MatchPerfomanceSection matchData={matchData} />

      {/* </TwQuickViewTimeLine> */}
      {/* )} */}

      <TwQVDetailTabContainer className='space-y-8 pb-8'>
        {/*  TY LE KEO */}
        {/* only show on domain '.com' */}
        {/* {isShowOdds(path) && showOdds && (
          <div className='space-y-0.5'>
            <OddsSettings showAll={false}></OddsSettings>
            <MatchDetailOddsSection
              matchData={matchData}
            ></MatchDetailOddsSection>
          </div>
        )} */}

        {/* TIMELINE */}
        {/* <MatchEventSection matchData={matchData} /> */}
        <div className='space-y-8 px-2.5 lg:px-0'>
          {/*  TY LE CHIEN THANG */}
          {/* <WinRateSection
            i18n={i18n}
            matchId={matchData?.id}
            statusCode={matchData?.status?.code}
            homeTeam={matchData?.homeTeam?.name as string}
            awayTeam={matchData?.awayTeam?.name as string}
          /> */}

          {/* PHONG DO */}
          {/* <QuickViewForm
            homeData={homeData}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            awayData={awayData}
          /> */}

          {/* TRƯỚC TRẬN ĐẤU */}
          <PrematchStandingSection
            matchData={matchData}
            i18n={i18n}
            setActiveTab={setActiveTab}
          />

          {/* ODDS  */}
          {/* only show on domain '.com' */}
          {/* {isShowOdds(path) && showOdds && (
            <MatchWinningOddsSection i18n={i18n} matchData={matchData} />
          )} */}
          {/* TRỌNG TÀI */}
          <RefereeSection i18n={i18n} matchData={matchData} />
          {/* H2H */}
          {/* <ManagerH2HSection
          matchData={matchData}
          i18n={i18n}
        ></ManagerH2HSection> */}
          <TeamH2HSection matchData={matchData} i18n={i18n} />
          {matchData?.uniqueTournament && (
            <div className='space-y-4'>
              <TwQuickViewTitleV2 className=''>
                {i18n.match.matchInfo}
              </TwQuickViewTitleV2>
              <TwBorderLinearBox className='dark:border-linear-box bg-white dark:bg-primary-gradient text-csm p-3 gap-1.5'>
                <p className='dark:text-white'>{matchData.uniqueTournament.name}</p>
                <span className='text-msm'>{formatTimestamp(matchData.startTimestamp)}</span>
              </TwBorderLinearBox>
            </div>
          )}
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
  const { city, stadium, country } = venue!;

  if (venue && Object.keys(venue).length <= 0) return <></>;

  return (
    <TwMbQuickViewWrapper>
      <TwQuickViewTitleV2 className='text-center'>
        {i18n.titles.venue}
      </TwQuickViewTitleV2>
      <div className='dark:border-linear-box bg-white dark:bg-primary-gradient rounded-md'>
        <TwQuickViewSection className='space-y-2 p-4'>
          <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
            <div className='flex gap-x-2'>
              <StadiumSVG className='h-6 w-6' />
              <TwContentVenue>{i18n?.qv.name}</TwContentVenue>
            </div>
            <TwContentVenue className='text-black dark:!text-white'>
              {stadium?.name}
            </TwContentVenue>
          </div>
          <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
            <div className='flex gap-x-2'>
              <AddressSVG className='h-6 w-6' />
              <TwContentVenue>{i18n?.qv.location}</TwContentVenue>
            </div>
            <TwContentVenue className='text-black dark:!text-white'>
              {city?.name || ''}{' '}
              {city?.name && country?.name ? `, ${country.name}` : ''}
            </TwContentVenue>
          </div>
          <div className='flex justify-between '>
            <div className='flex gap-x-2'>
              <CapacitySVG className='h-6 w-6' />
              <TwContentVenue>{i18n?.competitor.capacity}</TwContentVenue>
            </div>
            <TwContentVenue className='text-black dark:!text-white'>
              {stadium?.capacity}
            </TwContentVenue>
          </div>
        </TwQuickViewSection>
      </div>
    </TwMbQuickViewWrapper>
  );
};

export const TwContentVenue = tw.span`text-csm dark:text-dark-text`;
