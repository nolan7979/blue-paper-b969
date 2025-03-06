import tw from 'twin.macro';

import { useMatchOddsAnalysisData } from '@/hooks/useFootball/useOddsData';

import {
  TwHeaderRow,
  TWTable,
} from '@/components/modules/football/odds/shared-components';
import { BookmakerFiltersFB } from '@/components/modules/football/odds/OddsComponents';

import { useOddsStore } from '@/stores';

import { convertOdds } from '@/utils';

export const LiveOddsAnalysisSection = ({ matchData }: { matchData: any }) => {
  return (
    <div>
      {/* <div>{matchData?.id}</div> */}
      <div className='flex justify-end'>
        <div className='w-24 py-1'>
          <BookmakerFiltersFB isPassive={false}></BookmakerFiltersFB>
        </div>
      </div>
      <div>
        <TWTable
          width='100%'
          border={0}
          cellPadding={0}
          cellSpacing={0}
          className='border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text '
        >
          <TwHeaderRow className='h-8'>
            <TwCellEarly rowSpan={2} className='w-[8%]'>
              Giờ
            </TwCellEarly>
            <TwCellEarly rowSpan={2}>Tỷ số</TwCellEarly>
            <TwCellEarly rowSpan={2}>F/H</TwCellEarly>
            <TwCellEarly colSpan={6}>HDP</TwCellEarly>
            <TwCellEarly colSpan={6}>Tài Xỉu</TwCellEarly>
            <TwCellEarly colSpan={6}>1x2</TwCellEarly>
          </TwHeaderRow>
          <TwHeaderRow className='h-8'>
            {/* <TwCell>Time</TwCell>
            <TwCell>Ty so</TwCell> */}
            {/* <TwCell>F/H</TwCell> */}
            <TwCellEarly colSpan={3}>Early</TwCellEarly>
            <TwCellEarly colSpan={3}>Live</TwCellEarly>
            <TwCellEarly colSpan={3}>Early</TwCellEarly>
            <TwCellEarly colSpan={3}>Live</TwCellEarly>
            <TwCellEarly colSpan={3}>Early</TwCellEarly>
            <TwCellEarly colSpan={3}>Live</TwCellEarly>
          </TwHeaderRow>

          <OddsAnalysisBody matchData={matchData}></OddsAnalysisBody>
        </TWTable>
      </div>
    </div>
  );
};

export const OddsAnalysisBody = ({ matchData }: { matchData: any }) => {
  const { selectedBookMaker } = useOddsStore();
  const { data, isFetching } = useMatchOddsAnalysisData(
    matchData?.id,
    selectedBookMaker?.id?.toString()
  );
  const { oddsType } = useOddsStore();

  if (isFetching)
    return (
      <>
        <BodySkeleton></BodySkeleton>
      </>
    );

  const { hdp, hdpHalf, tx, txHalf, std1x2, std1x2Half } = data?.data || {};

  // TODO odds -> store
  const mapOdds: any = {
    hdp: {},
    hdpHalf: {},
    tx: {},
    txHalf: {},
    std1x2: {},
    std1x2Half: {},
  };
  const hdpRows = (hdp || '').split('|').map((row: string) => row.split(','));
  hdpRows.forEach((row: string[]) => {
    mapOdds['hdp'][row[0]] = row;
  });

  const hdpHalfRows = (hdpHalf || '')
    .split('|')
    .map((row: string) => row.split(','));
  hdpHalfRows.forEach((row: string[]) => {
    mapOdds['hdpHalf'][row[0]] = row;
  });

  const txRows = (tx || '').split('|').map((row: string) => row.split(','));
  txRows.forEach((row: string[]) => {
    mapOdds['tx'][row[0]] = row;
  });

  const txHalfRows = (txHalf || '')
    .split('|')
    .map((row: string) => row.split(','));
  txHalfRows.forEach((row: string[]) => {
    mapOdds['txHalf'][row[0]] = row;
  });

  const std1x2Rows = (std1x2 || '')
    .split('|')
    .map((row: string) => row.split(','));
  std1x2Rows.forEach((row: string[]) => {
    mapOdds['std1x2'][row[0]] = row;
  });

  const std1x2HalfRows = (std1x2Half || '')
    .split('|')
    .map((row: string) => row.split(','));
  std1x2HalfRows.forEach((row: string[]) => {
    mapOdds['std1x2Half'][row[0]] = row;
  });

  const times: any[] = [];

  [
    ...hdpRows,
    // ...hdpHalfRows,
    ...txRows,
    // ...txHalfRows,
    ...std1x2Rows,
    // ...std1x2HalfRows,
  ].forEach((row: string[]) => {
    // times[row[0]] = true;
    if (!times.includes(`${row[0]}-${row[1]}`))
      times.push(`${row[0]}-${row[1]}`);
  });

  const sortedTimes = times.sort().map((t: any) => t.split('-')[0]);

  return (
    <tbody className=''>
      {sortedTimes?.map((time: string) => {
        return (
          <OddsAnalysisRow
            key={time}
            time={time}
            mapOdds={mapOdds}
            oddsType={oddsType}
          ></OddsAnalysisRow>
        );
      })}
    </tbody>
  );
};

