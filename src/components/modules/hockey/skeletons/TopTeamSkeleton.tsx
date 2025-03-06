import Rectangle from '@/components/common/skeleton/Rectangle';
import { RankingHeaderRow } from '@/components/modules/basketball/competition';
import { SkeletonLeftSide } from '@/components/modules/basketball/skeletons/SkeletonLeftSide';
import useTrans from '@/hooks/useTrans';

export const TopTeamSkeleton = () => {
  const i18n = useTrans();
  return (
    <div className='flex gap-[0.375rem] px-4'>
      <div className='flex-1'>
        <Rectangle classes='h-7 w-full' fullWidth />
      </div>
      <div className='flex-1'>
        <Rectangle classes='h-7 w-full' fullWidth />
      </div>
    </div>
  );
};
