import useTrans from '@/hooks/useTrans';

import { TwButtonIcon } from '@/components/buttons/IconButton';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SPORT } from '@/constant/common';
import ZoomOutSVG from '~/svg/zoom-out.svg';
import { useFetchTeamCommonData } from '@/hooks/useCommon';
import { useMatchStore } from '@/stores/match-store';
import { useEffect } from 'react';
import { getSlug } from '@/utils';

const QuickViewSummaryTeam = () => {
  const i18n = useTrans();
  const { selectedFavorite } = useMatchStore();

  const { data, refetch } = useFetchTeamCommonData(
    selectedFavorite?.id || '', selectedFavorite?.sport || SPORT.FOOTBALL
  );

  const teamDetail = data && data?.team ? data?.team : data;

  useEffect(() => {
    refetch()
  }, [selectedFavorite])

  if(!data) return <></>

  return (
    <div className='dark:border-linear-box relative dark-away-score lg:custom-bg-white dark:lg:bg-primary-gradient rounded-md px-4 py-6'>
      <div className='absolute right-3 top-3 z-10'>
        <CustomLink href={`/${selectedFavorite?.sport}/competitor/${getSlug(teamDetail?.name)}/${selectedFavorite?.id}`} target='_parent'>
          <TwButtonIcon
            icon={<ZoomOutSVG />}
            className='h-8 w-8 rounded-full  dark:bg-slate-700 !pb-0 bg-head-tab'
          />
        </CustomLink>
      </div>
      <div className='flex items-center gap-3'>
        <Avatar id={teamDetail?.id} type='competitor' width={90} height={90} sport={selectedFavorite?.sport} />
        <div>
          <h3 className='mb-2 font-oswald text-2xl font-semibold capitalize text-white lg:text-black lg:dark:text-white'>
            {teamDetail?.name}
          </h3>
        </div>
      </div>
    </div>
  );
};
export default QuickViewSummaryTeam;