const timeTitles: any = {
  '.p0': 'Early',
  '.p1': 'Live',
  '45HT': 'HT',
};

const OddsAnalysisRow = ({
  time,
  mapOdds,
  oddsType,
}: {
  time: string;
  mapOdds: any;
  oddsType: string;
}) => {
  // TODO: !time

  const hdp = mapOdds['hdp'][time] || [];
  const hdpHalf = mapOdds['hdpHalf'][time] || [];
  const tx = mapOdds['tx'][time] || [];
  const txHalf = mapOdds['txHalf'][time] || [];
  const std1x2 = mapOdds['std1x2'][time] || [];
  const std1x2Half = mapOdds['std1x2Half'][time] || [];

  if (time > '45') {
    return (
      <>
        <TwBodyRow>
          <TwCellEarly rowSpan={1} className='w-[7.5%]'>
            {timeTitles[time] || time}
          </TwCellEarly>
          <TwCellEarly rowSpan={1} className='w-[7%]'>
            {hdp[1]}
          </TwCellEarly>

          <TwCellEarly>FT</TwCellEarly>
          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(hdp[2], 'hdp', oddsType, 1)}
          </TwCellEarly>
          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(hdp[3], 'hdp', oddsType, 2)}
          </TwCellEarly>
          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(hdp[4], 'hdp', oddsType, 3)}
          </TwCellEarly>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(hdp[5], 'hdp', oddsType, 1)}
          </TwCellRun>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(hdp[6], 'hdp', oddsType, 2)}
          </TwCellRun>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(hdp[7], 'hdp', oddsType, 3)}
          </TwCellRun>

          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(tx[2], 'tx', oddsType, 1)}
          </TwCellEarly>
          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(tx[3], 'tx', oddsType, 2)}
          </TwCellEarly>
          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(tx[4], 'tx', oddsType, 3)}
          </TwCellEarly>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(tx[5], 'tx', oddsType, 1)}
          </TwCellRun>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(tx[6], 'tx', oddsType, 2)}
          </TwCellRun>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(tx[7], 'tx', oddsType, 3)}
          </TwCellRun>

          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(std1x2[2], 'std1x2', oddsType, 1)}
          </TwCellEarly>
          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(std1x2[3], 'std1x2', oddsType, 2)}
          </TwCellEarly>
          <TwCellEarly className='w-[4.5%]'>
            {convertOdds(std1x2[4], 'std1x2', oddsType, 3)}
          </TwCellEarly>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(std1x2[5], 'std1x2', oddsType, 1)}
          </TwCellRun>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(std1x2[6], 'std1x2', oddsType, 2)}
          </TwCellRun>
          <TwCellRun className='w-[4.5%]'>
            {convertOdds(std1x2[7], 'std1x2', oddsType, 3)}
          </TwCellRun>
        </TwBodyRow>
      </>
    );
  }
  return (
    <>
      <TwBodyRow>
        <TwCellEarly rowSpan={2} className='w-[7.5%]'>
          {timeTitles[time] || time}
        </TwCellEarly>
        <TwCellEarly rowSpan={2} className='w-[7%]'>
          {hdp[1]}
        </TwCellEarly>

        <TwCellEarly className='w-[4.5%]'>HT</TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(hdpHalf[2], 'hdp', oddsType, 1)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(hdpHalf[3], 'hdp', oddsType, 2)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(hdpHalf[4], 'hdp', oddsType, 3)}
        </TwCellEarly>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(hdpHalf[5], 'hdp', oddsType, 1)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(hdpHalf[6], 'hdp', oddsType, 2)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(hdpHalf[7], 'hdp', oddsType, 3)}
        </TwCellRun>

        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(txHalf[2], 'tx', oddsType, 1)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(txHalf[3], 'tx', oddsType, 2)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(txHalf[4], 'tx', oddsType, 3)}
        </TwCellEarly>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(txHalf[5], 'tx', oddsType, 1)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(txHalf[6], 'tx', oddsType, 2)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(txHalf[7], 'tx', oddsType, 3)}
        </TwCellRun>

        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(std1x2Half[2], 'std1x2', oddsType, 1)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(std1x2Half[3], 'std1x2', oddsType, 2)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(std1x2Half[4], 'std1x2', oddsType, 3)}
        </TwCellEarly>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(std1x2Half[5], 'std1x2', oddsType, 1)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(std1x2Half[6], 'std1x2', oddsType, 2)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(std1x2Half[7], 'std1x2', oddsType, 3)}
        </TwCellRun>
      </TwBodyRow>

      <TwBodyRow>
        <TwCellEarly>FT</TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(hdp[2], 'hdp', oddsType, 1)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(hdp[3], 'hdp', oddsType, 2)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(hdp[4], 'hdp', oddsType, 3)}
        </TwCellEarly>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(hdp[5], 'hdp', oddsType, 1)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(hdp[6], 'hdp', oddsType, 2)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(hdp[7], 'hdp', oddsType, 3)}
        </TwCellRun>

        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(tx[2], 'tx', oddsType, 1)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(tx[3], 'tx', oddsType, 2)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(tx[4], 'tx', oddsType, 3)}
        </TwCellEarly>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(tx[5], 'tx', oddsType, 1)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(tx[6], 'tx', oddsType, 2)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(tx[7], 'tx', oddsType, 3)}
        </TwCellRun>

        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(std1x2[2], 'std1x2', oddsType, 1)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(std1x2[3], 'std1x2', oddsType, 2)}
        </TwCellEarly>
        <TwCellEarly className='w-[4.5%]'>
          {convertOdds(std1x2[4], 'std1x2', oddsType, 3)}
        </TwCellEarly>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(std1x2[5], 'std1x2', oddsType, 1)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(std1x2[6], 'std1x2', oddsType, 2)}
        </TwCellRun>
        <TwCellRun className='w-[4.5%]'>
          {convertOdds(std1x2[7], 'std1x2', oddsType, 3)}
        </TwCellRun>
      </TwBodyRow>
    </>
  );
};

