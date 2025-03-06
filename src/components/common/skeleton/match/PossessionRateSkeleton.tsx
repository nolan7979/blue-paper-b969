import Rectangle from '@/components/common/skeleton/Rectangle';
import { TwQuickViewTitleV2 } from '@/components/modules/football/tw-components';

const PossessionRateSkeleton: React.FC = () => {
  return (
    <div className='space-y-2.5'>
      <TwQuickViewTitleV2 className='px-2.5 text-center'>
        <Rectangle classes='h-5 w-1/2' fullWidth />
      </TwQuickViewTitleV2>
      <div className='space-y-2.5 p-2.5'>
        <div className=' flex items-center justify-center gap-4 '>
          <Rectangle classes='h-5 w-full' fullWidth />
          <Rectangle classes='h-5 w-full' fullWidth />
        </div>
        <div className='flex items-center justify-center gap-2'>
          <Rectangle classes='h-5 w-24' />
          <Rectangle classes='h-5 w-24' />
          <Rectangle classes='h-5 w-24' />
        </div>
      </div>
    </div>
  );
};
export default PossessionRateSkeleton;
