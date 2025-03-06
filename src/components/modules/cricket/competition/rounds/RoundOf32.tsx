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
  TwFullBlockContainer,
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
import IcNext from '/public/svg/IcNext.svg';
import IcPrev from '/public/svg/IcPrev.svg';
import ChampionSVG from '/public/svg/champion.svg';
import { CupTreeDto, ViewDto } from '@/constant/interface';
import React from 'react';
import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import { SPORT } from '@/constant/common';
import CustomModal from '@/components/modal/CustomModal';
import { MatchItemCupTree } from '@/components/modules/cricket/competition/MatchItemCupTree';
import useTrans from '@/hooks/useTrans';

type CupTreeProps = {
  cupTree: CupTreeDto;
  activeTab?: string;
  activeIndex?: number;
  totalTabs?: number;
  handleTabChange?: (index: number) => void;
};

export const RoundOf32 = ({
  cupTree,
  activeTab,
  activeIndex,
  totalTabs,
  handleTabChange,
}: Partial<CupTreeProps>) => {
  if (!cupTree) return <></>;

  const { views } = cupTree || {};
  if (!views || views.length === 0) return <></>;

  const handlePrev = () => {
    if (activeIndex && activeIndex > 0) {
      handleTabChange && handleTabChange(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex !== undefined && totalTabs !== undefined && activeIndex < totalTabs - 1) {
      handleTabChange && handleTabChange(activeIndex + 1);
    }
  };

  return <BracketPages
    pages={views}
    maxView={0}
    activeTab={activeTab}
    activeIndex={activeIndex}
    totalTabs={totalTabs}
    handlePrev={handlePrev}
    handleNext={handleNext}
  />
};

const BracketPages = ({
  pages,
  maxView,
  activeTab,
  activeIndex,
  totalTabs,
  handlePrev,
  handleNext,
}: {
  pages: Array<ViewDto[]>;
  maxView: number;
  activeTab?: string;
  activeIndex?: number;
  totalTabs?: number;
  handlePrev?: () => void;
  handleNext?: () => void;
}) => {
  const i18n = useTrans();
  const { selectedOrder, selectedView } = useLeagueStore();
  const isFinalRound = activeTab === 'Final';
  const checkpleftfromR32 = activeTab !== 'R32' ? 'pl-0' : '';
  const checkpRightfromFinal = isFinalRound ? 'pr-4' : 'pr-0';
  let selectedPage = pages.find((page: any) => page.order === selectedOrder);
  if (!Array.isArray(selectedPage)) {
    selectedPage = pages[0] || [];
  }
  const firstOrder = selectedOrder || 1;
    
    const [openModal, setOpenModal] = useState(false)
    const [listIdEvent, setListIdEvent] = useState<any[]>([])
  
    const MatchClick = (event:any) => {
      setListIdEvent(event)
      setOpenModal(true)
    }
  return (
    <div className={`place-content-center rounded-md p-4 ${checkpRightfromFinal} ${checkpleftfromR32}`}>
      {[selectedPage].map((items: any, index: number) => (
        <Rounds
          data={items}
          key={index}
          left={items.left}
          right={items.right}
          firstOrder={firstOrder}
          maxView={maxView}
          parentOrder={firstOrder}
          root={true}
          activeTab={activeTab}
          activeIndex={activeIndex}
          totalTabs={totalTabs}
          handlePrev={handlePrev}
          handleNext={handleNext}
          isFinalRound={isFinalRound}
          matchClick={MatchClick}
        />
      ))}
      <CustomModal open={openModal} setOpen={() => setOpenModal(!openModal)}>
        {listIdEvent.length > 0 ? listIdEvent.map((ev:any) => <MatchItemCupTree eventId={ev} key={ev} />) : <div>{i18n.notification.notiTitle}</div>}
      </CustomModal>
    </div>
  );
};

const filterRoundsByActiveTab = (view: any, roundDesc: string): any[] => {
  if (!view || !view.round) {
    return [];
  }

  if (view.round.description === roundDesc) {
    return [view];
  }

  let matches: any[] = [];

  if (view.left) {
    const leftMatches = filterRoundsByActiveTab(view.left, roundDesc);
    if (leftMatches.length > 0) {
      matches = matches.concat(leftMatches);
    }
  }

  if (view.right) {
    const rightMatches = filterRoundsByActiveTab(view.right, roundDesc);
    if (rightMatches.length > 0) {
      matches = matches.concat(rightMatches);
    }
  }

  return matches;
};

const groupMatches = (matches: any, groupSize = 2) => {
  const grouped = [];
  for (let i = 0; i < matches.length; i += groupSize) {
    grouped.push(matches.slice(i, i + groupSize));
  }
  return grouped;
};

const groupMatchesByRound = (matches: any[], roundName: string) => {
  return matches.filter((match) => match.round?.description === roundName);
};

const Rounds = ({
  data,
  order,
  left,
  right,
  firstOrder,
  maxView,
  parentOrder = 1,
  root = false,
  activeTab = '',
  activeIndex,
  totalTabs,
  handlePrev,
  handleNext,
  isFinalRound = false,
  matchClick,
}: {
  data?: any;
  order?: number;
  left: any;
  right: any;
  firstOrder: number;
  maxView: number;
  parentOrder?: number;
  root?: boolean;
  activeTab?: string;
  activeIndex?: number;
  totalTabs?: number;
  handlePrev?: () => void;
  handleNext?: () => void;
  isFinalRound?: boolean;
  matchClick: (ev:any) => void;
}) => {
  const participants = isFinalRound ? data.participants : null;

  const getFilteredData = (roundData: any, isFinal: boolean, tab: string) => {
    return isFinal
      ? filterRoundsByActiveTab(roundData, 'Final')
      : filterRoundsByActiveTab(roundData, tab);
  };

  const filteredLeft = getFilteredData(left, isFinalRound, activeTab);
  const filteredRight = getFilteredData(right, isFinalRound, activeTab);

  if (filteredLeft.length === 0 && filteredRight.length === 0 && !isFinalRound) {
    return null;
  }

  const getFinalData = (filtered: any[], isFinal: boolean, side: 'left' | 'right') => {
    if (!isFinal || filtered.length === 0) return filtered;

    const sideData = filtered[0]?.[side];
    return sideData && typeof sideData === 'object'
      ? [sideData]
      : filterRoundsByActiveTab(sideData, 'Final');
  };

  const finalLeft = getFinalData(filteredLeft, isFinalRound, 'left');
  const finalRight = getFinalData(filteredRight, isFinalRound, 'right');

  if (finalLeft.length === 0 && finalRight.length === 0 && !participants) {
    return null;
  }

  const semiFinalsLeft = groupMatchesByRound(finalLeft, 'Semi Finals');
  const semiFinalsRight = groupMatchesByRound(finalRight, 'Semi Finals');

  const groupedLeft = groupMatches(semiFinalsLeft.length > 0 ? semiFinalsLeft : finalLeft);
  const groupedRight = groupMatches(semiFinalsRight.length > 0 ? semiFinalsRight : finalRight);
  const groupedData = [...groupedLeft, ...groupedRight];

  const renderTeamAvatar = (teamId: number = 0, item: any) => {
    return teamId ? (
      <>
        <HandleGroupAvatar team={item} sport={SPORT.CRICKET} size={25}></HandleGroupAvatar>
        {/* <Avatar
          id={teamId.toString()}
          width={25}
          height={25}
          type="team"
          isBackground={false}
          rounded={false}
          isSmall
        /> */}
      </>
    ) : (
      <UnknownTeamSVG className="h-5 w-5" />
    );
  };

  const renderMatch = (item: any) => (
    <TwFullBlockContainer
      className="relative my-1.5 w-full cursor-pointer !border-none bg-gradient-to-br"
      onClick={() => {
        if (item.events && item.events.length > 0) {
          matchClick(item?.events)
        }
      }}
    >
      <div className="flex gap-2 p-2">
        <div className="flex flex-col items-center justify-center gap-2">
          {renderTeamAvatar(item.participants?.[0]?.team?.id, item.participants[0].team)}
          {renderTeamAvatar(item.participants?.[1]?.team?.id, item.participants[1].team)}
        </div>
        <div className="flex w-20 flex-col text-white">
          <p className="flex-1 truncate leading-6">
            {item.participants?.[0]?.team?.name || 'N/A'}
          </p>
          <p className="flex-1 truncate leading-6">
            {item.participants?.[1]?.team?.name || 'N/A'}
          </p>
        </div>
        <div className="flex w-[1.374rem] items-center ml-auto">
          <MatchScoreColumn
            code={100}
            homeScore={item.homeTeamScore}
            awayScore={item.awayTeamScore}
          />
        </div>
      </div>
    </TwFullBlockContainer>
  );

  const renderGroup = (group: any[], groupIndex: number) => (
    <div className="relative flex items-center" key={groupIndex}>
      <div className="relative items-center basis-[100%]">
        <div className="relative my-1">
          {!(activeTab === 'Semi Finals') && (
            <div className="absolute right-0 h-[86px] w-[1px] bg-dark-blue-border top-[50%] transform -translate-y-1/2" />
          )}
          {group.map((item: any, subIndex: number) => (
            <div key={`left-${groupIndex}-${subIndex}`} className="relative flex items-center">
              {activeTab !== 'R32' && (
                <>
                  <button
                    className="absolute left-[4px] z-10 flex items-center justify-center w-[32px] h-[32px] rounded-full bg-gray-800 hover:bg-gray-700"
                    onClick={handlePrev}
                  >
                    <IcPrev />
                  </button>
                  <div className="relative right-0 h-[1px] w-12 bg-dark-blue-border" />
                </>
              )}
              {renderMatch(item)}
              {!isFinalRound && (
                <div className="relative right-0 h-[1px] w-8 bg-dark-blue-border" />
              )}
            </div>
          ))}
          {!isFinalRound && !(activeTab === 'Semi Finals') && (
            <div className="absolute right-0 h-[86px] w-[1px] bg-dark-blue-border top-[50%] transform -translate-y-1/2" />
          )}
        </div>
      </div>
      {!isFinalRound && (
        <>
          <button
            onClick={handleNext}
            className="absolute right-[13px] flex items-center justify-center w-[32px] h-[32px] rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <IcNext />
          </button>
          <div className="right-[0] top-[50%] h-[1px] w-8 bg-dark-blue-border" />
        </>
      )}
    </div>
  );

  return (
    <div className="no-scrollbar overflow-y-scroll">
      <div className="relative flex-1 flex-col">
        {isFinalRound && participants ? (
          <div className="relative flex items-center">
            {activeTab !== 'R32' && (
              <>
                <button
                  className="absolute left-[4px] z-10 flex items-center justify-center w-[32px] h-[32px] rounded-full bg-gray-800 hover:bg-gray-700"
                  onClick={handlePrev}
                >
                  <IcPrev />
                </button>
                <div className="relative right-0 h-[1px] w-12 bg-dark-blue-border" />
              </>
            )}
            {renderMatch(data)}
          </div>
        ) : (
          groupedData.map(renderGroup)
        )}
      </div>
    </div>
  );
};
