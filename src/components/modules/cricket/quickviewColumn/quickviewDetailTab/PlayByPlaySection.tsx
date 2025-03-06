import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Tippy from '@tippyjs/react';
import { BsInfoCircleFill } from 'react-icons/bs';

import Avatar from '@/components/common/Avatar';
import {
  TwBorderLinearBox,
  TwQuickViewTitleV2,
  TwTabHead,
} from '@/components/modules/common';
import PlayByPlayHeader from '@/components/modules/cricket/quickviewColumn/quickviewDetailTab/PlayByPlayHeader';
import { TwQWRoundOfMatchContainer } from '@/components/modules/cricket/quickviewColumn/quickviewDetailTab/RoundOfMatchSection';
import { Inning, Over, SportEventDto } from '@/constant/interface';
import { useIncidentsMatchData } from '@/hooks/useCricket';
import useTrans from '@/hooks/useTrans';
import { checkInProgessMatch, getOrdinalSuffix } from '@/utils/cricketUtils';
import { produce } from 'immer';
import clsx from 'clsx';
import { SPORT } from '@/constant/common';

const backgroundColor: { [key: string]: string } = {
  W: 'bg-dark-loss',
  '6': 'bg-dark-win',
  '4': 'bg-light-default',
  default: 'bg-inning-score dark:bg-[#46484E]',
};

const PlayByPlaySection: React.FC<{ matchData: SportEventDto }> = ({
  matchData,
}) => {
  const i18n = useTrans();
  const [activeTab, setActiveTab] = useState<string>('home');
  const { homeTeam, awayTeam } = matchData || {};
  const {
    data = [],
    isLoading,
    refetch,
  } = useIncidentsMatchData(matchData?.id);
  const [homeInnings, setHomeInnings] = useState<Inning[]>([]);
  const [awayInnings, setAwayInnings] = useState<Inning[]>([]);

  const shouldRefetching = useMemo(() => {
    return checkInProgessMatch(matchData?.status?.code);
  }, [matchData?.status?.code]);

  useEffect(() => {
    if (shouldRefetching) {
      const intervalIdEvents = setInterval(() => {
        refetch();
      }, 5000);

      return () => {
        clearInterval(intervalIdEvents);
      };
    }
  }, [refetch, shouldRefetching]);

  const filterAndSortInnings = useCallback(
    (teamId: string) => {
      if (!data || !teamId) {
        return [];
      }

      return data
        .filter((item) => item.team?.id === teamId)
        .sort((a, b) => b?.inning - a?.inning)
        .map((inning) => ({
          ...inning,
          overs: inning?.overs?.sort((a, b) => b?.over_number - a?.over_number),
        }));
    },
    [data]
  );

  useEffect(() => {
    if (data && !isLoading) {
      setHomeInnings(filterAndSortInnings(homeTeam?.id));
      setAwayInnings(filterAndSortInnings(awayTeam?.id));
    }
  }, [data, isLoading, homeTeam?.id, awayTeam?.id]);

  const onClickShowOptions = (value: string) => {
    if (value !== activeTab) {
      setActiveTab(value);
    }
  };

  const showedInnings = useMemo(
    () => (activeTab === 'home' ? homeInnings : awayInnings),
    [activeTab, homeInnings, awayInnings]
  );

  if (!data || data?.length == 0) {
    return <></>;
  }

  return (
    <div>
      <TwQuickViewTitleV2 className='flex items-center justify-center gap-2'>
        {i18n.play_by_play.play_by_play}
        <TooltipPlayByPlay />
      </TwQuickViewTitleV2>
      <TwTabHead className='mb-3.5 mt-4 bg-white'>
        {['home', 'away'].map((item: string) => {
          return (
            <TwBorderLinearBox
              key={item}
              className={` h-full w-1/2 !rounded-full ${
                activeTab === item
                  ? 'dark:border-linear-form bg-active-squad'
                  : ''
              }`}
            >
              <button
                test-id={`btn-type-${item}`}
                // isActive={statsPeriod === period.period}
                onClick={() => onClickShowOptions(item)}
                className={`flex h-full w-full items-center justify-center gap-x-1 rounded-full transition-colors  duration-300 ${
                  activeTab === item ? 'dark:bg-button-gradient' : ''
                }`}
              >
                {item === 'home' && (
                  <Avatar
                    id={homeTeam?.id}
                    type='team'
                    width={24}
                    height={24}
                    className='shrink-0 grow-0 basis-6'
                    isBackground={false}
                    isSmall
                    rounded={false}
                    sport={SPORT.CRICKET}
                  />
                )}
                {item === 'away' && (
                  <Avatar
                    id={awayTeam?.id}
                    type='team'
                    width={24}
                    height={24}
                    className='shrink-0 grow-0 basis-6'
                    isBackground={false}
                    isSmall
                    rounded={false}
                    sport={SPORT.CRICKET}
                  />
                )}
              </button>
            </TwBorderLinearBox>
          );
        })}
      </TwTabHead>
      {showedInnings?.length > 0 &&
        showedInnings.map((item: Inning, index: number) => {
          return (
            <Fragment key={index}>
              <PlayByPlayHeader
                className='mb-4'
                team={item?.team}
                subTitle={i18n.play_by_play.inning.replace(
                  'XXX',
                  ['en', 'en-GB', 'en-IN', 'en-SG', 'en-PH'].includes(
                    i18n.language
                  )
                    ? getOrdinalSuffix(item?.inning)
                    : item?.inning?.toString() || ''
                )}
              />
              {item?.overs?.map((itemOver, index: number) => {
                return <OverRow key={index} over={itemOver} />;
              })}
            </Fragment>
          );
        })}
    </div>
  );
};

