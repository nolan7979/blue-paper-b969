import { RatingBadge } from '@/components/modules/football/RatingBadge';
import {
  TwCard,
  TwPlayerDetailTitle,
  TwSection,
  TwStatsLi,
  TwStatsUl,
} from '@/components/modules/football/tw-components';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';
import { StatsCollapse } from '@/pages/football/player/[...playerParams]';
import HeatMapSeasonSVG from '/public/svg/heatmap-season.svg';
import PenaltyShotmapSection from '@/modules/football/manager/components/PenaltyShotmapSection';

const PlayerStatsSection = () => {
  return (
    <TwCard className='space-y-2.5 p-2.5'>
      {/* <TwQuickViewSection className=''>
        adbv
      </TwQuickViewSection> */}
      <div className='flex gap-2.5 '>
        <TwSection className='h-10 w-1/2'></TwSection>
        <TwSection className='h-10 w-1/2'></TwSection>
      </div>
      <Divider></Divider>
      <div className='flex items-center justify-between'>
        <TwPlayerDetailTitle>Xếp hạng</TwPlayerDetailTitle>
        <RatingBadge point={6.55} isSmall={false}></RatingBadge>
        {/* TODO new rating badge */}
      </div>
      <div className=''>
        <TwCard className='h-36'></TwCard>
      </div>
      {/* <div>
        <TwPlayerDetailTitle>Bản đồ nhiệt theo mùa</TwPlayerDetailTitle>
        <HeatMapSeasonSVG className='h-64 w-full'></HeatMapSeasonSVG>
      </div> */}
      <div>
        <Divider />
        <StatsCollapse title='Bản đồ nhiệt theo mùa'>
          <HeatMapSeasonSVG className='h-64 w-full'></HeatMapSeasonSVG>
        </StatsCollapse>
        <Divider />
        <StatsCollapse title='Trận đấu'>
          <TwStatsUl className='pb-2.5'>
            <TwStatsLi>
              <span>Tổng số trận đã chơi</span>
              <span>12</span>
            </TwStatsLi>
            <TwStatsLi>
              <span>Tổng số phút đã chơi</span>
              <span>322</span>
            </TwStatsLi>
            <TwStatsLi>
              <span>Tổng số phút đã chơi</span>
              <span>74</span>
            </TwStatsLi>
            <TwStatsLi>
              <span>Cầu thủ của tuần</span>
              <span>12</span>
            </TwStatsLi>
          </TwStatsUl>
        </StatsCollapse>
        <Divider />
        <StatsCollapse title='Tấn công'></StatsCollapse>
        <Divider />
        <StatsCollapse title='Chuyền'></StatsCollapse>
        <Divider />
        <StatsCollapse title='Phòng thủ'></StatsCollapse>
        <Divider />
        <StatsCollapse title='Khác'></StatsCollapse>
        <Divider />
        <StatsCollapse title='Thẻ'></StatsCollapse>
        <Divider />
        <StatsCollapse title='Vị trí sút phạt Penalty'>
          <PenaltyShotmapSection></PenaltyShotmapSection>
        </StatsCollapse>
      </div>
    </TwCard>
  );
};

export default PlayerStatsSection;
