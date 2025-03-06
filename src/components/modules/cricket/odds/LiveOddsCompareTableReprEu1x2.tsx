import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiTrendingUp } from 'react-icons/hi';
import tw from 'twin.macro';

import { useAllBookmakersData } from '@/hooks/useFootball/useOddsData';

import SingleSelect from '@/components/common/selects/SingleSelect';
import Eu1x2BookFilter from '@/components/modules/football/odds/Eu1x2BookFilter';
import OddsChangesModal from '@/components/modules/football/odds/OddsChangeModal';
import {
  TwCell,
  TwHeaderRow,
  TWTable,
} from '@/components/modules/football/odds/shared-components';
import { TwFilterDiv } from '@/components/modules/football/tw-components';

import {
  useOddsDetailsStore,
  useOddsEu1x2FilterStore,
  useOddsStore,
} from '@/stores';

import { convertOdds, isValEmpty, numerizeObj, roundNum } from '@/utils';

// import OddDownSVG from '/public/svg/odd-down.svg';
// import OddUpSVG from '/public/svg/odd-up.svg';
import OddDownSVG from '/public/svg/odd-down.svg';
import OddUpSVG from '/public/svg/odd-up.svg';

export const LiveOddsCompareTableReprEu1x2 = ({
  matchId,
  half = 0,
}: {
  matchId: string;
  half?: number;
}) => {
  const [openChangesModal, setOpenChangesModal] = useState<boolean>(false);
  const [bookMaker, setBookMaker] = useState<any>(null);

  const { oddsType } = useOddsStore();
  const { oddsEu1x2CompareData, oddsEu1x2ChangeDataKelly } =
    useOddsDetailsStore();

  const { sortBy, eu1x2OddsType } = useOddsEu1x2FilterStore();

  const {
    showFilter,
    inputValues,
    applyFilter,
    selectedBookMakers,
    bookMakerType,
  } = useOddsEu1x2FilterStore();
  const { data: bookMakerData, isFetching } = useAllBookmakersData();

  const mapBookMakers = useMemo(() => {
    return (
      bookMakerData?.bookmakers?.reduce((acc: any, cur: any) => {
        acc[cur?.id] = cur;
        return acc;
      }, {}) || {}
    );
  }, [bookMakerData]);

  const sortedShownData = useMemo(() => {
    const entries = Object.entries(oddsEu1x2CompareData);
    const sortedEntries = entries.sort((e1: any, e2: any) => {
      const [bookId1, book1Data] = e1;
      const [bookId2, book2Data] = e2;
      const [ih1, id1, ia1, lh1, ld1, la1, ct1] = book1Data.split(',');
      const [ih2, id2, ia2, lh2, ld2, la2, ct2] = book2Data.split(',');
      const iH1Wrate = 100 / (1 + ih1 / (id1 || 1) + ih1 / (ia1 || 1));
      const iD1Wrate = 100 / (1 + id1 / (ih1 || 1) + id1 / (ia1 || 1));
      const iA1Wrate = 100 / (1 + ia1 / (ih1 || 1) + ia1 / (id1 || 1));
      const iH2Wrate = 100 / (1 + ih2 / (id2 || 1) + ih2 / (ia2 || 1));
      const iD2Wrate = 100 / (1 + id2 / (ih2 || 1) + id2 / (ia2 || 1));
      const iA2Wrate = 100 / (1 + ia2 / (ih2 || 1) + ia2 / (id2 || 1));
      const iH1ReturnRate = roundNum(iH1Wrate * ih1, 2);
      const iH2ReturnRate = roundNum(iH2Wrate * ih2, 2);

      const lh1Wrate = 100 / (1 + lh1 / (ld1 || 1) + lh1 / (la1 || 1));
      const ld1Wrate = 100 / (1 + ld1 / (lh1 || 1) + ld1 / (la1 || 1));
      const la1Wrate = 100 / (1 + la1 / (lh1 || 1) + la1 / (ld1 || 1));
      const lh2Wrate = 100 / (1 + lh2 / (ld2 || 1) + lh2 / (la2 || 1));
      const ld2Wrate = 100 / (1 + ld2 / (lh2 || 1) + ld2 / (la2 || 1));
      const la2Wrate = 100 / (1 + la2 / (lh2 || 1) + la2 / (ld2 || 1));
      const lh1ReturnRate = roundNum(lh1Wrate * lh1, 2);
      const lh2ReturnRate = roundNum(lh2Wrate * lh2, 2);

      if (eu1x2OddsType === 'early') {
        if (sortBy === 1) return ih1 - ih2;
        if (sortBy === -1) return ih2 - ih1;
        if (sortBy === 2) return id1 - id2;
        if (sortBy === -2) return id2 - id1;
        if (sortBy === 3) return ia1 - ia2;
        if (sortBy === -3) return ia2 - ia1;
        if (sortBy === 4) return iH1Wrate - iH2Wrate;
        if (sortBy === -4) return iH2Wrate - iH1Wrate;
        if (sortBy === 5) return iD1Wrate - iD2Wrate;
        if (sortBy === -5) return iD2Wrate - iD1Wrate;
        if (sortBy === 6) return iA1Wrate - iA2Wrate;
        if (sortBy === -6) return iA2Wrate - iA1Wrate;
        if (sortBy === 7) return iH1ReturnRate - iH2ReturnRate;
        if (sortBy === -7) return iH2ReturnRate - iH1ReturnRate;
      } else {
        if (sortBy === 1) return lh1 - lh2;
        if (sortBy === -1) return lh2 - lh1;
        if (sortBy === 2) return ld1 - ld2;
        if (sortBy === -2) return ld2 - ld1;
        if (sortBy === 3) return la1 - la2;
        if (sortBy === -3) return la2 - la1;
        if (sortBy === 4) return lh1Wrate - lh2Wrate;
        if (sortBy === -4) return lh2Wrate - lh1Wrate;
        if (sortBy === 5) return ld1Wrate - ld2Wrate;
        if (sortBy === -5) return ld2Wrate - ld1Wrate;
        if (sortBy === 6) return la1Wrate - la2Wrate;
        if (sortBy === -6) return la2Wrate - la1Wrate;
        if (sortBy === 7) return lh1ReturnRate - lh2ReturnRate;
        if (sortBy === -7) return lh2ReturnRate - lh1ReturnRate;
      }

      return 1;
    });

    return sortedEntries.map((e: any) => {
      return e[0];
    });
  }, [oddsEu1x2CompareData, sortBy, eu1x2OddsType]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <OddsEu1x2Filters></OddsEu1x2Filters>

      <TWTable
        width='100%'
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className='border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text '
      >
        <OddsDetailHeader></OddsDetailHeader>
        <AdvancedFilter></AdvancedFilter>

        <tbody className=''>
          {sortedShownData.map((bookId: string, idx: number) => {
            if (
              !isValEmpty(selectedBookMakers) &&
              !selectedBookMakers[bookId]
            ) {
              return <></>;
            }
            const book = mapBookMakers[bookId] || bookId;

            // bookmaker type
            if (bookMakerType === 'hot' && !book.primary) return <></>;
            if (bookMakerType === 'other' && book.primary) return <></>;

            const kellyScores = oddsEu1x2ChangeDataKelly[bookId] || [];
            const last = kellyScores[0] || {};

            // filter by values
            if (showFilter && applyFilter) {
              const {
                h,
                d,
                a,
                hWrate,
                dWrate,
                aWrate,
                hReturnRate,
                hKelly,
                dKelly,
                aKelly,
              } = last;
              const {
                min_home,
                min_draw,
                min_away,
                min_hwrate,
                min_dwrate,
                min_awrate,
                min_return,
                min_hkelly,
                min_dkelly,
                min_akelly,
                max_home,
                max_draw,
                max_away,
                max_hwrate,
                max_dwrate,
                max_awrate,
                max_return,
                max_hkelly,
                max_dkelly,
                max_akelly,
              } = inputValues || {};

              if ((min_home && h < min_home) || (max_home && h > max_home))
                return <></>;
              if ((min_draw && d < min_draw) || (max_draw && d > max_draw))
                return <></>;
              if ((min_away && a < min_away) || (max_away && a > max_away))
                return <></>;
              if (
                (min_hwrate && hWrate < min_hwrate) ||
                (max_hwrate && hWrate > max_hwrate)
              )
                return <></>;
              if (
                (min_dwrate && dWrate < min_dwrate) ||
                (max_dwrate && dWrate > max_dwrate)
              )
                return <></>;
              if (
                (min_awrate && aWrate < min_awrate) ||
                (max_awrate && aWrate > max_awrate)
              )
                return <></>;
              if (
                (min_return && hReturnRate < min_return) ||
                (max_return && hReturnRate > max_return)
              )
                return <></>;
              if (
                (min_hkelly && hKelly < min_hkelly) ||
                (max_hkelly && hKelly > max_hkelly)
              )
                return <></>;
              if (
                (min_dkelly && dKelly < min_dkelly) ||
                (max_dkelly && dKelly > max_dkelly)
              )
                return <></>;
              if (
                (min_akelly && aKelly < min_akelly) ||
                (max_akelly && aKelly > max_akelly)
              )
                return <></>;
            }

            return (
              <OddsDetailRowEu1x2
                key={bookId}
                bookId={bookId}
                bookName={book?.name}
                oddsType={oddsType}
                setOpenChangesModal={setOpenChangesModal}
                setBookMaker={setBookMaker}
                idx={idx}
                half={half}
              ></OddsDetailRowEu1x2>
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

export const Eu1x2OddsChangesStats = () => {
  const { oddsStats: os } = useOddsDetailsStore();
  const { oddsType } = useOddsStore();

  return (
    <>
      <TWTable
        width='100%'
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className='sticky bottom-0 border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text'
      >
        <OddsStatsHeader></OddsStatsHeader>
        <tbody className=''>
          <OddsStatsRow
            label1='The highest first odds'
            label2='The highest odds'
            oddsType={oddsType}
            h={os.maxH}
            d={os.maxD}
            a={os.maxA}
            hWrate={os.maxHWrate}
            dWrate={os.maxDWrate}
            aWrate={os.maxAWrate}
            hReturnRate={os.maxHReturnRate}
            hKelly={os.maxHKelly}
            dKelly={os.maxDKelly}
            aKelly={os.maxAKelly}
            fH={os.fMaxH}
            fD={os.fMaxD}
            fA={os.fMaxA}
            fHWrate={os.fMaxHWrate}
            fDWrate={os.fMaxDWrate}
            fAWrate={os.fMaxAWrate}
            fHReturnRate={os.fMaxHReturnRate}
          ></OddsStatsRow>

          <OddsStatsRow
            label1='The lowest first odds'
            label2='The lowest odds'
            oddsType={oddsType}
            h={os.minH}
            d={os.minD}
            a={os.minA}
            hWrate={os.minHWrate}
            dWrate={os.minDWrate}
            aWrate={os.minAWrate}
            hReturnRate={os.minHReturnRate}
            hKelly={os.minHKelly}
            dKelly={os.minDKelly}
            aKelly={os.minAKelly}
            fH={os.fMinH}
            fD={os.fMinD}
            fA={os.fMinA}
            fHWrate={os.fMinHWrate}
            fDWrate={os.fMinDWrate}
            fAWrate={os.fMinAWrate}
            fHReturnRate={os.fMinHReturnRate}
          ></OddsStatsRow>

          <OddsStatsRow
            label1='The average first odds'
            label2='The average odds'
            oddsType={oddsType}
            h={os.avgH}
            d={os.avgD}
            a={os.avgA}
            hWrate={os.avgHWrate}
            dWrate={os.avgDWrate}
            aWrate={os.avgAWrate}
            hReturnRate={os.avgHReturnRate}
            hKelly={os.avgHKelly}
            dKelly={os.avgDKelly}
            aKelly={os.avgAKelly}
            fH={os.fAvgH}
            fD={os.fAvgD}
            fA={os.fAvgA}
            fHWrate={os.fAvgHWrate}
            fDWrate={os.fAvgDWrate}
            fAWrate={os.fAvgAWrate}
            fHReturnRate={os.fAvgHReturnRate}
          ></OddsStatsRow>
        </tbody>
      </TWTable>
    </>
  );
};

const OddsEu1x2Filters = () => {
  const { showFilter, setShowFilter, setEu1x2OddsType, setBookMakerType } =
    useOddsEu1x2FilterStore();

  return (
    <div className=''>
      <div className='flex place-content-center items-center gap-3'>
        <Eu1x2BookFilter></Eu1x2BookFilter>
        <TwFilterDiv>
          <SingleSelect
            callback={setBookMakerType}
            options={[
              {
                id: 1,
                value: 'all',
                name: 'Tất cả nhà cái',
              },
              {
                id: 2,
                value: 'hot',
                name: 'Nhà cái hot',
              },
              {
                id: 3,
                value: 'other',
                name: 'Nhà cái khác',
              },
            ]}
            showCheck={false}
          ></SingleSelect>
        </TwFilterDiv>

        <TwFilterDiv className='w-32'>
          <SingleSelect
            callback={setEu1x2OddsType}
            options={[
              {
                id: 1,
                value: 'all',
                name: 'Tất cả odds',
              },
              {
                id: 2,
                value: 'live',
                name: 'Live',
              },
              {
                id: 3,
                value: 'early',
                name: 'Sớm',
              },
            ]}
            showCheck={false}
          ></SingleSelect>
        </TwFilterDiv>

        <TwFilterDiv
          isActive={showFilter}
          onClick={() => setShowFilter(!showFilter)}
        >
          Lọc theo giá trị
        </TwFilterDiv>
      </div>
    </div>
  );
};

const TwInput = tw.input`cursor-text truncate border border-gray-light placeholder:text-light-default bg-transparent rounded-md text-light-default dark:text-dark-default px-1 py-0.5 focus:border-none focus:ring-0 text-csm font-normal leading-normal`;

const AdvancedFilter = () => {
  const {
    showFilter,
    setShowFilter,
    inputValues,
    setInputValues,
    applyFilter,
    setApplyFilter,
  } = useOddsEu1x2FilterStore();
  const { register, handleSubmit, control, setValue, reset } = useForm();

  const onSubmit = (data: any) => {
    setInputValues(numerizeObj(data));
    setApplyFilter(true);
  };

  const clearForm = () => {
    setInputValues({});
    setValue('min_home', '');
    setValue('min_draw', '');
    setValue('min_away', '');
    setValue('min_hwrate', '');
    setValue('min_dwrate', '');
    setValue('min_awrate', '');
    setValue('min_return', '');
    setValue('min_hkelly', '');
    setValue('min_dkelly', '');
    setValue('min_akelly', '');
    setValue('max_home', '');
    setValue('max_draw', '');
    setValue('max_away', '');
    setValue('max_hwrate', '');
    setValue('max_dwrate', '');
    setValue('max_awrate', '');
    setValue('max_return', '');
    setValue('max_hkelly', '');
    setValue('max_dkelly', '');
    setValue('max_akelly', '');
    setApplyFilter(false);
  };

  return (
    <>
      {showFilter && (
        <>
          <thead className='border font-bold text-black dark:text-dark-default '>
            <TwHeaderRow className='h-8 border bg-light-match dark:bg-dark-match'>
              <th className='w-[0%]' rowSpan={2}></th>
              <TwCell className='w-[12%] border' rowSpan={2}>
                Advanced Filter
              </TwCell>
              <TwCell className='w-[4%] border'>Min:</TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_home')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] '>
                <TwInput
                  className='w-4/5'
                  {...register('min_draw')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_away')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_hwrate')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_dwrate')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_awrate')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_return')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_hkelly')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_dkelly')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('min_akelly')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[18%] border' rowSpan={2} colSpan={2}>
                <div className='flex justify-evenly'>
                  <TwOddsFilterButton
                    className=''
                    onClick={handleSubmit(onSubmit)}
                  >
                    Filter
                  </TwOddsFilterButton>
                  <TwOddsFilterButton
                    className=''
                    onClick={clearForm}
                    type='button'
                  >
                    Clear All
                  </TwOddsFilterButton>
                  <TwOddsFilterButton
                    className=''
                    onClick={() => setShowFilter(false)}
                  >
                    Close
                  </TwOddsFilterButton>
                </div>
              </TwCell>
            </TwHeaderRow>
            <TwHeaderRow className='h-8 border bg-light-match dark:bg-dark-match'>
              {/* <TwCell className='w-[4%] border'></TwCell> */}
              {/* <TwCell className='w-[12%] border'>Bookmakers</TwCell> */}
              <TwCell className='w-[4%] border'>Max:</TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_home')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] '>
                <TwInput
                  className='w-4/5'
                  {...register('max_draw')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_away')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_hwrate')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_dwrate')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_awrate')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_return')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_hkelly')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_dkelly')}
                  type='number'
                />
              </TwCell>
              <TwCell className='w-[6%] border'>
                <TwInput
                  className='w-4/5'
                  {...register('max_akelly')}
                  type='number'
                />
              </TwCell>
              {/* <TwCell className='w-[10%] border'>Cập nhật</TwCell> */}
              {/* <TwCell className='w-[8%] border'>Xem thêm</TwCell> */}
            </TwHeaderRow>
          </thead>
        </>
      )}
    </>
  );
};

const TwOddsFilterButton = tw.button`p-1 px-2 text-csm dark:hover:brightness-150 cursor-pointer bg-white dark:bg-dark-text text-black rounded-md`;

const OddsDetailRowEu1x2 = ({
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
  const { eu1x2OddsType } = useOddsEu1x2FilterStore();
  const {
    oddsEu1x2CompareData,
    oddsEu1x2ChangeData,
    oddsEu1x2ChangeDataKelly,
  } = useOddsDetailsStore();
  const oddsStr = oddsEu1x2CompareData[bookId] || {};
  const odds = oddsStr.split(',');
  const changeTime = odds[6];

  if (!bookId) {
    return <></>;
  }

  const kellyScores = oddsEu1x2ChangeDataKelly[bookId] || [];

  const last = kellyScores[0] || {};
  const first = kellyScores[kellyScores.length - 1] || {};
  const ih = first.h;
  const id = first.d;
  const ia = first.a;
  const iHWrate = roundNum(first.hWrate, 2);
  const iDWrate = roundNum(first.dWrate, 2);
  const iAWrate = roundNum(first.aWrate, 2);

  const lh = last.h;
  const ld = last.d;
  const la = last.a;
  const lHWrate = roundNum(last.hWrate, 2);
  const lDWrate = roundNum(last.dWrate, 2);
  const lAWrate = roundNum(last.aWrate, 2);
  const iReturnRate = roundNum(first.hReturnRate, 2);
  const lReturnRate = roundNum(last.hReturnRate, 2);

  if (eu1x2OddsType === 'all') {
    return (
      <>
        <tr
          className='h-8 font-light'
          css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
        >
          <TwCell className='w-[4%] border' rowSpan={2}></TwCell>
          <TwCell className='w-[12%] border' rowSpan={2}>
            {bookName}
          </TwCell>
          <TwCell className='w-[4%] border text-xs'>Early</TwCell>
          {/* <TwCell className='w-[6%] border'>{ih}</TwCell> */}
          <TwCell className='w-[6%] border'>
            {convertOdds(ih, 'eu1x2', oddsType, 1)}
          </TwCell>
          <TwCell className='w-[6%] '>
            {convertOdds(id, 'eu1x2', oddsType, 2)}
          </TwCell>
          <TwCell className='w-[6%] border'>
            {convertOdds(ia, 'eu1x2', oddsType, 3)}
          </TwCell>
          <TwCell className='w-[6%] border'>{iHWrate}</TwCell>
          <TwCell className='w-[6%] border'>{iDWrate}</TwCell>
          <TwCell className='w-[6%] border'>{iAWrate}</TwCell>
          <TwCell className='w-[8%] border'>{iReturnRate}</TwCell>
          <TwCell
            className='w-[6%] border'
            rowSpan={2}
            css={[last['hKelly'] >= 1 && tw`text-dark-loss`]}
          >
            {last['hKelly']}
          </TwCell>
          <TwCell
            className='w-[6%] border'
            rowSpan={2}
            css={[last['dKelly'] >= 1 && tw`text-dark-loss`]}
          >
            {last['dKelly']}
          </TwCell>
          <TwCell
            className='w-[6%] border'
            rowSpan={2}
            css={[last['aKelly'] >= 1 && tw`text-dark-loss`]}
          >
            {last['aKelly']}
          </TwCell>
          <TwCell className='w-[10%] border' rowSpan={2}>
            {format(new Date(changeTime * 1000), 'dd/MM HH:mm')}
          </TwCell>
          <TwCell className='w-[8%] border' rowSpan={2}>
            <div className='flex h-full w-full place-content-center items-center px-1'>
              <button
                onClick={() => {
                  setBookMaker({
                    id: bookId,
                    name: bookName,
                  });
                  setOpenChangesModal(true);
                }}
              >
                <HiTrendingUp className='item-hover h-6 w-6 rounded-md border border-gray-light p-1 text-dark-text'></HiTrendingUp>
              </button>
            </div>
          </TwCell>
        </tr>
        <tr
          className='h-8'
          css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
        >
          {/* <TwCell className='w-[4%] border'></TwCell> */}
          {/* <TwCell className='w-[18%] border'>Bookmakers</TwCell> */}
          <TwCell className='w-[4%] border text-xs'>Live</TwCell>
          <TwCell className='w-[6%] border'>{lh}</TwCell>
          <TwCell className='w-[6%] '>{ld}</TwCell>
          <TwCell className='w-[6%] border'>{la}</TwCell>
          <TwCell className='w-[6%] border'>{lHWrate}</TwCell>
          <TwCell className='w-[6%] border'>{lDWrate}</TwCell>
          <TwCell className='w-[6%] border'>{lAWrate}</TwCell>
          <TwCell className='w-[8%] border'>{lReturnRate}</TwCell>
          {/* <TwCell className='w-[6%] border'></TwCell>
          <TwCell className='w-[6%] border'></TwCell>
          <TwCell className='w-[6%] border'></TwCell> */}
          {/* <TwCell className='w-[12%] border'></TwCell>
          <TwCell className='w-[6%] border'>TBD</TwCell> */}
        </tr>
      </>
    );
  }

  let cH = ih;
  let cD = id;
  let cA = ia;
  let cHWrate = iHWrate;
  let cDWrate = iDWrate;
  let cAWrate = iAWrate;
  let cReturnRate = iReturnRate;
  let ot = 'Early';
  if (eu1x2OddsType === 'live') {
    cH = lh;
    cD = ld;
    cA = la;
    cHWrate = lHWrate;
    cDWrate = lDWrate;
    cAWrate = lAWrate;
    cReturnRate = lReturnRate;
    ot = 'Live';
  }

  return (
    <>
      <tr
        className='h-8 font-light'
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='w-[4%] border' rowSpan={1}></TwCell>
        <TwCell className='w-[12%] border' rowSpan={1}>
          {bookName}
        </TwCell>
        <TwCell className='w-[4%] border text-xs'>{ot}</TwCell>
        <TwCell className='w-[6%] border'>
          {convertOdds(cH, 'eu1x2', oddsType, 1)}
        </TwCell>
        <TwCell className='w-[6%] '>
          {convertOdds(cD, 'eu1x2', oddsType, 2)}
        </TwCell>
        <TwCell className='w-[6%] border'>
          {convertOdds(cA, 'eu1x2', oddsType, 3)}
        </TwCell>
        <TwCell className='w-[6%] border'>{cHWrate}</TwCell>
        <TwCell className='w-[6%] border'>{cDWrate}</TwCell>
        <TwCell className='w-[6%] border'>{cAWrate}</TwCell>
        <TwCell className='w-[8%] border'>{cReturnRate}</TwCell>
        <TwCell
          className='w-[6%] border'
          rowSpan={1}
          css={[last['hKelly'] >= 1 && tw`text-dark-loss`]}
        >
          {last['hKelly']}
        </TwCell>
        <TwCell
          className='w-[6%] border'
          rowSpan={1}
          css={[last['dKelly'] >= 1 && tw`text-dark-loss`]}
        >
          {last['dKelly']}
        </TwCell>
        <TwCell
          className='w-[6%] border'
          rowSpan={1}
          css={[last['aKelly'] >= 1 && tw`text-dark-loss`]}
        >
          {last['aKelly']}
        </TwCell>
        <TwCell className='w-[10%] border' rowSpan={1}>
          {format(new Date(changeTime * 1000), 'dd/MM HH:mm')}
        </TwCell>
        <TwCell className='w-[8%] border' rowSpan={1}>
          <div className='flex h-full w-full place-content-center items-center px-1'>
            <button
              onClick={() => {
                setBookMaker({
                  id: bookId,
                  name: bookName,
                });
                setOpenChangesModal(true);
              }}
            >
              <HiTrendingUp className='item-hover h-6 w-6 rounded-md border border-gray-light p-1 text-dark-text'></HiTrendingUp>
            </button>
          </div>
        </TwCell>
      </tr>
    </>
  );
};

export const OddsStatsRow = ({
  label1,
  label2,
  oddsType,
  h,
  d,
  a,
  hWrate,
  dWrate,
  aWrate,
  hReturnRate,
  hKelly,
  dKelly,
  aKelly,
  fH,
  fD,
  fA,
  fHWrate,
  fDWrate,
  fAWrate,
  fHReturnRate,
}: {
  label1: string;
  label2: string;
  oddsType: string;
  h: string;
  d: string;
  a: string;
  hWrate: number;
  dWrate: number;
  aWrate: number;
  hReturnRate: number;
  hKelly: number;
  dKelly: number;
  aKelly: number;
  fH: string;
  fD: string;
  fA: string;
  fHWrate: number;
  fDWrate: number;
  fAWrate: number;
  fHReturnRate: number;
}) => {
  return (
    <>
      <tr
        className='h-7 font-light '
        css={[tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='w-[16%] border' rowSpan={1}>
          {label1}
        </TwCell>
        <TwCell className='w-[4%] border text-xs'>{/* {ot} */}</TwCell>
        <TwCell className='w-[6%] border'>
          {convertOdds(fH, 'eu1x2', oddsType, 1)}
        </TwCell>
        <TwCell className='w-[6%] '>
          {convertOdds(fD, 'eu1x2', oddsType, 2)}
        </TwCell>
        <TwCell className='w-[6%] border'>
          {convertOdds(fA, 'eu1x2', oddsType, 3)}
        </TwCell>
        <TwCell className='w-[6%] border'>{fHWrate}</TwCell>
        <TwCell className='w-[6%] border'>{fHWrate}</TwCell>
        <TwCell className='w-[6%] border'>{fAWrate}</TwCell>
        <TwCell className='w-[8%] border'>{fHReturnRate}</TwCell>
        <TwCell className='w-[6%] border' rowSpan={2}>
          {hKelly}
        </TwCell>
        <TwCell className='w-[6%] border' rowSpan={2}>
          {dKelly}
        </TwCell>
        <TwCell className='w-[6%] border' rowSpan={2}>
          {aKelly}
        </TwCell>
        <TwCell className='w-[18%] border' rowSpan={2}></TwCell>
      </tr>
      <tr className='h-7 bg-light-match font-light dark:bg-dark-match'>
        <TwCell className='w-[16%] border' rowSpan={1}>
          {label2}
        </TwCell>
        <TwCell className='w-[4%] border text-xs'>{/* {ot} */}</TwCell>
        <TwCell className='w-[6%] border'>
          {convertOdds(h, 'eu1x2', oddsType, 1)}
        </TwCell>
        <TwCell className='w-[6%] '>
          {convertOdds(d, 'eu1x2', oddsType, 2)}
        </TwCell>
        <TwCell className='w-[6%] border'>
          {convertOdds(a, 'eu1x2', oddsType, 3)}
        </TwCell>
        <TwCell className='w-[6%] border'>{hWrate}</TwCell>
        <TwCell className='w-[6%] border'>{dWrate}</TwCell>
        <TwCell className='w-[6%] border'>{aWrate}</TwCell>
        <TwCell className='w-[8%] border'>{hReturnRate}</TwCell>
        {/* <TwCell
          className='w-[6%] border'
          rowSpan={1}
        >
        </TwCell> */}
        {/* <TwCell
          className='w-[6%] border'
          rowSpan={1}
        >
        </TwCell> */}
        {/* <TwCell
          className='w-[6%] border'
          rowSpan={1}
        >
        </TwCell> */}
        {/* <TwCell className='w-[18%] border' rowSpan={1}>
        </TwCell> */}
      </tr>
    </>
  );
};

const OddsDetailHeader = () => {
  return (
    <thead className='border font-bold text-black dark:text-dark-default '>
      <TwHeaderRow className='h-10 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[4%] border'></TwCell>
        <TwCell className='w-[12%] border'>Bookmakers</TwCell>
        <TwCell className='w-[4%] border'></TwCell>
        <TwCell className='w-[6%] border'>
          <SortableHeader name='Chủ' code={1}></SortableHeader>
        </TwCell>
        <TwCell className='w-[6%] '>
          <SortableHeader name='Hoà' code={2}></SortableHeader>
        </TwCell>
        <TwCell className='w-[6%] border'>
          <SortableHeader name='Khách' code={3}></SortableHeader>
        </TwCell>
        <TwCell className='w-[6%] border'>
          <SortableHeader name='Chủ %' code={4}></SortableHeader>
        </TwCell>
        <TwCell className='w-[6%] border'>
          <SortableHeader name='Hoà %' code={5}></SortableHeader>
        </TwCell>
        <TwCell className='w-[6%] border'>
          <SortableHeader name='Khách %' code={6}></SortableHeader>
        </TwCell>
        <TwCell className='w-[8%] border'>
          <SortableHeader name='Hoàn vốn %' code={7}></SortableHeader>
        </TwCell>
        <TwCell className='w-[18%] border' colSpan={3}>
          Tiêu chuẩn Kelly
        </TwCell>
        <TwCell className='w-[10%] border'>Cập nhật</TwCell>
        <TwCell className='w-[8%] border'>Xem thêm</TwCell>
      </TwHeaderRow>
    </thead>
  );
};

const SortableHeader = ({
  name = '',
  code = 0,
}: {
  name: string;
  code: number;
}) => {
  const { sortBy, setSortBy } = useOddsEu1x2FilterStore();

  return (
    <div className='flex h-full w-full place-content-center'>
      <button
        className='flex items-center gap-1'
        onClick={() => {
          if (sortBy === code) {
            setSortBy(-code);
            return;
          }
          setSortBy(code);
        }}
      >
        <span className='hover:text-logo-blue hover:underline'>{name}</span>
        <span className='flex flex-col'>
          <OddUpSVG
            className='h-1.5 w-2'
            css={[
              sortBy === code && tw`text-logo-blue`,
              sortBy === -code && tw`text-dark-text`,
            ]}
          ></OddUpSVG>
          <OddDownSVG
            className='h-1.5 w-2'
            css={[
              sortBy === code && tw`text-dark-text`,
              sortBy === -code && tw`text-logo-blue`,
            ]}
          ></OddDownSVG>
        </span>
      </button>
    </div>
  );
};

export const OddsStatsHeader = () => {
  return (
    <thead className='border font-bold text-black dark:text-dark-default '>
      <TwHeaderRow className='h-10 border bg-light-match dark:bg-dark-match'>
        {/* <TwCell className='w-[4%] border'></TwCell> */}
        <TwCell className='w-[16%] border'>Tiêu chí</TwCell>
        <TwCell className='w-[4%] border'></TwCell>
        <TwCell className='w-[6%] border'>Chủ</TwCell>
        <TwCell className='w-[6%] '>Hoà</TwCell>
        <TwCell className='w-[6%] border'>Khách</TwCell>
        <TwCell className='w-[6%] border'>Chủ %</TwCell>
        <TwCell className='w-[6%] border'>Hoà %</TwCell>
        <TwCell className='w-[6%] border'>Khách %</TwCell>
        <TwCell className='w-[8%] border'>Hoàn vốn %</TwCell>
        <TwCell className='w-[18%] border' colSpan={3}>
          Tiêu chuẩn Kelly
        </TwCell>
        <TwCell className='w-[18%] border'></TwCell>
        {/* <TwCell className='w-[8%] border'>Xem thêm</TwCell> */}
      </TwHeaderRow>
    </thead>
  );
};
