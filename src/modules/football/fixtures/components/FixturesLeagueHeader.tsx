import { useState } from 'react';

import { extractCompetitionId, getImage, Images } from '@/utils';

/* eslint-disable @next/next/no-img-element */
export const FixturesLeagueHeader = ({
  uniqueTournament,
}: {
  uniqueTournament: any;
}) => {
  const [err, setErr] = useState(false);

  if (!uniqueTournament) return <></>; // TODO: skeletons

  const { name, category = {} } = uniqueTournament || {};

  return (
    <div className='flex flex-col gap-4 py-3 md:flex-row'>
      <div className='flex flex-1 items-center gap-2 pl-2 lg:gap-4 lg:pl-4'>
        <div className=''>
          <img
            src={`${err
                ? '/images/football/teams/unknown-team.png'
                : `${getImage(
                  Images.competition,
                  extractCompetitionId(uniqueTournament?.id)
                )}`
              }`}
            alt=''
            width={56}
            height={56}
            onError={() => setErr(true)}
          />
        </div>
        <div className=' flex flex-col place-content-center gap-1'>
          <h1 className='text-xl font-bold not-italic lg:text-xl lg:font-black'>
            {name}
          </h1>
          <div className=' flex items-center gap-4'>
            <div className='lg:text-md overflow-hidden text-xs uppercase '>
              {category.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
