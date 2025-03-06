import { BookmakerFiltersFB } from '@/components/modules/football';

const OddsSettingsMainCol = ({ showAll = false }: { showAll: boolean }) => {
  return (
    <>
      <div className='flex items-center justify-end'>
        <div className='w-24 '>
          <BookmakerFiltersFB isPassive={false}></BookmakerFiltersFB>
        </div>
        {/* {showAll && (
          <div className='w-28 '>
            <MarketsFilters></MarketsFilters>
          </div>
        )} */}
      </div>
    </>
  );
};
export default OddsSettingsMainCol;
