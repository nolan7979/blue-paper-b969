import clsx from 'clsx';
import { useMemo } from 'react';
import tw from 'twin.macro';

import Avatar from '@/components/common/Avatar';

import { isValEmpty, toDecimalOdd } from '@/utils';
import React from 'react';

const TeamWinningOddsSection = ({
  team,
  teamWinningOdds,
  isHome = true,
  i18n,
}: {
  team: any;
  i18n?: any;
  teamWinningOdds: any;
  isHome?: boolean;
}) => {
  const originalString = i18n.qv.oddsWinv1;
  const regex = /\{(fractional|expected|actual)\}/g;

  const renderOriginalString = useMemo(() => {
    const replaceFunction = (match: string, index: number) => {
      switch (match) {
        case 'fractional':
          return (
            <span
              key={`fractional-${index}`}
              className={clsx({
                'text-all-blue': isHome,
                'text-light-detail-away': !isHome,
              })}
            >
              {toDecimalOdd(teamWinningOdds.fractionalValue)}
            </span>
          );
        case 'expected':
          return (
            <span
              key={`expected-${index}`}
              className={clsx({
                'text-all-blue': isHome,
                'text-light-detail-away': !isHome,
              })}
            >
              {teamWinningOdds.expected}%
            </span>
          );
        case 'actual':
          return <span key={`actual-${index}`}>0.75</span>;
        default:
          return <span key={`default-${index}`}>{match}</span>;
      }
    };
    if (isValEmpty(teamWinningOdds)) {
      return <></>;
    }
    const parts = originalString.split(regex);
    const elements = parts.map((part: any, index: any) => {
      if (['fractional', 'expected', 'actual'].includes(part)) {
        return replaceFunction(part, index);
      }
      return <span key={index}>{part}</span>;
    });

    return <>{elements}</>;
  }, [teamWinningOdds, isHome, i18n]);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex place-content-center items-center'>
            <Avatar
              id={team?.id}
              type='team'
              height={24}
              width={24}
              rounded={false}
              isBackground={false}
              isSmall
            />
          </div>
          <div className='flex items-center text-sm font-medium'>
            {toDecimalOdd(teamWinningOdds.fractionalValue)} ={' '}
            {teamWinningOdds.expected || '-'}%
          </div>
        </div>
        {teamWinningOdds.actual && (
          <div className='h-full'>
            <span
              className='rounded-md  px-2 py-1 text-sm font-medium text-black'
              css={[isHome ? tw`bg-logo-blue` : tw`bg-logo-yellow`]}
            >
              W: {teamWinningOdds.actual || '-'}%
            </span>
          </div>
        )}
      </div>
      <div className='text-csm'>{renderOriginalString}</div>
    </>
  );
};
export default TeamWinningOddsSection;
