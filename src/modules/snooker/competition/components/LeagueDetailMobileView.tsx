/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TabViewFilterMobile } from '@/modules/snooker/competition/components/TabViewFilterMobile';

import QuickViewSummary from '@/components/modules/snooker/quickviewColumn/QuickViewSummary';
import { TwTitle } from '@/components/modules/football/tw-components';
import Matches from '@/modules/snooker/competition/components/Matches';
import { SportEventDtoWithStat } from '@/constant/interface';
import { EmptyEvent } from '@/components/common/empty/EmptyEvent';

export const LeagueDetailMobileView = ({
  uniqueTournament,
  i18n,
  selectedSeason,
  featuredMatchData,
}: any) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  
  return (
    <div className='w-full sticky top-0 z-[5]'>
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

          {activeTab === 'details' && <>
            <div className='p-3'>
              <TwTitle className='text-center'>{i18n.qv.featured_match}</TwTitle>
              <div className='bg-white dark:bg-dark-card rounded-md'>
                {featuredMatchData && Object.keys(featuredMatchData).length > 0 ? <QuickViewSummary match={featuredMatchData || ({} as SportEventDtoWithStat)} /> : <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>}
              </div>
            </div>
          </>}

          {activeTab === 'matches' && <Matches seasonId={selectedSeason?.id} />}
        </div>
      </div>
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