export const BodySkeleton = () => {
  return (
    <tbody className=''>
      <SkeletonRow></SkeletonRow>
      <SkeletonRow></SkeletonRow>
      <SkeletonRow></SkeletonRow>
      <SkeletonRow></SkeletonRow>
      <SkeletonRow></SkeletonRow>
      <SkeletonRow></SkeletonRow>
      <SkeletonRow></SkeletonRow>
    </tbody>
  );
};

const SkeletonRow = () => {
  return (
    <>
      <TwBodyRow>
        <TwCellEarly rowSpan={2} className='w-[7.5%]'></TwCellEarly>
        <TwCellEarly rowSpan={2} className='w-[7%]'></TwCellEarly>

        <TwCellEarly className='w-[4.5%]'>HT</TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>

        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>

        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
      </TwBodyRow>
      <TwBodyRow>
        <TwCellEarly>FT</TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>

        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>

        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellEarly className='w-[4.5%]'></TwCellEarly>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
        <TwCellRun className='w-[4.5%]'></TwCellRun>
      </TwBodyRow>
    </>
  );
};

const TwBodyRow = tw.tr`h-8`;
const TwCellEarly = tw.td`border border-dark-text/20`;
const TwCellRun = tw.td`border border-dark-text/20 bg-logo-blue/10`;
