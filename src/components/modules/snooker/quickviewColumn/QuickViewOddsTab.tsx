import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';

import {
  useBookmakersData,
  useMatchCompareMarketsOddsData,
} from '@/hooks/useFootball/useOddsData';

import OddsChangesModalQV from '@/components/modules/football/odds/OddsChangeModalQV';
import { TwQuickViewSection } from '@/components/modules/football/tw-components';

import { useOddsQvStore, useOddsStore } from '@/stores';

import { SportEventDto } from '@/constant/interface';
import { convertOdds, isValEmpty } from '@/utils';

const QuickViewOddsTab = ({ matchData }: { matchData: SportEventDto }) => {
  return (
    <>
      <PopularOddsSection matchData={matchData}></PopularOddsSection>
      {/* <CornerOUOddsSection matchData={matchData}></CornerOUOddsSection> */}
      <CorrectScoreSection matchData={matchData}></CorrectScoreSection>

      <OddsChangeModalSection matchData={matchData}></OddsChangeModalSection>
      <OddsChangeModalSectionCornerOU
        matchData={matchData}
      ></OddsChangeModalSectionCornerOU>
      <OddsChangeModalSectionScore
        matchData={matchData}
      ></OddsChangeModalSectionScore>
    </>
  );
};

export default QuickViewOddsTab;

const OddsChangeModalSectionScore = ({ matchData }: { matchData: any }) => {
  const {
    halfScore,
    showDetailModalScore,
    setShowDetailModalScore,
    correctScoreBookMaker,
  } = useOddsQvStore();

  return (
    <div className=''>
      <OddsChangesModalQV
        open={showDetailModalScore}
        setOpen={setShowDetailModalScore}
        bookMaker={{
          id: correctScoreBookMaker,
          name: correctScoreBookMaker === 31 ? 'Sbobet' : 'Bwin',
        }}
        matchId={matchData?.id}
        half={halfScore}
      ></OddsChangesModalQV>
    </div>
  );
};

const OddsChangeModalSection = ({ matchData }: { matchData: any }) => {
  const { half, showDetailModal, selectedBookMaker, setShowDetailModal } =
    useOddsQvStore();

  return (
    <div className=''>
      <OddsChangesModalQV
        open={showDetailModal}
        setOpen={setShowDetailModal}
        bookMaker={selectedBookMaker}
        matchId={matchData?.id}
        half={half}
      ></OddsChangesModalQV>
    </div>
  );
};

const OddsChangeModalSectionCornerOU = ({ matchData }: { matchData: any }) => {
  const {
    halfCornerOU,
    showDetailModalCornerOU,
    selectedBookMaker,
    setShowDetailModalCornerOU,
  } = useOddsQvStore();

  return (
    <div className=''>
      <OddsChangesModalQV
        open={showDetailModalCornerOU}
        setOpen={setShowDetailModalCornerOU}
        bookMaker={selectedBookMaker}
        matchId={matchData?.id}
        half={halfCornerOU}
      ></OddsChangesModalQV>
    </div>
  );
};

const PopularOddsSection = ({ matchData }: { matchData: any }) => {
  return (
    <TwQuickViewSection className='p-2.5'>
      <PopularOddsFilterSection></PopularOddsFilterSection>
      <ShowPopularOddsSection matchId={matchData?.id}></ShowPopularOddsSection>
    </TwQuickViewSection>
  );
};

