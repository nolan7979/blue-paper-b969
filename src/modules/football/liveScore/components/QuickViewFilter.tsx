import ChatSVG from 'public/svg/chat.svg';
import CommentarySVG from 'public/svg/commentary.svg';
import DetailSVG from 'public/svg/details.svg';
import FootySVG from 'public/svg/footy.svg';
import H2HSVG from 'public/svg/h2h.svg';
import LineupsSVG from 'public/svg/lineups.svg';
import StandingsSVG from 'public/svg/standings.svg';
import StatsSVG from 'public/svg/stats.svg';

import { TwFilterButtonV2 } from '@/components/buttons';
import QuickViewTabFilterSkeleton from '@/components/common/skeleton/quickview/QuickViewTabFilterSkeleton';

import { IQuickViewFilterProps } from '@/models/page/matchDetails';
import { isMatchHaveStat } from '@/utils';
import { memo, useMemo } from 'react';

export const QuickViewFilter = memo(
  ({
    activeTab,
    setActiveTab,
    status,
    has_standing,
    has_player_stats,
    lineup,
    isHaveData,
    hasHighlight,
    hasCommentary,
    hasAdvancedStats,
    locale,
  }: IQuickViewFilterProps) => {
    const isMatchEmpty = useMemo(() => !isHaveData, [isHaveData]);
    const isDisplayCommentary = useMemo(() => {
      const supportedLocales = ['en', 'en-GB', 'en-PH', 'en-SG', 'en-IN', 'vi'];
      return hasCommentary && locale && supportedLocales.includes(locale);
    }, [hasCommentary, locale]);
    if (isMatchEmpty) return <QuickViewTabFilterSkeleton />;
    return (
      <div
        className='flex w-full gap-x-2.5 overflow-scroll bg-white dark:bg-dark-main  lg:bg-light-main lg:no-scrollbar'
        test-id='tabs'
      >
        <TwFilterButtonV2
          testId='btnDetails'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          icon={<DetailSVG className='h-6 w-6' />}
        />

        {lineup === 1 && (
          <TwFilterButtonV2
            testId='btnSquad'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'squad'}
            onClick={() => setActiveTab('squad')}
            icon={<LineupsSVG className='h-6 w-6' />}
          />
        )}
        <TwFilterButtonV2
          testId='btnMatches'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'matches'}
          onClick={() => setActiveTab('matches')}
          icon={<H2HSVG className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          testId='btnChat'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
          icon={<ChatSVG className='h-6 w-6' />}
        />
        {hasAdvancedStats && (
          <>
            <TwFilterButtonV2
              testId='btnFooty'
              className='w-full whitespace-nowrap'
              isActive={activeTab === 'footy'}
              onClick={() => setActiveTab('footy')}
              icon={<FootySVG className='h-5 w-5' />}
            />
            {/* <TwFilterButtonV2
                testId='btnFooty'
                className='w-full whitespace-nowrap'
                isActive={activeTab === 'footy1'}
                onClick={() => setActiveTab('footy1')}
                icon={<FootySVG className='h-5 w-5' />}
              /> */}
          </>
        )}
        {/* {!!hasHighlight && (
          <TwFilterButtonV2
            testId='btnMatches'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'matches'}
            onClick={() => setActiveTab('matches')}
            icon={<H2HSVG className='h-6 w-6' />}
          />
        )} */}
        {isDisplayCommentary && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'commentary'}
            onClick={() => setActiveTab('commentary')}
            icon={<CommentarySVG className='h-6 w-6' />}
          />
        )}
        {isMatchHaveStat(status?.code) && (
          <TwFilterButtonV2
            testId='btnStats'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<StatsSVG className='h-6 w-6' />}
          />
        )}

        {(has_standing || has_player_stats) && (
          <TwFilterButtonV2
            testId='btnStandings'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'standings'}
            icon={<StandingsSVG className='h-6 w-6' />}
            onClick={() => setActiveTab('standings')}
          />
        )}
        {/* {round! > 0 && (
        <TwFilterButton
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'top-score'}
          onClick={() => setActiveTab('top-score')}
        >
          {i18n.tab.topScore}
        </TwFilterButton>
      )} */}

        {/* <TwFilterButton
        className='w-full'
        isActive={activeTab === 'odds'}
        onClick={() => setActiveTab('odds')}
      >
        {i18n.menu.odds}
      </TwFilterButton> */}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.activeTab === nextProps.activeTab &&
      prevProps.status === nextProps.status &&
      prevProps.has_standing === nextProps.has_standing &&
      prevProps.has_player_stats === nextProps.has_player_stats &&
      prevProps.lineup === nextProps.lineup &&
      prevProps.isHaveData === nextProps.isHaveData &&
      prevProps.hasCommentary === nextProps.hasCommentary &&
      prevProps.locale === nextProps.locale
    );
  }
);
