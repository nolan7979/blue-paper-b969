import { useMemo, useState } from 'react';
import { HiTrendingUp } from 'react-icons/hi';
import tw from 'twin.macro';

import { useBookmakersData } from '@/hooks/useFootball/useOddsData';

import OddsChangesModal from '@/components/modules/football/odds/OddsChangeModal';
import {
  TwBodySingleRow,
  TwCell,
  TwHeaderRow,
  TWTable,
} from '@/components/modules/football/odds/shared-components';

import { useOddsDetailsStore, useOddsStore } from '@/stores';

export const LiveOddsCompareTableReprScore = ({
  matchId,
  half = 0,
}: {
  matchId: string;
  half: number;
}) => {
  const [openChangesModal, setOpenChangesModal] = useState<boolean>(false);
  const [bookMaker, setBookMaker] = useState<any>(null);

  const { oddsType } = useOddsStore();
  const { oddsScoreCompareData, oddsScoreCompareDataHT } =
    useOddsDetailsStore();
  const { data: bookMakerData, isFetching } = useBookmakersData();

  const mapBookMakers = useMemo(() => {
    return (
      bookMakerData?.bookmakers?.reduce((acc: any, cur: any) => {
        acc[cur?.id] = cur.name;
        return acc;
      }, {}) || {}
    );
  }, [bookMakerData]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  const shownData = half === 0 ? oddsScoreCompareData : oddsScoreCompareDataHT;

  return (
    <>
      <TWTable
        width='100%'
        cellPadding={0}
        cellSpacing={0}
        className='border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text '
      >
        <ScoreOddsHeader></ScoreOddsHeader>
        <tbody className=''>
          {Object.keys(shownData || {}).map((bookId: string, idx: number) => {
            const bookName = mapBookMakers[bookId] || bookId;
            return (
              <ScoreOddsRow
                key={bookId}
                bookId={bookId}
                bookName={bookName}
                oddsType={oddsType}
                setOpenChangesModal={setOpenChangesModal}
                setBookMaker={setBookMaker}
                idx={idx}
                half={half}
              ></ScoreOddsRow>
            );
          })}
        </tbody>
      </TWTable>

      <OddsChangesModal
        open={openChangesModal}
        setOpen={setOpenChangesModal}
        bookMaker={bookMaker}
        matchId={matchId}
        half={half}
      ></OddsChangesModal>
    </>
  );
};

const ScoreOddsRow = ({
  bookId,
  bookName,
  oddsType,
  setOpenChangesModal,
  setBookMaker,
  idx,
  half = 0,
}: {
  bookId: string;
  bookName: string;
  oddsType: string;
  setOpenChangesModal: (x: boolean) => void;
  setBookMaker: (x: any) => void;
  idx: number;
  half: number;
}) => {
  const { oddsScoreCompareData, oddsScoreCompareDataHT } =
    useOddsDetailsStore();
  const bookData =
    (half === 0
      ? oddsScoreCompareData[bookId]
      : oddsScoreCompareDataHT[bookId]) || {};
  // const { odds } = bookData || {};
  const odds = bookData.odds || {};

  return (
    <>
      <TwBodySingleRow
        className=''
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <td className='table-border ' rowSpan={2}>
          <div className=' text-center font-bold text-black dark:text-dark-default'>
            {bookName}
          </div>
        </td>
        <TwCell className='w-[5%] text-logo-blue'>Home</TwCell>
        <td className='w-[5%]'>{odds.h1}</td>
        <td className='w-[5%]'>{odds.h2}</td>
        <td className='w-[5%]'>{odds.h3}</td>
        <td className='w-[5%]'>{odds.h4}</td>
        <td className='w-[5%]'>{odds.h5}</td>
        <td className='w-[5%]'>{odds.h6}</td>
        <td className='w-[5%]'>{odds.h7}</td>
        <td className='w-[5%]'>{odds.h8}</td>
        <td className='w-[5%]'>{odds.h9}</td>
        <td className='w-[5%]'>{odds.h10}</td>

        <td className=' w-[5%]' rowSpan={2}>
          {odds.d1}
        </td>
        <td className=' w-[5%]' rowSpan={2}>
          {odds.d2}
        </td>
        <td className=' w-[5%]' rowSpan={2}>
          {odds.d3}
        </td>
        <td className=' w-[5%]' rowSpan={2}>
          {odds.d4}
        </td>
        <td className=' w-[5%]' rowSpan={2}>
          {odds.d5}
        </td>
        <td className=' w-[5%]' rowSpan={2}>
          {odds.o}
        </td>

        <td className='table-border' rowSpan={2}>
          <div className='flex cursor-pointer place-content-center text-center'>
            <button
              onClick={() => {
                setBookMaker({
                  id: bookId,
                  name: bookName,
                });
                setOpenChangesModal(true);
              }}
            >
              <HiTrendingUp className='item-hover h-7 w-7 rounded-md border border-gray-light p-1 text-dark-text'></HiTrendingUp>
            </button>
          </div>
        </td>
      </TwBodySingleRow>
      <TwBodySingleRow
        className=''
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='w-[5%] text-logo-yellow'>Away</TwCell>
        <td className='w-[5%]'>{odds.a1}</td>
        <td className='w-[5%]'>{odds.a2}</td>
        <td className='w-[5%]'>{odds.a3}</td>
        <td className='w-[5%]'>{odds.a4}</td>
        <td className='w-[5%]'>{odds.a5}</td>
        <td className='w-[5%]'>{odds.a6}</td>
        <td className='w-[5%]'>{odds.a7}</td>
        <td className='w-[5%]'>{odds.a8}</td>
        <td className='w-[5%]'>{odds.a9}</td>
        <td className='w-[5%]'>{odds.a10}</td>
        {/* <td className='w-[5%]'>1:0</td>
        <td className='w-[5%]'>2:0</td>
        <td className='w-[5%]'>2:1</td>
        <td className='w-[5%]'>3:0</td>
        <td className='w-[5%]'>3:1</td>
        <td className='w-[5%]'>3:2</td>
        <td className='w-[5%]'>4:0</td>
        <td className='w-[5%]'>4:1</td>
        <td className='w-[5%]'>4:2</td>
        <td className='w-[5%]'>4:3</td> */}
      </TwBodySingleRow>
    </>
  );
};

const ScoreOddsHeader = () => {
  return (
    <thead className='font-bold text-black dark:text-dark-default '>
      <TwHeaderRow className='h-10 bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[15%]' rowSpan={2} colSpan={2}>
          <b>Nhà cái</b>
        </TwCell>
        <TwCell className='w-[5%]'>1:0</TwCell>
        <TwCell className='w-[5%]'>2:0</TwCell>
        <TwCell className='w-[5%]'>2:1</TwCell>
        <TwCell className='w-[5%]'>3:0</TwCell>
        <TwCell className='w-[5%]'>3:1</TwCell>
        <TwCell className='w-[5%]'>3:2</TwCell>
        <TwCell className='w-[5%]'>4:0</TwCell>
        <TwCell className='w-[5%]'>4:1</TwCell>
        <TwCell className='w-[5%]'>4:2</TwCell>
        <TwCell className='w-[5%]'>4:3</TwCell>
        <TwCell className='w-[5%]'>0:0</TwCell>
        <TwCell className='w-[5%]'>1:1</TwCell>
        <TwCell className='w-[5%]'>2:2</TwCell>
        <TwCell className='w-[5%]'>3:3</TwCell>
        <TwCell className='w-[5%]'>4:4</TwCell>
        <TwCell className='w-[5%]'>Other</TwCell>
        <TwCell className='w-[5%]'>Changes</TwCell>
      </TwHeaderRow>
    </thead>
  );
};
