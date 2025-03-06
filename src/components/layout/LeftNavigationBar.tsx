import tw from 'twin.macro';

import { useConvertPath } from '@/hooks/useConvertPath';

import CustomLink from '@/components/common/CustomizeLink';
import { TwSideTab } from '@/components/modules/football/tw-components';
import { H2HIcon } from '@/components/icons/H2hIcon';
import { LineupsIcon } from '@/components/icons/LineupsIcon';
import { OddsIcon } from '@/components/icons/OddsIcon';
import { StatsIcon } from '@/components/icons/StatsIcon';

import { useMatchSectionStore } from '@/stores';

import { isShowOdds, scrollWithOffset } from '@/utils';

import FootballIcon from '~/svg/football.svg';

const LeftNavigationBar = ({ matchId }: { matchId: string }) => {
  const { selectedSection, setSelectedSection } = useMatchSectionStore();
  const path = useConvertPath();
  return (
    <div className='fixed right-1 top-[50%] z-10 xl:right-8 '>
      <div className='space-y-5'>
        <TwSideTab
          css={[selectedSection === 'timeline' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('timeline');
            scrollWithOffset('timeline', 75);
          }}
        >
          <FootballIcon></FootballIcon>
        </TwSideTab>
        <TwSideTab
          css={[selectedSection === 'lineups' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('lineups');
            scrollWithOffset('lineups', 75);
          }}
        >
          <LineupsIcon></LineupsIcon>
        </TwSideTab>

        <TwSideTab
          css={[selectedSection === 'h2h' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('h2h');
            scrollWithOffset('h2h', 75);
          }}
        >
          <H2HIcon></H2HIcon>
        </TwSideTab>

        <TwSideTab
          css={[selectedSection === 'stats' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('stats');
            scrollWithOffset('stats', 75);
          }}
        >
          <StatsIcon></StatsIcon>
        </TwSideTab>

        <TwSideTab
          css={[selectedSection === 'standings' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('standings');
            scrollWithOffset('standings', 75);
          }}
        >
          <StatsIcon></StatsIcon>
        </TwSideTab>
        {isShowOdds(path) && (
          <TwSideTab
            css={[selectedSection === 'odds' && tw`text-logo-blue`]}
            onClick={() => {
              setSelectedSection('odds');
            }}
          >
            <CustomLink href={`/odds/match/${matchId}`} target='_parent'>
              <OddsIcon></OddsIcon>
            </CustomLink>
          </TwSideTab>
        )}
      </div>
    </div>
  );
};

export default LeftNavigationBar;
