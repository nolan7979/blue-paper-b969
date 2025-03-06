import { useEffect } from 'react';

import {
  usefetchFullStatPlayerSelectedMatch,
  useManagerData,
  useSelectedMatchLineupsData,
  useTimelineData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import { HorizontalLineUpSection } from '@/components/modules/cricket/match/HorizontalLineUpSection';
import {
  SquadSummarySection,
  TeamPlayerList,
  TeamSuspensionList,
} from '@/components/modules/cricket/quickviewColumn/QuickViewSquadTab';
import TableMatch from '@/components/modules/cricket/stat-table-match/TableMatch/TableMatch';
import {
  TwCard,
  TwQuickViewTitleV2,
} from '@/components/modules/cricket/tw-components';

import { useFilterStore } from '@/stores';

import { FilterPlayer } from '@/components/modules/cricket/match/FilterPlayer';
import { StatusDto } from '@/constant/interface';
import { ILineupsInfo } from '@/models';
import {
  calAverageAge,
  calTeamRating,
  getImage,
  Images,
  isMatchLive,
  isValEmpty,
} from '@/utils';
import { genPlayerData } from '@/utils/genPlayerData';

export const PlayerLineUpSection = ({
  matchData = {},
}: {
  matchData?: any;
}) => {
  const i18n = useTrans();
  const { playerFilter } = useFilterStore();
  const status: StatusDto = matchData?.status;
  const shouldRefetch = isMatchLive(status?.code) && matchData?.lineup;

  const {
    data: lineupsData,
    isLoading: isLoadingLineups,
    refetch,
  } = useSelectedMatchLineupsData(matchData?.id || '');

  const { data: statistic } = usefetchFullStatPlayerSelectedMatch(
    matchData?.id || ''
  );

  useEffect(() => {
    if (shouldRefetch) {
      const timer = setInterval(() => {
        refetch();
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [refetch, shouldRefetch]);

  const { data: managerData, isLoading: isLoadingManager } = useManagerData(
    matchData?.id || ''
  );

  const { data: timelineData = [], isLoading: isLoadingTimeline } =
    useTimelineData(matchData?.id || '', matchData.status.code);
  if (isLoadingLineups || isLoadingManager || isLoadingTimeline) {
    return <></>;
  }

  if (isValEmpty(matchData) || isValEmpty(lineupsData)) {
    return <></>;
  }

  const { homeTeam = {}, awayTeam = {} } = matchData;

  const { home, away, confirmed } = lineupsData as ILineupsInfo;
  const { homeManager, awayManager } = managerData;
  const mapPlayerEvents = genPlayerData(timelineData);

  if (!matchData) return <></>;

  const homeRating = calTeamRating(home.players || []);
  const awayRating = calTeamRating(away.players || []);

  return (
    <TwCard className='space-y-4 p-2.5 py-3' id='lineups'>
      <div className='hidden lg:block'>
        <div id='lineups'></div>
        <div className='space-y-3'>
          {/* <TwTitle className=''>{i18n.titles.lineups}</TwTitle> */}

          {/* TODO move stats to somewhre */}
          <FilterPlayer></FilterPlayer>

          {playerFilter === 'player-lineup' && (
            <>
              {/* <TwQuickViewSection className='p-4'>
            <AvgPosition i18n={i18n}></AvgPosition>
          </TwQuickViewSection> */}
              {confirmed && (
                <>
                  <div className='flex gap-2 xl:gap-4'>
                    <div className='flex-1'>
                      <SquadSummarySection
                        teamName={homeTeam.name}
                        teamId={homeTeam?.id}
                        avgAge={calAverageAge(home.players || [])}
                        formation={home.formation || ''}
                        isHome={true}
                        logoUrl={`${getImage(Images.team, homeTeam?.id)}`}
                        teamRating={homeRating}
                      ></SquadSummarySection>
                    </div>
                    <div className='flex-1'>
                      <SquadSummarySection
                        teamName={awayTeam.name}
                        teamId={awayTeam?.id}
                        avgAge={calAverageAge(away.players || [])}
                        formation={away.formation || ''}
                        isHome={false}
                        logoUrl={`${getImage(Images.team, awayTeam?.id)}`}
                        teamRating={awayRating}
                      ></SquadSummarySection>
                    </div>
                  </div>

                  <HorizontalLineUpSection
                    lineupsData={lineupsData}
                    mapPlayerEvents={mapPlayerEvents}
                    matchData={matchData}
                  />
                </>
              )}
              <TwQuickViewTitleV2 className=''>
                {confirmed ? i18n.titles.entering_the_field : i18n.qv.team}
              </TwQuickViewTitleV2>
              <div className='grid grid-cols-2 gap-4'>
                {/* <TeamPlayerList
                  team={homeTeam}
                  teamLineups={home}
                  confirmed={confirmed}
                  manager={homeManager}
                  mapPlayerEvents={mapPlayerEvents}
                  isHome={true}
                  matchData={matchData}
                />
                <TeamPlayerList
                  team={awayTeam}
                  teamLineups={away}
                  manager={awayManager}
                  confirmed={confirmed}
                  mapPlayerEvents={mapPlayerEvents}
                  isHome={false}
                  matchData={matchData}
                ></TeamPlayerList> */}
              </div>
              {confirmed && (
                <>
                  <TwQuickViewTitleV2 className=''>
                    {i18n.titles.injuries} & {i18n.titles.suspensions}
                  </TwQuickViewTitleV2>
                  <div className='grid grid-cols-2 gap-4'>
                    <TeamSuspensionList
                      team={homeTeam}
                      missingPlayers={home.missingPlayers}
                    ></TeamSuspensionList>
                    <TeamSuspensionList
                      team={awayTeam}
                      missingPlayers={away.missingPlayers}
                    ></TeamSuspensionList>
                  </div>
                </>
              )}
            </>
          )}

          {playerFilter === 'player-stats' && (
            <>
              <TableMatch
                statistic={statistic && statistic.data}
                team={matchData && matchData}
              />
            </>
          )}
        </div>
      </div>
    </TwCard>
  );
};