const Ball = ({
  content,
  className,
}: {
  content: string;
  className: string;
}) => {
  return (
    <div
      className={clsx(
        'size-6 rounded-full text-center font-oswald text-mxs font-semibold leading-6 text-white',
        className
      )}
    >
      {content || ''}
    </div>
  );
};

const OverRow = ({ over }: { over: Over }) => {
  const i18n = useTrans();
  const formatDisplayName = useMemo(() => {
    if (!over?.bowler?.name && !over?.batter?.name) {
      return '';
    }

    if (!over?.batter2?.name) {
      return `${over?.bowler?.name || ''} to ${over?.batter?.name || ''}`;
    }

    return `${over?.bowler?.name || ''} to ${over?.batter?.name || ''}${
      ' & ' + over?.batter2?.name
    }`;
  }, [over]);
  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <div className='flex flex-col gap-2 border-b border-line-default dark:border-light-darkGray py-4'>
        <div className='flex justify-between'>
          <div className='text-ccsm font-bold dark:text-white'>
            {i18n.play_by_play.over.replace(
              'XXX',
              over?.over_number?.toString() || ''
            )}
          </div>
          <div className='text-msm dark:text-dark-text'>
            {`${over?.runs ?? 0} ${i18n.play_by_play.runs}`}
          </div>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div className='text-center text-msm dark:text-white'>
            {formatDisplayName}
          </div>
          <div className='flex gap-[6px]'>
            {over?.balls?.map((itemBall, indexBall: number) => {
              return (
                <Ball
                  key={indexBall}
                  content={itemBall?.display || ''}
                  className={
                    backgroundColor[itemBall?.display?.toUpperCase()] ||
                    backgroundColor.default
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </TwQWRoundOfMatchContainer>
  );
};

const TooltipPlayByPlay = memo(() => {
  const i18n = useTrans();

  const tooltipContent = useMemo(() => {
    const items = [
      { label: i18n.play_by_play.runs, symbol: 'O' },
      { label: i18n.play_by_play.bowled, symbol: 'B' },
      { label: i18n.play_by_play.no_ball, symbol: 'NB' },
      { label: i18n.play_by_play.left_bye, symbol: 'LB' },
      {
        label: i18n.play_by_play['4s'],
        symbol: '4',
        bgColor: 'bg-light-default',
      },
      { label: i18n.play_by_play['6s'], symbol: '6', bgColor: 'bg-dark-win' },
      {
        label: i18n.play_by_play.fall_of_wickets,
        symbol: 'W',
        bgColor: 'bg-dark-loss',
      },
    ];

    return items.map(({ label, symbol, bgColor = 'bg-[#46484E]' }) => (
      <div key={symbol} className='flex items-center gap-1'>
        <div
          className={`size-5 rounded-full ${bgColor} text-center font-oswald text-mxs font-semibold leading-5 dark:text-white`}
        >
          {symbol}
        </div>
        {label}
      </div>
    ));
  }, [i18n]);

  return (
    <Tippy
      content={<div className='flex flex-col gap-2'>{tooltipContent}</div>}
    >
      <span>
        <BsInfoCircleFill />
      </span>
    </Tippy>
  );
});

export default PlayByPlaySection;
