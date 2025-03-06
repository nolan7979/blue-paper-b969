import Avatar from '@/components/common/Avatar'
import React from 'react'

import { TwQuickViewTitleV2 } from '@/components/modules/basketball/tw-components';
import useTrans from '@/hooks/useTrans';
import { CompetitorDto } from '@/constant/interface';

const H2HBasketball = ({
  head2head = {},
  homeTeam,
  awayTeam,
}: {
  head2head: any;
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
}) => {
  const i18n = useTrans();
  const { teamDuel } = head2head
  return (
    <div className='rounded-md dark:border-linear-box bg-white dark:bg-primary-gradient px-4 py-2 pt-0 mb-4'>
      <TwQuickViewTitleV2 className='pl-2 uppercase lg:pl-0 mb-2'>
        {i18n.titles.h2h}
      </TwQuickViewTitleV2>
      <div className='flex justify-between gap-4'>
        <div className='flex gap-2'>
          <div className='w-[40px]'>
            <Avatar 
              id={homeTeam.id} 
              type='team' 
              width={40} 
              height={40} 
              isBackground={false}
              rounded={false} />
          </div>
          <div>
            <b className='text-dark-green'>{teamDuel.homeWins}</b>
            <h3 className='text-sm'>{homeTeam.name}</h3>
          </div>
        </div>
        <div className='flex flex-row-reverse gap-2'>
          <div className='w-[40px]'>
            <Avatar 
              id={awayTeam.id} 
              type='team' 
              width={40} 
              height={40}
              isBackground={false}
              rounded={false} />
          </div>
          <div className='text-right'>
            <b className='text-logo-blue'>{teamDuel.awayWins}</b>
            <h3 className='text-sm'>{awayTeam.name}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default H2HBasketball