const PopularOddsFilterSection = () => {
  const { market, setMarket, half, setHalf } = useOddsQvStore();

  return (
    <>
      <TwOddsTitle className=''>Popular Odds</TwOddsTitle>
      <div className='text-center text-csm '>
        <div className=' my-2 flex justify-between gap-2'>
          <button
            className='flex-1 cursor-pointer rounded-md py-1.5 '
            css={[
              market === 'hdp' && tw`bg-logo-blue text-white shadow-sm`,
              market === 'std1x2' && tw`bg-white dark:bg-dark-hl-1 shadow-sm `,
              market === 'tx' && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
            ]}
            onClick={() => setMarket('hdp')}
          >
            Asian HDP
          </button>
          <button
            className='w-1/3 cursor-pointer rounded-md py-1.5'
            onClick={() => setMarket('std1x2')}
            css={[
              market === 'std1x2' && tw`bg-logo-blue text-white shadow-sm`,
              market === 'hdp' && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
              market === 'tx' && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
            ]}
          >
            1x2
          </button>
          <button
            className='w-1/3 cursor-pointer rounded-md py-1.5 '
            onClick={() => setMarket('tx')}
            css={[
              market === 'tx' && tw`bg-logo-blue text-white shadow-sm`,
              market === 'hdp' && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
              market === 'std1x2' && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
            ]}
          >
            Over/Under
          </button>
        </div>

        {/* <div className=' mb-2 flex gap-2 py-2 text-center'> */}
        {/* <div className=' border-common flex w-8/12 rounded-md dark:bg-dark-hl-1'>
            <div
              className=' w-1/2 cursor-pointer rounded-s-md  py-1  '
              css={[
                showPrematch && tw`bg-logo-blue text-white`,
                !showPrematch && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
              ]}
              onClick={() => setShowPrematch(true)}
            >
              Prematch
            </div>
            <div
              className=' flex-1 cursor-pointer rounded-e-md py-1'
              css={[
                !showPrematch && tw`bg-logo-blue text-white`,
                showPrematch && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
              ]}
              onClick={() => setShowPrematch(false)}
            >
              In-play
            </div>
          </div> */}
        <div className=' flex flex-1 gap-2 rounded-md'>
          <button
            className=' w-1/2 cursor-pointer rounded-md py-1'
            css={[
              half === 0 && tw`bg-logo-blue text-white shadow-sm`,
              half === 1 && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
            ]}
            onClick={() => setHalf(0)}
          >
            FT
          </button>
          <button
            className=' flex-1 cursor-pointer rounded-md py-1'
            css={[
              half === 1 && tw`bg-logo-blue text-white shadow-sm`,
              half === 0 && tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
            ]}
            onClick={() => setHalf(1)}
          >
            HT
          </button>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

const ShowPopularOddsSection = ({ matchId }: { matchId: string }) => {
  const { market, half, setSelectedBookMaker, setShowDetailModal } =
    useOddsQvStore();
  const { oddsType } = useOddsStore();

  const { data: shownData, isFetching } = useMatchCompareMarketsOddsData(
    matchId || '',
    half || 0,
    market
  );

  const { data: bookMakerData, isFetching: isFetchingBM } = useBookmakersData();
  const mapBookMakers = useMemo(() => {
    return (
      bookMakerData?.bookmakers?.reduce((acc: any, cur: any) => {
        acc[cur?.id] = cur.name;
        return acc;
      }, {}) || {}
    );
  }, [bookMakerData]);

  if (isFetching || isFetchingBM) {
    return <ShowPopularOddsSkeletons></ShowPopularOddsSkeletons>; // TODO skeleton later
  }

  return (
    <div className='mt-4 rounded-md'>
      <TwTable className='w-full text-ccsm'>
        <thead className=''>
          <div className='grid grid-cols-11 border border-light-stroke dark:border-dark-draw'>
            <td className='col-span-4'>{/* Company */}</td>
            <td className='col-span-2 text-black dark:text-white'>Home</td>
            <td className='col-span-2 text-black dark:text-white'>X</td>
            <td className='col-span-2 text-black dark:text-white'>Away</td>
          </div>
        </thead>
        <tbody className='flex flex-col'>
          {Object.keys(shownData || {}).map((bookId: string, idx: number) => {
            const bookName = mapBookMakers[bookId] || bookId;
            const oddsData = shownData[bookId];
            const { choices } = oddsData[market] || {};
            const [first, second, third] = choices || [];

            return (
              <div key={idx} className='grid grid-cols-11'>
                <div className='col-span-4 flex items-center border border-t-0 border-light-stroke p-2 dark:border-dark-draw'>
                  {bookName}
                </div>
                <div className='col-span-7 flex flex-col border-b border-r border-light-stroke dark:border-dark-draw'>
                  <div className=' grid grid-cols-7 border-l border-[#2196F3]'>
                    <td className='col-span-2 flex h-7 items-center justify-center border-b border-l-0 border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(first?.iv, market, oddsType, 1)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center border-b border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(second?.iv, market, oddsType, 2)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center border-b border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(third?.iv, market, oddsType, 3)}
                    </td>
                  </div>
                  <div className=' grid grid-cols-7 border-l border-[#FFBA5A]'>
                    <td className='col-span-2 flex h-7 items-center justify-center border-b border-l-0 border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(first?.lv, market, oddsType, 1)}
                    </td>
                    <td className=' col-span-2 h-7 border-b border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(second?.lv, market, oddsType, 2)}
                    </td>
                    <td className=' col-span-2 flex h-7 items-center justify-center border-b border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(third?.lv, market, oddsType, 3)}
                    </td>
                    <td
                    // onClick={() => {
                    //   setSelectedBookMaker({
                    //     id: bookId,
                    //     name: bookName,
                    //   });
                    //   setShowDetailModal(true);
                    // }}
                    >
                      &gt;
                    </td>
                  </div>
                  <div className='grid grid-cols-7 border-l border-[#5DB400]'>
                    <td className='col-span-2 flex h-7 items-center justify-center border-l-0 border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(first?.v, market, oddsType, 1)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(second?.v, market, oddsType, 2)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(third?.v, market, oddsType, 3)}
                    </td>
                  </div>
                </div>
              </div>
            );
            // }
            // return (
            //   <TwBodyRow key={idx}>
            //     <TwCell>{bookName}</TwCell>
            //     <td>{convertOdds(first.v, market, oddsType, 1)}</td>
            //     <td>{convertOdds(second.v, market, oddsType, 2)}</td>
            //     <td>{convertOdds(third.v, market, oddsType, 3)}</td>
            //     <td>
            //       <div className='flex h-full w-full items-center px-1'>
            //         <button
            //           onClick={() => {
            //             setSelectedBookMaker({
            //               id: bookId,
            //               name: bookName,
            //             });
            //             setShowDetailModal(true);
            //           }}
            //         >
            //           <HiTrendingUp className='item-hover h-6 w-6 rounded-md border border-gray-light p-1 text-dark-text'></HiTrendingUp>
            //         </button>
            //       </div>
            //     </td>
            //   </TwBodyRow>
            // );
          })}
        </tbody>
      </TwTable>
    </div>
  );
};

const ShowPopularOddsSkeletons = () => {
  return (
    // <div className=' rounded-md bg-white dark:bg-dark-hl-1'>
    //   <TwTable className='w-full border-collapse'>
    //     <thead className='border-common table-border text-center text-sm text-dark-text'>
    //       <TwHeaderRow className='table-border'>
    //         <TwCell className='w-[20%]' rowSpan={2}>
    //           <Skeleton></Skeleton>
    //         </TwCell>
    //         <TwCell className='w-[40%]' colSpan={3}>
    //           First
    //         </TwCell>
    //         <TwCell className='w-[40%]' colSpan={3}>
    //           Live
    //         </TwCell>
    //       </TwHeaderRow>
    //       <TwHeaderRow>
    //         <td className='w-[10%]'>O</td>
    //         <td className='w-[10%]'>T</td>
    //         <td className='w-[10%]'>U</td>
    //         <td className='w-[10%]'>O</td>
    //         <td className='w-[10%]'>T</td>
    //         <td className='w-[10%]'>U</td>
    //       </TwHeaderRow>
    //     </thead>
    //     <tbody>
    //       <TwBodyRow>
    //         <TwCell>Bet365</TwCell>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //       </TwBodyRow>
    //       <TwBodyRow>
    //         <TwCell>Bet365</TwCell>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //       </TwBodyRow>
    //       <TwBodyRow>
    //         <TwCell>Bet365</TwCell>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //       </TwBodyRow>
    //       <TwBodyRow>
    //         <TwCell>Bet365</TwCell>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //         <td>0.95</td>
    //         <td>1</td>
    //         <td>0.82</td>
    //       </TwBodyRow>
    //     </tbody>
    //   </TwTable>
    // </div>
    <div>Loading...</div>
  );
};

const CornerOUOddsSection = ({ matchData }: { matchData: any }) => {
  return (
    <TwQuickViewSection className='p-2.5'>
      <CornerOUOddsFilterSection></CornerOUOddsFilterSection>
      <ShowCornerOUSection matchId={matchData?.id}></ShowCornerOUSection>
    </TwQuickViewSection>
  );
};

const CornerOUOddsFilterSection = () => {
  return (
    <div className=''>
      <TwOddsTitle className=''>Phạt góc T/X</TwOddsTitle>
    </div>
  );
};

const ShowCornerOUSection = ({ matchId }: { matchId: string }) => {
  const {
    market,
    showPrematchCornerOU,
    halfCornerOU,
    setShowDetailModalCornerOU,
    setSelectedBookMaker,
  } = useOddsQvStore();
  const { oddsType } = useOddsStore();

  const { data: shownData } = useMatchCompareMarketsOddsData(
    matchId || '',
    halfCornerOU || 0,
    'cornerTx'
  );

  const { data: bookMakerData } = useBookmakersData();

  const mapBookMakers = useMemo(() => {
    return (
      bookMakerData?.bookmakers?.reduce((acc: any, cur: any) => {
        acc[cur?.id] = cur.name;
        return acc;
      }, {}) || {}
    );
  }, [bookMakerData]);

  return (
    <div className=' mt-4 rounded-md'>
      <TwTable className='w-full border-collapse text-ccsm'>
        <thead className='border-common table-border border border-light-stroke text-center text-sm text-dark-text brightness-150 dark:border-dark-draw'>
          <div className='table-border grid grid-cols-11'>
            <td className='col-span-4'>{/* Company */}</td>
            <td className='light:text-black col-span-2'>Home</td>
            <td className='light:text-black col-span-2'>X</td>
            <td className='light:text-black col-span-2'>Away</td>
          </div>
        </thead>
        {/* {!showPrematchCornerOU && (
          <thead className='border-common table-border text-center text-csm text-dark-text'>
            <TwHeaderRow>
              <td className='w-[25%]'>Company</td>
              <td className='w-[25%]'>O</td>
              <td className='w-[25%]'>T</td>
              <td className='w-[25%]'>U</td>
            </TwHeaderRow>
          </thead>
        )} */}
        <tbody className='flex flex-col'>
          {Object.keys(shownData || {}).map((bookId: string, idx: number) => {
            const bookName = mapBookMakers[bookId] || bookId;
            const oddsData = shownData[bookId];
            const { choices } = oddsData['cornerTx'] || {};
            const [first, second, third] = choices || [];

            return (
              <div key={idx} className='grid grid-cols-11'>
                <div className='col-span-4 flex items-center border border-t-0 border-light-stroke p-2 dark:border-dark-draw'>
                  {bookName}
                </div>
                <div className='col-span-7 flex flex-col border-b border-r border-light-stroke dark:border-dark-draw'>
                  <div className=' grid grid-cols-7 '>
                    <td className='col-span-2 flex h-7 items-center justify-center'>
                      {convertOdds(first?.iv, market, oddsType, 1)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center'>
                      {convertOdds(second?.iv, market, oddsType, 2)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(third?.iv, market, oddsType, 3)}
                    </td>
                  </div>
                  <div className=' grid grid-cols-7'>
                    <td className='col-span-2 flex h-7 items-center justify-center'>
                      {convertOdds(first?.lv, market, oddsType, 1)}
                    </td>
                    <td className='col-span-2 h-7 '>
                      {convertOdds(second?.lv, market, oddsType, 2)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(third?.lv, market, oddsType, 3)}
                    </td>
                    <td
                      onClick={() => {
                        setSelectedBookMaker({
                          id: bookId,
                          name: bookName,
                        });
                        setShowDetailModalCornerOU(true);
                      }}
                    >
                      &gt;
                    </td>
                  </div>
                  <div className='grid grid-cols-7 '>
                    <td className='col-span-2 flex h-7 items-center justify-center'>
                      {convertOdds(first?.v, market, oddsType, 1)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center'>
                      {convertOdds(second?.v, market, oddsType, 2)}
                    </td>
                    <td className='col-span-2 flex h-7 items-center justify-center border-r border-light-stroke dark:border-dark-draw'>
                      {convertOdds(third?.v, market, oddsType, 3)}
                    </td>
                  </div>
                </div>
              </div>
            );
          })}
        </tbody>
      </TwTable>
    </div>
  );
};

const ShowCornerOUSectionSkeletons = () => {
  return (
    <div className=' rounded-md'>
      <TwTable className='w-full border-collapse'>
        <thead className='border-common table-border text-center text-sm text-dark-text'>
          <TwHeaderRow className='table-border'>
            <TwCell className='w-[20%]' rowSpan={2}>
              Company
            </TwCell>
            <TwCell className='w-[40%]' colSpan={3}>
              First
            </TwCell>
            <TwCell className='w-[40%]' colSpan={3}>
              Live
            </TwCell>
          </TwHeaderRow>
          <TwHeaderRow>
            <td className='w-[10%]'>O</td>
            <td className='w-[10%]'>T</td>
            <td className='w-[10%]'>U</td>
            <td className='w-[10%]'>O</td>
            <td className='w-[10%]'>T</td>
            <td className='w-[10%]'>U</td>
          </TwHeaderRow>
        </thead>
        <tbody>
          <TwBodyRow>
            <TwCell>Bet365</TwCell>
            <td>0.95</td>
            <td>1</td>
            <td>0.82</td>
            <td>0.95</td>
            <td>1</td>
            <td>0.82</td>
          </TwBodyRow>
          <TwBodyRow>
            <TwCell>Bet365</TwCell>
            <td>0.95</td>
            <td>1</td>
            <td>0.82</td>
            <td>0.95</td>
            <td>1</td>
            <td>0.82</td>
          </TwBodyRow>
        </tbody>
      </TwTable>
    </div>
  );
};

const ValueSwitcher = ({
  options,
  valGetter,
}: {
  options: any[];
  valGetter: (x: any) => void;
}) => {
  const [choice, setChoice] = useState<number>(options[0].value);

  useEffect(() => {
    valGetter(choice);
  }, [choice, valGetter]);

  return (
    <div className='flex items-center'>
      <button
        className='item-hover w-1/2 rounded-s-lg px-3 py-1 text-sm '
        onClick={() => setChoice(options[0].value)}
        css={[
          choice === options[0].value && tw`bg-logo-blue text-white`,
          choice === options[1].value && tw`bg-light-match dark:bg-dark-match`,
        ]}
      >
        {options[0].name}
      </button>
      <button
        className='item-hover w-1/2 rounded-e-lg px-3 py-1 text-sm '
        onClick={() => setChoice(options[1].value)}
        css={[
          choice === options[1].value && tw`bg-logo-blue text-white`,
          choice === options[0].value && tw`bg-light-match dark:bg-dark-match`,
        ]}
      >
        {options[1].name}
      </button>
    </div>
  );
};

const CorrectScoreSection = ({ matchData }: { matchData: any }) => {
  return (
    <TwQuickViewSection className='p-2.5'>
      <CorrectScoreFilterSection></CorrectScoreFilterSection>
      <ShowCorrectScoreSection
        matchId={matchData?.id}
      ></ShowCorrectScoreSection>
    </TwQuickViewSection>
  );
};

const ShowScoreDetailModal = () => {
  const { setShowDetailModalScore } = useOddsQvStore();

  return (
    <div className='flex cursor-pointer place-content-center items-center pt-1.5 text-center text-sm text-logo-blue underline'>
      <button
        onClick={() => {
          setShowDetailModalScore(true);
        }}
      >
        More
      </button>
    </div>
  );
};

const CorrectScoreFilterSection = () => {
  const { correctScoreBookMaker, setCorrectScoreBookMaker } = useOddsQvStore();

  return (
    <div className=''>
      <TwOddsTitle className=''>Tỷ số</TwOddsTitle>
      <div className='text-center text-sm '>
        <div className=' mb-2 flex gap-2 py-2 text-center'>
          <div className=' border-common flex w-8/12 rounded-md dark:bg-dark-hl-1'>
            <div
              className=' w-1/2 cursor-pointer rounded-s-md  py-1  '
              css={[
                `${correctScoreBookMaker}` === '31' &&
                  tw`bg-logo-blue text-white`,
                `${correctScoreBookMaker}` !== '31' &&
                  tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
              ]}
              onClick={() => setCorrectScoreBookMaker(31)}
            >
              Sbobet
            </div>
            <div
              className=' flex-1 cursor-pointer rounded-e-md py-1'
              css={[
                `${correctScoreBookMaker}` === '49' &&
                  tw`bg-logo-blue text-white`,
                `${correctScoreBookMaker}` !== '49' &&
                  tw`bg-white dark:bg-dark-hl-1 shadow-sm`,
              ]}
              onClick={() => setCorrectScoreBookMaker(49)}
            >
              Bwin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowCorrectScoreSection = ({ matchId }: { matchId: string }) => {
  const { halfScore, correctScoreBookMaker } = useOddsQvStore();
  const { data, isFetching } = useMatchCompareMarketsOddsData(
    matchId || '',
    halfScore || 0,
    'score'
  );

  if (isFetching) {
    return (
      <ShowCorrectScoreSectionSkeletons></ShowCorrectScoreSectionSkeletons>
    );
  }

  const isEmpty = isValEmpty(data);
  const shownData = data ? data[correctScoreBookMaker] : {};
  const odds = shownData?.odds || {};

  return (
    <div className=''>
      <table className='w-full border-collapse rounded-md text-center'>
        <ScoreOddsHeader></ScoreOddsHeader>
        <tbody className='text-csm'>
          <ScoreOddsRow odds={odds}></ScoreOddsRow>
        </tbody>
      </table>
      <table className='w-full border-collapse rounded-md text-center'>
        <ScoreOddsHeaderDraw></ScoreOddsHeaderDraw>
        <tbody className='text-csm'>
          <ScoreOddsRowDraw odds={odds}></ScoreOddsRowDraw>
        </tbody>
      </table>
      {!isEmpty && <ShowScoreDetailModal></ShowScoreDetailModal>}
    </div>
  );
};

const ShowCorrectScoreSectionSkeletons = () => {
  return (
    <div className=''>
      <TwTable className='w-full border-collapse rounded-md '>
        <ScoreOddsHeader></ScoreOddsHeader>
        <tbody>
          <tr className='h-10'>
            <TwCell className='w-[10%]'>Home</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
          </tr>
          <tr className='h-10'>
            <TwCell className='w-[10%]'>Away</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
          </tr>
        </tbody>
      </TwTable>
      <TwTable className='w-full border-collapse rounded-md'>
        <ScoreOddsHeaderDraw></ScoreOddsHeaderDraw>
        <tbody>
          <tr className='h-10'>
            <TwCell className='w-[10%]'>Draw</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
            <TwCell className='w-[9%]'>-</TwCell>
          </tr>
        </tbody>
      </TwTable>
    </div>
  );
};

const TwCell = tw.td`border border-light-stroke dark:border-dark-draw`;
const TwBodyRow = tw.tr`h-9 border border-light-stroke dark:border-dark-draw`;
const TwHeaderRow = tw.tr`h-7 text-light-black dark:text-dark-default border border-light-stroke dark:border-dark-draw brightness-150`;
const TwTable = tw.table`border-collapse text-center text-sm`;
const TwBodySingleRow = tw.tr`h-9`;
const TwOddsTitle = tw.h5`font-bold text-sm capitalize not-italic leading-5 text-logo-blue `;

const ScoreOddsRow = ({ odds }: { odds: any }) => {
  return (
    <>
      <TwBodySingleRow className=''>
        <TwCell className='w-[10%] text-logo-blue'>Home</TwCell>
        <TwCell className='w-[9%]'>{odds.h1}</TwCell>
        <TwCell className='w-[9%]'>{odds.h2}</TwCell>
        <TwCell className='w-[9%]'>{odds.h3}</TwCell>
        <TwCell className='w-[9%]'>{odds.h4}</TwCell>
        <TwCell className='w-[9%]'>{odds.h5}</TwCell>
        <TwCell className='w-[9%]'>{odds.h6}</TwCell>
        <TwCell className='w-[9%]'>{odds.h7}</TwCell>
        <TwCell className='w-[9%]'>{odds.h8}</TwCell>
        <TwCell className='w-[9%]'>{odds.h9}</TwCell>
        <TwCell className='w-[9%]'>{odds.h10}</TwCell>
      </TwBodySingleRow>
      <TwBodySingleRow className=''>
        <TwCell className='w-[10%] text-logo-yellow'>Away</TwCell>
        <TwCell className='w-[9%]'>{odds.a1}</TwCell>
        <TwCell className='w-[9%]'>{odds.a2}</TwCell>
        <TwCell className='w-[9%]'>{odds.a3}</TwCell>
        <TwCell className='w-[9%]'>{odds.a4}</TwCell>
        <TwCell className='w-[9%]'>{odds.a5}</TwCell>
        <TwCell className='w-[9%]'>{odds.a6}</TwCell>
        <TwCell className='w-[9%]'>{odds.a7}</TwCell>
        <TwCell className='w-[9%]'>{odds.a8}</TwCell>
        <TwCell className='w-[9%]'>{odds.a9}</TwCell>
        <TwCell className='w-[9%]'>{odds.a10}</TwCell>
      </TwBodySingleRow>
    </>
  );
};

const ScoreOddsRowDraw = ({ odds }: { odds: any }) => {
  return (
    <>
      <TwBodySingleRow className=''>
        <TwCell className='w-[10%] text-dark-text'>Draw</TwCell>
        <TwCell className=' w-[9%]'>{odds.d1}</TwCell>
        <TwCell className=' w-[9%]'>{odds.d2}</TwCell>
        <TwCell className=' w-[9%]'>{odds.d3}</TwCell>
        <TwCell className=' w-[9%]'>{odds.d4}</TwCell>
        <TwCell className=' w-[9%]'>{odds.d5}</TwCell>
        <TwCell className=' w-[18%]' colSpan={2}>
          {odds.o}
        </TwCell>
        <TwCell className=' w-[9%]'></TwCell>
        <TwCell className=' w-[9%]'></TwCell>
        <TwCell className=' w-[9%]'></TwCell>
      </TwBodySingleRow>
    </>
  );
};

const ScoreOddsHeader = () => {
  return (
    <thead className='text-csm font-bold text-black dark:text-dark-default'>
      <TwHeaderRow className='h-10 bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[10%]'></TwCell>
        <TwCell className='w-[9%]'>1:0</TwCell>
        <TwCell className='w-[9%]'>2:0</TwCell>
        <TwCell className='w-[9%]'>2:1</TwCell>
        <TwCell className='w-[9%]'>3:0</TwCell>
        <TwCell className='w-[9%]'>3:1</TwCell>
        <TwCell className='w-[9%]'>3:2</TwCell>
        <TwCell className='w-[9%]'>4:0</TwCell>
        <TwCell className='w-[9%]'>4:1</TwCell>
        <TwCell className='w-[9%]'>4:2</TwCell>
        <TwCell className='w-[9%]'>4:3</TwCell>
      </TwHeaderRow>
    </thead>
  );
};

const ScoreOddsHeaderDraw = () => {
  return (
    <thead className='text-csm font-bold text-black dark:text-dark-default '>
      <TwHeaderRow className='h-10 bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[10%]'></TwCell>
        <TwCell className='w-[9%]'>0:0</TwCell>
        <TwCell className='w-[9%]'>1:1</TwCell>
        <TwCell className='w-[9%]'>2:2</TwCell>
        <TwCell className='w-[9%]'>3:3</TwCell>
        <TwCell className='w-[9%]'>4:4</TwCell>
        <TwCell className='w-[18%] ' colSpan={2}>
          Other
        </TwCell>
        <TwCell className='w-[9%]'></TwCell>
        <TwCell className='w-[9%]'></TwCell>
        <TwCell className='w-[9%]'></TwCell>
      </TwHeaderRow>
    </thead>
  );
};
