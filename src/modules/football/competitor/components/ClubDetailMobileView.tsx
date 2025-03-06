/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';

import { TabViewFilterMobile } from '@/modules/football/competitor/components/TabViewFilterMobile';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';
import { DetailClub } from '@/components/modules/football/competitor/Summary';
import { InformationTeam, PlayerSection } from '@/components/modules/football/competitor';
import { TeamMatchesSection, TeamSeasonStandingsSection, TeamSeasonStatsSection } from '@/modules/football/competitor/components';
import dynamic from 'next/dynamic';
const TeamPlayersSection = dynamic(
  () =>
    import('@/modules/football/competitor/components').then(
      (mod) => mod.TeamPlayersSection
    ),
  {
    ssr: false,
  }
);

export const ClubDetailMobileView = ({
  id,
  teamDetails,
  i18n,
  players,
  avgAge,
  uniqueTournaments,
  teamTransfers,
  isDesktop
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
            <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white px-4'>{i18n.titles.general_information}</h3>
            <DetailClub teamDetails={teamDetails} players={players?.players} avgAge={avgAge} i18n={i18n} />
            <InformationTeam
              manager={teamDetails?.manager}
              foundationDate={teamDetails?.foundationDate}
              country={teamDetails?.country}
              venue={teamDetails?.venue}
              uniqueTournaments={uniqueTournaments}
              teamTransfers={teamTransfers}
              isDesktop={isDesktop}
            />
          </>}

          {activeTab === 'standings' && <div className='px-3'>
            <TeamSeasonStandingsSection teamId={id} i18n={i18n} />
          </div>}
          {activeTab === 'matches' && <>
            <TeamMatchesSection teamId={id} i18n={i18n} />
          </>}
          {activeTab === 'player' && <div className='px-3'>
            <TeamPlayersSection
              players={players}
              i18n={i18n}
              isMobile={!isDesktop}
            />
          </div>}
          {activeTab === 'stats' && <div className='px-3'>
            <TeamSeasonStatsSection teamId={id} i18n={i18n} />
          </div>}
          {activeTab === 'top-title' && <div className='px-3'>
            <PlayerSection teamId={id} players={players} isDesktop={isDesktop} />
          </div>}
        </div>
      </div>
    </div>
  );
};
