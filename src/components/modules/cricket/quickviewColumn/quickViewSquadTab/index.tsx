/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import tw from 'twin.macro';

import {
  useSelectedMatchLineupsData,
  useTimelineData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import EmptySection from '@/components/common/empty';
import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import LineupTab from '@/components/common/skeleton/homePage/LineupTab';
import { TabsRef } from '@/components/common/tabs/TabCustom';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import {
  QvLineupsPlayerReverse,
  QvManager,
  QvPlayer,
  QvPlayerV2,
  TwPlayerRow,
  TwUnvailablePlayerRow,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { RatingBadge } from '@/components/modules/football/RatingBadge';
import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { LINEUPS_TAB } from '@/constant/common';
import { CompetitorDto, SportEventDto, StatusDto } from '@/constant/interface';
import {
  ILineupsInfo,
  ILineupsItem,
  ILineupsPlayer,
  InjuriesSuspensionSectionProps,
} from '@/models';
import { IPlayerLineups } from '@/models/player';
import {
  calAverageAge,
  calTeamRating,
  getAgeFromTimestamp,
  getImage,
  Images,
  isMatchLive,
  isValEmpty,
  roundNum,
  splitSquad,
} from '@/utils';
import { genPlayerData } from '@/utils/genPlayerData';

import AgeSVG from '/public/svg/age.svg';
import AssistSVG from '/public/svg/assist.svg';
import BlockSVG from '/public/svg/block.svg';
import CountrySVG from '/public/svg/country.svg';
import EmptySVG from '/public/svg/empty.svg';
import GoalBlueSVG from '/public/svg/goal-blue.svg';
import OwnGoalSVG from '/public/svg/goal-own.svg';
import GoalPenSVG from '/public/svg/goal-pen.svg';
import MisssedPenSVG from '/public/svg/goal-pen-miss.svg';
import GoalYellowSVG from '/public/svg/goal-yellow.svg';
import HeightSVG from '/public/svg/height_player.svg';
import LogoSVG from '/public/svg/logo-transparent.svg';
import MissingReason0SVG from '/public/svg/missing-reason-0.svg';
import RedCrossSVG from '/public/svg/red-cross.svg';
import StadiumSVG from '/public/svg/stadium.svg';
import SubLineUpSVG from '/public/svg/sub-line-up.svg';
import SubstituteSVG from '/public/svg/substitute.svg';
import vi from '~/lang/vi';

export const QuickViewSquadTab: React.FC<{ matchData: SportEventDto }> = ({
  matchData,
}) => {
  const i18n = useTrans();
  const status: StatusDto = matchData.status;
  const shouldRefetch = isMatchLive(status.code) && matchData.lineup;
  const [activeTab, setActiveTab] = useState<keyof typeof LINEUPS_TAB | null>();
  const refTabs = useRef<TabsRef>(null);
  const refinjuriesTabs = useRef<TabsRef>(null);
  const {
    data: lineupsData,
    isLoading: isLoadingLineups,
    refetch,
  } = useSelectedMatchLineupsData(matchData?.id || '');

  const { homeTeam, awayTeam } = matchData || {};

  useEffect(() => {
    if (shouldRefetch) {
      const timer = setInterval(() => {
        refetch();
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [refetch, shouldRefetch, homeTeam.id]);

  // const { data: managerData, isLoading: isLoadingManager } = useManagerData(
  //   matchData?.id || ''
  // );

  const onClickShowOptions = (value: keyof typeof LINEUPS_TAB) => {
    if (value !== activeTab) {
      setActiveTab(value);
    } else {
      setActiveTab(null);
    }
  };

  const { data: timelineData = [], isLoading: isLoadingTimeline } =
    useTimelineData(matchData?.id || '', matchData.status.code);

  if (isLoadingLineups || isLoadingTimeline) {
    return <LineupTab />;
  }

  if (isValEmpty(matchData) || isValEmpty(lineupsData)) {
    return (
      <div className='space-y-2'>
        <TwQuickViewTitleV2 className=''>
          {i18n.titles.lineups}
        </TwQuickViewTitleV2>
        <EmptySection content={i18n.common.nodata} />
      </div>
    );
  }

  const mapPlayerEvents = genPlayerData(timelineData);

  const { home, away, confirmed } = lineupsData as ILineupsInfo;

  const homeRating = calTeamRating(home.players || []);
  const awayRating = calTeamRating(away.players || []);

  return (
    <>
      <div className=''>
        {confirmed && (
          <TwQuickViewTitleV2>{i18n.titles.lineups}</TwQuickViewTitleV2>
        )}
        <TwTabHead className='mb-3.5 mt-4'>
          {Object.keys(LINEUPS_TAB).map((item: any) => {
            return (
              <TwBorderLinearBox
                key={item}
                className={` h-full w-1/3 !rounded-full ${
                  activeTab === item ? 'dark:border-linear-form' : ''
                }`}
              >
                <button
                  // isActive={statsPeriod === period.period}
                  onClick={() => onClickShowOptions(item)}
                  className={`flex h-full w-full items-center justify-center gap-x-1 rounded-full transition-colors  duration-300 ${
                    activeTab === item ? 'dark:bg-button-gradient' : ''
                  }`}
                >
                  {item === LINEUPS_TAB.nationality ? (
                    <CountrySVG className='h-5 w-5' />
                  ) : item === LINEUPS_TAB.height ? (
                    <HeightSVG className='h-5 w-5' />
                  ) : (
                    <AgeSVG className='h-5 w-5' />
                  )}
                  <span className='text-csm font-medium dark:text-white'>
                    {i18n.tab[item as 'age']}
                  </span>
                </button>
              </TwBorderLinearBox>
            );
          })}
        </TwTabHead>
        {confirmed && (
          <div>
            <SquadSummarySection
              teamName={homeTeam?.name ?? ''}
              avgAge={calAverageAge(home.players || [])}
              formation={home.formation || ''}
              isHome={true}
              teamId={homeTeam?.id}
              logoUrl={`${getImage(Images.team, homeTeam?.id)}`}
              teamRating={homeRating}
              i18n={i18n}
            ></SquadSummarySection>

            <VerticalLineUpSection
              lineupsData={lineupsData}
              activeTab={activeTab as keyof typeof LINEUPS_TAB}
              mapPlayerEvents={mapPlayerEvents}
              matchData={matchData}
            ></VerticalLineUpSection>

            <SquadSummarySection
              teamId={awayTeam?.id}
              teamName={awayTeam?.name ?? ''}
              avgAge={calAverageAge(away.players || [])}
              formation={away.formation || ''}
              isHome={false}
              logoUrl={`${getImage(Images.team, awayTeam?.id)}`}
              teamRating={awayRating}
              i18n={i18n}
            ></SquadSummarySection>
          </div>
        )}
      </div>

      {/* ĐỘI HÌNH RA SÂN */}
      <div className='space-y-2 px-2.5 lg:px-0'>
        {confirmed ? (
          <div className='flex items-center justify-center gap-1.5'>
            <SubstituteSVG className='h-6 w-6' />
            <TwQuickViewTitleV2 className=''>
              {i18n.qv.substitute}
            </TwQuickViewTitleV2>
          </div>
        ) : (
          <TwQuickViewTitleV2 className=''>
            {i18n.titles.lineups}
          </TwQuickViewTitleV2>
        )}

        <div className='relative grid grid-cols-2 items-start justify-center gap-x-6 '>
          {/* Home team */}
          <TeamPlayerList
            team={homeTeam}
            activeTab={activeTab as keyof typeof LINEUPS_TAB}
            teamLineups={home}
            confirmed={confirmed}
            manager={null}
            mapPlayerEvents={mapPlayerEvents}
            isHome={true}
            i18n={i18n}
            matchData={matchData}
          ></TeamPlayerList>
          {/* Guest team */}
          <TeamPlayerList
            team={awayTeam}
            teamLineups={away}
            confirmed={confirmed}
            activeTab={activeTab as keyof typeof LINEUPS_TAB}
            manager={null}
            mapPlayerEvents={mapPlayerEvents}
            isHome={false}
            i18n={i18n}
            matchData={matchData}
          ></TeamPlayerList>
          <div className='absolute left-[50%] h-full w-[1px] bg-[#838486] opacity-30'></div>
          {/* //todo create components */}
        </div>
        {confirmed && (
          <InjuriesSuspensionSection
            i18n={i18n}
            ref={refinjuriesTabs}
            homeMissingPlayers={home.missingPlayers || []}
            awayMissingPlayers={away.missingPlayers || []}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
          />
        )}
      </div>

      {/* CHẤN THƯƠNG + ÁN TREO GIÒ */}
    </>
  );
};

export const TeamPlayerList = ({
  team,
  teamLineups,
  manager,
  mapPlayerEvents,
  isHome = true,
  i18n = vi,
  matchData,
  confirmed,
  activeTab,
}: {
  team: CompetitorDto;
  teamLineups: ILineupsItem;
  manager?: any;
  mapPlayerEvents?: any;
  isHome?: boolean;
  i18n?: any;
  matchData?: any;
  confirmed?: boolean;
  activeTab?: keyof typeof LINEUPS_TAB;
}) => {
  let subPlayers = confirmed
    ? teamLineups.players
    : [...teamLineups.players, ...teamLineups.missingPlayers];

  subPlayers = subPlayers.filter((player: any) => player.substitute !== false);
  subPlayers = subPlayers.sort((a: any, b: any) => {
    if (a.substitute && !b.substitute) {
      return -1;
    } else if (!a.substitute && b.substitute) {
      return 1;
    }
    return 0;
  });

  const mapPlayerRating: any = {};
  for (const playerData of teamLineups.players) {
    const { player, statistics, rating } = playerData;
    mapPlayerRating[player?.id] = statistics.rating || rating;
  }

  return (
    <div className=''>
      <div
        className={clsx(
          'divide-single flex place-content-center items-center justify-start gap-3 pb-3',
          { 'flex-row-reverse': isHome }
        )}
      >
        <Avatar
          id={team?.id}
          type='team'
          width={26}
          height={26}
          isBackground={false}
          rounded={false}
        />
        <div className='truncate text-csm font-semibold dark:text-white'>
          {team.name}
        </div>
      </div>
      {manager && (
        <div className=' divide-single place flex items-center py-4'>
          <QvManager
            name={manager.name}
            imgUrl={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/manager/${manager?.id}/image`}
          ></QvManager>
        </div>
      )}

      <ul className=' divide-list divide-y'>
        {subPlayers.map((playerLineupData: any, index: number) => {
          const { player = {}, shirtNumber } = playerLineupData;

          const playerStats = mapPlayerEvents?.get(player?.id) || {};
          const playerRating = mapPlayerRating[player?.id] || 0;

          return (
            <TwPlayerRow key={index} className=''>
              <PlayerStatsWithPopUp matchData={matchData} player={player}>
                {(isHome && (
                  <QvLineupsPlayerReverse
                    name={player?.name}
                    activeTab={activeTab}
                    shirtNo={shirtNumber}
                    coutry={player?.coutry?.id}
                    height={player?.height}
                    teamId={player?.team?.id}
                    birthday={player?.birthday}
                    isNationality={teamLineups?.isNationalTeam}
                    id={player?.id}
                    imgSize={28}
                    rating={playerRating}
                    playerData={playerStats}
                    isHome={isHome}
                    i18n={i18n}
                  />
                )) || (
                  <QvPlayer
                    name={player?.name}
                    shirtNo={shirtNumber}
                    imgSize={28}
                    id={player?.id}
                    rating={playerRating}
                    playerData={playerStats}
                    isHome={isHome}
                    i18n={i18n}
                    activeTab={activeTab}
                    coutry={player?.coutry?.id}
                    height={player?.height}
                    teamId={player?.team?.id}
                    birthday={player?.birthday}
                    isNationality={teamLineups?.isNationalTeam}
                  />
                )}
              </PlayerStatsWithPopUp>
            </TwPlayerRow>
          );
        })}
      </ul>
    </div>
  );
};

export const TeamSuspensionList = ({
  team,
  missingPlayers = [],
  i18n = vi,
  isHome,
}: {
  team?: any;
  missingPlayers: any[];
  i18n?: any;
  isHome?: boolean;
}) => {
  return (
    <TwQuickViewSection className='!border-x-0 lg:!border-x-1.5'>
      <div
        className={clsx(
          'divide-single flex place-content-center items-center justify-start gap-3 px-4 py-3 lg:px-0',
          {
            'flex-row-reverse': isHome,
          }
        )}
      >
        <Avatar
          id={team?.id}
          type='team'
          width={24}
          height={24}
          isBackground={false}
        />
        <div className='text-csm font-semibold dark:text-white'>
          {team.name}
        </div>
      </div>
      <ul className=' divide-list divide-y'>
        {isValEmpty(missingPlayers) && (
          <div className='pt-4 text-center text-xs text-dark-text'>
            {i18n.qv.no_missing}
          </div>
        )}
        {missingPlayers.map((playerData: any, idx: number) => {
          const {
            player = {},
            reason = -1,
            typeTranslate = '',
            type,
          } = playerData;

          return (
            <TwUnvailablePlayerRow
              key={idx}
              className={clsx({ 'flex-row-reverse': isHome })}
            >
              <QvPlayerV2
                name={player.name}
                id={player?.id}
                rating={0}
                imgSize={26}
                i18n={i18n}
                slug={typeTranslate}
                typeReason={type}
                isHome={isHome}
              />

              <span className='flex items-center gap-1 text-red-600'>
                {reason === 0 && <MissingReason0SVG className='h-5 w-5' />}
                {reason === 1 && <RedCrossSVG className='h-5 w-5' />}
                {reason === 2 && <RedCrossSVG className='h-5 w-5' />}
                {reason === 3 && <BlockSVG className='h-5 w-5' />}
              </span>
            </TwUnvailablePlayerRow>
          );
        })}
      </ul>
    </TwQuickViewSection>
  );
};

export const AvgPosition = ({ i18n = vi }: { i18n?: any }) => {
  return (
    <div className=' flex h-full items-center gap-2 text-all-blue'>
      <StadiumSVG className='h-6 w-6'></StadiumSVG>
      <div className='text-sm font-semibold'>{i18n.qv.avg_position}</div>
    </div>
  );
};

export const PlayerLineUp = ({
  src,
  name,
  shirtNo,
  isHome = true,
  isSub = false,
  yellowCard = 0,
  redCard = 0,
  numGoals = 0,
  penGoals = 0,
  ownGoals = 0,
  missedPens = 0,
  yellowRed = 0,
  numAssists = 0,
  rating = 0,
  team = {},
  matchData,
  player,
  showStats = true,
  captain = false,
  activeType,
  isNationalTeam,
}: IPlayerLineups & {
  activeType?: keyof typeof LINEUPS_TAB;
  isNationalTeam?: boolean;
}) => {
  // TODO: captain icon

  const renderOptional = useMemo(() => {
    if (!activeType) return null;

    const { birthday, height, coutry, team } = player;

    switch (activeType) {
      case LINEUPS_TAB.age:
        return birthday === 0 ? (
          <div className='h-4 w-4'>
            <EmptySVG className='h-full w-full' />
          </div>
        ) : (
          <span className='text-msm dark:text-white'>
            {getAgeFromTimestamp(birthday)}
          </span>
        );
      case LINEUPS_TAB.height:
        return (
          ((height === 0 || !height) && (
            <div className='h-4 w-4'>
              <EmptySVG className='h-full w-full' />
            </div>
          )) || <span className='text-msm dark:text-white'>{height}</span>
        );
      case LINEUPS_TAB.nationality:
        if (!coutry?.id || !team.id) {
          return (
            <div className='h-4 w-4'>
              <EmptySVG className='h-full w-full' />
            </div>
          );
        }
        return (
          <Avatar
            id={isNationalTeam ? team.id : coutry?.id}
            type={isNationalTeam ? 'team' : 'country'}
            height={16}
            width={16}
            rounded={false}
            isBackground={false}
          />
        );
      default:
        return null;
    }
  }, [activeType, player, isNationalTeam]);

  return (
    <div className='relative flex flex-col items-center text-xxs xl:text-cxs'>
      <div className='flex items-center justify-center'>
        {activeType && (
          <div test-id={`btn-nationality-${activeType}`}
            className={`absolute left-1 top-0 z-10 rounded-md mb-0.5 px-1 ${
              activeType !== 'nationality' ? 'bg-black' : ''
            }`}
          >
            <>{renderOptional}</>
          </div>
        )}
        <div className='absolute bottom-5 z-10 mr-8 flex justify-end'>
          {/* <div className='bg-black px-1'>{activeType && <h1>tes</h1>}</div> */}
          {isSub && (
            <div className='flex w-5 place-content-center justify-end' test-id='sub-player'>
              <SubLineUpSVG
                className=' text-red-800'
                css={[tw`h-4 w-4`]}
              ></SubLineUpSVG>
            </div>
          )}
          <div className='flex justify-end gap-x-0.5'>
            {redCard > 0 && <RedCard numCards={redCard} size='xs'></RedCard>}
            {yellowRed < 1 && yellowCard > 0 && (
              <YellowCard isLineUp numCards={yellowCard} size='xs'></YellowCard>
            )}
          </div>
          {/* <div className='h-5/12'>
            <RatingBadge isSmall point={rating}></RatingBadge>
          </div> */}
        </div>
        {!showStats && (
          <div>
            <CustomLink href={`/football/player/${player?.id}`} target='blank'>
              <Avatar
                id={player?.id}
                type='player'
                width={36}
                height={36}
                isSmall
                className='border border-dark-card'
              />
            </CustomLink>
          </div>
        )}
        {showStats && (
          <PlayerStatsWithPopUp
            matchData={matchData}
            player={player}
            isHome={isHome}
          >
            <Avatar
              id={player?.id}
              type='player'
              width={36}
              isSmall
              height={36}
              className='border border-dark-card'
            />
          </PlayerStatsWithPopUp>
        )}

        <div className='  absolute right-0 mb-1 flex flex-col justify-between'>
          {rating &&<div className='h-5/12 relative bottom-2 right-2'>
            <RatingBadge isSmall point={rating}></RatingBadge>
          </div>}
          <div className='h-5/12 flex'>
            {team?.id && (
              <Avatar
                id={team?.id}
                type='team'
                width={20}
                height={20}
                isBackground={false}
                rounded={false}
                isSmall
              />
            )}
            {numGoals > 0 ? (
              !isHome ? (
                <GoalYellowSVG className='h-4 w-4'></GoalYellowSVG>
              ) : (
                <GoalBlueSVG className='h-4 w-4'></GoalBlueSVG>
              )
            ) : (
              ''
            )}
            {numGoals > 1 && (
              <span className='text-xs text-white'>
                <sub>x{numGoals}</sub>
              </span>
            )}
            <div>
              {penGoals > 0 && (
                <div className='relative'>
                  <GoalPenSVG
                    css={[
                      tw`h-4 w-4`,
                      isHome && tw` text-blue-800`,
                      !isHome && tw`text-logo-yellow`,
                    ]}
                  ></GoalPenSVG>
                  {penGoals > 1 && (
                    <span className='absolute -right-3 top-0 text-xs text-white'>
                      x{penGoals}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div>
              {missedPens > 0 && (
                <div className='relative'>
                  <MisssedPenSVG
                    css={[tw`h-4 w-4 text-dark-loss`]}
                  ></MisssedPenSVG>
                  {missedPens > 1 && (
                    <span className='absolute -right-3 top-0 text-xs text-white'>
                      x{missedPens}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div>
              {ownGoals > 0 && (
                <div className='relative'>
                  <OwnGoalSVG css={[tw`h-5 w-5 text-dark-loss`]}></OwnGoalSVG>
                  {ownGoals > 1 && (
                    <span className='absolute -right-3 top-0 text-xs text-white'>
                      x{ownGoals}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div>
              {numAssists > 0 && (
                <span className='flex items-center'>
                  {isHome ? (
                    <AssistSVG className='inline-block h-5 w-5 text-blue-800'></AssistSVG>
                  ) : (
                    <AssistSVG className='inline-block h-5 w-5  text-logo-yellow'></AssistSVG>
                  )}
                  {numAssists > 1 && <sub>{`x${numAssists}`}</sub>}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-20 items-center space-x-0.5 rounded-cmd bg-black/20 px-1 text-sm text-white'>
        {shirtNo && (
          <span
            css={[
              tw`rounded-sm px-1 text-white text-xs font-bold font-oswald`,
              // isHome && tw`bg-logo-blue`,
              // !isHome && tw`bg-logo-yellow`,
            ]}
          >
            {shirtNo}
          </span>
        )}
        <Tippy
          content={<span className='text-xs'>{name}</span>}
          placement='bottom-end'
        >
          <span className='truncate text-msm font-medium'>
            {captain && '(C) '}
            {name}
          </span>
        </Tippy>
      </div>
    </div>
  );
};

export const SquadSummarySection = ({
  teamName,
  avgAge,
  formation,
  teamRating = -1,
  i18n = vi,
  teamId,
}: {
  teamName: string;
  teamId?: string;
  avgAge: number | null;
  formation: string;
  isHome: boolean;
  logoUrl: string;
  teamRating?: number;
  i18n?: any;
}) => {
  return (
    <>
      <div className='bg-dark-head-lineups px-4 py-2.5'>
        <div className=' flex justify-between'>
          <div className='flex items-center gap-2 font-medium'>
            <Avatar
              type='team'
              id={teamId}
              isBackground={false}
              rounded={false}
              width={28}
              height={28}
            />
            <span className='text-csm text-white'>{teamName}</span>
            <RatingBadge point={teamRating}></RatingBadge>
          </div>
          <div>
            <span
              test-id='line-up-home'
              className=' text-csm font-medium text-white'
              // css={[isHome ? tw`text-dark-text` : tw`text-white`]}
            >
              {formation}
            </span>
          </div>
        </div>
        {avgAge !== 0 && (
          <div className=' space-x-2'>
            <span className=' text-csm dark:text-white'>
              {i18n.qv.avg_age}:
            </span>
            <span
              className='text-sm font-semibold dark:text-white'
              // css={[isHome ? tw`text-dark-text` : tw`text-white`]}
            >
              {avgAge} {i18n.qv.age_unit}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export const VerticalLineUpSection = ({
  lineupsData,
  mapPlayerEvents,
  matchData,
  activeTab,
}: {
  lineupsData: ILineupsInfo;
  activeTab?: keyof typeof LINEUPS_TAB;
  mapPlayerEvents: any;
  matchData: SportEventDto;
}) => {
  const { home, away } = lineupsData;

  return (
    <div className='relative'>
      <TwQuickViewSection
        className='relative flex aspect-[1/1.9] h-min max-h-[691px] w-full flex-col items-center justify-between overflow-x-hidden !rounded-none !border-none py-3.5 scrollbar'
        style={{
          backgroundImage: "url('/svg/map.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      >
        <VerticalHomeTeamLineUp
          lineups={home}
          activeType={activeTab}
          mapPlayerEvents={mapPlayerEvents}
          matchData={matchData}
          mdFitBg={true}
        ></VerticalHomeTeamLineUp>
        <VerticalAwayTeamLineUp
          lineups={away}
          activeType={activeTab}
          mapPlayerEvents={mapPlayerEvents}
          matchData={matchData}
          mdFitBg={true}
        ></VerticalAwayTeamLineUp>
      </TwQuickViewSection>
    </div>
  );
};

export const VerticalHomeTeamLineUp = ({
  lineups,
  mapPlayerEvents,
  matchData,
  showStats = true,
  mdFitBg,
  activeType,
}: {
  lineups: ILineupsItem;
  mapPlayerEvents?: any;
  matchData?: SportEventDto;
  showStats?: boolean;
  mdFitBg?: boolean;
  activeType?: keyof typeof LINEUPS_TAB;
}) => {
  const { players, formation, isNationalTeam } = lineups;

  if (isValEmpty(players) || isValEmpty(formation)) {
    return <></>;
  }
  const linePlayers = splitSquad(formation, players.slice(0, 11));

  return (
    <div className='relative w-full bg-cover bg-no-repeat'>
      <div className='flex flex-col place-content-center gap-y-4'>
        {linePlayers.map((lineup: ILineupsPlayer[], index: number) => {
          return (
            <TwLineupLine
              key={`line-${index}`}
              className='flex-wrap items-end gap-x-1'
            >
              {lineup.map((playerLineup: any, index: number) => {
                const {
                  team = {},
                  player = {},
                  rating = 0,
                  statistics = {},
                  captain,
                } = playerLineup;
                const playerRating = roundNum(
                  statistics?.rating || rating || 0,
                  1
                );
                const playerData = mapPlayerEvents?.get(player?.id) || {};

                return (
                  <PlayerLineUp
                    key={`player-${index}`}
                    activeType={activeType}
                    src={`${getImage(Images.player, player?.id)}`}
                    name={`${player?.name}`}
                    shirtNo={playerLineup.shirtNumber}
                    isSub={playerData.subOut || false}
                    yellowCard={playerData.yellow || 0}
                    yellowRed={playerData.yellowRed || 0}
                    redCard={playerData.redCard || 0}
                    numGoals={playerData.regularGoals || 0}
                    penGoals={playerData.penGoals || 0}
                    ownGoals={playerData.ownGoals || 0}
                    missedPens={playerData.missedPens || 0}
                    rating={Number(playerRating) || 0}
                    team={team || {}}
                    matchData={matchData}
                    player={player}
                    showStats={showStats}
                    isNationalTeam={isNationalTeam}
                    isHome={true}
                    captain={captain}
                  />
                );
              })}
            </TwLineupLine>
          );
        })}
        {!showStats && (
          <div className='pointer-events-none absolute bottom-1 right-2 flex justify-end'>
            <LogoSVG className='h-8 w-28 xl:h-10 xl:w-32' />
          </div>
        )}
      </div>
    </div>
  );
};

export const TwLineupLine = tw.div`flex flex-row justify-evenly`;
export const TwLineupLineAway = tw.div`flex flex-row-reverse justify-evenly`;

export const VerticalAwayTeamLineUp = ({
  lineups,
  mapPlayerEvents,
  matchData,
  showStats = true,
  mdFitBg,
  activeType,
}: {
  lineups: ILineupsItem;
  mapPlayerEvents: any;
  matchData?: SportEventDto;
  showStats?: boolean;
  mdFitBg?: boolean;
  activeType?: keyof typeof LINEUPS_TAB;
}) => {
  const { players, formation, isNationalTeam } = lineups;

  if (isValEmpty(players) || isValEmpty(formation)) {
    return <></>;
  }
  const linePlayers = splitSquad(formation, players.slice(0, 11));

  return (
    <div className='w-full rounded-b-md bg-cover bg-no-repeat'>
      <div className='flex flex-col place-content-center gap-y-4'>
        {linePlayers
          .slice()
          .reverse()
          .map((lineup: any, index: number) => {
            return (
              <TwLineupLineAway
                key={`line-${index}`}
                className='flex-wrap items-end gap-x-1'
              >
                {lineup.map((playerData: any, index: number) => {
                  const playerStatsData =
                    mapPlayerEvents?.get(playerData.player?.id) || {};
                  const {
                    player = {},
                    statistics = {},
                    rating = 0,
                    captain,
                  } = playerData;

                  const playerRating = roundNum(
                    statistics?.rating || rating || 0,
                    1
                  );
                  return (
                    <PlayerLineUp
                      key={`player-${index}`}
                      src={`${getImage(Images.player, player?.id)}`}
                      name={`${player?.name}`}
                      shirtNo={playerData.shirtNumber}
                      isSub={playerStatsData.subOut || false}
                      yellowCard={playerStatsData.yellow || 0}
                      yellowRed={playerStatsData.yellowRed || 0}
                      redCard={playerStatsData.redCard || 0}
                      numGoals={playerStatsData.regularGoals || 0}
                      penGoals={playerStatsData.penGoals || 0}
                      ownGoals={playerStatsData.ownGoals || 0}
                      missedPens={playerStatsData.missedPens || 0}
                      isHome={false}
                      matchData={matchData}
                      player={player}
                      showStats={showStats}
                      activeType={activeType}
                      rating={Number(playerRating) || 0}
                      captain={captain}
                      isNationalTeam={isNationalTeam}
                    />
                  );
                })}
              </TwLineupLineAway>
            );
          })}
      </div>
    </div>
  );
};

export const ImageSquad = ({
  url,
  width,
  height,
  className,
  type,
}: {
  url: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  type?: string;
}) => {
  const [err, setErr] = useState<boolean>(false);
  return (
    <img
      src={`${
        err
          ? '/images/football/teams/unknown-team.png'
          : `${getImage(type || Images.team, url)}`
      }`}
      alt=''
      width={width || 28}
      height={height || 28}
      className={clsx(className, 'h-5 w-5 rounded-full object-contain')}
      onError={() => setErr(true)}
    ></img>
  );
};

export const InjuriesSuspensionSection = ({
  i18n = vi,
  ref,
  homeTeam,
  awayTeam,
  awayMissingPlayers,
  homeMissingPlayers,
  className,
}: InjuriesSuspensionSectionProps) => {
  return (
    <TwMbQuickViewWrapper className={clsx(className, 'mt-5')}>
      <TwQuickViewTitleV2 className='text-center xl:text-left'>
        {i18n.titles.injuries} + {i18n.titles.suspensions}
      </TwQuickViewTitleV2>
      <div className='relative grid grid-cols-2 gap-x-6'>
        <TeamSuspensionList
          team={homeTeam}
          isHome={true}
          missingPlayers={homeMissingPlayers || []}
          i18n={i18n}
        />
        <TeamSuspensionList
          team={awayTeam}
          missingPlayers={awayMissingPlayers || []}
          i18n={i18n}
        />
        <div className='absolute left-[50%] h-full w-[1px] bg-[#838486] opacity-30'></div>{' '}
        {/* //todo create components */}
      </div>
    </TwMbQuickViewWrapper>
  );
};
