import { RowMatchFa } from '@/components/user/favorite/RowMatchFa';

function MatchByDate({ matchList }: { matchList: any }) {
  return (
    <>
      {matchList.map((item: any, index: number) => {
        return (
          <div key={index}>
            <div className='px-3 py-4 text-csm'>
              <p>Ngày {item['day']}</p>
            </div>
            <div className='rounded-lg border-b border-solid  bg-white dark:border-[#222] dark:bg-light-black'>
              <div className='flex flex-col gap-y-2'>
                {item['matches'].map((item: any, index: number) => {
                  return <RowMatchFa key={index} matchId={item.matchId} />;
                })}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default MatchByDate;
