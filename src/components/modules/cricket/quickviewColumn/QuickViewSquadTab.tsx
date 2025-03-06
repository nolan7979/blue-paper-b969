import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import EmptySection from '@/components/common/empty';
import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import LineupTab from '@/components/common/skeleton/homePage/LineupTab';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import {
  QvPlayerV2,
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
import { SportEventDto } from '@/constant/interface';
import {
  ILineupsInfo,
  ILineupsItem,
  ILineupsPlayer,
  InjuriesSuspensionSectionProps,
} from '@/models';
import { IPlayerLineups } from '@/models/player';
import {
  getAgeFromTimestamp,
  getImage,
  getSlug,
  Images,
  isValEmpty,
  roundNum,
  splitSquad,
} from '@/utils';

import React from 'react';
import vi from '~/lang/vi';
import AssistSVG from '/public/svg/assist.svg';
import BlockSVG from '/public/svg/block.svg';
import EmptySVG from '/public/svg/empty.svg';
import GoalBlueSVG from '/public/svg/goal-blue.svg';
import OwnGoalSVG from '/public/svg/goal-own.svg';
import MisssedPenSVG from '/public/svg/goal-pen-miss.svg';
import GoalPenSVG from '/public/svg/goal-pen.svg';
import LogoSVG from '/public/svg/logo-transparent.svg';
import MissingReason0SVG from '/public/svg/missing-reason-0.svg';
import RedCrossSVG from '/public/svg/red-cross.svg';
import StadiumSVG from '/public/svg/stadium.svg';
import SubLineUpSVG from '/public/svg/sub-line-up.svg';
import { useSelectedMatchLineupsData } from '@/hooks/useCricket';

const QuickViewSquadTab: React.FC<{ matchData: SportEventDto }> = ({
  matchData,
}) => {
  const i18n = useTrans();
  const [activeTab, setActiveTab] = useState<string>('home');
  const { homeTeam, awayTeam } = matchData || {};
  const {
    data: lineupsData,
    isLoading: isLoadingLineups,
    refetch,
  } = useSelectedMatchLineupsData(matchData?.id || '');

  const onClickShowOptions = (value: string) => {
    if (value !== activeTab) {
      setActiveTab(value);
    }
  };

  const { home, away, confirmed } =
    (lineupsData as {
      confirmed: boolean;
      home: ILineupsItem[];
      away: ILineupsItem[];
    }) || {};

  const teamLineups = useMemo(() => {
    return activeTab === 'home' ? home : away;
  }, [home, away, activeTab]);

  if (isLoadingLineups) {
    return <LineupTab />;
  }

  if (
    isValEmpty(matchData) ||
    (isValEmpty(lineupsData?.home) && isValEmpty(lineupsData?.away))
  ) {
    return (
      <div className='space-y-2'>
        <EmptySection content={i18n.common.nodata} />
      </div>
    );
  }

  return (
    <>
      <div>
        <TwTabHead className='mb-3.5 mt-4'>
          {['home', 'away'].map((item: any, index) => {
            return (
              <TwBorderLinearBox
                key={item}
                className={` h-full w-1/2 !rounded-full ${
                  activeTab === item ? 'dark:border-linear-form' : ''
                }`}
              >
                <button
                  test-id={`btn-type-${item}`}
                  // isActive={statsPeriod === period.period}
                  onClick={() => onClickShowOptions(item)}
                  className={`flex h-full w-full items-center justify-center gap-x-1 rounded-full transition-colors  duration-300 ${
                    activeTab === item ? 'bg-dark-button dark:bg-button-gradient' : ''
                  }`}
                >
                  {item === 'home' && (
                    <Avatar
                      id={homeTeam?.id}
                      type='team'
                      width={24}
                      height={24}
                      className='shrink-0 grow-0 basis-6'
                      isBackground={false}
                      isSmall
                      rounded={false}
                    />
                  )}
                  {item === 'away' && (
                    <Avatar
                      id={awayTeam?.id}
                      type='team'
                      width={24}
                      height={24}
                      className='shrink-0 grow-0 basis-6'
                      isBackground={false}
                      isSmall
                      rounded={false}
                    />
                  )}
                </button>
              </TwBorderLinearBox>
            );
          })}
        </TwTabHead>
      </div>
      <div className='space-y-2 px-2.5 lg:px-0' test-id='Substitute'>
        <TeamPlayerList teamLineups={teamLineups} />
      </div>
    </>
  );
};
export default QuickViewSquadTab;

export const TeamPlayerList = ({
  teamLineups,
}: {
  teamLineups: ILineupsItem[];
}) => {
  return (
    <div className='flex flex-col gap-6' test-id='home-line-up'>
      {teamLineups?.map((lineup: any, index: number) => {
        const { player = {}, position = '' } = lineup;
        return (
          <CustomLink
            href={`/cricket/player/${getSlug(player?.name || 'slug')}/${
              lineup.player?.id
            }`}
            key={player?.id}
            disabled
          >
            <div className='flex gap-2'>
              <Avatar
                id={player?.id}
                type='player'
                width={36}
                height={36}
                className='border border-dark-card'
                isSmall
              />
              <div className='flex flex-col gap-1'>
                <p className='text-[13px] leading-3 text-black dark:text-white'>
                  {player?.name}
                </p>
                <p className='text-msm text-dark-text'>{position}</p>
              </div>
            </div>
          </CustomLink>
        );
      })}
    </div>
  );
};

export const TeamSuspensionList = ({
  team,
  missingPlayers = [],
  isHome,
}: {
  team?: any;
  missingPlayers: any[];
  isHome?: boolean;
}) => {
  const i18n = useTrans();
  return (
    <TwQuickViewSection className='!border-x-0 lg:!border-x-1.5'>
      <div
        test-id='away-line-up'
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
          isSmall
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
          <span className='text-msm dark:text-white' test-id='birthday'>
            {getAgeFromTimestamp(birthday)}
          </span>
        );
      case LINEUPS_TAB.height:
        return (
          ((height === 0 || !height) && (
            <div className='h-4 w-4'>
              <EmptySVG className='h-full w-full' />
            </div>
          )) || (
            <span className='text-msm dark:text-white' test-id='height'>
              {height}
            </span>
          )
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
            isBackground={false}
            rounded={true}
            isSmall
          />
        );
      default:
        return null;
    }
  }, [activeType, player, isNationalTeam]);

  return (
    <div
      className='relative flex flex-col items-center text-xxs xl:text-cxs'
      test-id='player-detail'
    >
      <div className='flex items-center justify-center'>
        <div
          className='absolute bottom-5  z-[2] mr-14 flex h-auto w-auto justify-end'
          test-id='sub-line'
        >
          {rating > 0 && (
            <div className='h-5/12 relative'>
              <RatingBadge isSmall point={rating}></RatingBadge>
            </div>
          )}
        </div>
        {!showStats && (
          <div>
            <CustomLink href={`/football/player/${player?.id}`} target='blank'>
              <Avatar
                id={player?.id}
                type='player'
                width={36}
                height={36}
                className='border border-dark-card'
                isSmall
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
              height={36}
              className='border border-dark-card'
              isSmall
            />
          </PlayerStatsWithPopUp>
        )}
        <div className='absolute top-0 ml-2 flex flex-col justify-between'>
          {activeType && (
            <div
              test-id={`type-${activeType}`}
              className={`absolute left-2 top-0 z-10 rounded-md  px-1 ${
                activeType !== 'nationality' ? 'bg-black' : ''
              }`}
            >
              <>{renderOptional}</>
            </div>
          )}
        </div>
        <div className='absolute bottom-5 ml-[50px] flex flex-col justify-between'>
          <div className='h-5/12 flex' test-id='numGoals'>
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
            {isSub && (
              <div className='flex w-5 place-content-center justify-end'>
                <SubLineUpSVG
                  className=' text-red-800'
                  css={[tw`h-4 w-4`]}
                ></SubLineUpSVG>
              </div>
            )}

            {redCard > 0 && (
              <div className='flex justify-end gap-x-0.5' test-id='card-red'>
                <RedCard numCards={redCard} size='xs'></RedCard>{' '}
              </div>
            )}
            {yellowRed < 1 && yellowCard > 0 && (
              <div className='flex justify-end gap-x-0.5' test-id='card-yellow'>
                <YellowCard
                  isLineUp
                  numCards={yellowCard}
                  size='xs'
                ></YellowCard>
              </div>
            )}
            {numGoals > 0 && <GoalBlueSVG className='h-4 w-4'></GoalBlueSVG>}
            {numGoals > 1 && (
              <span className='text-xs text-white'>
                <sub>x{numGoals}</sub>
              </span>
            )}
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
      <div
        className='flex w-max items-center space-x-0.5 rounded-cmd bg-black/20 px-1 text-sm text-white'
        test-id='search-no'
      >
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
          <span className=' pr-0.5 text-msm font-medium' test-id='name-player'>
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
  teamId,
}: {
  teamName: string;
  teamId?: string;
  avgAge: number | null;
  formation: string;
  isHome: boolean;
  logoUrl: string;
  teamRating?: number;
}) => {
  const i18n = useTrans();
  return (
    <>
      <div className='bg-dark-head-lineups px-4 py-2.5'>
        <div className=' flex justify-between' test-id='away-line-up-info'>
          <div
            className='flex items-center gap-2 font-medium'
            test-id='team-home-line-up'
          >
            <Avatar
              type='team'
              id={teamId}
              isBackground={false}
              rounded={false}
              width={28}
              height={28}
              isSmall
            />
            <span className='text-csm text-white' test-id='team-name'>
              {teamName}
            </span>
            <RatingBadge point={teamRating}></RatingBadge>
          </div>
          <div>
            <span
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
        className='relative flex aspect-[1/1.9] h-min max-h-[667px] w-full flex-col items-center justify-between !rounded-none !border-none py-2'
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
      <div className='flex flex-col place-content-center gap-y-2'>
        {linePlayers.map((lineup: ILineupsPlayer[], index: number) => {
          return (
            <div
              key={`line-${index}`}
              className='flex flex-row flex-wrap items-end justify-evenly gap-x-1'
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
            </div>
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
      <div className='flex flex-col place-content-center gap-y-2'>
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
        />
        <TeamSuspensionList
          team={awayTeam}
          missingPlayers={awayMissingPlayers || []}
        />
        <div className='absolute left-[50%] h-full w-[1px] bg-[#838486] opacity-30'></div>{' '}
        {/* //todo create components */}
      </div>
    </TwMbQuickViewWrapper>
  );
};
