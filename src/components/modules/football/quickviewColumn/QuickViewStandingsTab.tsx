/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { GoTriangleRight } from 'react-icons/go';
import tw from 'twin.macro';

import {
  useGroupMatchData,
  useSeasonStandingsData,
  useSeasonStandingsFormData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import EmptySection from '@/components/common/empty';
import Standing from '@/components/common/skeleton/competition/StandingRow';
import { LiveIcon } from '@/components/icons/Live';
import {
  FormBadgeWithHover,
  SoccerTeam,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { SelectBXHFormat } from '@/components/modules/football/selects/SelectBXHFormat';
import {
  TwDesktopView,
  TwQuickViewSection,
  TwSkeletonRectangle,
} from '@/components/modules/football/tw-components';

import { useFilterStore } from '@/stores';

import { STANDINGS_TAB } from '@/constant/common';
import { SportEventDto, StatusDto } from '@/constant/interface';
import {
  IQuickViewStandingsTab,
  IStandingRowProps,
} from '@/models/page/matchDetails';
import { StandingPromotionNotes } from '@/modules/football/competition/components';
import {
  extractCompetitionId,
  genBorderColors,
  genRankingColors,
  getImage,
  getLastMatches,
  Images,
  isMatchLive,
  isValEmpty,
} from '@/utils';

import QuickViewTopScore from '@/components/modules/football/quickviewColumn/QuickViewTopScore';
import { useArabicLayout } from '@/hooks';
import { usePathname } from 'next/navigation';
import ArrowRight from '/public/svg/arrow-right.svg';
import LeftArrowSVG from '/public/svg/left-arrow.svg';
import { cn } from '@/utils/tailwindUtils';

const QuickViewStandingsTab = ({
  matchData,
  wide = false,
  tournamentId = '',
  seasonId = '',
  stageId = '',
  type = '',
  isUniqueTournament = false,
  isPlayerStats,
  isStandings,
  isSort = false,
}: IQuickViewStandingsTab) => {
  const path = usePathname();
  const isCompetition = ['competition', 'team'].includes(path.split('/')[2]);
  const isDetail = path.includes('/match/');
  const i18n = useTrans();
  const [disabledRealtimeBtn, setDisabledRealtimeBtn] =
    useState<DisabledBtnProps>({});
  const { bxhFormat, bxhData, setBxhData } = useFilterStore();

  const { tournament, homeTeam, awayTeam, stage_id, season } = matchData;
  const status: StatusDto = matchData.status;
  const shouldRefetch = isMatchLive(status && status.code);

  // useEffect(() => {}, [liveScores]);

  const { data: standingsData, isLoading } = useSeasonStandingsData(
    tournamentId || tournament?.id,
    seasonId || season?.id,
    stageId || stage_id,
    type || bxhData,
    isUniqueTournament
  );
  // const { data: eventData } = useEventCounter();

  const { data: lastMatches, isLoading: isLoadingForm } =
    useSeasonStandingsFormData(
      tournamentId || tournament?.id,
      seasonId || season?.id,
      stageId || stage_id,
      type || bxhData,
      isUniqueTournament
    );

  const { data: groupMatch } = useGroupMatchData(
    tournament.id,
    season?.id,
    stage_id
  );

  useEffect(() => {
    if (isPlayerStats && !isStandings) {
      setBxhData('');
    } else {
      setBxhData('total');
    }
  }, [isStandings, isPlayerStats]);

  const ArrayFromOnetoNine = Array.from(
    { length: 20 },
    (_, index) => index + 1
  );

  if (!bxhData) {
    return (
      <>
        <StandingTypeFilter
          wide={false}
          isPlayerStats={isPlayerStats}
          isStandings={isStandings}
          competitionName={tournament.name}
          imgId={tournament.id}
          isLive={shouldRefetch}
          disabled={disabledRealtimeBtn}
        />
        <QuickViewTopScore matchData={matchData} />
      </>
    );
  }
  if (isLoading || !standingsData.standings) {
    return <></>;
  }
  const { standings: groups } = standingsData;

  return (
    <div className='space-y-4'>
      <StandingTypeFilter
        wide={false}
        isPlayerStats={isPlayerStats}
        isStandings={isStandings}
        competitionName={tournament.name}
        imgId={tournament.id}
        isLive={shouldRefetch}
        disabled={disabledRealtimeBtn}
      />

      {((isLoading || isLoadingForm) && (
        <TwSkeletonRectangle className='!h-fit dark:bg-primary-gradient'>
          {ArrayFromOnetoNine.map((number) => (
            <Standing key={number} />
          ))}
        </TwSkeletonRectangle>
      )) ||
        (isValEmpty(groups) && (
          <EmptySection content={i18n.common.nodata} />
        )) || (
          <>
            {groups?.map((groupData: any, index: number) => {
              const { tieBreakingRule = {}, rows = [] } = groupData || {};
              let groupLastMatches = lastMatches || {};
              groupLastMatches = lastMatches || {};

              const rankingColors = genRankingColors(rows);

              const arrMatch = groupMatch?.events?.filter(
                (item: any) => item?.status?.code === 0
              );

              const arrMatchSort = arrMatch?.sort(
                (a: any, b: any) => a.startTimestamp - b.startTimestamp
              );

              const rowsNextMatch = rows?.map((item: any) => {
                const nextMatch = arrMatchSort?.find(
                  (match: Match) =>
                    match.homeTeam.id === item.team.id ||
                    match.awayTeam.id === item.team.id
                );

                return {
                  ...item,
                  nextMatchUrl: `/football/match/${nextMatch?.slug || 'slug'}/${
                    nextMatch?.id
                  }`,
                  nextTeam: nextMatch
                    ? nextMatch.homeTeam.id === item.team.id
                      ? nextMatch.awayTeam
                      : nextMatch.homeTeam
                    : undefined,
                };
              });

              return (
                <React.Fragment key={`group-${index}`}>
                  <TwQuickViewSection className='z-0 overflow-x-auto scrollbar'>
                    {rowsNextMatch.length > 0 && (
                      <StandingHeaderRow
                        showForm={bxhFormat === 'form' || wide}
                        showLong={bxhFormat === 'full'}
                        wide={wide}
                        isSort={isSort}
                        isDetail={isDetail}
                      />
                    )}
                    {rowsNextMatch.length < 1 && (
                      <div className='p-4 text-center text-xs dark:text-dark-text'>
                        {i18n.common.nodata}
                      </div>
                    )}
                    <ul
                      className={cn('w-fit space-y-1 text-xs', {
                        'w-fit sm:w-full md:justify-between lg:w-fit': isDetail,
                      })}
                    >
                      {rowsNextMatch.map((row: any, idx: number) => {
                        const {
                          team = {},
                          promotion = {},
                          position,
                          matches,
                          wins,
                          scoresFor,
                          scoresAgainst,
                          id,
                          losses,
                          draws,
                          points,
                          change,
                          live,
                          match,
                          nextTeam,
                          nextMatchUrl = '',
                        } = row;

                        let teamLastMatches = groupLastMatches[team?.id] || [];
                        teamLastMatches = getLastMatches(teamLastMatches);
                        return (
                          <StandingRow
                            isDetail={isDetail}
                            key={`standing-row-${idx}`}
                            uniqueKey={idx}
                            no={position}
                            team={team}
                            logoUrl={`${getImage(Images.team, team?.id)}`}
                            nextMatchTeam={nextTeam}
                            isRankUp={change > 0}
                            isRankDown={change < 0}
                            change={change}
                            noMatches={matches}
                            noWin={wins}
                            noDraw={draws}
                            noLoss={losses}
                            scoresFor={scoresFor}
                            scoresAgainst={scoresAgainst}
                            goalDiff={scoresFor - scoresAgainst}
                            points={points}
                            showForm={bxhFormat === 'form' || wide}
                            showLong={bxhFormat === 'full'}
                            promotion={promotion}
                            homeTeam={homeTeam}
                            awayTeam={awayTeam}
                            lastMatches={teamLastMatches}
                            wide={wide}
                            rankingColors={rankingColors}
                            live={live}
                            classNameStickyColumn={
                              isCompetition
                                ? 'dark:bg-transparent bg-white'
                                : 'bg-white dark:bg-dark-card'
                            }
                            match={match}
                            nextMatchUrl={nextMatchUrl}
                          />
                        );
                      })}
                    </ul>
                  </TwQuickViewSection>
                  <div className=''>
                    <StandingPromotionNotes rankingColors={rankingColors} />
                  </div>

                  <div className='mt-4 text-xs text-dark-text'>
                    {tieBreakingRule?.text}
                  </div>
                </React.Fragment>
              );
            })}
          </>
        )}
      <HeadSectionStandings
        matchData={matchData}
        setDisabledRealtimeBtn={setDisabledRealtimeBtn as (value: any) => void}
      />

      {/*<NoteTabSVG className='h-[3.875rem] w-[8.125rem]' />*/}
    </div>
  );
};

export default QuickViewStandingsTab;
export interface Match {
  awayScore: { display: number };
  homeScore: { display: number };
  homeTeam: { id: string };
  awayTeam: { id: string };
}

export const StandingRow = ({
  uniqueKey,
  no,
  team,
  logoUrl = '',
  noMatches = 0,
  noWin = 0,
  noDraw = 0,
  noLoss = 0,
  scoresFor = 0,
  scoresAgainst = 0,
  goalDiff = 0,
  points = 0,
  showForm = false,
  showLong = false,
  promotion = {},
  homeTeam = {},
  awayTeam = {},
  lastMatches = [],
  wide = false,
  rankingColors,
  live,
  match,
  nextMatchTeam,
  nextMatchUrl = '',
  classNameStickyColumn = 'bg-white dark:bg-dark-main',
  isDetail = false,
}: IStandingRowProps) => {
  return (
    <li
      test-id='standing-row'
      className='!mt-0 border-b py-0.5 last:border-none dark:border-head-tab dark:bg-dark-card'
      key={uniqueKey}
    >
      <CustomLink
        href={`/football/competitor/${team.slug || team.name}/${team?.id}`}
        target='_parent'
        className={cn('flex w-fit items-center', {
          'bg-logo-blue/20': team?.id === homeTeam?.id,
          'bg-logo-yellow/20': team?.id === awayTeam?.id,
          'w-fit sm:w-full md:justify-between lg:w-fit': isDetail,
        })}
      >
        <div
          className={clsx(
            'sticky left-0 z-[2] flex h-8 items-center',
            classNameStickyColumn
          )}
        >
          <div
            test-id='team-logo'
            className={clsx(
              'flex h-full items-center bg-white pl-1.5 dark:bg-transparent',
              {
                '!bg-logo-blue/20': team?.id === homeTeam?.id,
                '!bg-logo-yellow/20': team?.id === awayTeam?.id,
              }
            )}
          >
            {/* Rank */}
            <div className='flex w-4 justify-center'>
              {/* TODO use outcome */}
              <RankNoBadge
                rank={no}
                promotion={promotion}
                rankingColors={rankingColors}
              />
            </div>
            {/* Team name */}
            <div className='flex w-16 justify-center' test-id='team-logo'>
              <SoccerTeam
                logoUrl={logoUrl}
                team={team}
                isLink={false}
                match={match}
                showName={false}
              />
            </div>
          </div>
        </div>

        <div className='w-28 truncate whitespace-nowrap lg:w-36'>
          <SoccerTeam
            team={team}
            showIcon={false}
            teamPlaying={false}
            showLiveScore={false}
            match={match}
          />
        </div>

        <div className='w-10 justify-end'>
          <SoccerTeam
            team={team}
            showIcon={false}
            showName={false}
            showLiveScore={true}
            teamPlaying={false}
            match={match}
          />
        </div>

        {/* Points */}
        <StandingCell
          val={points}
          wide={wide}
          isBold={false}
          isMain={true}
          className='w-12'
          idCol='id-points'
        />

        {/* Tran */}
        <StandingCell
          val={noMatches}
          wide={wide}
          isWin={false}
          isBold={true}
          isMain={true}
          className='w-12'
          idCol='id-match'
        />

        {/* Goal diff */}
        <StandingCell
          val={goalDiff}
          wide={wide}
          isSigned={true}
          className='w-12'
          idCol='id-goal-diff'
        />

        {/* Win */}
        {showLong && (
          <>
            <StandingCell
              val={noWin}
              wide={wide}
              isWin={true}
              className='w-12'
              idCol='id-win'
            />
            <StandingCell
              val={noDraw}
              wide={wide}
              isDraw={true}
              className='w-12'
              idCol='id-draw'
            />
            <StandingCell
              val={noLoss}
              wide={wide}
              isLoss={true}
              className='w-12'
              idCol='id-loss'
            />
          </>
        )}

        {/*{wide && (*/}
        {/*  <>*/}
        {/*    <StandingCell*/}
        {/*      val={scoresFor}*/}
        {/*      wide={wide}*/}
        {/*      className='min-w-12 max-w-12 '*/}
        {/*    />*/}
        {/*    <StandingCell*/}
        {/*      val={scoresAgainst}*/}
        {/*      wide={wide}*/}
        {/*      className='min-w-12 max-w-12 '*/}
        {/*    />*/}
        {/*  </>*/}
        {/*)}*/}

        <StandingCell
          val={scoresFor}
          wide={wide}
          className='w-12'
          idCol='id-for'
        />

        <StandingCell
          val={scoresAgainst}
          wide={wide}
          className='w-12'
          idCol='id-against'
        />

        {/* nextFootballMatch*/}
        <div className='flex w-20 justify-center'>
          {nextMatchTeam && (
            <SoccerTeam
              team={nextMatchTeam}
              isLink={true}
              teamPlaying={live}
              showName={false}
              match={match}
              customUrl={nextMatchUrl}
            />
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className='w-40'>
            <div className='flex justify-center md:pl-2'>
              {lastMatches.map((match: any, idx: number) => {
                if (match.winnerCode === 1) {
                  if (`${match.homeTeam?.id}` === `${team?.id}`) {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={true}
                        isDraw={false}
                        isLoss={false}
                        isSmall
                        matchData={match}
                      />
                    );
                  } else {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={false}
                        isDraw={false}
                        isLoss={true}
                        isSmall
                        matchData={match}
                      />
                    );
                  }
                } else if (match.winnerCode === 2) {
                  if (`${match.awayTeam?.id}` === `${team?.id}`) {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={true}
                        isDraw={false}
                        isLoss={false}
                        isSmall
                        matchData={match}
                      />
                    );
                  } else {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={false}
                        isDraw={false}
                        isLoss={true}
                        isSmall
                        matchData={match}
                      />
                    );
                  }
                } else if (match.winnerCode === 3) {
                  return (
                    <FormBadgeWithHover
                      key={idx}
                      isWin={false}
                      isDraw={true}
                      isLoss={false}
                      isSmall
                      matchData={match}
                    />
                  );
                } else {
                  return (
                    <FormBadgeWithHover
                      key={idx}
                      isWin={false}
                      isDraw={false}
                      isLoss={false}
                      isSmall
                      matchData={match}
                    />
                  );
                }
              })}
            </div>
          </div>
        )}
      </CustomLink>
    </li>
  );
};

