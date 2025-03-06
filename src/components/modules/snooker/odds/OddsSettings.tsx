import { MarketsFilters } from '@/components/modules/football';

const OddsSettings = ({ showAll = false }: { showAll: boolean }) => {
  return (
    <>
      <div className='flex items-center justify-end'>
        <div>
          <div className='w-24 '>
            {/* <BookmakerFiltersQV isPassive={true}></BookmakerFiltersQV> */}
          </div>
          {/* asian HDP === handicap  */}
          {showAll && (
            <div className='w-28 '>
              <MarketsFilters></MarketsFilters>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default OddsSettings;
