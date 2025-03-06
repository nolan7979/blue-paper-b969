import tw from 'twin.macro';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import {
  TwPenDotContainer,
  TwPenDotEmpty,
  TwPenDotMiss,
  TwPenDotScore,
  TwPenDotUl,
  TwPenScore,
  TwPenTakerContainer,
  TwPenTakerMiss,
  TwPenTakerScore,
  TwPenTeamContainer,
} from '@/components/modules/football/tw-components';

export const TeamPenShootout = ({
  homeTeam,
  penEvents,
  isHome,
  winnerCode,
}: any) => {
  const teamPenEvents = penEvents
    .filter((event: any) => event.isHome === isHome)
    .reverse();
  const teamScore =
    teamPenEvents.filter((event: any) => event.incidentClass === 'scored')
      .length || 0;
  return (
    <div className='space-y-2'>
      <TwPenTeamContainer>
        <div className='flex items-center'>
          <CustomLink
            href={`/football/competitor/${homeTeam.name}/${homeTeam?.id}`}
            target='_parent'
          >
            <Avatar
              id={homeTeam?.id}
              type='team'
              width={24}
              height={24}
              isBackground={false}
              rounded={false}
            />
          </CustomLink>
          <TwPenDotContainer>
            <TwPenDotUl>
              {teamPenEvents.map((event: any, idx: number) => {
                if (event.incidentClass === 'scored') {
                  return (
                    <div key={idx} className='flex items-center'>
                      <TwPenDotScore key={idx}></TwPenDotScore>
                      {/* {(idx + 1) % 5 === 0 && <TwPenDotEmpty></TwPenDotEmpty>} */}
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className='flex items-center'>
                      <TwPenDotMiss key={idx}></TwPenDotMiss>
                      {/* {(idx + 1) % 5 === 0 && <TwPenDotEmpty></TwPenDotEmpty>} */}
                    </div>
                  );
                }
              })}
            </TwPenDotUl>
          </TwPenDotContainer>
        </div>
        <TwPenScore
          css={[
            ((winnerCode === 1 && !isHome) || (winnerCode === 2 && isHome)) &&
              tw`text-gray-500`,
          ]}
        >
          {teamScore}
        </TwPenScore>
      </TwPenTeamContainer>
      <TwPenTakerContainer className='flex-wrap'>
        {teamPenEvents.map((event: any, idx: number) => {
          if (event.incidentClass === 'scored') {
            return (
              <TwPenTakerScore key={idx}>
                {event.player?.shortName || event.player?.name}
              </TwPenTakerScore>
            );
          } else {
            return (
              <TwPenTakerMiss key={idx}>
                {event.player?.shortName || event.player?.name}
              </TwPenTakerMiss>
            );
          }
        })}
      </TwPenTakerContainer>
    </div>
  );
};
