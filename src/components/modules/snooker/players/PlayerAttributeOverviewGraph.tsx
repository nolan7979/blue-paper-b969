/* eslint-disable @next/next/no-img-element */
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import tw from 'twin.macro';

import {
  usePlayerAttributeOverviewData,
  useSearchPlayerData,
} from '@/hooks/useFootball';

import { QvPlayer } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { AttributeBadge } from '@/components/modules/football/RatingBadge';

import { usePlayerStore } from '@/stores/player-store';

import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
import React from 'react';
import { vi } from 'date-fns/locale';
import useDebounce from '@/hooks/useDebounce';

export default function PlayerAttributeOverviewGraph({
  player,
}: {
  player: any;
}) {
  const i18n = useTrans();
  const [yearShift, setYearShift] = useState<number>(0);
  const { selectedPlayer, setSelectedPlayer } = usePlayerStore();

  const {
    data: playerData,
    isLoading,
    isFetching,
  } = usePlayerAttributeOverviewData(player?.id);

  const {
    data: otherPlayerData = {},
    isLoading: isLoadingOther,
    isFetching: isFetchingOther,
  } = usePlayerAttributeOverviewData(selectedPlayer?.id);

  useEffect(() => {
    setYearShift(0);
  }, [player, playerData, otherPlayerData]);

  if (isLoading || isFetching) return <div className='h-full w-full'></div>; // TODO skeletons
  if (isLoadingOther || isFetchingOther)
    return <div className='h-full w-full'></div>;

  const { averageAttributeOverviews = [], playerAttributeOverviews = [] } =
    playerData || {};

  const { playerAttributeOverviews: otherPlayerAttributeOverviews } =
    otherPlayerData || {};

  const maxYearShift = playerAttributeOverviews.length - 1; // TODO

  let avgRatings: any = {};
  if (averageAttributeOverviews.length > 0) {
    avgRatings = averageAttributeOverviews[0];
  }

  const currentView: any = playerAttributeOverviews[yearShift];
  let otherCurrentView: any = {};
  if (otherPlayerAttributeOverviews) {
    otherCurrentView = otherPlayerAttributeOverviews[yearShift];
  }
  const latestView: any = playerAttributeOverviews[0];

  const isComparing = !isValEmpty(otherCurrentView);

  const data: any[] = [];
  for (const key in currentView) {
    if (['id', 'position', 'yearShift'].includes(key)) {
      continue;
    }

    let refValue = 0;
    if (isComparing) {
      refValue = otherCurrentView[key] || 0;
    } else {
      if (yearShift === 0) {
        refValue = avgRatings[key] || 0;
      } else {
        refValue = currentView[key] || 0;
      }
    }

    const attributeValue = latestView[key] || 0;

    data.push({
      attribute: key.substring(0, 3).toUpperCase(),
      refValue: refValue,
      attributeValue: attributeValue,
      fullMark: 100,
    });
  }

  const sortedData = data.sort((a, b) => {
    return a.attributeValue < b.attributeValue ? 1 : -1;
  });

  let refName = '';
  let viewName = '';
  if (isComparing) {
    viewName = player?.name;
    refName = selectedPlayer?.name;
  } else {
    if (yearShift === 0) {
      viewName = player?.name;
      refName = 'Average';
    } else {
      refName = calShiftYear(yearShift);
      viewName = calShiftYear(0);
    }
  }

  // TODO color
  const refColor = 'gray';
  const viewColor = '#0192B2';
  const refBgColor = 'bg-gray-400';
  const viewBgColor = ''; // use badge colors
  // if (isComparing) {
  //   refColor = '#F6B500'; //  yellow
  //   refBgColor = 'bg-logo-yellow'; // yellow
  //   viewColor = '#2187E5'; // blue
  //   viewBgColor = ''; // blue
  // }
  // else {
  //   refColor = 'gray';
  //   refBgColor = 'bg-gray-400';
  //   viewColor = 'blue';
  //   viewBgColor = 'bg-blue-400';
  // }

  return (
    <div className='flex flex-1 flex-col place-content-center items-center'>
      <div className=' self-start pb-4 text-sm font-bold uppercase not-italic leading-5 text-black dark:text-white'>
        {i18n.player.attribute}
      </div>
      <div className='attribute flex flex-col items-center text-sm text-dark-default'>
        <div className=' relative flex h-72 w-72 justify-center'>
          {/* TOP */}
          <AttributeBadgeDouble
            name={sortedData[0]?.attribute}
            value={sortedData[0]?.attributeValue}
            refValue={sortedData[0]?.refValue}
            yearShift={yearShift}
            rightSide={false}
            isComparing={isComparing}
            refBgColor={refBgColor}
            viewBgColor={viewBgColor}
          ></AttributeBadgeDouble>

          {/* top-right */}
          <AttributeBadgeDouble
            name={sortedData[1]?.attribute}
            value={sortedData[1]?.attributeValue}
            refValue={sortedData[1]?.refValue}
            yearShift={yearShift}
            top='top-26'
            right='right-8'
            transform='translate(100%, -50%)'
            isComparing={isComparing}
            refBgColor={refBgColor}
            viewBgColor={viewBgColor}
          ></AttributeBadgeDouble>

          {/* bottom-right */}
          <AttributeBadgeDouble
            name={sortedData[2]?.attribute}
            value={sortedData[2]?.attributeValue}
            refValue={sortedData[2]?.refValue}
            yearShift={yearShift}
            bottom='bottom-7'
            right='left-[70%]'
            rightSide={true}
            isComparing={isComparing}
            refBgColor={refBgColor}
            viewBgColor={viewBgColor}
          ></AttributeBadgeDouble>

          {/* bottom-left */}
          <AttributeBadgeDouble
            name={sortedData[3]?.attribute}
            value={sortedData[3]?.attributeValue}
            refValue={sortedData[3]?.refValue}
            yearShift={yearShift}
            bottom='bottom-7'
            right='right-[70%]'
            rightSide={false}
            isComparing={isComparing}
            refBgColor={refBgColor}
            viewBgColor={viewBgColor}
          ></AttributeBadgeDouble>

          {/* top-left */}
          <AttributeBadgeDouble
            name={sortedData[4]?.attribute}
            value={sortedData[4]?.attributeValue}
            refValue={sortedData[4]?.refValue}
            yearShift={yearShift}
            top='top-26'
            left='-left-18'
            transform={
              yearShift === 0 && !isComparing
                ? 'translate(100%, -50%)'
                : 'translate(50%, -70%)'
            }
            rightSide={false}
            isComparing={isComparing}
            refBgColor={refBgColor}
            viewBgColor={viewBgColor}
          ></AttributeBadgeDouble>

          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart
              width={360}
              height={360}
              data={sortedData}
              style={{
                color: 'gray',
              }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey='attribute' hide tick={false} />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                style={{
                  fontSize: '0.6rem',
                }}
              />

              <Radar
                name={refName}
                dataKey='refValue'
                stroke={refColor}
                fill={refColor}
                fillOpacity={0.6}
                animationDuration={100}
              />

              <Radar
                name={viewName}
                dataKey='attributeValue'
                stroke={viewColor}
                fill={viewColor}
                fillOpacity={0.6}
                animationDuration={100}
              />

              <Legend content={<CustomLegend />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className='py-4'>
          <YearShiftFilter
            yearShift={yearShift}
            setYearShift={setYearShift}
          ></YearShiftFilter>
        </div>
      </div>
    </div>
  );
}

const CustomLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul
      style={{ margin: 0, padding: 0, listStyle: 'none' }}
      className='flex place-content-center items-center gap-4 text-xs'
    >
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`}>
          <span style={{ color: entry.color }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export const PlayerSearchSection = ({
  i18n,
  player,
}: {
  i18n: any;
  player?: any;
}) => {
  const { selectedPlayer, setSelectedPlayer } = usePlayerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchTerm(`${formData.get('search')}`);
    // e.target.reset();
    e.target.focus();
  };

  return (
    <>
      <div className=' flex w-full items-center gap-2 py-4'>
        <div className=''>
          {selectedPlayer?.id ? (
            <img
              src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/player/${selectedPlayer?.id}/image`}
              alt='...'
              width={36}
              height={36}
              className='rounded-full'
            ></img>
          ) : (
            <img
              src='/images/football/players/unknown1.webp'
              alt='...'
              width={36}
              height={36}
              className='rounded-full'
            ></img>
          )}
        </div>
        <div className=' relative flex-1'>
          <form
            onSubmit={handleSubmit}
            className='flex rounded-md border border-light-default bg-opacity-[0.4] text-sm leading-4 '
          >
            <input
              placeholder={i18n.titles.search_player_compare} //'Đội bóng, cầu thủ, giải đấu...'
              className='m-auto block h-10 w-full cursor-text overflow-hidden overflow-ellipsis rounded-md border-none bg-transparent bg-white px-2 text-sm leading-tight text-black'
              value={searchTerm === 'null' ? '' : searchTerm}
              style={{
                borderWidth: 'medium',
                outline: 'none',
                listStyle: 'outside',
              }}
              onChange={handleChange}
            />
            <button
              className='absolute right-2 top-3'
              onClick={() => {
                setSearchTerm('');
                setSelectedPlayer({});
              }}
            >
              <HiOutlineX className='h-5 w-5 text-dark-text'></HiOutlineX>
            </button>
          </form>
          <div className='relative'>
            {debouncedSearchTerm &&
              debouncedSearchTerm !== 'null' &&
              searchTerm && (
                <FetchPlayerComponent
                  debouncedSearchTerm={debouncedSearchTerm}
                  setSelectedPlayer={setSelectedPlayer}
                  player={player}
                ></FetchPlayerComponent>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

function FetchPlayerComponent({
  debouncedSearchTerm,
  setSelectedPlayer,
  player,
}: {
  debouncedSearchTerm: string;
  setSelectedPlayer: any;
  player?: any;
}) {
  const listRef = useRef<any>(null);
  const [show, setShow] = useState<boolean>(false);
  const [people, setPeople] = useState<any[]>([]);
  const { position = '' } = player || {};

  const { data, isLoading, isFetching } =
    useSearchPlayerData(debouncedSearchTerm);

  useEffect(() => {
    if (data) {
      setPeople(data.players || []);
      setShow(true);
    }
  }, [data, setPeople]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setPeople([]);
        setShow(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [listRef]);

  if (isLoading || isFetching || !data) return <></>;

  if (!show || isValEmpty(debouncedSearchTerm)) {
    return <></>;
  }

  return (
    <div
      className='absolute left-0 top-1 z-10 h-52 w-full overflow-scroll rounded-md bg-light-match text-sm dark:bg-dark-match'
      ref={listRef}
    >
      {people
        .filter((other: any) => {
          if (position !== 'G') {
            return other.position !== 'G';
          } else if (position === 'G') {
            return other.position === 'G';
          }
          return true;
        })
        .map((person) => (
          <div
            key={person?.id}
            className='item-hover flex cursor-pointer items-center p-2.5'
            onClick={() => {
              setSelectedPlayer(person);
              setShow(false);
            }}
          >
            <div className='w-14'>
              <QvPlayer name='' id={person?.id} type='player' imgSize={36} />
            </div>
            <div>{person?.name}</div>
          </div>
        ))}
    </div>
  );
}

export const YearShiftFilter = ({
  yearShift,
  setYearShift,
}: {
  yearShift: any;
  setYearShift: any;
}) => {
  return (
    <div className='flex text-xs'>
      <YearShiftButton
        yearShift={yearShift}
        setYearShift={setYearShift}
        shiftIndex={3}
        isStart={true}
      ></YearShiftButton>
      <YearShiftButton
        yearShift={yearShift}
        setYearShift={setYearShift}
        shiftIndex={2}
      ></YearShiftButton>
      <YearShiftButton
        yearShift={yearShift}
        setYearShift={setYearShift}
        shiftIndex={1}
      ></YearShiftButton>
      <YearShiftButton
        yearShift={yearShift}
        setYearShift={setYearShift}
        shiftIndex={0}
        isEnd={true}
      ></YearShiftButton>
    </div>
  );
};

export const calShiftYear = (yearShift: number) => {
  const current = new Date();
  const i18n = useTrans()
  const shiftedDateTime = current.setFullYear(
    current.getFullYear() - yearShift
  );

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (i18n.language === 'vi') {
    const monthText = i18n.time.months;
    const capitalizedMonth = capitalizeFirstLetter(monthText);
    return `${capitalizedMonth} ${format(new Date(shiftedDateTime), 'M yyyy', {
      locale: vi,
    })}`;
  }

  return format(new Date(shiftedDateTime), 'MMM yyyy');
};

export const YearShiftButton = ({
  yearShift,
  setYearShift,
  shiftIndex = 0,
  isEnd = false,
  isStart = false,
}: {
  yearShift: any;
  setYearShift: any;
  shiftIndex: number;
  isEnd?: boolean;
  isStart?: boolean;
}) => {
  return (
    <div
      className=' w-20 cursor-pointer space-y-2'
      onClick={() => setYearShift(shiftIndex)}
    >
      <div className='flex items-center'>
        <div
          className='h-1 w-full flex-1 bg-[#171939]'
          css={[isStart && tw`bg-opacity-0`]}
        ></div>
        <div className='relative'>
          {yearShift === shiftIndex ? (
            <div
              className='absolute left-0 top-0 flex h-4 w-4 -translate-x-2 -translate-y-2 transform place-content-center items-center rounded-full '
              css={[isEnd && tw`bg-[#0192B2]`, !isEnd && tw`bg-gray-400`]}
            >
              <div className='h-1 w-1 rounded-full bg-white leading-[0px] text-opacity-0'></div>
            </div>
          ) : (
            <div className='h-1 w-1 rounded-full bg-white leading-[0px] text-opacity-0'></div>
          )}
        </div>
        <div
          className='h-1 w-full  flex-1 bg-[#171939] '
          css={[isEnd && tw`bg-opacity-0`]}
        ></div>
      </div>
      <div className={`text-center ${isEnd ? 'text-light-active dark:text-[#0192B2]' : 'text-black dark:text-white'}`}>
        {calShiftYear(shiftIndex)}
      </div>
    </div>
  );
};

export const AttributeBadgeTop = ({
  name,
  value,
}: {
  name: any;
  value: any;
}) => {
  return (
    <div
      className='attribute absolute right-1/2 top-8 flex pb-1 leading-4 text-white'
      style={{ transform: 'translate(22px, -100%)' }}
    >
      <span className='text-left font-sans text-xs font-medium uppercase leading-5'>
        {name}
      </span>
      <div className='ml-1 flex text-white'>
        {/* TODO color */}
        <div className='h-5 w-5 rounded bg-sky-500'>
          <div className='text-center font-sans text-xs font-bold leading-5 text-gray-800'>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AttributeBadgeSideTop = ({
  name,
  value,
  top = '38%',
  right = '',
  left = '',
}: {
  name: any;
  value: any;
  top?: string;
  right?: string;
  left?: string;
}) => {
  return (
    <div
      className={`absolute ${right} ${left} flex flex-row-reverse leading-4 text-white`}
      style={{ top: top, transform: 'translate(100%, -50%)' }}
    >
      <span className='ml-0 mr-1 text-left font-sans text-xs font-medium uppercase leading-5'>
        {name}
      </span>
      <div className='ml-0 mr-1 flex text-white'>
        <div className='h-5 w-5 rounded bg-green-500'>
          <div className='text-center font-sans text-xs font-bold leading-5 text-gray-800'>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AttributeBadgeSideBottom = ({
  name,
  value,
  top = '',
  right = '',
  left = '',
  bottom = '',
}: {
  name: any;
  value: any;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
}) => {
  return (
    <div
      className={`absolute ${top} ${bottom} ${left} ${right} flex leading-4 text-white`}
      style={{
        transform: 'translate(10px, 0px)',
      }}
    >
      <span className='text-left font-sans text-xs font-medium uppercase leading-5'>
        {name}
      </span>
      <div className='ml-1 flex text-white'>
        <div className='h-5 w-5 rounded bg-red-500'>
          <div className='text-center font-sans text-xs font-bold leading-5 text-gray-800'>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AttributeBadgeDouble = ({
  name,
  value,
  refValue,
  yearShift = 0,
  top = '',
  right = '',
  left = '',
  bottom = '',
  transform = '',
  rightSide = true,
  isComparing = false,
  refBgColor = 'bg-gray-600',
  viewBgColor = 'bg-[#0192B2]',
}: {
  name: any;
  value: any;
  refValue: any;
  yearShift?: number;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
  transform?: string;
  rightSide?: boolean;
  isComparing?: boolean;
  refBgColor?: string;
  viewBgColor?: string;
}) => {
  return (
    <div
      className={`absolute  ${top} ${bottom} ${left} ${right} ${
        rightSide ? 'flex-row-reverse' : 'flex-row'
      } flex leading-4 `}
      css={{
        transform: transform,
      }}
    >
      <span className='mr-1 text-xs font-medium uppercase leading-5 text-light-default dark:text-dark-text'>
        {name}
      </span>
      <div className='mr-1 flex'>
        {yearShift === 0 && !isComparing ? (
          <AttributeBadge point={value}></AttributeBadge>
        ) : (
          <div className='flex gap-0.5'>
            <AttributeBadge point={value} color={viewBgColor}></AttributeBadge>
            <AttributeBadge
              point={refValue}
              color={refBgColor}
            ></AttributeBadge>
          </div>
        )}
      </div>
    </div>
  );
};
