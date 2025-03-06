import useTrans from '@/hooks/useTrans';

import { H2HIcon } from '@/components/icons/H2hIcon';
import { LineupsIcon } from '@/components/icons/LineupsIcon';
import { StatsIcon } from '@/components/icons/StatsIcon';
import {
  TwCard,
  TwMatchTab,
} from '@/components/modules/football/tw-components';

import { useMatchSectionStore } from '@/stores';

import { isMatchHaveStat, scrollWithOffset } from '@/utils';

import FootballIcon from '~/svg/football.svg';

export const MatchDetailTabSection = ({
  lineup,
  statusCode = 0,
  round,
}: {
  matchId: string;
  round: number;
  lineup: number;
  statusCode: number;
}) => {
  const { selectedSection, setSelectedSection } = useMatchSectionStore();
  const i18n = useTrans();
  return (
    <TwCard className='layout mb-4 px-4 lg:-mt-5 '>
      <div className='divide-menu-x flex h-10 justify-center'>
        <TwMatchTab
          className={`${
            selectedSection === 'timeline' ? 'item-hover-active' : 'item-hover'
          }`}
          onClick={() => {
            setSelectedSection('timeline');
            scrollWithOffset('timeline', 75);
          }}
        >
          <FootballIcon></FootballIcon>
          <span className='capitalize'>{i18n.tab.timeline}</span>
        </TwMatchTab>

        {lineup === 1 && (
          <TwMatchTab
            className={`${
              selectedSection === 'lineups' ? 'item-hover-active' : 'item-hover'
            }`}
            onClick={() => {
              setSelectedSection('lineups');
              scrollWithOffset('lineups', 75);
            }}
          >
            <LineupsIcon></LineupsIcon>
            <span>{i18n.tab.squad}</span>
          </TwMatchTab>
        )}

        <TwMatchTab
          className={`${
            selectedSection === 'h2h' ? 'item-hover-active' : 'item-hover'
          }`}
          onClick={() => {
            setSelectedSection('h2h');
            scrollWithOffset('h2h', 75);
          }}
        >
          <H2HIcon></H2HIcon>
          <span>{i18n.tab.matches}</span>
        </TwMatchTab>
        {isMatchHaveStat(statusCode) && (
          <TwMatchTab
            className={`${
              selectedSection === 'stats' ? 'item-hover-active' : 'item-hover'
            }`}
            onClick={() => {
              setSelectedSection('stats');
              scrollWithOffset('stats', 75);
            }}
          >
            <span>{i18n.tab.statistics}</span>
          </TwMatchTab>
        )}

        {round > 0 && (
          <TwMatchTab
            className={`${
              selectedSection === 'standings'
                ? 'item-hover-active'
                : 'item-hover'
            }`}
            onClick={() => {
              setSelectedSection('standings');
              scrollWithOffset('standings', 75);
            }}
          >
            <StatsIcon></StatsIcon>
            <span>{i18n.tab.standings}</span>
          </TwMatchTab>
        )}

        {/* <CustomLink href={`/odds/match/${matchId}`} target='_blank'>
          <TwMatchTab
            className={`${
              selectedSection === 'odds' ? 'item-hover-active' : 'item-hover'
            }`}
            onClick={() => {
              setSelectedSection('odds');
            }}
          >
            <OddsIcon></OddsIcon>
            <span>{i18n.tab.droppingOdds}</span>
            <HiArrowTopRightOnSquare></HiArrowTopRightOnSquare>
          </TwMatchTab>
        </CustomLink> */}
      </div>
    </TwCard>
  );
};
