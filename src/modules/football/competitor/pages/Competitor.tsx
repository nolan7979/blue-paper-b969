import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import CustomLink from '@/components/common/CustomizeLink';
import {
  InformationTeam,
  PlayerSection,
  Summary,
} from '@/components/modules/football/competitor';
import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import useTrans from '@/hooks/useTrans';
import { HiOutlineChevronRight } from 'react-icons/hi';

import {
  ShowTeamSeasonTopPlayers,
  TeamDetailSummarySection,
  TeamInfoSection,
  TeamMatchesSection,
  TeamPlayersSection,
  TeamSeasonStandingsSection,
  TeamSeasonStatsSection,
  TeamSeasonTopPlayersFilter,
} from '@/modules/football/competitor/components';
import Avatar from '@/components/common/Avatar';
import { Player, TeamDetails, TeamTransfers } from '@/models/interface';
import { Tournament } from '@/stores';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import { ClubDetailMobileView } from '@/modules/football/competitor/components/ClubDetailMobileView';
import { calTeamAvgAge } from '@/utils';

type CompetitorProps = {
  id: string;
  teamDetails: Partial<TeamDetails>;
  players: {
    players: Player[];
    foreignPlayers: number;
    nationalPlayers: number;
  };
  teamUniqueTournaments: { uniqueTournaments: Tournament[] };
  teamTransfers: TeamTransfers;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
};

const Competitor: React.FC<CompetitorProps> = ({
  id,
  teamDetails,
  players,
  teamUniqueTournaments,
  teamTransfers,
}) => {
  const i18n = useTrans();
  const {
    name,
    slug,
    sport = {},
    category = {},
    tournament = {},
    country = {},
    manager = {},
    venue = {},
    foundationDate,
  } = teamDetails || {};
  const { uniqueTournaments = [] } = teamUniqueTournaments || {};

  const { isDesktop } = useDetectDeviceClient();

  const { players: playersClub } = players || {};
  const avgAge = calTeamAvgAge(playersClub);

  return (
    <>
      <div className=' hidden py-3 lg:block'>
        <BreadCrumb className='layout'>
          <div className=' flex items-center gap-2 truncate text-xs font-extralight'>
            <BreadCumbLink href='/football' name={sport?.name} />
            {category.name && (
              <>
                <BreadCrumbSep />
                <BreadCumbLink
                  href={`/football/country/${category.name}/${category?.id}`}
                  name={category.name}
                />
              </>
            )}
            <BreadCrumbSep />
            <BreadCumbLink
              href={`/football/competition/${tournament.slug}/${
                tournament?.id || tournament?.id
              }`}
              name={`${tournament.name || ''}`}
            />
            <BreadCrumbSep />
            <BreadCumbLink
              href={`/football/competition/${slug}/${
                teamDetails?.id || ''
              }`}
              name={`${name || ''}`}
              disabled
            />
          </div>
        </BreadCrumb>
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 no-scrollbar sticky top-20 w-full max-w-[209px] lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          {/* <AllTeamBkb isLoading={isTeamLoading} teams={teamsData} /> */}
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full'>
              <div className='flex w-full flex-col lg:gap-6'>
                <Summary
                  id={id}
                  teamDetails={teamDetails}
                  teamPlayers={players}
                  isDesktop={isDesktop}
                />
                {!isDesktop ? (
                  <ClubDetailMobileView 
                    id={id}
                    teamDetails={teamDetails}
                    players={players}
                    avgAge={avgAge} 
                    i18n={i18n}
                    uniqueTournaments={uniqueTournaments}
                    teamTransfers={teamTransfers}
                    isDesktop={isDesktop}
                  />
                ) : (
                  <>
                    <InformationTeam
                      manager={manager}
                      foundationDate={foundationDate}
                      country={country}
                      venue={venue}
                      uniqueTournaments={uniqueTournaments}
                      teamTransfers={teamTransfers}
                      isDesktop={isDesktop}
                    />

                    <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container p-4'>
                      <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white'>
                        {i18n.titles.matches}
                      </h3>
                      <TeamMatchesSection teamId={id} i18n={i18n} />
                    </div>

                    <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container p-4'>
                      <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white'>
                        {i18n.menu.standings || 'Season Standings'}
                      </h3>
                      <TeamSeasonStandingsSection teamId={id} i18n={i18n} />
                    </div>
                    <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container p-4'>
                      <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white'>
                        {i18n.titles.players || 'players'}
                      </h3>
                      <PlayerSection teamId={id} players={players} isDesktop={isDesktop} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container px-[0.625rem] py-4'>
              <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white'>
                {i18n.titles.season_stats}
              </h3>
              <TeamSeasonStatsSection teamId={id} i18n={i18n} />
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default Competitor;

//  Todo: remove when done
//  <TeamDetailSummarySection
//         teamDetails={teamDetails}
//         homeId={id}
//         i18n={i18n}
//       />
//       <TwDesktopView>
//         <TwMatchDetailDataSection className='layout mt-4 flex flex-col gap-4 md:flex-row'>
//           {/* Main column */}
//           <TwMainColDetailPage className=' space-y-4'>
//             <TwCard className='space-y-4 p-2.5'>
//               <TwTitle className='pl-2'>
//                 {i18n.competitor.informationTem}
//               </TwTitle>
//               <TeamInfoSection
//                 teamDetails={teamDetails}
//                 players={players}
//                 teamTransfers={teamTransfers}
//                 teamUniqueTournaments={teamUniqueTournaments}
//                 i18n={i18n}
//               />
//             </TwCard>
//             <TwCard className='space-y-4 py-2.5 md:p-2.5'>
//               <TwTitle className='px-2.5 md:px-0'>
//                 {i18n.titles.matches}
//               </TwTitle>
//               <TeamMatchesSection teamId={id} i18n={i18n} />
//             </TwCard>

//             <TwCard className='space-y-2.5 pt-2.5'>
//               <TwTitle className='px-2.5'>
//                 {i18n.menu.standings || 'Season Standings'}
//               </TwTitle>
//               <TeamSeasonStandingsSection teamId={id} i18n={i18n} />
//             </TwCard>

//             <TwCard className='space-y-4 p-2.5'>
//               <TwTitle className=''>{i18n.titles.players || 'players'}</TwTitle>
//               <TeamPlayersSection teamId={id} players={players} i18n={i18n} />
//             </TwCard>
//           </TwMainColDetailPage>
//           {/* Small column  */}
//           <TwDetailPageSmallCol className=' space-y-4'>
//             {/* <TwCard className='space-y-4 p-2.5'>
//               <TwTitle className=''>{i18n.titles.last_matches}</TwTitle>
//               <TeamRecentFormSection
//                 teamId={id}
//                 i18n={i18n}
//               ></TeamRecentFormSection>
//             </TwCard> */}
//             <TwCard className='space-y-2.5 py-2.5'>
//               <TwTitle className='px-2.5'>{i18n.titles.top_players}</TwTitle>
//               <TeamSeasonTopPlayersFilter teamId={id} />
//               <ShowTeamSeasonTopPlayers teamId={id} />
//             </TwCard>
//             <TwCard className='space-y-2.5 py-2.5'>
//               <TwTitle className='px-2.5'>{i18n.titles.season_stats}</TwTitle>
//               <TeamSeasonStatsSection
//                 teamId={id}
//                 i18n={i18n}
//               ></TeamSeasonStatsSection>
//             </TwCard>
//           </TwDetailPageSmallCol>
//         </TwMatchDetailDataSection>
//       </TwDesktopView>
