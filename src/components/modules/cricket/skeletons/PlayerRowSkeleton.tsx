import Circle from '@/components/common/skeleton/Circle';
import Rectangle from '@/components/common/skeleton/Rectangle';

export const PlayerRowSkeleton = () => {
  const arrayWithTenItems = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <>
      {arrayWithTenItems.map((number) => (
        <div key={number} className='flex items-center justify-start gap-4'>
          <div>
            <Rectangle classes='!h-5 w-5' fullWidth />
          </div>
          <Circle classes='!w-9 !h-9' />
          <div>
            <Rectangle classes='!h-3 w-28' fullWidth />
          </div>
        </div>
      ))}
    </>
  );
};
