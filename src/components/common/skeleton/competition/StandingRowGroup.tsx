import StandingRow from '@/components/common/skeleton/competition/StandingRow';
import Rectangle from '@/components/common/skeleton/Rectangle';

function StandingRowGroup({ check }: { check?: boolean, locale?: string }) {
  const numbersArray = Array.from(
    { length: check ? 6 : 10 },
    (_, index) => index + 1
  );
  return (
    <div className={`space-y-4 ${check ? 'pb-6' : ''}`}>
      <div className='flex gap-3'>
        <Rectangle classes='h-9 w-16 !rounded-lg' />
        <Rectangle classes='h-9 w-16 !rounded-lg' />
        <Rectangle classes='h-9 w-16 !rounded-lg' />
      </div>
      {numbersArray.map((number) => (
        <StandingRow key={number} />
      ))}
    </div>
  );
}

export default StandingRowGroup;
