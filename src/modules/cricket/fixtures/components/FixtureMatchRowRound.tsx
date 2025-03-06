/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import tw from 'twin.macro';
import { useWindowSize } from 'usehooks-ts';

import { useMatchStore } from '@/stores';

import {
  TwMatchText,
  TwScoreText,
} from '@/modules/football/competition/components';
import { formatTimestamp, getImage, Images } from '@/utils';

export const TwFixtureMatchLi = tw.li`flex rounded-md bg-light-match dark:bg-dark-hl-1 items-center cursor-pointer`;

export const FixtureMatchRowRound = ({
  match,
  i18n,
}: {
  match: any;
  i18n: any;
}) => {
  const router = useRouter();
  const [err1, setErr1] = useState(false);
  const [err2, setErr2] = useState(false);

  const { width } = useWindowSize();
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    toggleShowSelectedMatch,
  } = useMatchStore();
  // const i18n: any = useTrans();

  const {
    id,
    // customId,
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
    status = {},
  } = match || {};
  const { type = '' } = status || {};

  return (
    <TwFixtureMatchLi
      className='item-hover px-2.5 py-1 md:px-2.5 md:py-2 '
      onClick={() => {
        if (width < 1024) {
          setSelectedMatch(`${id}`);
          // go to detailed page for small screens
          router.push(`/football/match/${match?.slug}/${match?.id}`); // TODO slug
          // window.location.href = `/match/${match?.slug}/${match?.id}`;
        } else {
          if (`${id}` === `${selectedMatch}`) {
            toggleShowSelectedMatch();
          } else {
            setShowSelectedMatch(true);
            setSelectedMatch(`${id}`);
          }
        }
      }}
    >
      <div className='flex w-[23%] items-center gap-x-2 md:gap-x-4'>
        <TwMatchText className='flex flex-col gap-0.5 text-logo-blue md:flex-row md:gap-1.5'>
          <div>{formatTimestamp(match?.startTimestamp, 'dd/MM')}</div>
          <div>{formatTimestamp(match?.startTimestamp, 'HH:mm')}</div>
        </TwMatchText>
        {/* <TwMatchText className='hidden md:inline-block'> */}
        {/* {formatTimestamp(match?.startTimestamp, 'dd/MM/yyyy')} */}
        {/* </TwMatchText> */}
        <TwMatchText className='truncate'>
          {i18n.status[type] || '-'}
        </TwMatchText>
      </div>
      <div className='flex flex-1  items-center gap-1 overflow-hidden md:gap-3'>
        <div className='flex w-1/3  items-center justify-end gap-2'>
          <TwMatchText className='truncate'>{homeTeam.name}</TwMatchText>
          <img
            src={`${
              err1
                ? '/images/football/teams/unknown-team.png'
                : `${getImage(Images.team, homeTeam?.id)}`
            }`}
            alt='..'
            width={18}
            height={18}
            onError={() => setErr1(true)}
            className='h-[18px] w-[18px]'
          />
        </div>
        <TwScoreText className='w-10 text-center md:w-14'>
          {homeScore.display} - {awayScore.display}
        </TwScoreText>
        <div className='flex w-5/12 items-center gap-2'>
          <img
            src={`${
              err2
                ? '/images/football/teams/unknown-team.png'
                : `${getImage(Images.team, awayTeam?.id)}`
            }`}
            alt='..'
            width={18}
            height={18}
            className='h-[18px] w-[18px]'
            onError={() => setErr2(true)}
          />
          <TwMatchText className='truncate'>{awayTeam.name}</TwMatchText>
        </div>
      </div>
    </TwFixtureMatchLi>
  );
};
