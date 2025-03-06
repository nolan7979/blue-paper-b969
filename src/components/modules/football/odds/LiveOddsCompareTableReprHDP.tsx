import { useMemo, useState } from 'react';
import { HiTrendingUp } from 'react-icons/hi';
import tw from 'twin.macro';

import { useBookmakersData } from '@/hooks/useFootball/useOddsData';

import OddsChangesModal from '@/components/modules/football/odds/OddsChangeModal';
import {
  EarlyOddsCells,
  LiveOddsCells,
  RunOddsCells,
  TwBodySingleRow,
  TwCell,
  TwHeaderRow,
  TWTable,
} from '@/components/modules/football/odds/shared-components';

import { useOddsDetailsStore, useOddsStore } from '@/stores';

export const LiveOddsCompareTableReprHDP = ({
  matchId,
  half = 0,
}: {
  matchId: string;
  half: number;
}) => {
  const [openChangesModal, setOpenChangesModal] = useState<boolean>(false);
  const [bookMaker, setBookMaker] = useState<any>(null);

  const { oddsType } = useOddsStore();
  // const { oddsDetailsData } = useOddsDetailsStore();
  const { oddsHdpCompareData, oddsHdpCompareDataHT } = useOddsDetailsStore();
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

  const shownData = half === 0 ? oddsHdpCompareData : oddsHdpCompareDataHT;

  return (
    <>
      <TWTable
        width='100%'
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className='border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text '
      >
        <OddsDetailHeader></OddsDetailHeader>
        <tbody className=''>
          {Object.keys(shownData || {}).map((bookId: string, idx: number) => {
            const bookName = mapBookMakers[bookId] || bookId;
            return (
              <OddsDetailRowHDP
                key={bookId}
                bookId={bookId}
                bookName={bookName}
                oddsType={oddsType}
                setOpenChangesModal={setOpenChangesModal}
                setBookMaker={setBookMaker}
                idx={idx}
                half={half}
              ></OddsDetailRowHDP>
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

const OddsDetailRowHDP = ({
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
  const { oddsHdpCompareData, oddsHdpCompareDataHT } = useOddsDetailsStore();
  const bookData =
    (half === 0 ? oddsHdpCompareData[bookId] : oddsHdpCompareDataHT[bookId]) ||
    {};
  const { hdp } = bookData || {};

  return (
    <>
      <TwBodySingleRow
        className=''
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='border ' rowSpan={1}>
          <div className=' text-center font-bold text-black dark:text-dark-default'>
            {bookName}
          </div>
        </TwCell>

        <EarlyOddsCells
          marketData={hdp}
          oddsType={oddsType}
          market='hdp'
        ></EarlyOddsCells>
        <LiveOddsCells
          marketData={hdp}
          oddsType={oddsType}
          market='hdp'
        ></LiveOddsCells>
        <RunOddsCells
          marketData={hdp}
          oddsType={oddsType}
          market='hdp'
        ></RunOddsCells>

        {/* <TwCell className='border' rowSpan={1}>
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
        </TwCell>
        <TwCell rowSpan={1} style={{ cursor: 'pointer' }}>
          <div className='flex cursor-pointer place-content-center '>
            TBD
          </div>
        </TwCell> */}
      </TwBodySingleRow>
    </>
  );
};

const OddsDetailHeader = () => {
  return (
    <thead className='border font-bold text-black dark:text-dark-default '>
      <TwHeaderRow className='h-10 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[15%] border' rowSpan={2}>
          <b>Nhà cái</b>
        </TwCell>
        {/* <TwCell className='w-8 border' rowSpan={2} /> */}
        <TwCell className='border' colSpan={3}>
          <b>Sớm</b>
        </TwCell>
        <TwCell className='border' colSpan={3}>
          <b>Live</b>
        </TwCell>
        <TwCell className='border' colSpan={3}>
          <b>Run</b>
        </TwCell>
        {/* <TwCell className='w-4 border' rowSpan={2}>
          <b>Thay đổi</b>
        </TwCell>
        <TwCell rowSpan={2} className='w-6 cursor-pointer'>
          TBD
        </TwCell> */}
      </TwHeaderRow>
      <TwHeaderRow className='h-8 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[8%] border'>Chủ</TwCell>
        <TwCell className='w-[8%] border'>HDP</TwCell>
        <TwCell className='w-[8%] border'>Khách</TwCell>
        <TwCell className='w-[8%] border'>Chủ</TwCell>
        <TwCell className='w-[8%] border'>HDP</TwCell>
        <TwCell className='w-[8%] border'>Khách</TwCell>
        <TwCell className='w-[8%] border'>Chủ</TwCell>
        <TwCell className='w-[8%] border'>Hòa</TwCell>
        <TwCell className='w-[8%] border'>Khách</TwCell>
      </TwHeaderRow>
    </thead>
  );
};
