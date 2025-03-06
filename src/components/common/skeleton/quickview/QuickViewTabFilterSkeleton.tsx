import Rectangle from '@/components/common/skeleton/Rectangle';

const QuickViewTabFilterSkeleton: React.FC = () => {
  return (
    <div className='bg-primary-gradient my-2 flex justify-between gap-x-8 overflow-hidden rounded-md p-2.5'>
      <Rectangle classes='w-24 h-6' />
      <Rectangle classes='w-24 h-6' />
      <Rectangle classes='w-24 h-6' />
      <Rectangle classes='w-24 h-6' />
    </div>
  );
};
export default QuickViewTabFilterSkeleton;
