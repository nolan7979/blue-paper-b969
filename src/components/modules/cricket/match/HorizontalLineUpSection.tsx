import { HorizontalHomeTeamLineUp } from '@/components/modules/cricket/match/HorizontalHomeTeamLineUp';
import { TwQuickViewSection } from '@/components/modules/cricket/tw-components';

import LogoSVG from '/public/svg/logo-transparent.svg';
import TeamAwayLineUpHorizontal from '@/components/modules/cricket/teams/TeamAwayLineUpHorizontal';

export const HorizontalLineUpSection = ({
  lineupsData,
  // matchId,
  mapPlayerEvents,
  matchData,
}: {
  lineupsData: any;
  mapPlayerEvents?: any;
  matchData?: any;
}) => {
  const { home = {}, away = {} } = lineupsData;

  return (
    <TwQuickViewSection
      className='relative box-content flex overflow-hidden !bg-dark-stadium'
      style={{
        backgroundImage: "url('/svg/stadium_horizontal.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width: '100%',
      }}
    >
      <div className='inline-block flex-1'>
        <HorizontalHomeTeamLineUp
          lineups={home}
          mapPlayerEvents={mapPlayerEvents}
          matchData={matchData}
        />
      </div>
      <div className=' inline-block flex-1'>
        <TeamAwayLineUpHorizontal
          lineups={away}
          mapPlayerEvents={mapPlayerEvents}
          matchData={matchData}
        />
      </div>
      <div className='pointer-events-none absolute bottom-3 right-2 flex justify-end'>
        <LogoSVG className='h-8 w-28 xl:h-10 xl:w-32' />
      </div>
    </TwQuickViewSection>
  );
};
