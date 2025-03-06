import { useState } from 'react';
import { useRouter } from 'next/router';
import { isValEmpty } from '@/utils';
import Avatar from '@/components/common/Avatar';
import BracketPopOver from '@/components/common/pop-over/BracketPopOver';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import {
  Tw3rdPlaceBlockContainer,
  TwBlockContainer,
  TwBracketMatchBadge,
  TwCard,
  TwStageTitle,
} from '@/components/modules/common';
import { useLeagueStore } from '@/stores/league-store';
import {
  HiChevronLeft,
  HiOutlineChevronRight,
  HiPlusCircle,
} from 'react-icons/hi';
import tw from 'twin.macro';
import UnknownTeamSVG from '/public/svg/unknown-team.svg';
import ChampionSVG from '/public/svg/champion.svg';
import { CupTreeDto, ViewDto } from '@/constant/interface';
import React from 'react';
import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import useTrans from '@/hooks/useTrans';
import { EmptyEvent } from '@/components/common/empty';
import { SPORT } from '@/constant/common';

type CupTreeProps = {
  cupTree: CupTreeDto;
};

export const CupTreeMobile = ({ cupTree }: Partial<CupTreeProps>) => {
  if (!cupTree) return <></>;

  const { views } = cupTree || {};
  const i18n = useTrans();
  
  if (!views) {
    return (
      <div className='flex flex-col gap-4 bg-white dark:bg-dark-container p-4'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
        <EmptyEvent title={i18n.common.nodata} content={''} />
      </div>
    );
  }
  return <BracketPages pages={views} maxView={0} />;
};

const BracketPages = ({
  pages,
  maxView,
  thirdPlaceCupBlock,
}: {
  pages: Array<ViewDto[]>;
  maxView: number;
  thirdPlaceCupBlock?: any;
}) => {
  const { selectedOrder, selectedView } = useLeagueStore();
  let selectedPage = pages.find((page: any) => page.order === selectedOrder);
  if (isValEmpty(selectedPage)) selectedPage = pages[0] || {};
  const firstOrder = selectedOrder || 1;
  return (
    <div className="lg:no-scrollbar w-full flex place-content-center rounded-md p-4 overflow-x-scroll">
      {[selectedPage]?.map((items: any, index: number) => (
        <Rounds
          key={index}
          roundData={items}
          firstOrder={firstOrder}
          maxView={maxView}
          parentOrder={firstOrder}
          root={true}
          thirdPlaceCupBlock={thirdPlaceCupBlock}
        />
      ))}
    </div>
  );
};

const getClosestDivisibleByFour = (num: number) => {
  if (num % 4 === 0) {
    return num;
  }

  const lower = num - (num % 4);

  return lower;
};

const getParentOrder = (order: number) => {
  return Math.round(getClosestDivisibleByFour(order) / 4);
};

