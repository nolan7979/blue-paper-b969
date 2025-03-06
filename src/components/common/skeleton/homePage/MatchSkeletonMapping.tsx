import { memo } from 'react';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';

const MatchSkeletonMapping = memo(function MatchSkeletonMapping() {
  const ArrayFromOneToNine = Array.from({ length: 9 }, (_, index) => index + 1);
  return (
    <div>
      {ArrayFromOneToNine.map((number) => (
        <MatchSkeleton key={number} />
      ))}
    </div>
  );
});

export default MatchSkeletonMapping;
