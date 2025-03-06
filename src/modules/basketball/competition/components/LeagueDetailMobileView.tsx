/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useState } from 'react';
import tw from 'twin.macro';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TabViewFilterMobile } from '@/modules/basketball/competition/components/TabViewFilterMobile';
import { TwTitle } from '@/components/modules/football/tw-components';
import { EmptyEvent } from '@/components/common/empty';
import { SportEventDtoWithStat } from '@/constant/interface';
import {
  Matches as MatchesBkb,
  TopPlayer as TopPlayerBkb,
  TopTeam as TopTeamBkb,
  CupTree as CupTreeBkb,
  FeaturedMatch,
} from '@/components/modules/basketball/competition';

const StandingStableBkb = dynamic(
  () =>
    import('@/components/modules/basketball/competition').then(
      (mod) => mod.StandingStable
    ),
  { ssr: false }
);

export const LeagueDetailMobileView = ({
  uniqueTournament,
  i18n,
  selectedSeason,
  featuredMatchData,
  teams,
  showFeaturedMatch,
}: any) => {
  const [activeTab, setActiveTab] = useState<string>('details');

  return (
    <div className='sticky top-0 z-[5] w-full'>
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        <div className='space-y-4 '>
          <div className='sticky top-[3.313rem] z-10 lg:relative lg:top-0'>
            {/* Filter */}
            <TabViewFilterMobile
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <Divider className='!mt-0'></Divider>

          {activeTab === 'details' && (
            <div className='px-3'>
              <TwTitle className='text-center'>
                {i18n.qv.featured_match}
              </TwTitle>
              <div className='rounded-md bg-white dark:bg-dark-card'>
                {showFeaturedMatch ? (
                  <FeaturedMatch
                    match={featuredMatchData || ({} as SportEventDtoWithStat)}
                    isShowedHeader={false}
                  />
                ) : (
                  <div className='rounded-md bg-white p-4 dark:bg-dark-card'>
                    <EmptyEvent title={i18n.common.nodata} content={''} />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'standings' && (
            <StandingStableBkb
              uniqueTournament={uniqueTournament}
              selectedSeason={selectedSeason}
            />
          )}
          {activeTab === 'matches' && (
            <MatchesBkb
              teams={teams}
              selectedSeason={selectedSeason}
              isShowedHeader={false}
            />
          )}
          {activeTab === 'cup-tree' && (
            <CupTreeBkb selectedSeason={selectedSeason} />
          )}
          {activeTab === 'top-player' && (
            <div className='px-3'>
              <TopPlayerBkb
                selectedSeason={selectedSeason}
                isShowedHeader={false}
              />
            </div>
          )}
          {activeTab === 'top-team' && (
            <div className='px-3'>
              <TopTeamBkb
                selectedSeason={selectedSeason}
                isShowedHeader={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
