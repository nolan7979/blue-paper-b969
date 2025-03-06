/* eslint-disable react-hooks/exhaustive-deps */
import useTrans from '@/hooks/useTrans';
import clsx from 'clsx';

import { TwButtonIcon } from '@/components/buttons/IconButton';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import RenderIf from '@/components/common/RenderIf';
import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';

import { useHomeStore, useSitulations } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

import ButtonLiveMatch from '@/components/buttons/ButtonLiveMatch';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';
import { LeagueShortLink } from '@/components/common/LeagueShortLink';
import MatchSimulationIframe from '@/components/modules/football/match/MatchSimulationIframe';
import { SPORT } from '@/constant/common';
import { useWindowSize } from '@/hooks';
import { cn } from '@/utils/tailwindUtils';
import { useEffect } from 'react';
import ZoomOutSVG from '~/svg/zoom-out.svg';

const QuickViewSummaryCommon = ({
  match,
  isDetail = false,
  sport,
  children,
  isSubPage
}: {
  match: SportEventDtoWithStat;
  isDetail?: boolean;
  isFeatureMatch?: boolean;
  sport: SPORT | string;
  children: React.ReactNode;
  isSubPage?: boolean;
}) => {
  const i18n = useTrans();
  const { homeTeam, awayTeam } = match || {};
  const tournament = match?.tournament || match?.uniqueTournament || {};
  const { matchLiveInfo ,setMatchLiveInfo} = useHomeStore();
  const { width } = useWindowSize();
  const { situlations } = useSitulations();
  const isShowSimulation = situlations.length > 0;

  useEffect(() => {
    if (isSubPage) {  
      setMatchLiveInfo(false);
    }
  }, [isSubPage]);

  const isDisplaySimulation =[SPORT.BADMINTON, SPORT.VOLLEYBALL, SPORT.BASKETBALL, SPORT.FOOTBALL, SPORT.TENNIS].includes(sport as SPORT);  

  if (isValEmpty(match)) {
    return <QuickviewSummarySkeleton />;
  }

  return (
    <div className={cn({ 'bg-white  dark:bg-transparent rounded-md': isSubPage })}>
      <div className={cn('dark:border-linear-box relative lg:rounded-md lg:py-3 lg:pb-2 lg:pt-4', {
        'dark:bg-dark-main dark:bg-transparent lg:bg-transparent rounded-lg dark:lg:bg-primary-gradient': isSubPage,
        'dark-away-score  dark:lg:bg-primary-gradient lg:custom-bg-white': !isSubPage,
      })}>
        <RenderIf isTrue={!isDetail}>
          <div className='absolute right-3 top-3 z-10'>
            <CustomLink href={`/${sport}/match/${match?.slug}/${match?.id}`} target='_parent'>
              <TwButtonIcon
                icon={<ZoomOutSVG />}
                className='h-8 w-8 rounded-full  bg-head-tab !pb-0 dark:bg-slate-700'
              />
            </CustomLink>
          </div>
        </RenderIf>

        <RenderIf isTrue={!isDetail}>
          <div className='absolute right-3 top-3 z-10 hidden lg:block'>
            <CustomLink href={`/${sport}/match/${match?.slug}/${match?.id}`} target='_parent'>
              <TwButtonIcon
                icon={<ZoomOutSVG />}
                className='h-8 w-8 rounded-full  bg-head-tab !pb-0 dark:bg-slate-700'
              />
            </CustomLink>
          </div>
        </RenderIf>

        <RenderIf isTrue={isDetail}>
          <div className='mb-6 hidden items-center justify-center gap-x-1.5 lg:flex'>
            <Avatar
              id={tournament.id}
              type='competition'
              isBackground={false}
              width={20}
              height={20}
              rounded={false}
            />
            <span className='text-csm font-bold uppercase dark:text-white'>
              {tournament.name}
            </span>
          </div>
        </RenderIf>

        {isSubPage && (
          <h3 className='font-primary font-bold uppercase text-black dark:text-white px-4 hidden lg:block'>
            {i18n.titles.featured_match}
          </h3>
        )}

        <div
          className={clsx(
            'pb-2 transition-opacity duration-500 lg:pointer-events-auto lg:relative lg:z-0 lg:opacity-100',
            !matchLiveInfo
              ? 'z-10 opacity-100'
              : 'pointer-events-none absolute inset-0 z-0 opacity-0'
          )}
        >
          <div className='flex px-6 py-2 lg:pt-6'>
            <div className='flex flex-1'>
              {/* Team 1 */}
              <div
                className='flex flex-1 flex-col place-content-center items-center justify-center gap-2'
                test-id='home-box'
              >
                <div className='relative'>
                  <AvatarTeamCommon team={homeTeam} sport={sport} size={64} disabled={[SPORT.TENNIS].includes(sport as SPORT)} />
                </div>
                <QuickViewTeamName name={homeTeam?.name || ''} isSubPage={isSubPage} />
              </div>
            </div>

            {/* Score */}
            {children}

            {/* Team 2 */}
            <div className='flex flex-1  flex-col place-content-center items-center gap-2'>
              {/* <BellOff></BellOff> */}
              <div className='relative'>
                {/* <div
                onClick={() =>
                  handleChangeFollow(
                    awayTeam?.id,
                    awayTeam.name,
                    awayTeam.slug,
                    isFollowedAwayTeam
                  )
                }
                className='absolute top-1/2 -translate-y-1/2 md:-right-6 xl:-right-8 '
              >
                {isFollowedAwayTeam ? (
                  <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
                ) : (
                  <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
                )}
              </div> */}
                <AvatarTeamCommon team={awayTeam} sport={sport} size={64} disabled={[SPORT.TENNIS].includes(sport as SPORT)} />
              </div>

              <QuickViewTeamName name={awayTeam?.name || ''} isSubPage={isSubPage} />
            </div>
          </div>
          {!isSubPage && isDisplaySimulation && (
            <div className='mb-6 mt-2 text-center'>
              <div className='mt-4 flex justify-center'>
                <ButtonLiveMatch />
              </div>
            </div>
          )}
        </div>
        <div
          className={clsx(
            'transition-opacity duration-500',
            matchLiveInfo
              ? 'z-10 opacity-100'
              : 'pointer-events-none absolute inset-0 z-0 opacity-0'
          )}
        >
          <div className='lg:px-2'>
            {matchLiveInfo && (
              <MatchSimulationIframe
                id={match.id}
                height={
                  isShowSimulation ? '300px' : width > 1024 ? '320px' : '265px'
                }
                className='bg-dark-main lg:rounded-lg'
                sport={sport}
              />
            )}
          </div>
        </div>
        <LeagueShortLink tournament={tournament} sport={sport} isSubPage={isSubPage} />
      </div>
    </div>
  );
};
export default QuickViewSummaryCommon;


export const QuickViewTeamName = ({name, isSubPage, className}: {name: string, isSubPage?: boolean, className?: string}) => {
  return (
    <div>
      <div className={cn('text-center text-[11px] font-bold dark:text-white lg:text-dark-dark-blue lg:dark:text-white line-clamp-3 overflow-hidden text-ellipsis', className, {
        'text-white': !isSubPage,
        'text-dark-dark-blue': isSubPage,
      })}>{name}</div>
    </div>
  )
}