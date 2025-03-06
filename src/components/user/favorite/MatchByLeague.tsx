/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import { StarYellow } from '@/components/icons';
import { RowMatchFa } from '@/components/user/favorite/RowMatchFa';
import { getImage, Images } from '@/utils';

function MatchByLeague({ matchList }: { matchList: any }) {
  const [isErr, setIsErr] = useState(false);
  return (
    <>
      {matchList.map((item: any, index: number) => {
        return (
          <div key={index}>
            <div className='px-3 py-4 text-csm'>
              <div className='flex px-1 py-1'>
                <div className=' flex w-12 items-center'>
                  <img
                    alt=''
                    width={36}
                    height={36}
                    src={`${
                      isErr
                        ? '/images/football/teams/unknown-team.png'
                        : `${getImage(
                            Images.competition,
                            item['tournamentId'].split('_')[0]
                          )}`
                    }`} // TODO use slug
                    onError={() => setIsErr(true)}
                  ></img>
                </div>
                <div className='w-56 space-y-1 md:w-full md:flex-1'>
                  <div className='truncate text-csm font-medium leading-5 text-light-black dark:text-dark-default'>
                    {/* Premier League */}
                    <span className='truncate'>
                      {item['matches'][0].tournamentName}
                    </span>
                  </div>
                  <div className='text-csm dark:text-dark-text'>
                    {/* Anh */}
                    {item['matches'][0].categoryName}
                  </div>
                </div>
                <div className=' flex w-8 flex-1 items-center justify-end'>
                  <StarYellow />
                </div>
              </div>
            </div>
            <div className='rounded-lg border-b border-solid  bg-white dark:border-[#222] dark:bg-light-black'>
              <div className='flex flex-col gap-y-2'>
                {item['matches'].reverse().map((item: any, index: number) => {
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

export default MatchByLeague;