export const StandingRowMobile = ({
  uniqueKey,
  no,
  team,
  logoUrl = '',
  noMatches = 0,
  noWin = 0,
  noDraw = 0,
  noLoss = 0,
  scoresFor = 0,
  scoresAgainst = 0,
  goalDiff = 0,
  points = 0,
  showForm = false,
  showLong = false,
  promotion = {},
  homeTeam = {},
  awayTeam = {},
  lastMatches = [],
  wide = false,
  rankingColors,
  live,
  match,
  nextMatchTeam,
  nextMatchUrl = '',
  classNameStickyColumn = 'bg-white dark:bg-dark-main',
}: IStandingRowProps) => {
  const { toggleRecentMatch } = useFilterStore();
  return (
    <li
      test-id='standing-row'
      className='!mt-0 border-b py-0.5 last:border-none dark:border-head-tab dark:bg-dark-card'
      key={uniqueKey}
    >
      <CustomLink
        href={`/football/competitor/${team.slug || team.name}/${team?.id}`}
        target='_parent'
        className={clsx('flex items-center', {
          'bg-logo-blue/20': team?.id === homeTeam?.id,
          'bg-logo-yellow/20': team?.id === awayTeam?.id,
          'w-fit': !toggleRecentMatch,
          'w-full justify-between': toggleRecentMatch,
        })}
      >
        <div
          className={clsx(
            'sticky left-0 z-[2] flex h-8 items-center',
            classNameStickyColumn
          )}
        >
          <div
            test-id='team-logo'
            className={clsx(
              'flex h-full items-center bg-white pl-1.5 dark:bg-transparent',
              {
                '!bg-logo-blue/20': team?.id === homeTeam?.id,
                '!bg-logo-yellow/20': team?.id === awayTeam?.id,
              }
            )}
          >
            {/* Rank */}
            <div className='flex w-4 justify-center'>
              {/* TODO use outcome */}
              <RankNoBadge
                rank={no}
                promotion={promotion}
                rankingColors={rankingColors}
              />
            </div>
            {/* Team name */}
            <div className='flex w-16 justify-center' test-id='team-logo'>
              <SoccerTeam
                logoUrl={logoUrl}
                team={team}
                isLink={false}
                match={match}
                showName={false}
              />
            </div>
          </div>
        </div>

        <div
          className={`w-28 truncate whitespace-nowrap lg:w-36 ${
            toggleRecentMatch ? 'flex-1' : ''
          }`}
        >
          <SoccerTeam
            team={team}
            showIcon={false}
            teamPlaying={false}
            showLiveScore={false}
            match={match}
          />
        </div>

        {/* Score */}
        {!toggleRecentMatch ? (
          <>
            <div className='w-10 justify-end'>
              <SoccerTeam
                team={team}
                showIcon={false}
                showName={false}
                showLiveScore={true}
                teamPlaying={false}
                match={match}
              />
            </div>
            {/* Points */}
            <StandingCell
              val={points}
              wide={wide}
              isBold={false}
              isMain={true}
              className='w-12'
              idCol='id-points'
            />

            {/* Tran */}
            <StandingCell
              val={noMatches}
              wide={wide}
              isWin={false}
              isBold={true}
              isMain={true}
              className='w-12'
              idCol='id-match'
            />

            {/* Goal diff */}
            <StandingCell
              val={goalDiff}
              wide={wide}
              isSigned={true}
              className='w-12'
              idCol='id-goal-diff'
            />

            {/* Win */}
            <StandingCell
              val={noWin}
              wide={wide}
              isWin={true}
              className='w-12'
              idCol='id-win'
            />
            <StandingCell
              val={noDraw}
              wide={wide}
              isDraw={true}
              className='w-12'
              idCol='id-draw'
            />
            <StandingCell
              val={noLoss}
              wide={wide}
              isLoss={true}
              className='w-12'
              idCol='id-loss'
            />

            <StandingCell
              val={scoresFor}
              wide={wide}
              className='w-12'
              idCol='id-for'
            />

            <StandingCell
              val={scoresAgainst}
              wide={wide}
              className='w-12'
              idCol='id-against'
            />

            {/* nextFootballMatch*/}
            <div className='flex w-20 justify-center'>
              {nextMatchTeam && (
                <SoccerTeam
                  team={nextMatchTeam}
                  isLink={true}
                  teamPlaying={live}
                  showName={false}
                  match={match}
                  customUrl={nextMatchUrl}
                />
              )}
            </div>
          </>
        ) : (
          <div className='w-28 lg:w-40'>
            <div className='flex justify-center md:pl-2'>
              {lastMatches.map((match: any, idx: number) => {
                if (match.winnerCode === 1) {
                  if (`${match.homeTeam?.id}` === `${team?.id}`) {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={true}
                        isDraw={false}
                        isLoss={false}
                        isSmall
                        matchData={match}
                      />
                    );
                  } else {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={false}
                        isDraw={false}
                        isLoss={true}
                        isSmall
                        matchData={match}
                      />
                    );
                  }
                } else if (match.winnerCode === 2) {
                  if (`${match.awayTeam?.id}` === `${team?.id}`) {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={true}
                        isDraw={false}
                        isLoss={false}
                        isSmall
                        matchData={match}
                      />
                    );
                  } else {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={false}
                        isDraw={false}
                        isLoss={true}
                        isSmall
                        matchData={match}
                      />
                    );
                  }
                } else if (match.winnerCode === 3) {
                  return (
                    <FormBadgeWithHover
                      key={idx}
                      isWin={false}
                      isDraw={true}
                      isLoss={false}
                      isSmall
                      matchData={match}
                    />
                  );
                } else {
                  return (
                    <FormBadgeWithHover
                      key={idx}
                      isWin={false}
                      isDraw={false}
                      isLoss={false}
                      isSmall
                      matchData={match}
                    />
                  );
                }
              })}
            </div>
          </div>
        )}
      </CustomLink>
    </li>
  );
};

