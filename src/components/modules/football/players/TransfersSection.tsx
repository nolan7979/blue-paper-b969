import { useTranslation } from 'next-i18next';

import { TransferHistoryGraph } from '@/components/modules/football/players';
import { TwTitle } from '@/components/modules/football/tw-components';
import {
  Divider,
  TwTransferFeeText,
} from '@/components/modules/football/tw-components/TwPlayer';

import { formatMarketValue } from '@/utils';

import CurrentValueSVG from '/public/svg/current-value.svg';
import TransferFeeSVG from '/public/svg/transfer-fee.svg';
import { TransferHistorySection } from '@/pages/football/player/[...playerParams]';
import React from 'react';
import useTrans from '@/hooks/useTrans';

export const TransfersSection = ({
  transfers,
  player,
  proposedMarketValueRaw,
}: {
  transfers: any;
  player: any;
  proposedMarketValueRaw?: any;
}) => {
  const i18n = useTrans()
  const maxTransferFee = transfers.reduce(
    (max: any, transfer: any) =>
      transfer.transferFeeRaw?.value > max.value
        ? transfer.transferFeeRaw
        : max,
    {
      value: 0,
      currency: '',
    }
  );

  return (
    <>
      <div className='space-y-2 p-4 w-full lg:w-1/2 border-r border-line-default dark:border-dark-time-tennis'>
        <TwTitle className='mb-3 flex justify-center md:justify-start text-black dark:text-white'>
          {i18n.titles.transferHistory}
        </TwTitle>
        <div className='  flex-1 rounded-md bg-gradient-to-b from-gray-800 to-blue-900 '>
          <TransferHistoryGraph
            player={player}
            transfers={[...transfers]}
          ></TransferHistoryGraph>
        </div>
        <div className=' space-y-1'>
          <div className='flex items-center gap-2 '>
            <span>
              <CurrentValueSVG className='w-5'></CurrentValueSVG>
            </span>
            <TwTransferFeeText>Giá trị hiện tại</TwTransferFeeText>
            <span className='text-xs font-normal leading-5 text-dark-win'>
              {formatMarketValue(proposedMarketValueRaw?.value)} (
              {proposedMarketValueRaw?.currency})
            </span>
          </div>
          <div className='flex items-center gap-2 '>
            <span>
              <TransferFeeSVG className='w-5'></TransferFeeSVG>
            </span>
            <TwTransferFeeText>Phí chuyển nhượng cao nhất: </TwTransferFeeText>
            <div className='text-xs font-normal not-italic leading-5 text-logo-blue'>
              {formatMarketValue(maxTransferFee?.value)} (
              {maxTransferFee?.currency})
            </div>
          </div>
        </div>
      </div>
      <div className='w-full lg:w-1/2 p-4'>
        <TransferHistorySection
          transfers={[...transfers]}
          player={player}
        ></TransferHistorySection>
      </div>
    </>
  );
};
