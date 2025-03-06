/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';

import { Divider } from '@/components/modules/football/tw-components/TwPlayer';
import PlayerMoreDetail from '@/components/modules/football/players/PlayerMoreDetail';
import PlayerSummary, { PlayerClubInfo, PlayerSummaryDetail } from '@/components/modules/football/players/PlayerSummary';
import PlayerTransfer from '@/components/modules/football/players/PlayerTransfer';
import { TabFilterCommon } from '@/modules/football/player/components/TabFilterCommon';
import { PlayerMatchesSection, PlayerStatsSection } from '@/pages/football/player/[...playerParams]';

export const PlayerMobileView = ({
  playerId,
  teamId,
  i18n,
  player,
  transfers,
  isDesktop,
}: any) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  
  return (
    <div className='w-full static lg:sticky top-0 z-[5]'>
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        <PlayerSummary playerDetail={player} isDesktop={isDesktop} />
        <div className='space-y-4 '>
          <div className='sticky top-[3.313rem] z-[11] lg:relative lg:top-0'>
            {/* Filter */}
            <TabFilterCommon
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              details
              stats
              matches
            />
          </div>
          <Divider className='!mt-0'></Divider>

          {activeTab === 'details' && <>
            <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white px-4'>{i18n.titles.general_information}</h3>
            {
              player?.team && (
                <PlayerClubInfo playerDetail={player} />
              )
            }
            <PlayerSummaryDetail playerDetail={player} i18n={i18n} />
            <PlayerMoreDetail playerDetail={player} />
            <PlayerTransfer playerDetail={player} transfers={transfers} />
          </>}
          {activeTab === 'matches' && <>
            <PlayerMatchesSection
              playerId={playerId}
              teamId={teamId}
              i18n={i18n}
            ></PlayerMatchesSection>
          </>}
          {activeTab === 'stats' && <div className='px-3'>
            <PlayerStatsSection player={player}></PlayerStatsSection>
          </div>}
        </div>
      </div>
    </div>
  );
};
