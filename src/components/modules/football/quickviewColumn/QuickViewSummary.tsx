/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import ButtonLiveMatch from '@/components/buttons/ButtonLiveMatch';
import { TwButtonIcon } from '@/components/buttons/IconButton';
import CustomLink from '@/components/common/CustomizeLink';
import RenderIf from '@/components/common/RenderIf';
import MatchSimulationIframe from '@/components/modules/football/match/MatchSimulationIframe';
import MatchTimeScore from '@/components/modules/football/match/MatchTimeScore';

import { useHomeStore, useSitulations } from '@/stores';

import { IScore, SportEventDtoWithStat } from '@/constant/interface';
import { isMatchNotStarted } from '@/utils';

import { LeagueShortLink } from '@/components/common/LeagueShortLink';
import { TeamInfo } from '@/components/modules/common/team/TeamInfo';
import { SPORT } from '@/constant/common';
import ZoomOutSVG from '~/svg/zoom-out.svg';

const QuickViewSummary = ({
  match,
  isSelectMatch,
  isDetail = false,
  isFeatureMatch,
  isMobile,
  showNavigation = true, 
  isSubPage,
}: {
  match: SportEventDtoWithStat;
  isSelectMatch?: boolean;
  isDetail?: boolean;
  isFeatureMatch?: boolean;
  isMobile?: boolean;
  showNavigation?: boolean;
  isSubPage?: boolean;
}) => {
  const i18n = useTrans();
  const { situlations } = useSitulations();

  const { id, homeTeam, awayTeam, slug, tournament } = match || {};
  const { matchLiveInfo, setMatchLiveInfo } = useHomeStore();
  const isShowSimulation = situlations.length > 0;

  const [homeScore, setHomeScore] = useState<IScore | object>(match?.homeScore);
  const [awayScore, setAwayScore] = useState<IScore | object>(match?.awayScore);

  useEffect(() => {
    setHomeScore(match?.homeScore);
    setAwayScore(match?.awayScore);
  }, [match]);

  useEffect(() => {
    if (!isDetail || (isMobile && !!matchLiveInfo) ) {
      setMatchLiveInfo(false);
    }
    if (!isMobile && isDetail) {
      setMatchLiveInfo(true);
    }
  }, [isDetail, isMobile]);

  return (
    <div
      className={clsx(' relative lg:rounded-md lg:py-3 lg:pb-2 lg:pt-6', {
        'dark:border-linear-box lg:bg-white lg:dark:bg-primary-gradient':
          !isDetail,
        'dark-away-score lg:dark:bg-mb-detail lg:bg-white': isDetail,
      })}
    >
      <RenderIf isTrue={!isDetail && showNavigation}>
        <div className='absolute right-3 top-3 z-10'>
          {slug && id && <CustomLink href={`/football/match/${slug}/${id}`} target='_parent'>
            <TwButtonIcon
              testId='btnDetailMatch'
              icon={<ZoomOutSVG />}
              className='h-8 w-8 rounded-full  bg-head-tab !pb-0 dark:bg-slate-700'
            />
          </CustomLink>
          }
        </div>
      </RenderIf>

      {isFeatureMatch && (
        <h3 className='font-primary font-bold uppercase text-black dark:text-white px-4 hidden lg:block'>
          {i18n.titles.featured_match}
        </h3>
      )}

      <div
        test-id='match-info'
        className={clsx(
          'pb-1 transition-opacity duration-500',
          'lg:pointer-events-auto lg:relative lg:z-0 lg:opacity-100',
          matchLiveInfo
            ? 'pointer-events-none absolute inset-0 z-0 opacity-0'
            : 'z-10 opacity-100'
        )}
      >
        <div
          className={clsx('flex gap-x-3.5 px-2.5 lg:pt-6 ', {
            'pt-3': isMatchNotStarted(match?.status?.code),
            'pt-2': !isMatchNotStarted(match?.status?.code),
          })}
        >
          <div className='mt-1.5 flex flex-1' test-id='team-1'>
            <TeamInfo team={homeTeam} isMobile={isMobile} type='home' isSubPage={isSubPage} />
          </div>

          {/* Score */}
          <MatchTimeScore
            match={match}
            homeScore={homeScore}
            status={match?.status}
            awayScore={awayScore}
            currentPeriodStartTimestamp={
              match?.time?.currentPeriodStartTimestamp
            }
            i18n={i18n}
            isSubPage={isSubPage}
          />

          {/* Team 2 */}
          <div
            className='mt-1.5 flex flex-1 place-content-center items-center justify-start gap-x-3 lg:flex-col lg:justify-center lg:gap-2'
            test-id='team-2'
          >
            <TeamInfo team={awayTeam} isMobile={isMobile} type='away' isSubPage={isSubPage} />
          </div>
        </div>

        <div className='mb-4 mt-2 text-center'>
          {!isFeatureMatch && (
            <div className='mt-4 flex justify-center'>
              <ButtonLiveMatch />
            </div>
          )}
        </div>
      </div>
      {!isFeatureMatch && (
        <div
          className={clsx(
            'transition-opacity duration-500',
            matchLiveInfo
              ? 'z-10 opacity-100'
              : 'pointer-events-none absolute inset-0 z-0 opacity-0'
          )}
        >
          {/* <div className='absolute left-2 top-2 z-10'>
            {isDetail && (
              <div
                className='z-10 rounded-full bg-dark-text-full p-1 opacity-80'
                onClick={() => setMatchLiveInfo(!matchLiveInfo)}
              >
                <ArrowLeftSVG className='h-6 w-6 fill-white' />
              </div>
            )}
          </div> */}

          <div className='lg:px-2'>
            {matchLiveInfo && (
              <MatchSimulationIframe
                id={match.id}
                height={
                  isShowSimulation ? '300px' : isMobile ? '320px' : '265px'
                }
                className='bg-dark-main lg:rounded-lg'
              />
            )}
          </div>
        </div>
      )}
      <LeagueShortLink
        tournament={tournament}
        sport={SPORT.FOOTBALL}
        roundInfo={match?.roundInfo}
        isSubPage={isSubPage}
      />
    </div>
  );
};
export default memo(QuickViewSummary, (prev, next) => {
  return (
    prev.match?.id === next.match?.id &&
    prev.isSelectMatch === next.isSelectMatch &&
    prev.match?.status?.code === next.match?.status?.code &&
    prev.match?.homeScore === next.match?.homeScore &&
    prev.match?.awayScore === next.match?.awayScore &&
    prev.match?.time === next.match?.time &&
    prev.isSubPage === next.isSubPage &&
    prev.isMobile === next.isMobile
  );
});