const StandingCell = ({
  val,
  isSigned = false,
  children = null,
  className = '',
  idCol,
}: {
  val?: number;
  wide?: boolean;
  isWin?: boolean;
  isDraw?: boolean;
  isLoss?: boolean;
  isBold?: boolean;
  isMain?: boolean;
  isSigned?: boolean;
  className?: string;
  idCol?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      test-id='stading-col'
      className={`flex place-content-center items-center font-primary text-xss font-normal dark:text-white ${className}
      `}
      // css={[
      //   wide && tw`w-1/20`,
      //   !wide && tw`w-1/15`,
      //   // isWin && tw`text-dark-win`,
      //   // isDraw && tw`text-dark-draw`,
      //   // isLoss && tw`text-dark-loss`,
      //   // isBold && tw`font-medium`,
      //   // isMain && tw`text-logo-blue`,
      // ]}
    >
      {isSigned && <span>{val && val > 0 ? '+' : ''}</span>}
      <StandingNumber val={val} id={idCol}></StandingNumber>
      {children}
    </div>
  );
};

export const StandingHeaderRow = ({
  showForm = false,
  showLong = false,
  isSort = false,
  isDetail = false,
}: {
  showForm: boolean;
  showLong?: boolean;
  wide?: boolean;
  isSort?: boolean;
  isDetail?: boolean;
}) => {
  const i18n = useTrans();
  const { resolvedTheme } = useTheme();
  const { toggleRecentMatch } = useFilterStore();

  return (
    <li
      className={cn(
        'flex h-[2.375rem] items-center bg-head-tab py-2.5 font-primary text-xss font-normal dark:bg-dark-head-tab',
        {
          'w-full justify-between': toggleRecentMatch,
          'w-fit': !toggleRecentMatch,
          'w-fit sm:w-full lg:w-fit lg:justify-between': isDetail,
        }
      )}
    >
      <div className='sticky left-0 z-[2] flex bg-head-tab pl-1.5  dark:bg-dark-head-tab'>
        {/* Rank */}
        <div className='flex w-4 place-content-center text-center'>#</div>

        {/* Team name */}
        <div className='w-16 text-center'>{i18n.menu.team}</div>
      </div>

      <div className='w-28 lg:w-36' />

      {!toggleRecentMatch ? (
        <>
          <div className='w-10' />
          {/* Points */}
          {isSort && (
            <div className='w-12 truncate text-center normal-case'>
              {i18n.qv.pointsShort}
            </div>
          )}

          <div
            className='w-12 truncate text-center uppercase'
            test-id='col-qv-played'
          >
            {i18n.qv.played}
          </div>

          <div
            className='min-w-12 max-w-12 truncate text-center uppercase'
            test-id='goals-diff'
          >
            {i18n.qv.goals_diff}
          </div>
          {!isSort && (
            <div className='w-12 truncate text-center normal-case'>
              {i18n.qv.pointsShort}
            </div>
          )}

          {/* Win */}
          {showLong && (
            <>
              <div className='min-w-12 max-w-12  truncate text-center uppercase text-standings-t'>
                {i18n.qv.won}
              </div>

              <div className='min-w-12 max-w-12  truncate text-center uppercase text-standings-h'>
                {i18n.qv.drawn}
              </div>

              <div className='min-w-12 max-w-12  truncate text-center uppercase text-standings-b'>
                {i18n.qv.lost}
              </div>
            </>
          )}

          <div className='w-12 truncate text-center uppercase'>
            {i18n.qv.goals_for}
          </div>

          <div className='w-12 truncate text-center uppercase'>
            {i18n.qv.goals_against}
          </div>

          {/* nextFootballMatch*/}
          <div className='w-20 truncate text-center normal-case'>
            {i18n.titles.nextFootballMatch}
          </div>

          {/* Form */}
          {showForm && (
            <div className='w-40 text-center'>
              <div className='flex flex-col items-center justify-center truncate'>
                {i18n.filter.form}
                <div
                  className='relative flex w-7/12 justify-end
                '
                >
                  <div className='absolute -left-1 top-1/2 z-0 h-[1px] w-full -translate-y-1/2 bg-black dark:bg-white'></div>
                  <GoTriangleRight
                    style={{
                      color: `${resolvedTheme === 'dark'}?"white":"black"`,
                    }}
                  ></GoTriangleRight>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='w-28 pr-2 text-right lg:w-40'>{i18n.titles.recent}</div>
      )}
    </li>
  );
};

export const StandingNumber = ({ val, id }: { val: any; id?: string }) => {
  return (
    <div className='text-center' test-id={id}>
      {val}
    </div>
  );
};
export const StandingTypeFilter = ({
  wide,
  isLive,
  competitionName,
  imgId = '',
  isPlayerStats,
  isStandings,
}: {
  imgId?: string;
  competitionName?: string;
  wide: boolean;
  isLive: boolean;
  isPlayerStats?: boolean;
  isStandings?: boolean;
  disabled: DisabledBtnProps;
}) => {
  const i18n = useTrans();
  const isArabicLayout = useArabicLayout();
  const { bxhData, setBxhData } = useFilterStore();
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isScrollBar, setIsScrollBar] = useState<boolean>(false);
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('scroll-container');
    const scrollStep = 70;
    if (container) {
      if (direction === 'left') {
        container.scrollLeft -= scrollStep;
        setScrollLeft(container.scrollLeft);
      } else {
        container.scrollLeft += scrollStep;
        setScrollLeft(container.scrollLeft);
      }
    }
  };

  return (
    <div className='space-y-2 py-2'>
      <div className='flex w-full items-center justify-between gap-x-3 px-2 transition-all lg:px-0'>
        <div className='w-full space-y-5 whitespace-nowrap'>
          {imgId && (
            <div className='flex items-center gap-2 text-left text-xss font-medium normal-case text-black dark:text-white'>
              <Avatar
                id={extractCompetitionId(imgId)}
                type='competition'
                rounded={false}
                width={24}
                height={24}
                isBackground={false}
                isSmall
              />
              {competitionName}
            </div>
          )}
          <div className='relative z-[4]'>
            <div
              className={clsx(
                'flex h-[2.188rem] gap-2 overflow-x-auto no-scrollbar',
                {
                  'ml-[3.25rem]': isArabicLayout,
                  'mr-[3.25rem]': !isArabicLayout,
                }
              )}
              id='scroll-container'
              onMouseEnter={() => setIsScrollBar(true)}
              onMouseLeave={() => setIsScrollBar(false)}
            >
              {isStandings && (
                <>
                  {isLive && (
                    <div
                      className={`h-full !rounded-full ${
                        bxhData === STANDINGS_TAB.realtime
                          ? 'border-linear-form'
                          : 'bg-white dark:bg-transparent'
                      }`}
                    >
                      <button
                        id='btnRealtime'
                        className={clsx(
                          'flex h-full w-full items-center justify-center rounded-full !p-2.5 font-medium text-black dark:text-white',
                          bxhData === STANDINGS_TAB.realtime
                            ? 'dark:bg-button-gradient bg-dark-button text-white'
                            : 'text-black dark:text-white'
                        )}
                        onClick={() => setBxhData(STANDINGS_TAB.realtime)}
                      >
                        <LiveIcon className='h-3 w-3 text-red-500' />
                        <TwTitleBtn className='text-xss text-white'>
                          {i18n.menu.bxh_realtime}
                        </TwTitleBtn>
                      </button>
                    </div>
                  )}
                  <div
                    className={`h-full !rounded-full ${
                      bxhData === STANDINGS_TAB.total
                        ? 'border-linear-form'
                        : 'bg-white dark:bg-dark-head-tab'
                    }`}
                  >
                    <button
                      id='btnTotal'
                      className={clsx(
                        'flex h-full w-full items-center justify-center rounded-full !p-2.5 text-xss font-medium text-black dark:text-white',
                        bxhData === STANDINGS_TAB.total
                          ? 'dark:bg-button-gradient bg-dark-button text-white'
                          : 'text-black dark:text-white'
                      )}
                      onClick={() => setBxhData(STANDINGS_TAB.total)}
                    >
                      {i18n.filter.all}
                    </button>
                  </div>
                  <div
                    className={`h-full !rounded-full ${
                      bxhData === STANDINGS_TAB.away
                        ? 'border-linear-form'
                        : 'bg-white dark:bg-dark-head-tab'
                    }`}
                  >
                    <button
                      id='btnAway'
                      className={clsx(
                        'flex h-full w-full items-center justify-center rounded-full !p-2.5 text-xss font-medium text-black dark:text-white',
                        bxhData === STANDINGS_TAB.away
                          ? 'dark:bg-button-gradient bg-dark-button text-white'
                          : 'text-black dark:text-white'
                      )}
                      onClick={() => setBxhData(STANDINGS_TAB.away)}
                    >
                      {i18n.filter.away_venue}
                    </button>
                  </div>
                  <div
                    className={`h-full !rounded-full ${
                      bxhData === STANDINGS_TAB.home
                        ? 'border-linear-form'
                        : 'bg-white dark:bg-dark-head-tab'
                    }`}
                  >
                    <button
                      id='btnHome'
                      className={clsx(
                        'flex h-full w-full items-center justify-center rounded-full !p-2.5 text-xss font-medium text-black dark:text-white',
                        bxhData === STANDINGS_TAB.home
                          ? 'dark:bg-button-gradient bg-dark-button text-white'
                          : 'text-black dark:text-white'
                      )}
                      onClick={() => setBxhData(STANDINGS_TAB.home)}
                    >
                      {i18n.filter.home_venue}
                    </button>
                  </div>
                </>
              )}
              {isPlayerStats && (
                <div
                  className={`h-full !rounded-full ${
                    bxhData === ''
                      ? 'border-linear-form'
                      : 'bg-white dark:bg-dark-head-tab'
                  }`}
                >
                  <button
                    id='btnTopScorer'
                    className={clsx(
                      'flex h-full w-full items-center justify-center rounded-full !p-2.5 text-xss font-medium text-black dark:text-white',
                      bxhData === ''
                        ? 'dark:bg-button-gradient bg-dark-button text-white'
                        : 'text-black dark:text-white'
                    )}
                    onClick={() => setBxhData('')}
                  >
                    {i18n.tab.topScore}
                  </button>
                </div>
              )}
            </div>
            <TwDesktopView>
              {scrollLeft > 0 && (
                <TwScrollBtn
                  className={clsx('bottom-0 left-0 hover:!flex', {
                    '!hidden': !isScrollBar,
                    flex: isScrollBar,
                  })}
                >
                  <button
                    test-id='left-draw'
                    onClick={() => handleScroll('left')}
                    className='p-1.5 text-dark-draw'
                  >
                    <LeftArrowSVG />
                  </button>
                </TwScrollBtn>
              )}
            </TwDesktopView>
            <TwDesktopView>
              {typeof window !== 'undefined' && (
                <>
                  {scrollLeft <
                    (document.getElementById('scroll-container')?.scrollWidth ??
                      0) -
                      (document.getElementById('scroll-container')
                        ?.clientWidth ?? 0) -
                      1 && (
                    <TwScrollBtn
                      className={clsx('bottom-0 right-6 hover:!flex', {
                        '!hidden': !isScrollBar,
                        flex: isScrollBar,
                      })}
                    >
                      <button
                        test-id='right-draw'
                        className='p-1.5 text-dark-draw'
                        onClick={() => handleScroll('right')}
                      >
                        <ArrowRight />
                      </button>
                    </TwScrollBtn>
                  )}
                </>
              )}
            </TwDesktopView>
            <div
              className={clsx(
                'absolute top-[0.063rem] flex h-[2.188rem] w-[2.188rem] flex-col items-center justify-center rounded-full bg-transparent',
                { 'left-2': isArabicLayout, 'right-2': !isArabicLayout }
              )}
            >
              <Drawer isOpen={!!bxhData}>
                <div className='flex gap-2'>{!wide && <SelectBXHFormat />}</div>
              </Drawer>
            </div>
          </div>
          {/*<div*/}
          {/*  className='no-scrollbar flex h-full w-full gap-x-3 overflow-x-auto '*/}
          {/*  onMouseEnter={() => setIsScrollBar(true)}*/}
          {/*  onMouseLeave={() => setIsScrollBar(false)}*/}
          {/*  id='scroll-container'*/}
          {/*>*/}
          {/*  {isLive && (*/}
          {/*    <TwFilterButton*/}
          {/*      // className='w-full'*/}
          {/*      className='w-full !min-w-max'*/}
          {/*      isActive={bxhData === 'total/realtime'}*/}
          {/*      onClick={() => setBxhData('total/realtime')}*/}
          {/*      disabled={disabled.live}*/}
          {/*    >*/}
          {/*      <LiveIcon className='h-3 w-3 text-red-500' />*/}
          {/*      <TwTitleBtn>{i18n.menu.bxh_realtime}</TwTitleBtn>*/}
          {/*    </TwFilterButton>*/}
          {/*  )}*/}
          {/*  <TwFilterButton*/}
          {/*    className='w-full !min-w-max'*/}
          {/*    isActive={bxhData === 'total'}*/}
          {/*    onClick={() => setBxhData('total')}*/}
          {/*  >*/}
          {/*    <TwTitleBtn>{i18n.filter.all}</TwTitleBtn>*/}
          {/*  </TwFilterButton>*/}
          {/*  <TwFilterButton*/}
          {/*    className='w-full !min-w-max'*/}
          {/*    isActive={bxhData === 'home'}*/}
          {/*    onClick={() => setBxhData('home')}*/}
          {/*    disabled={disabled.home}*/}
          {/*  >*/}
          {/*    <TwTitleBtn>{i18n.filter.home_venue}</TwTitleBtn>*/}
          {/*  </TwFilterButton>*/}
          {/*  <TwFilterButton*/}
          {/*    className='w-full !min-w-max'*/}
          {/*    isActive={bxhData === 'away'}*/}
          {/*    onClick={() => setBxhData('away')}*/}
          {/*    disabled={disabled.away}*/}
          {/*  >*/}
          {/*    <TwTitleBtn>{i18n.filter.away_venue}</TwTitleBtn>*/}
          {/*  </TwFilterButton>*/}
          {/*  <TwFilterButton*/}
          {/*    isActive={bxhData === ''}*/}
          {/*    className='w-full !min-w-max'*/}
          {/*    onClick={() => setBxhData('')}*/}
          {/*    disabled={disabled.topScore}*/}
          {/*  >*/}
          {/*    <TwTitleBtn>{i18n.tab.topScore}123123123</TwTitleBtn>*/}
          {/*  </TwFilterButton>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

const RankNoBadge = ({
  rank,
  promotion = {},
  rankingColors,
}: {
  rank: number;
  total?: number;
  promotion?: any;
  rankingColors?: any;
}) => {
  const { text } = promotion;
  const rankingColor = rankingColors?.get(text);
  const { type = '', color = '' } = rankingColor || {};

  return (
    <div
      className='flex h-4 w-4 items-center justify-center rounded-full'
      css={genBorderColors(type, color)}
    >
      <span className='text-msm font-normal' test-id='rank'>
        {rank}
      </span>
    </div>
  );
};

interface DisabledBtnProps {
  home?: boolean;
  away?: boolean;
  live?: boolean;
  topScore?: boolean;
}

export const HeadSectionStandings = ({
  matchData,
  setDisabledRealtimeBtn,
}: {
  matchData: SportEventDto;
  setDisabledRealtimeBtn: (value: any) => void;
}) => {
  const { tournament, season, stage_id } = matchData;
  // const handleSuccess = () => {
  //   setDisabledRealtimeBtn(); // Enable the realtime button
  // };
  useSeasonStandingsData(
    tournament?.id,
    season?.id,
    stage_id,
    'home',
    false,
    (data) => {
      setDisabledRealtimeBtn((prev: any) => ({
        ...prev,
        home: data,
      }));
    },
    false
  );
  useSeasonStandingsData(
    tournament?.id,
    season?.id,
    stage_id,
    'away',
    false,
    (data) => {
      setDisabledRealtimeBtn((prev: any) => ({
        ...prev,
        away: data,
      }));
    },
    false
  );
  useSeasonStandingsData(
    tournament?.id,
    season?.id,
    stage_id,
    'total/realtime',
    false,
    (data: boolean) => {
      setDisabledRealtimeBtn((prev: any) => ({
        ...prev,
        live: data,
      }));
    },
    false
  );
  return <></>;
};

interface DrawerProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ children, isOpen }) => {
  return (
    <div className={clsx(isOpen ? 'animate-fadeIn' : 'animate-fadeOut')}>
      {children}
    </div>
  );
};

export const TwScrollBtn = tw.div`absolute z-10 top-0 flex items-center rounded-md border dark:border-dark-draw bg-white dark:bg-dark-sub-bg-main  opacity-90 `;
export const TwTitleBtn = tw.span`px-1`;