const Rounds = ({
  roundData,
  firstOrder,
  maxView,
  parentOrder = 1,
  thirdPlaceCupBlock,
  root = false,
}: {
  roundData: any;
  firstOrder: number;
  maxView: number;
  parentOrder?: number;
  thirdPlaceCupBlock?: any;
  root?: boolean;
}) => {
  const { order, left, right, participants, events = [], time } = roundData || {};

  const leftParticipant = participants ? participants[0] : null;
  const rightParticipant = participants ? participants[1] : null;

  const leftTeamName = leftParticipant?.team?.name || 'N/A';
  const rightTeamName = rightParticipant?.team?.name || 'N/A';

  const leftScore = leftParticipant?.score || 0;
  const rightScore = rightParticipant?.score || 0;

  const isFinal = roundData?.round?.description === 'Final';

  return (
    <div className="flex flex-col items-center relative">
      {(left?.order === 4 || left?.order === 8 || left?.order === 10 || right?.order === 5 || right?.order === 9 || right?.order === 11) ? (
        <div className="flex flex-col items-center relative">
          <div className="flex relative gap-[8px]">
            <div className="flex flex-col items-center relative">
              <Rounds roundData={left} firstOrder={firstOrder} maxView={maxView} parentOrder={parentOrder} />
              <div className="h-[12px] w-[1px] bg-dark-blue-border" />
            </div>

            <div className="flex flex-col items-center relative">
              <Rounds roundData={right} firstOrder={firstOrder} maxView={maxView} parentOrder={parentOrder} />
              <div className="h-[12px] w-[1px] bg-dark-blue-border" />
            </div>
          </div>
          <div className="w-1/2 h-[1px] bg-dark-blue-border mx-auto" />
          <div className="w-2 mt-[-4px] h-2 bg-blue-500 border-1 border-white rounded-full mx-auto" />
          <div className="h-[12px] w-[1px] bg-dark-blue-border mx-auto" />
        </div>
      ) : null}

      {left?.order === 2 && (
        <div className="flex flex-col items-center relative">
          <Rounds roundData={left} firstOrder={firstOrder} maxView={maxView} parentOrder={parentOrder} />
          <div className="h-[12px] w-[1px] bg-dark-blue-border" />
        </div>
      )}

      <div className=''>
        {isFinal && (
          <div className="flex items-center">
            <span className="z-[1] absolute right-0 -left-[60%] bottom-1/2 top-[47%]">
              <ChampionSVG className="h-[40px] w-[40px]" />
            </span>
          </div>
        )}
        <div className="flex flex-row justify-center items-center relative">
          <div className="flex flex-col justify-center items-center bg-custom-gradient-item-row px-[8px] py-[12px] rounded-lg relative">
            <div className="flex flex-row items-center gap-[6px] relative">
              {leftParticipant?.team?.sub_ids && leftParticipant?.team?.sub_ids.length > 0 ? (
                <HandleGroupAvatar team={leftParticipant?.team} sport={SPORT.AMERICAN_FOOTBALL} size={24}></HandleGroupAvatar>
              ) : (
                <HandleGroupAvatar team={leftParticipant?.team} sport={SPORT.AMERICAN_FOOTBALL} size={24}></HandleGroupAvatar>
              )}
              {rightParticipant?.team?.sub_ids && rightParticipant?.team?.sub_ids.length > 0 ? (
                <HandleGroupAvatar team={rightParticipant?.team} sport={SPORT.AMERICAN_FOOTBALL} size={24}></HandleGroupAvatar>
              ) : (
                <HandleGroupAvatar team={rightParticipant?.team} sport={SPORT.AMERICAN_FOOTBALL} size={24}></HandleGroupAvatar>
              )}
            </div>

            <div className="flex flex-row justify-center mt-2">
              <span className={`${leftScore > rightScore ? 'text-white' : 'text-grey'} font-bold`}>
                {leftScore}
              </span>
              <span className="mx-2 text-white"> - </span>
              <span className={`${rightScore > leftScore ? 'text-white' : 'text-grey'} font-bold`}>
                {rightScore}
              </span>
            </div>
          </div>
          {order === 1 && thirdPlaceCupBlock && (
            <div className="ml-4">
              <ThirdPlaceBlock thirdPlaceCupBlock={thirdPlaceCupBlock} />
            </div>
          )}
        </div>
      </div>

      {right?.order === 3 && (
        <><div className="h-[12px] w-[1px] bg-dark-blue-border" /><Rounds roundData={right} firstOrder={firstOrder} maxView={maxView} parentOrder={parentOrder} /></>
      )}

      {left?.order === 6 || left?.order === 12 || left?.order === 14 || right?.order === 7 || right?.order === 13 || right?.order === 15 ? (
        <div className="flex flex-col items-center relative">
          <div className="h-[12px] w-[1px] bg-dark-blue-border mx-auto" />
          <div className="w-2 mb-[-4px] z-[1] h-2 bg-blue-500 border-1 border-white rounded-full mx-auto" />
          <div className="w-1/2 h-[1px] bg-dark-blue-border mx-auto" />
          <div className="flex flex-row relative gap-[8px]">
            <div className="flex flex-col items-center">
              <div className="h-[12px] w-[1px] bg-dark-blue-border" />
              <Rounds roundData={left} firstOrder={firstOrder} maxView={maxView} parentOrder={parentOrder} />
            </div>

            <div className="flex flex-col items-center">
              <div className="h-[12px] w-[1px] bg-dark-blue-border" />
              <Rounds roundData={right} firstOrder={firstOrder} maxView={maxView} parentOrder={parentOrder} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};


const calculateDateTime = (time: string) => {
  if (!time) return null;

  const date = new Date(time);

  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

const ThirdPlaceBlock = ({
  thirdPlaceCupBlock,
}: {
  thirdPlaceCupBlock: any;
}) => {
  const {
    participants = [],
    events: eventIds = [],
    homeTeamScore: leftScore,
    awayTeamScore: rightScore,
    notStart,
    time,
  } = thirdPlaceCupBlock || {};

  const [leftTeamData = {}, rightTeamData = {}] = participants || [];
  const { team: leftTeam } = leftTeamData || {};
  const { team: rightTeam } = rightTeamData || {};

  const dateTime = calculateDateTime(time);

  if (!leftTeam?.id && !rightTeam?.id) {
    return null;
  }

  return (
    <div
      className="relative w-full border-gradient-to-r my-1.5 p-3 cursor-pointer"
      onClick={() => {
        if (eventIds && eventIds.length > 0) {
          if (eventIds.length === 1) {
            window.location.href = `/match/${eventIds[0]}`;
          }
        }
      }}
    >
      {eventIds.length > 1 && (
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <BracketPopOver matches={eventIds}>
            <button>
              <HiPlusCircle className="h-5 w-5 text-white" />
            </button>
          </BracketPopOver>
        </div>
      )}

      <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
        {leftTeam?.sub_ids && leftTeam?.sub_ids.length > 0 ? (
          leftTeam.sub_ids.map((subId: string) => (
            <HandleGroupAvatar team={leftTeam} sport={'tennis'} size={20}></HandleGroupAvatar>
          ))
        ) : (
          leftTeam?.id ? (
            <HandleGroupAvatar team={leftTeam} sport={'tennis'} size={20}></HandleGroupAvatar>
          ) : (
            <UnknownTeamSVG className="h-5 w-5" />
          )
        )}
        <span className="flex-1 truncate text-white text-sm ml-2">{leftTeam.name || 'N/A'}</span>
        {!notStart ? (
          <span className="text-white">{leftScore}</span>
        ) : (
          <span className="text-white">{`${dateTime?.day}/${dateTime?.month}`}</span>
        )}
      </div>

      <div className="flex justify-between items-center">
        {rightTeam?.sub_ids && rightTeam?.sub_ids.length > 0 ? (
          rightTeam.sub_ids.map((subId: string) => (
            <HandleGroupAvatar team={rightTeam} sport={'tennis'} size={20}></HandleGroupAvatar>
          ))
        ) : (
          rightTeam?.id ? (
            <HandleGroupAvatar team={rightTeam} sport={'tennis'} size={20}></HandleGroupAvatar>
          ) : (
            <UnknownTeamSVG className="h-5 w-5" />
          )
        )}
        <span className="flex-1 truncate text-white text-sm ml-2">{rightTeam.name || 'N/A'}</span>
        {!notStart ? (
          <span className="text-white">{rightScore}</span>
        ) : (
          <span className="text-white">{`${dateTime?.day}/${dateTime?.month}`}</span>
        )}

        <TwBracketMatchBadge className="bg-gray-600 text-sm text-white ml-2">
          3rd place
        </TwBracketMatchBadge>
      </div>
    </div>
  );
};
