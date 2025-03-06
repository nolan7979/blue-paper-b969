/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import tw from 'twin.macro';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TabViewFilterMobile } from '@/modules/am-football/competition/components/TabViewFilterMobile';
// import QuickViewSummary from '@/components/modules/football/quickviewColumn/QuickViewSummary';
import { TwTitle } from '@/components/modules/football/tw-components';
import {
  FeaturedMatch,
  ProgressBar,
  Matches as MatchesAMF,
  CupTree as CupTreeAMF,
  StandingStable as StandingStableAMF,
} from '@/components/modules/am-football/competition';
import { SportEventDtoWithStat } from '@/constant/interface';
import { EmptyEvent } from '@/components/common/empty';

export const LeagueDetailMobileView = ({
  uniqueTournament,
  i18n,
  selectedSeason,
  featuredMatchData,
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
            <div className='px-4'>
              <ProgressBar
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
              />

              {featuredMatchData &&
                Object.keys(featuredMatchData).length > 0 && (
                  <>
                    <TwTitle className='text-center'>
                      {i18n.qv.featured_match}
                    </TwTitle>
                    <div className='rounded-md bg-white dark:bg-dark-card'>
                      <FeaturedMatch
                        match={
                          featuredMatchData || ({} as SportEventDtoWithStat)
                        }
                        isShowedHeader={false}
                      />
                    </div>
                  </>
                )}
            </div>
          )}

          {activeTab === 'standings' && (
            <StandingStableAMF
              uniqueTournament={uniqueTournament}
              selectedSeason={selectedSeason}
              isShowedHeader={false}
            />
          )}
          {activeTab === 'matches' && (
            <MatchesAMF seasonId={selectedSeason?.id} isShowedHeader={false} />
          )}
          {activeTab === 'cup-tree' && (
            <CupTreeAMF selectedSeason={selectedSeason} />
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
