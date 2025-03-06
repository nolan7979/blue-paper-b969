import { SwitchLeftButton, SwitchRightButton } from '@/components/common';
import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  TwFilterButton,
  TwSection,
  TwStatsLi,
  TwStatsUl,
} from '@/components/modules/football/tw-components';
import Image from 'next/image';
import { useState } from 'react';

const PenaltyShotmapSection = () => {
  const [penFilter, setPenFilter] = useState<string>('all');
  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <TwFilterButton
          isActive={penFilter === 'all'}
          onClick={() => setPenFilter('all')}
        >
          Tất cả
        </TwFilterButton>
        <TwFilterButton
          isActive={penFilter === 'scored'}
          onClick={() => setPenFilter('scored')}
        >
          Bàn thắng
        </TwFilterButton>
        <TwFilterButton
          isActive={penFilter === 'missed'}
          onClick={() => setPenFilter('missed')}
        >
          Trượt
        </TwFilterButton>
        <TwFilterButton
          isActive={penFilter === 'saved'}
          onClick={() => setPenFilter('saved')}
        >
          Cản phá
        </TwFilterButton>
      </div>

      <div className='flex'>
        <SwitchLeftButton></SwitchLeftButton>
        <div className='flex flex-1 place-content-center items-center gap-4'>
          <SoccerTeam
            showName={false}
            logoUrl='/images/football/teams/man-city.png'
            name='Man City'
            logoSize={44}
          ></SoccerTeam>
          <span className='text-2xl font-bold not-italic leading-4.5 tracking-widest text-black dark:text-white'>
            2-1
          </span>
          <SoccerTeam
            showName={false}
            logoUrl='/images/football/teams/ars.png'
            name='Man Utd'
            logoSize={44}
          ></SoccerTeam>
        </div>
        <SwitchRightButton></SwitchRightButton>
      </div>

      <div className='flex place-content-center items-center'>
        <Image
          unoptimized={true}
          src='/images/football/graphs/pen-shotmap.png'
          height={56}
          loading='lazy'
          width={600}
          alt='stadium'
          className='rounded-md'
        ></Image>
      </div>

      <TwSection className='p-2'>
        <TwStatsUl>
          <TwStatsLi>
            <span>Penalty goals</span>
            <span>1/1</span>
          </TwStatsLi>
          <TwStatsLi>
            <span>Penalty conversion</span>
            <span>100%</span>
          </TwStatsLi>
        </TwStatsUl>
      </TwSection>
    </div>
  );
};
export default PenaltyShotmapSection;
