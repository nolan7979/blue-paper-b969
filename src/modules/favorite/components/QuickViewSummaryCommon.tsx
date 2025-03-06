/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import useTrans from '@/hooks/useTrans';

import { TwButtonIcon } from '@/components/buttons/IconButton';
import CustomLink from '@/components/common/CustomizeLink';
import QuickviewSummarySkeleton from '@/components/common/skeleton/match/QuickviewSummarySkeleton';
import { TwQuickviewTeamName } from '@/components/modules/football/quickviewColumn/QuickViewColumn';

import { useMatchStore } from '@/stores';

import { getSlug } from '@/utils';

import { LeagueShortLink } from '@/components/common/LeagueShortLink';
import { SPORT } from '@/constant/common';
import ZoomOutSVG from '~/svg/zoom-out.svg';
import { useSelectedMatchData } from '@/hooks/useCommon';
import { EmptyEvent } from '@/components/common/empty';
import MatchTimeScoreCommon from '@/modules/favorite/components/MatchTimeScoreCommon';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

const QuickViewSummaryCommon = () => {
  const i18n = useTrans();
  const { selectedFavorite, setSelectedFavorite, } = useMatchStore();

  const { data, isLoading, refetch } = useSelectedMatchData(
    selectedFavorite?.id || '', selectedFavorite?.sport || SPORT.FOOTBALL
  );

  const homeTeam = data && data?.homeTeam ? data?.homeTeam : {id: '', name: ''}
  const awayTeam = data && data?.awayTeam ? data?.awayTeam : {id: '', name: ''}
  const uniqueTournament = data && data?.uniqueTournament ? data?.uniqueTournament : (data?.tournament || {})

  useEffect(() => {
    if(selectedFavorite?.id != '') {
      refetch()
    }
  }, [selectedFavorite])

  if(!data || selectedFavorite?.id == '') return <>{isLoading ? <QuickviewSummarySkeleton /> : <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>}</>

  return (
    <div className='dark:border-linear-box relative dark-away-score lg:custom-bg-white dark:lg:bg-primary-gradient lg:rounded-md lg:py-3 lg:pb-2 lg:pt-6'>
      <div className='absolute right-3 top-3 z-10'>
        <CustomLink href={`/${selectedFavorite?.sport}/match/${getSlug(homeTeam?.name)}-${getSlug(awayTeam?.name)}/${selectedFavorite?.id}`} target='_parent'>
          <TwButtonIcon
            icon={<ZoomOutSVG />}
            className='h-8 w-8 rounded-full  dark:bg-slate-700 !pb-0 bg-head-tab'
          />
        </CustomLink>
      </div>

      <div
        className={`pb-2 transition-opacity duration-500 lg:pointer-events-auto lg:relative lg:z-0 lg:opacity-100 z-10 opacity-100`}
      >
        <div className='flex px-6 pt-6 pb-2.5'>
          <div className='flex flex-1'>
            {/* Team 1 */}
            <div className='flex flex-1  flex-col place-content-center items-center justify-center gap-2'>
              <div className='relative'>
                <AvatarTeamCommon team={homeTeam} sport={selectedFavorite?.sport} size={64} />
              </div>
              <TwQuickviewTeamName>{homeTeam?.name}</TwQuickviewTeamName>
            </div>
          </div>
          <MatchTimeScoreCommon match={data} sport={selectedFavorite?.sport} />

          {/* Team 2 */}
          <div className='flex flex-1  flex-col place-content-center items-center gap-2'>
            <div className='relative'>
              <AvatarTeamCommon team={awayTeam} sport={selectedFavorite?.sport} size={64} />
            </div>

            <TwQuickviewTeamName>{awayTeam?.name}</TwQuickviewTeamName>
          </div>
        </div>
      </div>
      <LeagueShortLink
        tournament={uniqueTournament}
        sport={selectedFavorite?.sport || ''}
      />
    </div>
  );
};
export default QuickViewSummaryCommon;
