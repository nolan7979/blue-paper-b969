// pages/index.js

import { useState } from 'react';
import tw from 'twin.macro';

import ModalConfirm from '@/components/common/modal/ModalConfirm';
import { MainLayout } from '@/components/layout';
import {
  TwDataSection,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
// import { MbMainLayout } from '@/components/layout';
import Seo from '@/components/Seo';
import ButtonPaginationWithTitle from '@/components/user/favorite/ButtonPaginationWithTitle';
import MatchByDate from '@/components/user/favorite/MatchByDate';
import MatchByLeague from '@/components/user/favorite/MatchByLeague';
import RowFollow from '@/components/user/favorite/RowFollow';
import SportFollow from '@/components/user/favorite/SportFollow';

import { useFinshMatch } from '@/stores/finish-match-store';
import { useFollowStore } from '@/stores/follow-store';

import { suggestionFav } from '@/constant/suggestionFavorite';
import filterMatchByDate from '@/utils/filterMatchByDate';
import filterMatchByLeague from '@/utils/filterMatchByLeague';

import TrashIcon from '/public/svg/trash-icon.svg';
import { QuickViewColumn } from '@/components/modules/football/quickviewColumn/QuickViewColumn';

// import FootballPage from './football';
// import MbFootballPage from '@/pages/m';

export const TwTitleFa = tw.div`
  text-base font-bold uppercase lg:text-logo-blue
`;
export const TwFilterColFa = tw.div`
  shrink
  gap-y-3
  xl:flex-[2]
  lg:flex-[3]
`;
export const TwButtonFa = tw.button`
rounded-lg px-3 py-1.5 lg:px-0 lg:text-csm
`;
export const TwButtonFa2 = tw.button`
rounded-lg px-3 py-1.5 lg:text-csm
`;
export const TwSportTitleFa = tw.div`text-ccsm`;
export const TwCardFa = tw.div`space-y-6 border-b border-solid border-light-line-stroke-cd dark:border-dark-stroke p-4`;

interface TabItemProps {
  id: number;
  name: string;
}

const FavoritePage = () => {
  const { teamFollowed } = useFollowStore((state) => ({
    teamFollowed: state.followed.teams,
  }));
  const { playerFollowed } = useFollowStore((state) => ({
    playerFollowed: state.followed.players,
  }));
  const { tournamentFollowed } = useFollowStore((state) => ({
    tournamentFollowed: state.followed.tournament,
  }));
  const { matchFollowed } = useFollowStore((state) => ({
    matchFollowed: state.followed.match,
  }));
  const { removeMatches } = useFollowStore();
  const { previousDayMatches, todayMatches, upcomingDayMatches } =
    filterMatchByDate(matchFollowed);
  const sotedMatchByLeague = filterMatchByLeague(matchFollowed);
  // team
  const teamFootball = teamFollowed['football'] ? teamFollowed['football'] : [];
  const teamBasketball = teamFollowed['basketball']
    ? teamFollowed['basketball']
    : [];
  const teamTennis = teamFollowed['tennis'] ? teamFollowed['tennis'] : [];
  // player
  const playerFootball = playerFollowed['football']
    ? playerFollowed['football']
    : [];
  const playerBasketball = playerFollowed['basketball']
    ? playerFollowed['basketball']
    : [];
  // tounament
  const tournamnetFootball = tournamentFollowed['football']
    ? tournamentFollowed['football']
    : [];
  const tournamnetBasketball = tournamentFollowed['basketball']
    ? tournamentFollowed['basketball']
    : [];
  const tournamnetTennis = tournamentFollowed['tennis']
    ? tournamentFollowed['tennis']
    : [];

  const [tabActive, setTabActive] = useState<number>(1);
  const tabItem = [
    { id: 1, name: 'Đội bóng' },
    { id: 2, name: 'Giải đấu' },
    { id: 3, name: 'Cầu thủ' },
  ];
  const teamSportFollow = [
    { title: 'football', arrayFollow: teamFootball },
    { title: 'basketball', arrayFollow: teamBasketball },
    { title: 'tennis', arrayFollow: teamTennis },
  ];
  const tournamentSportFollow = [
    { title: 'football', arrayFollow: tournamnetFootball },
    { title: 'basketball', arrayFollow: tournamnetBasketball },
    { title: 'tennis', arrayFollow: tournamnetTennis },
  ];
  const playerSportFollow = [
    { title: 'football', arrayFollow: playerFootball },
    { title: 'basketball', arrayFollow: playerBasketball },
    { title: 'tennis', arrayFollow: teamTennis },
  ];
  const [isTodayFilter, setIsTodayFilter] = useState<number>(0);
  const [sortedByLeague, setSortedByLeague] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const inCrease = () => {
    setIsTodayFilter(isTodayFilter + 1);
  };
  const deCrease = () => {
    setIsTodayFilter(isTodayFilter - 1);
  };
  const { matches } = useFinshMatch((state) => ({
    matches: state.matches,
  }));
  const { removeAllMatches } = useFinshMatch();
  const handleRemoveFinishedMatch = () => {
    matches.forEach((item: any) => {
      removeMatches(item?.id); // Assuming item?.id is the identifier for a match
    });
    removeAllMatches();
    setIsOpenModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  return (
    <>
      <Seo templateTitle='Favorite' />
      <TwDataSection className='layout flex-col-reverse lg:flex-row'>
        <TwFilterColFa className='flex-shrink-1 rounded-lg border border-solid border-light-line-stroke-cd bg-white dark:border-dark-stroke dark:bg-light-black'>
          <TwCardFa>
            <div className='flex justify-center lg:justify-start'>
              <TwTitleFa>Đã theo dõi</TwTitleFa>
            </div>
            <div className='flex justify-center lg:justify-start'>
              <div className='flex w-full justify-center gap-2 lg:justify-between'>
                {tabItem.map((item: TabItemProps, index: number) => (
                  <TwButtonFa
                    key={index}
                    className={`${
                      tabActive === item?.id
                        ? 'bg-logo-blue font-bold text-white lg:bg-transparent lg:text-logo-blue'
                        : ''
                    }`}
                    onClick={() => setTabActive(item?.id)}
                  >
                    <p className='capitalize'>{item.name}</p>
                  </TwButtonFa>
                ))}
              </div>
            </div>
          </TwCardFa>

          <div className={`${tabActive === 1 ? 'block' : 'hidden'}`}>
            {teamSportFollow.map((item: any, index: number) => {
              if (item.arrayFollow.length === 0) {
                return <></>;
              } else {
                return (
                  <SportFollow
                    title={item.title}
                    arrayFollow={item.arrayFollow}
                    key={index}
                    type='team'
                  />
                );
              }
            })}
          </div>
          <div className={`${tabActive === 2 ? 'block' : 'hidden'}`}>
            {tournamentSportFollow.map((item: any, index: number) => {
              if (item.arrayFollow.length === 0) {
                return <></>;
              } else {
                return (
                  <SportFollow
                    title={item.title}
                    arrayFollow={item.arrayFollow}
                    key={index}
                    type='unique-tournament'
                  />
                );
              }
            })}
          </div>
          <div className={`${tabActive === 3 ? 'block' : 'hidden'}`}>
            {playerSportFollow.map((item: any, index: number) => {
              if (item.arrayFollow.length === 0) {
                return <></>;
              } else {
                return (
                  <SportFollow
                    title={item.title}
                    arrayFollow={item.arrayFollow}
                    key={index}
                    type={`${item.title === 'tennis' ? 'team' : 'player'}`}
                  />
                );
              }
            })}
          </div>

          <TwCardFa className='!border-none'>
            <div className='flex justify-center'>
              <TwTitleFa>Gợi ý</TwTitleFa>
            </div>
          </TwCardFa>
          <TwCardFa>
            <div className='space-y-4'>
              <TwSportTitleFa>
                <p>Football</p>
              </TwSportTitleFa>
              <div className='flex flex-col gap-y-3'>
                {(() => {
                  if (tabActive === 1) {
                    return suggestionFav['teamFootball']
                      .filter(
                        (item1) =>
                          !teamSportFollow[0]['arrayFollow'].some(
                            (item2) => item2?.id === item1?.id
                          )
                      )
                      .map((item: any, index: number) => (
                        <RowFollow
                          key={index}
                          team={item}
                          type='team'
                          title='football'
                          reverse={true}
                        />
                      ));
                  } else if (tabActive === 2) {
                    return <></>;
                    // return suggestionFav['tournamentFootball']
                    //   .filter(
                    //     (item1) =>
                    //       !tournamentSportFollow[0]['arrayFollow'].some(
                    //         (item2) => item2?.id === item1?.id
                    //       )
                    //   )
                    //   .map((item: any, index: number) => (
                    //     <RowFollow
                    //       key={index}
                    //       team={item}
                    //       type='unique-tournament'
                    //       title='football'
                    //       reverse={true}
                    //     />
                    //   ));
                  } else {
                    return suggestionFav['playerFootball']
                      .filter(
                        (item1) =>
                          !playerSportFollow[0]['arrayFollow'].some(
                            (item2) => item2?.id === item1?.id
                          )
                      )
                      .map((item: any, index: number) => (
                        <RowFollow
                          key={index}
                          team={item}
                          type='player'
                          title='football'
                          reverse={true}
                        />
                      ));
                  }
                })()}
              </div>
            </div>
          </TwCardFa>

          <TwCardFa>
            <div className='space-y-4'>
              <TwSportTitleFa>
                <p>Basketball</p>
              </TwSportTitleFa>
              <div className='flex flex-col gap-y-3'>
                {(() => {
                  if (tabActive === 1) {
                    return suggestionFav['teamBasketball']
                      .filter(
                        (item1) =>
                          !teamSportFollow[1]['arrayFollow'].some(
                            (item2) => item2?.id === item1?.id
                          )
                      )
                      .map((item: any, index: number) => (
                        <RowFollow
                          key={index}
                          team={item}
                          type='team'
                          title='basketball'
                          reverse={true}
                        />
                      ));
                  } else if (tabActive === 2) {
                    return <></>;
                    // return suggestionFav['tournamentBaseketball']
                    //   .filter(
                    //     (item1) =>
                    //       !tournamentSportFollow[1]['arrayFollow'].some(
                    //         (item2) => item2?.id === item1?.id
                    //       )
                    //   )
                    //   .map((item: any, index: number) => (
                    //     <RowFollow
                    //       key={index}
                    //       team={item}
                    //       type='unique-tournament'
                    //       title='basketball'
                    //       reverse={true}
                    //     />
                    //   ));
                  } else {
                    return suggestionFav['playerBasketball']
                      .filter(
                        (item1) =>
                          !playerSportFollow[1]['arrayFollow'].some(
                            (item2) => item2?.id === item1?.id
                          )
                      )
                      .map((item: any, index: number) => (
                        <RowFollow
                          key={index}
                          team={item}
                          type='player'
                          title='basketball'
                          reverse={true}
                        />
                      ));
                  }
                })()}
              </div>
            </div>
          </TwCardFa>
          <TwCardFa className='!border-none'>
            <div className='space-y-4'>
              <TwSportTitleFa>
                <p>Tennis</p>
              </TwSportTitleFa>
              <div className='flex flex-col gap-y-3'>
                {(() => {
                  if (tabActive === 1) {
                    return suggestionFav['teamTennis']
                      .filter(
                        (item1) =>
                          !teamSportFollow[2]['arrayFollow'].some(
                            (item2) => item2?.id === item1?.id
                          )
                      )
                      .map((item: any, index: number) => (
                        <RowFollow
                          key={index}
                          team={item}
                          type='team'
                          title='tennis'
                          reverse={true}
                        />
                      ));
                  } else if (tabActive === 2) {
                    return <></>;
                    // return suggestionFav['tournamantTennis']
                    //   .filter(
                    //     (item1) =>
                    //       !tournamentSportFollow[2]['arrayFollow'].some(
                    //         (item2) => item2?.id === item1?.id
                    //       )
                    //   )
                    //   .map((item: any, index: number) => (
                    //     <RowFollow
                    //       key={index}
                    //       team={item}
                    //       type='unique-tournament'
                    //       title='tennis'
                    //       reverse={true}
                    //     />
                    //   ));
                  } else {
                    return suggestionFav['teamTennis']
                      .filter(
                        (item1) =>
                          !teamSportFollow[2]['arrayFollow'].some(
                            (item2) => item2?.id === item1?.id
                          )
                      )
                      .map((item: any, index: number) => (
                        <RowFollow
                          key={index}
                          team={item}
                          type='team'
                          title='tennis'
                          reverse={true}
                        />
                      ));
                  }
                })()}
              </div>
            </div>
          </TwCardFa>
        </TwFilterColFa>

        <TwMainCol className='h-fit rounded-lg border border-solid border-light-line-stroke-cd dark:border-dark-stroke'>
          <div className='space-y-5 rounded-t-lg border-b border-solid border-light-line-stroke-cd bg-white px-3 py-4 text-csm dark:border-light-black dark:bg-light-black'>
            <div className='grid grid-cols-2'>
              <div className='flex items-center gap-2 text-csm'>
                <p>Nhóm theo giải đấu</p>
                <div className='flex items-center'>
                  <label className='relative inline-flex cursor-pointer items-center'>
                    <input
                      type='checkbox'
                      checked={sortedByLeague}
                      onChange={(e) => setSortedByLeague(e.target.checked)}
                      className='peer sr-only'
                      aria-label='group by league'
                    />
                    <div className="peer h-4 w-8 rounded-full bg-gray-200 after:absolute after:left-1 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                  </label>
                </div>
              </div>
              <div className='flex justify-end'>
                <TwButtonFa2
                  className=' flex w-fit items-center gap-2 bg-logo-blue text-csm font-bold text-white md:gap-4'
                  onClick={() => handleOpenModal()}
                >
                  <p>Xoá trận hoàn thành</p>
                  <TrashIcon />
                </TwButtonFa2>
              </div>
            </div>

            <div
              className={`flex ${
                isTodayFilter === 0
                  ? 'justify-between'
                  : isTodayFilter === 1
                  ? 'justify-start'
                  : 'justify-end'
              }`}
            >
              {!sortedByLeague ? (
                <>
                  <ButtonPaginationWithTitle
                    title='Previous'
                    previous={true}
                    value={-1}
                    today={isTodayFilter}
                    setToday={deCrease}
                  />

                  <ButtonPaginationWithTitle
                    title='After'
                    previous={false}
                    value={1}
                    today={isTodayFilter}
                    setToday={inCrease}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          {!sortedByLeague &&
            (isTodayFilter === 0 ? (
              <MatchByDate matchList={todayMatches} />
            ) : isTodayFilter === 1 ? (
              <MatchByDate matchList={upcomingDayMatches} />
            ) : (
              <MatchByDate matchList={previousDayMatches} />
            ))}
          {sortedByLeague ? (
            <MatchByLeague matchList={sotedMatchByLeague} />
          ) : (
            ''
          )}
        </TwMainCol>

        <TwQuickViewCol className=''>
          {/* show/hide this div, not the TwQuickViewCol */}
          <QuickViewColumn top={true} sticky={true} />
        </TwQuickViewCol>
      </TwDataSection>
      <ModalConfirm
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        confirm={handleRemoveFinishedMatch}
      />
    </>
  );
};

FavoritePage.Layout = MainLayout;
// FavoritePage.Layout = MbMainLayout;

export default FavoritePage;
