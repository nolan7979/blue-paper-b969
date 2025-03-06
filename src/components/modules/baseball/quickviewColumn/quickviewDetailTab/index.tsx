/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

// import AggregateScoreSection from '@/components/modules/baseketball/quickviewColumn/quickviewDetailTab/AggregateScoreSection';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import MatchWinningOddsSection from '@/components/modules/football/quickviewColumn/quickviewDetailTab/MatchWinningOddsSection';
import RefereeSection from '@/components/modules/football/quickviewColumn/quickviewDetailTab/RefereeSection';
import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import { TwQVDetailTabContainer } from '@/components/modules/football/tw-components/TwQuickview.module';

import { useOddsStore } from '@/stores';

import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { isShowOdds } from '@/utils';

import RoundOfMatchSection from '@/components/modules/baseball/quickviewColumn/quickviewDetailTab/RoundOfMatchSection';
import TeamH2HSection from '@/components/modules/baseball/teams/TeamH2HSection';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import { useConvertPath } from '@/hooks';
import { timeStampFormat } from '@/utils/timeStamp';
import vi from '~/lang/vi';
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
  const path = useConvertPath();
  const i18n = useTrans();
  const { showOdds } = useOddsStore();
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

      {/* <MatchPerfomanceSection matchData={matchData} /> */}

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
          {/* <PrematchStandingSection
            matchData={matchData}
            i18n={i18n}
            setActiveTab={setActiveTab}
          /> */}

          {/* ODDS  */}
          {/* only show on domain '.com' */}
          {isShowOdds(path) && showOdds && (
            <MatchWinningOddsSection i18n={i18n} matchData={matchData} />
          )}
          {/* TRỌNG TÀI */}
          <RefereeSection i18n={i18n} matchData={matchData} />
          {/* H2H */}
          {/* <ManagerH2HSection
          matchData={matchData}
          i18n={i18n}
        ></ManagerH2HSection> */}
          {matchData?.status?.code !== 0 && (
            <TeamH2HSection matchData={matchData} i18n={i18n} />
          )}
          {/* SÂN VẬN ĐỘNG */}
          {matchData?.venue && Object.keys(matchData?.venue).length > 0 && (
            <VenueSection i18n={i18n} matchData={matchData} />
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
  const { venue, uniqueTournament, startTimestamp } = matchData;
  const { name } = venue!;
  const { formattedDate, formattedTime } = timeStampFormat(startTimestamp);

  if (venue && Object.keys(venue).length <= 0) return <></>;

  return (
    <TwMbQuickViewWrapper>
      <TwQuickViewTitleV2 className='text-center'>
        {i18n.match.matchInfo}
      </TwQuickViewTitleV2>
      <div className='dark:border-linear-box rounded-md bg-white dark:bg-primary-gradient'>
        <div className='w-full text-csm p-4'>
          <div className='flex gap-x-2 text-black dark:text-white mb-2'>
            {uniqueTournament?.name}
          </div>
          <TwContentVenue className='text-[11px] text-black dark:text-dark-text-full'>
            {formattedDate} • {formattedTime}
          </TwContentVenue>
        </div>
        {/* <TwQuickViewSection className='space-y-2 p-4'>
          <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
            <div className='flex gap-x-2'>
              <StadiumSVG className='h-6 w-6' />
              <TwContentVenue>{i18n?.qv.name}</TwContentVenue>
            </div>
            <TwContentVenue className='text-black dark:!text-white'>{name}</TwContentVenue>
          </div>
          <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
            <div className='flex gap-x-2 text-black dark:text-white'>
              {uniqueTournament?.name}
            </div>
            <TwContentVenue className='text-black dark:!text-white'>
              {formattedDate} • {formattedTime}
            </TwContentVenue>
          </div>
        </TwQuickViewSection> */}
      </div>
    </TwMbQuickViewWrapper>
  );
};

export const TwContentVenue = tw.span`text-csm dark:text-dark-text`;
