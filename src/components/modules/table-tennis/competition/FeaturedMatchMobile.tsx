import { IScore, SportEventDtoWithStat } from '@/constant/interface';
import { useEffect, useState } from 'react';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import { FeaturedMatchSkeleton } from '@/components/modules/basketball/skeletons';
import { TwQuickviewTeamName } from '@/components/modules/football/quickviewColumn/QuickViewColumn';
import MatchTimeScore from '@/components/modules/tennis/match/MatchTimeScore';
import MatchTimeScoreMobile from '@/components/modules/tennis/match/MatchTimeScoreMobile';
import useTrans from '@/hooks/useTrans';
import { useHomeStore } from '@/stores';
import { isValEmpty } from '@/utils';

export const FeaturedMatchMobile = ({ match }: { match: SportEventDtoWithStat }) => {
  const i18n = useTrans();
  const { id, homeTeam, awayTeam, slug, tournament } = match || {};
  const { matchLiveInfo, matchesLive, setMatchLiveInfo } = useHomeStore();

  const [homeScore, setHomeScore] = useState<IScore | object>(match?.homeScore);
  const [awayScore, setAwayScore] = useState<IScore | object>(match?.awayScore);
  const [isFeaturedMatch, setIsFearutedMatch] = useState(false);

  const isScoreNotAvailable =
    !homeScore ||
    !awayScore ||
    Object.keys(homeScore)?.length === 0 ||
    Object.keys(awayScore)?.length === 0 ||
    isValEmpty((homeScore as IScore)?.display) ||
    isValEmpty((awayScore as IScore)?.display);

  useEffect(() => {
    setIsFearutedMatch(true);
    const matchedMatch: SportEventDtoWithStat = matchesLive[match?.id];
    if (matchedMatch) {
      setHomeScore(matchedMatch.homeScore);
      setAwayScore(matchedMatch.awayScore);
    } else {
      setHomeScore(match?.homeScore);
      setAwayScore(match?.awayScore);
    }
  }, [matchesLive, match]);

  if (isValEmpty(match)) {
    return <FeaturedMatchSkeleton />;
  }

  return (
    <>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white text-center mb-2.5'>
        {i18n.titles.featured_match}
      </h3>
      <MatchTimeScoreMobile
        isFeaturedMatch={isFeaturedMatch}
        match={match}
        homeScore={homeScore}
        status={match.status}
        awayScore={awayScore}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
      />
      <div className='dark:bg-primary-gradient dark:border-linear-box relative bg-white p-4 lg:rounded-md mb-2.5'>
        <div className='mt-3 hidden items-center gap-x-1.5 lg:flex'>
          <Avatar
            id={tournament?.id}
            type='competition'
            isBackground={false}
            width={24}
            height={24}
            rounded={false} 
            isSmall/>
          <span className='text-msm font-bold uppercase '>
            {tournament?.name}
          </span>
        </div>
        {/* <Divider className='mb-3 mt-2' /> */}
        <div
          className={`pb-2 transition-opacity duration-500 lg:pointer-events-auto lg:relative lg:z-0 lg:opacity-100 ${!matchLiveInfo
              ? 'z-10 opacity-100'
              : 'pointer-events-none absolute inset-0 z-0 opacity-0'}`}
        >
          <div className='flex'>
            <div className='flex flex-1'>
              {/* Team 1 */}
              <div className='flex flex-1  flex-col place-content-center items-center justify-center gap-2'>
                <div className='relative'>
                  <CustomLink
                    href={`/tennis/competitor/${homeTeam?.slug}/${homeTeam?.id}`}
                    target='_parent'
                  >
                    <div className='flex justify-center items-center gap-1.5'>
                      <HandleGroupAvatar team={homeTeam} sport={'tennis'} size={40}></HandleGroupAvatar>
                    </div>
                  </CustomLink>
                </div>
                {/* <CustomLink href='/competitor/man-utd'> */}
                <TwQuickviewTeamName>{homeTeam?.name}</TwQuickviewTeamName>
                {/* </CustomLink> */}
              </div>
            </div>

            {/* Score */}
            <MatchTimeScore
              isFeaturedMatch={isFeaturedMatch}
              match={match}
              status={match.status}
              i18n={i18n} />

            {/* Team 2 */}
            <div className='flex flex-1  flex-col place-content-center items-center gap-2'>
              {/* <BellOff></BellOff> */}
              <div className='relative'>
                <CustomLink
                  href={`/tennis/competitor/${awayTeam?.slug}/${awayTeam?.id}`}
                  target='_parent'
                >
                  <div className='flex justify-center items-center gap-1.5'>
                    <HandleGroupAvatar team={awayTeam} sport={'tennis'} size={40}></HandleGroupAvatar>
                  </div>
                </CustomLink>
              </div>

              <TwQuickviewTeamName>{awayTeam?.name}</TwQuickviewTeamName>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
