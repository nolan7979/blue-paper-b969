/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import React from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import EmptySection from '@/components/common/empty';
import Standing from '@/components/common/skeleton/competition/StandingRow';
import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { TwSkeletonRectangle } from '@/components/modules/football/tw-components';

import {
  IQuickViewStandingsTab,
  IStandingRowProps,
} from '@/models/page/matchDetails';
import { extractCompetitionId, getImage, getSlug, Images } from '@/utils';

import { usePathname } from 'next/navigation';
import { useSeasonStandingsData } from '@/hooks/useCricket';

const QuickViewStandingsTab = ({
  matchData,
  seasonId = '',
}: IQuickViewStandingsTab) => {
  const i18n = useTrans();
  const path = usePathname();

  const {
    uniqueTournament,
    homeTeam,
    awayTeam,
    stage_id,
    seasonId: seasonIdDefault,
  } = matchData;

  const { data: standingsData, isLoading } = useSeasonStandingsData(
    seasonId || seasonIdDefault
  );

  if (isLoading || !standingsData.standings) {
    return <></>;
  }

  return (
    <div className='space-y-4'>
      <StandingTypeFilter
        competitionName={uniqueTournament?.name}
        imgId={uniqueTournament?.id}
      />
      {isLoading && (
        <TwSkeletonRectangle className='!h-fit dark:bg-primary-gradient'>
          {[0, 1, 2, 3, 4, 5].map((number) => (
            <Standing key={number} />
          ))}
        </TwSkeletonRectangle>
      )}

      {!isLoading && !standingsData.standings?.length && (
        <EmptySection content={i18n.common.nodata} />
      )}
      <ul className='w-full space-y-1 text-xs overflow-auto'>
        {!isLoading &&
          !!standingsData.standings?.length &&
          standingsData.standings?.map((groupData: any, index: number) => {
            return (
              <div key={`group-${index}`} className='overflow-x-auto scrollbar'>
                <p className='mb-2 font-medium text-base text-black dark:text-white'>{groupData?.name}</p>
                <StandingHeaderRow showForm={false} />
                {groupData?.rows?.map((row: any, idx: number) => {
                  return (
                    <StandingRow
                      key={`standing-row-${idx}`}
                      uniqueKey={index}
                      no={idx + 1}
                      team={row?.team}
                      logoUrl={`${getImage(Images.team, row?.team?.id)}`}
                      noWin={row?.wins || 0}
                      noDraw={row?.draws || 0}
                      noLoss={row?.losses || 0}
                      points={row?.points || 0}
                      homeTeam={homeTeam}
                      awayTeam={awayTeam}
                      live={false}
                    />
                  );
                })}
              </div>
            );
          })}
      </ul>
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
  noWin = 0,
  noDraw = 0,
  noLoss = 0,
  points = 0,
  homeTeam = {},
  awayTeam = {},
  wide = false,
  match,
  classNameStickyColumn = 'bg-white dark:bg-dark-main',
}: IStandingRowProps) => {
  return (
    <li
      test-id='standing-row'
      className='!mt-0 border-b py-0.5 last:border-none dark:border-head-tab dark:bg-dark-card'
      key={uniqueKey}
    >
      <CustomLink
        href={`/cricket/competitor/${getSlug(team?.slug || team?.name || 'slug')}/${team?.id}`}
        target='_parent'
        className={clsx('flex w-full items-center', {
          'bg-logo-blue/20': team?.id === homeTeam?.id,
          'bg-logo-yellow/20': team?.id === awayTeam?.id,
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
            className={clsx('flex h-full items-center pl-1.5', {
              '!bg-logo-blue/20': team?.id === homeTeam?.id,
              '!bg-logo-yellow/20': team?.id === awayTeam?.id,
            })}
          >
            {/* Rank */}
            <div className='flex w-4 justify-center'>
              {/* TODO use outcome */}
              <RankNoBadge rank={no} />
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

        <div className='min-w-36 truncate whitespace-nowrap'>
          <SoccerTeam
            team={team}
            showIcon={false}
            teamPlaying={false}
            showLiveScore={false}
            match={match}
          />
        </div>
        <div className='w-full' />

        {/* Win */}
        <StandingCell
          val={noWin}
          wide={wide}
          isWin={true}
          className='min-w-12 max-w-12'
          idCol='id-win'
        />
        <StandingCell
          val={noDraw}
          wide={wide}
          isDraw={true}
          className='min-w-12 max-w-12'
          idCol='id-draw'
        />
        <StandingCell
          val={noLoss}
          wide={wide}
          isLoss={true}
          className='min-w-12 max-w-12'
          idCol='id-loss'
        />
        <StandingCell
          val={points}
          wide={wide}
          isBold={false}
          isMain={true}
          className='min-w-12 max-w-12'
          idCol='id-points'
        />
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
}: {
  showForm: boolean;
  showLong?: boolean;
  wide?: boolean;
}) => {
  const i18n = useTrans();

  return (
    <li className='flex h-[2.375rem] w-full items-center bg-head-tab dark:bg-[#171B2E] py-2.5 font-primary text-xss font-normal'>
      <div className='sticky left-0 z-[2] flex bg-head-tab dark:bg-[#171B2E]  pl-1.5'>
        {/* Rank */}
        <div className='flex w-4 place-content-center text-center'>#</div>

        {/* Team name */}
        <div className='w-16 text-center'>{i18n.menu.team}</div>
      </div>

      <div className='w-full min-w-36' />

      <div
        className='min-w-12 max-w-12 text-center uppercase'
        test-id='goals-diff'
      >
        p
      </div>

      <div
        className='min-w-12 max-w-12 text-center uppercase'
        test-id='goals-diff'
      >
        w
      </div>
      <div
        className='min-w-12 max-w-12 text-center uppercase'
        test-id='goals-diff'
      >
        d
      </div>
      <div
        className='min-w-12 max-w-12 text-center uppercase'
        test-id='goals-diff'
      >
        l
      </div>
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
  competitionName,
  imgId = '',
}: {
  imgId?: string;
  competitionName?: string;
}) => {
  return (
    <TwMbQuickViewWrapper className='py-1'>
      <div className='flex w-full items-center justify-between gap-x-3 px-2 transition-all lg:px-0'>
        <div className='w-full space-y-5 whitespace-nowrap'>
          {imgId && (
            <div className='flex items-center gap-2 text-left text-xss font-medium normal-case dark:text-white p-2'>
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
        </div>
      </div>
    </TwMbQuickViewWrapper>
  );
};

const RankNoBadge = ({ rank }: { rank: number }) => {
  return (
    <div
      className='flex h-4 w-4 items-center justify-center rounded-full'
      css={tw`border-[#48FF5A] border text-[#48FF5A]`}
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
