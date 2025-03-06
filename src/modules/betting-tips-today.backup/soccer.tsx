/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import tw from 'twin.macro';

import {
  useManagerData,
  useMatchTeamStreaksData,
  useSelectedMatchLineupsData,
  useTimelineData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import CustomLink from '@/components/common/CustomizeLink';
import { BellOff, BellOn } from '@/components/icons';
import { FilterPlayer } from '@/components/modules/football/match/FilterPlayer';
import { HorizontalLineUpSection } from '@/components/modules/football/match/HorizontalLineUpSection';
import { TeamPenShootout } from '@/components/modules/football/match/TeamPenShootout';
import {
  InjuryTime,
  MileStone,
} from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import { EventSeparator } from '@/components/modules/football/quickviewColumn/quickviewDetailTab/EventSeparator';
// import { BreadCumbLink } from '@/components/football/QuickViewColumn';
import TimeLineEventCardAway from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventCardAway';
import TimeLineEventCardHome from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventCardHome';
import TimeLineEventScoreAway from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventScoreAway';
import TimeLineEventScoreHome from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventScoreHome';
import TimeLineEventSubAway from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventSubAway';
import TimeLineEventSubHome from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TimeLineEventSubHome';
import TimeLineEventVarAway from '@/components/modules/cricket/quickviewColumn/quickviewDetailTab/TimeLineEventVarAway';
import TimeLineEventVarHome from '@/components/modules/cricket/quickviewColumn/quickviewDetailTab/TimeLineEventVarHome';
import {
  PlayerLineUp,
  SquadSummarySection,
  TeamPlayerList,
  TeamSuspensionList,
} from '@/components/modules/football/quickviewColumn/QuickViewSquadTab';
import { StandingTypeFilter } from '@/components/modules/football/quickviewColumn/QuickViewStandingsTab';
import TeamH2HCommonEvents from '@/components/modules/football/teams/TeamH2HCommonEvents';
import TeamH2HEachTeamEvents from '@/components/modules/football/teams/TeamH2HEachTeamEvents';
import {
  TwCard,
  TwDesktopView,
  TwDetailPageSmallCol,
  TwFilterButton,
  TwMainColDetailPage,
  TwMatchDetailDataSection,
  TwMobileView,
  TwQuickViewSection,
  TwQuickViewTimeLine,
  TwQuickViewTitle,
  TwTitle,
} from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';

import {
  calAverageAge,
  genDisplayedTime,
  getImage,
  Images,
  isStringNumeric,
  isValEmpty,
  splitSquad,
} from '@/utils';
import { genPlayerData } from '@/utils/genPlayerData';


import H2HStreakSection from '@/components/modules/football/quickviewColumn/quickViewMatchesTab/H2HStreakSection';
import TeamStreakSection from '@/components/modules/football/teams/TeamStreakSection';
import vi from '~/lang/vi';


// interface Props {
//   i18n: any;
// }

const MatchDetailedPage: NextPage = () => {
  const { mbDetailMatchTab } = useFilterStore();

  return (
    <div className=''>
      {/*<FootBallMenu />*/}

      <DroppingOddsSummarySection />

      <TwMobileView className='space-y-4'>
        {/* <MbDetailMenu i18n={i18n}></MbDetailMenu> */}
        <div className='px-2'>
          {mbDetailMatchTab === 'details' && (
            <div className='space-y-4'>
              {/* <PenaltyShootoutSection
                matchData={matchData}
                i18n={i18n}
              ></PenaltyShootoutSection> */}
              {/* <QuickViewDetailTab matchData={matchData} /> */}
            </div>
          )}
          {mbDetailMatchTab === 'squad' && (
            <div className='space-y-4'>
              {/* <QuickViewSquadTab matchData={matchData} /> */}
            </div>
          )}
          {mbDetailMatchTab === 'stats' && (
            <div className='space-y-4'>
              {/* <QuickViewStatsTab matchData={matchData} /> */}
            </div>
          )}
          {mbDetailMatchTab === 'matches' && (
            <>
              {/* <div className='space-y-4'>
                <QuickViewMatchesTab matchData={matchData} />
              </div> */}
              <TwCard className='space-y-4 p-2.5'>
                {/* <TwTitle className=''>{i18n.titles.h2h}</TwTitle> */}
                {/* <MatchesSectionCommon
                  matchData={matchData}
                  i18n={i18n}
                ></MatchesSectionCommon> */}
              </TwCard>

              <TwCard className='space-y-4 p-2.5'>
                {/* <TwTitle className=''>{i18n.titles.last_matches}</TwTitle> */}
                {/* <MatchesSectionEachTeam
                  matchData={matchData}
                  i18n={i18n}
                ></MatchesSectionEachTeam> */}
              </TwCard>
            </>
          )}
          {mbDetailMatchTab === 'standings' && (
            <div className='space-y-4'>
              <StandingTypeFilter
                wide={false}
                isLive={false}
                disabled={{ live: true }}
              ></StandingTypeFilter>
              {/* <QuickViewStandingsTab wide={false} matchData={matchData} /> */}
            </div>
          )}
        </div>

        {/* <HeadSection matchData={matchData}></HeadSection> */}
      </TwMobileView>

      <TwDesktopView className=''>
        <TwMatchDetailDataSection className='layout mt-4 flex flex-col gap-4 md:flex-row lg:-mt-12'>
          <TwMainColDetailPage className='space-y-4'>
            <TwCard className='space-y-4 p-2.5'>
              {/* <MatchEventSection
                showTitle={false}
                matchData={matchData}
              ></MatchEventSection> */}
            </TwCard>
            <TwCard className='space-y-4 p-2.5'>
              <div className='hidden lg:block'>
                {/* <PlayerLineUpSection
                  matchData={matchData}
                ></PlayerLineUpSection> */}
              </div>
            </TwCard>
            <TwCard className='space-y-4 p-2.5'>
              {/* <StandingTypeFilter wide={true}></StandingTypeFilter> */}
              {/* <QuickViewStandingsTab
                wide={true}
                matchData={matchData}
              ></QuickViewStandingsTab> */}
            </TwCard>

            <TwCard className='space-y-4 p-2.5'>
              {/* <TwTitle className=''>{i18n.titles.h2h}</TwTitle> */}
              {/* <MatchesSectionCommon
                matchData={matchData}
                i18n={i18n}
              ></MatchesSectionCommon> */}
            </TwCard>

            <TwCard className='space-y-4 p-2.5'>
              {/* <TwTitle className=''>{i18n.titles.last_matches}</TwTitle> */}
              {/* <MatchesSectionEachTeam
                matchData={matchData}
                i18n={i18n}
              ></MatchesSectionEachTeam> */}
            </TwCard>

            {/* <TwCard className='space-y-4'> */}
            {/* <AboutMatchSection i18n={i18n}></AboutMatchSection> */}
            {/* </TwCard> */}
          </TwMainColDetailPage>

          <TwDetailPageSmallCol className='space-y-4'>
            {/* show/hide this div, not the TwQuickViewCol */}

            {/* <div className='relative'>
              <PlayerHeatmap
                matchId='11067440'
                playerId='12634'
              ></PlayerHeatmap>
            </div> */}

            <TwCard className='space-y-4 p-2.5'>
              {/* <PenaltyShootoutSection
                matchData={matchData}
                i18n={i18n}
              ></PenaltyShootoutSection> */}

              {/* <AttackMomentumSection
                matchData={matchData}
                i18n={i18n}
              ></AttackMomentumSection> */}

              {/* <WinRateSection i18n={i18n}></WinRateSection> */}

              <TwQuickViewTimeLine className='space-y-3 p-4'>
                {/* <TwDataTitle className=''>Số đánh giá</TwDataTitle>
                <div className='flex h-10 items-center gap-4'>
                  <input
                    id='default-range'
                    type='range'
                    defaultValue={10}
                    className='h-2 w-full cursor-pointer rounded-lg bg-light-match dark:bg-dark-match '
                  />
                  <div className=''>
                    <p className='font-semibold text-logo-blue'>8.8</p>
                    <p className='text-csm'>Avg.</p>
                  </div>
                </div>
                <div className='text-center'>
                  <TwBigBlueText>Xem rating tất cả trận</TwBigBlueText>
                </div> */}
              </TwQuickViewTimeLine>

              {/* <TwQuickViewTimeLine className='space-y-3 p-4'>
                <QuickViewOdds i18n={i18n}></QuickViewOdds>
              </TwQuickViewTimeLine> */}

              {/* <MatchDetailOddsSection
                matchData={matchData}
              ></MatchDetailOddsSection> */}
              {/* 
              <MatchWinningOddsSection
                i18n={i18n}
                matchData={matchData}
              ></MatchWinningOddsSection>

              <StreakSection matchData={matchData}></StreakSection>

              <StatsSection i18n={i18n} matchData={matchData}></StatsSection>

              <RatingSection i18n={i18n} matchData={matchData}></RatingSection>

              <ShotMapSection
                i18n={i18n}
                matchData={matchData}
              ></ShotMapSection>

              <PrematchStandingSection
                matchData={matchData}
                i18n={i18n}
              ></PrematchStandingSection> */}

              {/* H2H */}
              {/* <TwQuickViewSection className='divide-y divide-light-line-stroke-cd dark:divide-match'> */}
              {/* TODO: Manager + Team H2H */}
              {/* <ManagerH2HSection
                  matchData={matchData}
                  i18n={i18n}
                ></ManagerH2HSection>
                <TeamH2HSection
                  matchData={matchData}
                  i18n={i18n}
                ></TeamH2HSection>
              </TwQuickViewSection>

              <RefereeSection
                i18n={i18n}
                matchData={matchData}
              ></RefereeSection>

              <VenueSection i18n={i18n} matchData={matchData}></VenueSection> */}
            </TwCard>
          </TwDetailPageSmallCol>

          {/* Data section end */}
        </TwMatchDetailDataSection>
      </TwDesktopView>
      {/* <PlayerStatsPopUpContentContainer></PlayerStatsPopUpContentContainer> */}
    </div>
  );
};

export const DroppingOddsSummarySection = () => {
  const { t } = useTranslation();
  return (
    <div className='bg-gradient-to-r from-blue-200 to-pink-100 dark:bg-dark-dark-blue dark:bg-none'>
      <div className='layout  flex h-full flex-col place-content-center justify-between'>
        <div className='hidden lg:block'>
          <div className='  flex justify-center gap-2 py-2 text-logo-blue dark:text-dark-text md:py-4'>
            <TwFilterButton>{t('football:header.football')}</TwFilterButton>
            <TwFilterButton>{t('football:header.basketball')}</TwFilterButton>
            <TwFilterButton>{t('football:filter.hot')}</TwFilterButton>
            <TwFilterButton>{t('football:filter.following')}</TwFilterButton>
          </div>
        </div>

        <div className=' flex flex-1 place-content-center items-center py-10 lg:items-start lg:pb-28 lg:pt-5'>
          {/* TODO i18n */}
          <h1 className='text-2xl font-[1000] uppercase leading-8 text-black dark:text-white'>
            Dự đoán và tip bóng đá
          </h1>
        </div>
      </div>

      <div className='block flex-1 lg:hidden'>
        <div className='  flex justify-center gap-2 bg-white py-2 dark:bg-dark-main md:py-4'>
          <TwFilterButton>{t('football:header.football')}</TwFilterButton>
          <TwFilterButton>{t('football:header.basketball')}</TwFilterButton>
          <TwFilterButton>{t('football:filter.hot')}</TwFilterButton>
          <TwFilterButton>{t('football:filter.following')}</TwFilterButton>
        </div>
      </div>
    </div>
  );
};

export const StreakSection = ({ matchData }: { matchData: any }) => {
  const { locale } = useRouter();
  const {
    id: matchId,
    homeTeam = {},
    awayTeam = {},
    startTimestamp,
  } = matchData || {};
  const { data, isLoading, isFetching } = useMatchTeamStreaksData(
    matchId,
    homeTeam?.id,
    awayTeam?.id,
    startTimestamp,
    locale || 'en'
  );

  if (isLoading || isFetching || !data) {
    return <></>;
  }

  const { general = {}, head2head = {} } = data || {};

  // if (general.length === 0 || head2head.length === 0) {
  //   return <></>;
  // }

  return (
    <>
      {general.length === 0 ? (
        <></>
      ) : (
        <TeamStreakSection
          general={general}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
      {head2head.length === 0 ? (
        <></>
      ) : (
        <H2HStreakSection
          head2head={head2head}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
    </>
  );
};

export const PenaltyShootoutSection = ({
  matchData = {},
  i18n,
}: {
  matchData: any;
  i18n: any;
}) => {
  const { id, homeTeam = {}, awayTeam = {} } = matchData || {};
  const {
    data = [],
    isLoading,
    isFetching,
  } = useTimelineData(id, matchData.status.code);

  if (isLoading || isFetching) return <></>;
  const penEvents =Array.isArray(data) ?  data.filter((event: any) => event.incidentType === 'penaltyShootout').sort((a: any, b: any) => a.sequence - b.sequence) : [];

  if (penEvents.length === 0) return <></>;

  return (
    <div className='space-y-4'>
      <TwTitle>{i18n.football.pen_shootout || 'Penalty Shootout'}</TwTitle>
      <div className='space-y-4 px-2'>
        <TeamPenShootout
          homeTeam={homeTeam}
          penEvents={penEvents}
          isHome={true}
          winnerCode={matchData.winnerCode}
        ></TeamPenShootout>
        <TeamPenShootout
          homeTeam={awayTeam}
          penEvents={penEvents}
          isHome={false}
          winnerCode={matchData.winnerCode}
        ></TeamPenShootout>
      </div>
    </div>
  );
};

export const TwPenTeamContainer = tw.div`flex h-6 items-center justify-between gap-4 rounded-full`;
export const TwPenScore = tw.div`p-1.5 px-2 text-sm font-medium`;
export const TwPenTakerContainer = tw.div`ml-12 flex flex-wrap leading-4`;
export const TwPenDotContainer = tw.div`flex flex-1 space-x-3`;
export const TwPenDotUl = tw.ul`flex gap-1.5 p-1.5`;
export const TwPenDotScore = tw.li`h-2 w-2 rounded-full bg-dark-win`;
export const TwPenDotMiss = tw.li`h-2 w-2 rounded-full bg-dark-loss`;
export const TwPenDotEmpty = tw.li`h-2 w-2 rounded-full`;
export const TwPenTakerScore = tw.div`mr-1 text-left  text-xs font-normal text-green-500`;
export const TwPenTakerMiss = tw.div`mr-1 text-left  text-xs font-normal text-dark-loss`;

export const MatchEventSection = ({
  showTitle = true,
  matchData = {},
}: {
  showTitle?: boolean;
  matchData?: any;
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching } = useTimelineData(
    matchData?.id || '',
    matchData.status.code
  );

  if (isLoading || isFetching) {
    return <div>Loading...</div>; // TODO skeleton
  }

  if (isValEmpty(data)) {
    return (
      <div className='text-sm dark:text-dark-text'>
        {t('football:common.nodata')}
      </div>
    );
  }
  const onBenchEvents =Array.isArray(data) ? data?.filter((event: any) => event.time < 0 || event.reason === 'player_on_bench' || !isValEmpty(event.manager)) : [];

  return (
    <div className='space-y-2'>
      {showTitle && <TwTitle className=''>{t('football:qv.timeline')}</TwTitle>}
      <TwQuickViewTimeLine className='h-[90vh] overflow-scroll py-4 text-xs 2xl:px-2'>
        {/* <ul className='dev2 h-96 overflow-scroll'> */}
        <ul className='dev2'>
          {Array.isArray(data) && data?.map((event: any, idx: number) => {
            if (
              event.time < 0 ||
              event.reason === 'player_on_bench' ||
              !isValEmpty(event.manager)
            ) {
              return <div key={idx}></div>;
            } else if (event.incidentType === 'period') {
              if (event) {
                return (
                  <MileStone
                    key={idx}
                    content={`${event.text}: ${event.homeScore} - ${event.awayScore}`}
                  ></MileStone>
                );
              } else {
                return <></>;
              }
            } else if (event.incidentType === 'card') {
              return (
                <div key={idx}>
                  {event.isHome ? (
                    <TimeLineEventCardHome
                      key={idx}
                      matchData={matchData}
                      event={event}
                    />
                  ) : (
                    <TimeLineEventCardAway
                      key={idx}
                      matchData={matchData}
                      event={event}
                    />
                  )}
                  <EventSeparator key={`sep-${idx}`} />
                </div>
              );
            } else if (
              event.incidentType === 'goal' ||
              event.incidentType === 'inGamePenalty'
            ) {
              return (
                <div key={idx}>
                  {event.isHome ? (
                    <TimeLineEventScoreHome
                      key={idx}
                      event={event}
                      matchData={matchData}
                    />
                  ) : (
                    <TimeLineEventScoreAway
                      key={idx}
                      event={event}
                      matchData={matchData}
                    />
                  )}
                  <EventSeparator key={`sep-${idx}`} />
                </div>
              );
            } else if (event.incidentType === 'substitution') {
              return (
                <div key={idx}>
                  {event.isHome ? (
                    <TimeLineEventSubHome
                      key={idx}
                      event={event}
                      matchData={matchData}
                    />
                  ) : (
                    <TimeLineEventSubAway
                      key={idx}
                      event={event}
                      matchData={matchData}
                    />
                  )}
                  <EventSeparator key={`sep-${idx}`} />
                </div>
              );
            } else if (event.incidentType === 'penaltyShootout') {
              return (
                <div key={idx}>
                  {event.isHome ? (
                    <TimeLineEventScoreHome
                      key={idx}
                      event={event}
                      matchData={matchData}
                    />
                  ) : (
                    <TimeLineEventScoreAway
                      key={idx}
                      event={event}
                      matchData={matchData}
                    />
                  )}
                  <EventSeparator key={`sep-${idx}`} />
                </div>
              );
            } else if (event.incidentType === 'injuryTime') {
              return <InjuryTime key={idx} content={event.length}></InjuryTime>;
            } else if (event.incidentType === 'varDecision') {
              return (
                <div key={idx}>
                  {event.isHome ? (
                    <TimeLineEventVarHome
                      key={idx}
                      event={event}
                    ></TimeLineEventVarHome>
                  ) : (
                    <TimeLineEventVarAway
                      key={idx}
                      event={event}
                    ></TimeLineEventVarAway>
                  )}
                  <EventSeparator key={`sep-${idx}`} />
                </div>
              );
            }
          })}
          {/* {!isValEmpty(onBenchEvents) && (
            <MileStone
              key='on_bench'
              content={i18n.timeline.on_bench}
              className={
                onBenchEvents?.homeScore > onBenchEvents?.awayScore
                  ? 'bg-all-blue dark:text-all-blue'
                  : 'bg-light-detail-away dark:text-light-detail-away'
              }
            ></MileStone>
          )} */}
          {onBenchEvents?.map((event: any, idx: number) => {
            if (event.incidentType === 'card') {
              return (
                <div key={idx}>
                  {event.isHome ? (
                    <TimeLineEventCardHome
                      key={`b-${idx}`}
                      event={event}
                      matchData={matchData}
                    />
                  ) : (
                    <TimeLineEventCardAway
                      key={`b-${idx}`}
                      event={event}
                      matchData={matchData}
                    />
                  )}
                  <EventSeparator key={`sep-${idx}`} />
                </div>
              );
            }
          })}
        </ul>
      </TwQuickViewTimeLine>
    </div>
  );
};

export const MbDetailMenu = ({ i18n = vi }: { i18n?: any }) => {
  const { mbDetailMatchTab, setMbDetailMatchTab } = useFilterStore();

  return (
    <div className='no-scrollbar flex items-center gap-3 overflow-scroll bg-white px-3 dark:bg-dark-match lg:hidden'>
      <TwMbMenuButton
        className=''
        onClick={() => setMbDetailMatchTab('details')}
        css={[
          mbDetailMatchTab === 'details' &&
          tw`text-logo-blue border-b-2 border-logo-blue`,
        ]}
      >
        {i18n.tab.timeline_plus}
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('squad')}
        css={[
          mbDetailMatchTab === 'squad' &&
          tw`text-logo-blue border-b-2 border-logo-blue`,
        ]}
        className=''
      >
        {i18n.tab.squad}
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('matches')}
        css={[
          mbDetailMatchTab === 'matches' &&
          tw`text-logo-blue border-b-2 border-logo-blue`,
        ]}
        className=''
      >
        {i18n.tab.matches}
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('stats')}
        css={[
          mbDetailMatchTab === 'stats' &&
          tw`text-logo-blue border-b-2 border-logo-blue`,
        ]}
        className=''
      >
        {i18n.tab.statistics}
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('standings')}
        css={[
          mbDetailMatchTab === 'standings' &&
          tw`text-logo-blue border-b-2 border-logo-blue`,
        ]}
        className=''
      >
        {i18n.tab.standings}
      </TwMbMenuButton>
    </div>
  );
};

export const TwMbMenuButton = tw.div`text-csm py-3 px-1 uppercase whitespace-nowrap cursor-pointer`;

export default MatchDetailedPage;

export const MatchDetailSummarySection = ({
  matchData,
  i18n,
}: {
  matchData?: any;
  i18n?: any;
}) => {
  if (!matchData) return <></>;

  const {
    tournament = {},
    roundInfo = {},
    homeTeam = {},
    awayTeam = {},
  } = matchData || {};
  const { uniqueTournament = {}, category = {} } = tournament;
  // const round = !isValEmpty(roundInfo.round) ? `, Vòng ${roundInfo.round}` : '';
  let round = '';
  if (!isValEmpty(roundInfo.round) && roundInfo.name) {
    round = `, ${roundInfo.name}`;
  } else if (!isValEmpty(roundInfo.round)) {
    round = `, ${i18n.football.round} ${roundInfo.round}`;
  }

  return (
    <div className='dark:bg-dark-dark-blue'>
      <div className='bg-gradient-to-r from-blue-200 to-pink-100 py-2 dark:bg-none'>
        <BreadCrumb className='layout'>
          <div className=' flex items-center gap-2 truncate text-xs font-extralight'>
            <BreadCumbLink
              href={`/football/country/${category.slug}`}
              name={category.name}
            />
            <BreadCrumbSep></BreadCrumbSep>
            <BreadCumbLink
              href={`/competition/${tournament.slug}/${uniqueTournament?.id || tournament?.id
                }`}
              name={`${tournament.name}${round}`}
            />
          </div>
          <BreadCrumbSep></BreadCrumbSep>
          <BreadCumbLink
            // href='/match/football/2355895'
            href={`/match/football/${matchData?.id}`}
            // name='Chelsea vs Man Utd'
            name={`${awayTeam.name} vs ${homeTeam.name}`}
            isEnd={true}
          ></BreadCumbLink>
        </BreadCrumb>
      </div>
      <div className='flex place-content-center bg-gradient-to-r from-blue-200 to-pink-100 pb-4 dark:bg-none lg:pb-16'>
        <div className='w-full lg:w-1/3'>
          <MatchDetailSummary matchData={matchData}></MatchDetailSummary>
        </div>
      </div>
    </div>
  );
};

export const AboutMatchSection = ({ i18n }: { i18n: any }) => {
  return (
    <div className='space-y-2'>
      <TwQuickViewSection className='space-y-2 p-4 leading-7 xl:rounded-xl'>
        <TwTitle className=''>{i18n.titles.about_match}</TwTitle>

        <p>
          Etiam libero augue, tincidunt scelerisque blandit eu, suscipit cursus
          dolor. Integer aliquet, lectus quis suscipit dignissim, lorem est
          convallis orci, nec semper tellus est ut sem. Aliquam semper sit amet
          tellus quis tempus.
        </p>
        <p>
          Suspendisse sollicitudin, justo at rhoncus viverra, lectus sapien
          posuere enim, eu consectetur tortor nibh a turpis. Mauris sed est sit
          amet eros aliquet commodo. Nullam molestie ligula ut fermentum
          consequat. Praesent congue tristique maximus. Sed pretium mi sed
          facilisis rutrum. Ut vulputate eros pulvinar, interdum libero non,
          viverra nulla. Mauris at dignissim leo.
        </p>
      </TwQuickViewSection>
    </div>
  );
};

export const PlayerLineUpSection = ({
  matchData = {},
}: {
  matchData?: any;
}) => {
  const { t } = useTranslation();
  const { playerFilter } = useFilterStore();

  const {
    data: lineupsData,
    isLoading: isLoadingLineups,
    isFetching: isFetchingLineups,
  } = useSelectedMatchLineupsData(matchData?.id || '');

  const {
    data: managerData,
    isLoading: isLoadingManager,
    isFetching: isFetchingManager,
  } = useManagerData(matchData?.id || '');

  const {
    data: timelineData = [],
    isLoading: isLoadingTimeline,
    isFetching: isFetchingTimeline,
  } = useTimelineData(matchData?.id || '', matchData.status.code);

  if (
    isLoadingLineups ||
    isFetchingLineups ||
    isLoadingManager ||
    isFetchingManager ||
    isLoadingTimeline ||
    isFetchingTimeline
  ) {
    return <div>Loading...</div>;
  }

  if (isValEmpty(matchData) || isValEmpty(lineupsData)) {
    return <></>;
  }

  const {
    // id,
    // tournament = {},
    // season = {},
    // roundInfo = {},
    // status = {},
    homeTeam = {},
    awayTeam = {},
    // homeScore = {},
    // awayScore = {},
  } = matchData;

  // const { category = {} } = tournament;
  const { confimred, home = {}, away = {} } = lineupsData;
  const { homeManager, awayManager } = managerData;
  const mapPlayerEvents = genPlayerData(timelineData);

  if (!matchData) return <></>;

  return (
    <div className='space-y-4'>
      <TwTitle className=''>{t('titles.lineups')}</TwTitle>

      <FilterPlayer></FilterPlayer>

      {playerFilter === 'player-lineup' && (
        <>
          {/* <TwQuickViewSection className='p-4'>
            <AvgPosition i18n={i18n}></AvgPosition>
          </TwQuickViewSection> */}

          <div className='flex gap-2 xl:gap-4'>
            <div className='flex-1'>
              <SquadSummarySection
                teamName={homeTeam.name}
                avgAge={calAverageAge(home.players || [])}
                formation={home.formation || ''}
                isHome={true}
                logoUrl={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${homeTeam?.id}/image`}
                teamRating={6.89} // TODO
              ></SquadSummarySection>
            </div>
            <div className='flex-1'>
              <SquadSummarySection
                teamName={awayTeam.name}
                avgAge={calAverageAge(away.players || [])}
                formation={away.formation || ''}
                isHome={false}
                logoUrl={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${awayTeam?.id}/image`}
                teamRating={6.6}
              ></SquadSummarySection>
            </div>
          </div>

          <HorizontalLineUpSection
            lineupsData={lineupsData}
            // matchId={matchData?.id}
            mapPlayerEvents={mapPlayerEvents}
            matchData={matchData}
          ></HorizontalLineUpSection>

          <TwQuickViewTitle className=''>
            {t('football:titles.players')}
          </TwQuickViewTitle>
          <div className='flex gap-4'>
            <div className='flex-1 space-y-2'>
              <TeamPlayerList
                team={homeTeam}
                teamLineups={home}
                manager={homeManager}
                mapPlayerEvents={mapPlayerEvents}
                isHome={true}
                matchData={matchData}
              />
              <TeamSuspensionList
                team={homeTeam}
                missingPlayers={home.missingPlayers}
              ></TeamSuspensionList>
            </div>
            <div className='flex-1 space-y-2'>
              <TeamPlayerList
                team={awayTeam}
                teamLineups={away}
                manager={awayManager}
                mapPlayerEvents={mapPlayerEvents}
                isHome={false}
                matchData={matchData}
              ></TeamPlayerList>
              <TeamSuspensionList
                team={awayTeam}
                missingPlayers={away.missingPlayers}
              />
            </div>
          </div>
        </>
      )}

      {playerFilter === 'player-stats' && (
        <>
          <TwQuickViewSection className='h-96 p-4'></TwQuickViewSection>
        </>
      )}
    </div>
  );
};

export const HorizontalHomeTeamLineUp = ({
  lineups,
  mapPlayerEvents,
  matchData,
}: {
  lineups: any;
  mapPlayerEvents: any;
  matchData: any;
}) => {
  const { players = [], formation = '' } = lineups;
  if (isValEmpty(players) || isValEmpty(formation)) {
    return <></>;
  }
  const linePlayers = splitSquad(formation, players.slice(0, 11));

  return (
    <div
      className=' aspect-h-1 aspect-w-1 rounded-l-md bg-contain bg-no-repeat '
      style={{
        backgroundImage: `url('/images/football/general/stadium-left.png')`,
      }}
    >
      <div className='flex justify-evenly px-2 pb-8'>
        {linePlayers.map((lineup: any, index: number) => {
          return (
            <TwLineupVerticalLine className='' key={`line-${index}`}>
              {lineup.map((playerLineupData: any, index: number) => {
                const {
                  player = {},
                  shirtNumber,
                  statistics = {},
                } = playerLineupData;
                const playerData =
                  mapPlayerEvents?.get(playerLineupData.player?.id) || {};

                const { rating = 0 } = statistics;

                return (
                  <PlayerLineUp
                    key={`player-${index}`}
                    src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/player/${player?.id}/image`}
                    name={`${player?.name}`}
                    shirtNo={shirtNumber}
                    isSub={playerData.subOut || false}
                    yellowCard={playerData.yellow || 0}
                    yellowRed={playerData.yellowRed || 0}
                    redCard={playerData.redCard || 0}
                    numGoals={playerData.regularGoals || 0}
                    penGoals={playerData.penGoals || 0}
                    ownGoals={playerData.ownGoals || 0}
                    missedPens={playerData.missedPens || 0}
                    numAssists={playerData.numAssists || 0}
                    player={player}
                    matchData={matchData}
                    rating={rating}
                  />
                );
              })}
            </TwLineupVerticalLine>
          );
        })}
      </div>
    </div>
  );
};

export const TwLineupVerticalLine = tw.div`flex flex-col-reverse justify-evenly`;
export const TwLineupVerticalLineAway = tw.div`flex flex-col justify-evenly`;

export const TeamAwayLineUpHorizontal = ({
  lineups,
  mapPlayerEvents,
  matchData,
}: {
  lineups: any;
  mapPlayerEvents: any;
  matchData: any;
}) => {
  const { players = [], formation = '' } = lineups;

  if (isValEmpty(players) || isValEmpty(formation)) {
    return <></>;
  }
  const linePlayers = splitSquad(formation, players.slice(0, 11));
  linePlayers.reverse();

  // mapPlayerEvents

  return (
    <div
      className=' aspect-h-1 aspect-w-1 rounded-r-md bg-contain bg-no-repeat'
      style={{
        backgroundImage: "url('/images/football/general/stadium-right.png')",
      }}
    >
      <div className=' flex w-full justify-evenly gap-2 px-2 pb-8'>
        {linePlayers.map((lineup: any, index: number) => {
          // TODO check to get events

          return (
            <TwLineupVerticalLineAway className='' key={`line-${index}`}>
              {lineup.map((playerLineupData: any, index: number) => {
                const {
                  player = {},
                  shirtNumber,
                  statistics = {},
                } = playerLineupData;
                const playerData =
                  mapPlayerEvents?.get(playerLineupData.player?.id) || {};

                const { rating = 0 } = statistics;

                return (
                  <PlayerLineUp
                    key={`player-${index}`}
                    src={
                      isStringNumeric(player?.id)
                        ? `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/player/${player?.id}/image`
                        : `${getImage(Images.player, player?.id)}`
                    }
                    name={`${player?.name}`}
                    shirtNo={shirtNumber}
                    isSub={playerData.subOut || false}
                    yellowCard={playerData.yellow || 0}
                    yellowRed={playerData.yellowRed || 0}
                    redCard={playerData.redCard || 0}
                    numGoals={playerData.regularGoals || 0}
                    penGoals={playerData.penGoals || 0}
                    ownGoals={playerData.ownGoals || 0}
                    missedPens={playerData.missedPens || 0}
                    numAssists={playerData.numAssists || 0}
                    isHome={false}
                    player={player}
                    matchData={matchData}
                    rating={rating}
                  />
                );
              })}
            </TwLineupVerticalLineAway>
          );
        })}
      </div>
    </div>
  );
};

export const MatchDetailSummary = ({ matchData }: { matchData: any }) => {
  const i18n = useTrans();
  const [isErr1, setIsErr1] = useState(false);
  const [isErr2, setIsErr2] = useState(false);

  if (!matchData) return <></>;

  const {
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
    status = {},
    startTimestamp = 0,
  } = matchData || {};
  const { type: statusType, code } = status || {};

  // TODO use number code to compare
  const scoreNotAvailable =
    isValEmpty(homeScore.display) || isValEmpty(awayScore.display);

  const [first = '', second = '', third = ''] =
    genDisplayedTime(startTimestamp, status, i18n) || [];

  return (
    <>
      <div className=' pb-3 text-dark-dark-blue dark:text-white'>
        <div className=' flex px-6'>
          <div className=' flex flex-1'>
            {/* Team 1 */}
            <div className='flex flex-1 flex-col place-content-center items-center gap-2'>
              <BellOn></BellOn>
              <CustomLink href={`/competitor/${homeTeam?.id}`} target='_parent'>
                <img
                  src={`${isErr1
                    ? '/images/football/teams/unknown-team.png'
                    : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${homeTeam?.id}/image`
                    }`}
                  alt='...'
                  width={64}
                  height={64}
                  onError={() => setIsErr1(true)}
                // className='border-quick-view rounded-lg p-1.5 shadow-sm'
                ></img>
              </CustomLink>
              <CustomLink href={`/competitor/${homeTeam?.id}`} target='_parent'>
                <div className='text-center text-sm text-logo-blue'>
                  {homeTeam.name}
                </div>
              </CustomLink>
            </div>
          </div>

          {/* Score */}
          <div className='flex flex-1 flex-col place-content-center items-center gap-2'>
            {/* TODO */}
            {/* <div className='flex place-content-center text-sm'>90+3'</div> */}
            <div className='flex flex-1 flex-col place-content-center items-center'>
              <div className='text-md flex place-content-center text-center font-bold '>
                {first}
              </div>
              <div className='flex place-content-center text-center text-xs text-dark-text'>
                {second}
              </div>
              <div className='flex place-content-center text-center text-csm '>
                {third}
              </div>
            </div>
            {!scoreNotAvailable && (
              <>
                <div className='flex w-fit place-content-center items-center rounded-lg border-1.5 border-logo-yellow bg-dark-dark-blue px-4 py-0.5  text-3xl font-extrabold text-logo-yellow'>
                  <span className='pb-1'>
                    {homeScore.display} - {awayScore.display}
                  </span>
                </div>
                <div className='text-center text-csm'>
                  {isValEmpty(homeScore.period1)
                    ? `( - `
                    : `(${homeScore.period1}-${awayScore.period1}`}
                  {`, ${homeScore.period2 || ''}-${awayScore.period2 || ''})`}
                </div>
              </>
            )}
          </div>

          {/* Team 2 */}
          <div className=' flex flex-1 flex-col place-content-center items-center gap-2'>
            <BellOff></BellOff>
            {/* <Image unoptimized={true} 
              src='/images/football/teams/chelsea.png'
              alt=''
              width={64}
              height={64}
              // className='rounded-lg border-2 p-1.5 dark:border-match'
              // className='border-quick-view rounded-lg border-2 p-1.5 shadow-sm'
            ></Image>
            <div className='text-sm text-logo-yellow'>Chelsea</div> */}
            <CustomLink href={`/competitor/${awayTeam?.id}`} target='_parent'>
              <img
                src={`${isErr2
                  ? '/images/football/teams/unknown-team.png'
                  : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${awayTeam?.id}/image`
                  }`}
                alt='...'
                width={64}
                height={64}
                onError={() => setIsErr2(true)}
              // className='border-quick-view rounded-lg p-1.5 shadow-sm'
              ></img>
            </CustomLink>
            <CustomLink href={`/competitor/${awayTeam?.id}`} target='_parent'>
              <div className='text-center text-sm text-logo-yellow'>
                {awayTeam.name}
              </div>
            </CustomLink>
          </div>
        </div>
        {/* <div className='mt-2 text-center'>
          <CustomLink href='/match/football/2355895'>
            <button>
              <span className='text-sm font-medium text-all-blue underline'>
                CHI TIẾT
              </span>
            </button>
          </CustomLink>
        </div> */}
      </div>
    </>
  );
};

export const MatchesSectionCommon = ({
  matchData,
  i18n,
}: {
  matchData: any;
  i18n: any;
}) => {
  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  return (
    <>
      <TeamH2HCommonEvents
        h2HFilter='h2h'
        matchData={matchData}
        showQuickView={true}
        i18n={i18n}
      ></TeamH2HCommonEvents>
    </>
  );
};

export const MatchesSectionEachTeam = ({
  matchData,
  i18n = vi,
}: {
  matchData: any;
  i18n: any;
}) => {
  const [h2HFilter, setH2HFilter] = useState<string>('home');
  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  return (
    <>
      <MatchFilter
        h2HFilter={h2HFilter}
        setH2HFilter={setH2HFilter}
        matchData={matchData}
      />

      {h2HFilter === 'home' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          showQuickView={true}
          i18n={i18n}
        ></TeamH2HEachTeamEvents>
      )}
      {h2HFilter === 'away' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          showQuickView={true}
          i18n={i18n}
        ></TeamH2HEachTeamEvents>
      )}
    </>
  );
};

export const MatchFilter = ({
  h2HFilter,
  setH2HFilter,
  matchData,
}: {
  h2HFilter?: string;
  setH2HFilter?: any;
  matchData?: any;
}) => {
  const { homeTeam = {}, awayTeam = {} } = matchData || {};

  return (
    <>
      <div className='flex justify-between px-2 lg:px-0'>
        <div className='flex gap-4'>
          <TwFilterButton
            isActive={h2HFilter === 'home'}
            onClick={() => setH2HFilter('home')}
          >
            {homeTeam.name}
          </TwFilterButton>
          <TwFilterButton
            isActive={h2HFilter === 'away'}
            onClick={() => setH2HFilter('away')}
          >
            {awayTeam.name}
          </TwFilterButton>
        </div>
      </div>
    </>
  );
};
