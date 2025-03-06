/* eslint-disable @next/next/no-img-element */
import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import tw from 'twin.macro';

import { useSelectedMatchData } from '@/hooks/useFootball';

import CustomLink from '@/components/common/CustomizeLink';

import { formatTimestamp, getImage, Images } from '@/utils';
import { SportEventDto } from '@/constant/interface';
import Link from 'next/link';

export default function BracketPopOver({
  children,
  matches = [],
}: {
  children?: React.ReactNode;
  matches: any[];
}) {
  const [openPanel, setOpen] = useState(false);

  return (
    <div className='relative w-full'>
      <Popover className=' '>
        {({ open }) => (
          <>
            <Popover.Button
              onClick={() => setOpen(!openPanel)}
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-orange-700 text-base font-medium text-logo-blue hover:text-opacity-100 focus:outline-none `}
            >
              {children}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1/2'
              enterTo='opacity-100 -translate-y-1/2'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 -translate-y-1/2'
              leaveTo='opacity-0 translate-y-1/2'
            >
              <Popover.Panel className='absolute -left-40 top-0 z-20 -translate-y-1/2 transform rounded-lg border border-logo-blue  bg-light-match dark:bg-dark-match '>
                <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                  <div className=''>
                    {matches.map((match, idx: number) => {
                      return (
                        <MatchComponent
                          key={idx}
                          matchId={match}
                          open={openPanel}
                        ></MatchComponent>
                      );
                    })}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

const MatchComponent = ({
  matchId,
  open,
}: {
  matchId: string;
  open: boolean;
}) => {
  const [err1, setErr1] = useState(false);
  const [err2, setErr2] = useState(false);

  const {
    data: matchData,
    isLoading,
    isFetching,
  } = useSelectedMatchData(matchId, 800000, 600000);
  if (isLoading || isFetching || !matchData) return <div>...</div>;

  if (!matchData || Object.keys(matchData).length === 0) return <></>;

  const {
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    winnerCode,
    startTimestamp,
    slug,
    id,
  } = matchData as SportEventDto;

  return (
    <div className='border-b border-dark-text/10'>
      {/*Todo: hotfix use Link instead of CustomeLink temporary*/}
      {/*<CustomLink href={`/match/${slug}/${id}`} prefetch='false'>*/}
      <CustomLink href={`/match/${slug}/${id}`} target='_parent'>
        <div className=' item-hover divide-y-logo-yelow w-40  divide-y px-2 py-1'>
          <div className='flex items-center gap-0.5'>
            <div className='w-1/4 text-cxs  '>
              {formatTimestamp(startTimestamp, 'dd/MM')}
            </div>
            <div className=' flex-1'>
              <div
                className='flex flex-1 items-center justify-between truncate text-cxs'
                css={[winnerCode === 1 && tw`text-black dark:text-white`]}
              >
                <span className='flex w-24 items-center'>
                  <img
                    src={`${
                      err1
                        ? '/images/football/teams/unknown-team.png'
                        : `${getImage(Images.team, homeTeam?.id)}`
                    }`}
                    alt='...'
                    width={10}
                    height={10}
                    className='mr-1 rounded-md'
                    onError={() => setErr1(true)}
                  ></img>
                  <span className='truncate'>{homeTeam?.name}</span>
                </span>
                <span>{homeScore?.display}</span>
              </div>
              <div
                className='flex flex-1 items-center justify-between truncate text-cxs'
                css={[winnerCode === 2 && tw`text-black dark:text-white`]}
              >
                <span className='flex w-24 items-center'>
                  <img
                    src={`${
                      err2
                        ? '/images/football/teams/unknown-team.png'
                        : `${getImage(Images.team, awayTeam?.id)}`
                    }`}
                    alt='...'
                    width={10}
                    height={10}
                    className='mr-1 rounded-md'
                    onError={() => setErr2(true)}
                  ></img>
                  <span className='truncate'>{awayTeam?.name}</span>
                </span>
                <span>{awayScore?.display}</span>
              </div>
            </div>
          </div>
        </div>
      </CustomLink>
    </div>
  );
};

function IconOne() {
  return (
    <svg
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='8' fill='#FFEDD5' />
      <path
        d='M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z'
        stroke='#FB923C'
        strokeWidth='2'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z'
        stroke='#FDBA74'
        strokeWidth='2'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z'
        stroke='#FDBA74'
        strokeWidth='2'
      />
    </svg>
  );
}

function IconTwo() {
  return (
    <svg
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='8' fill='#FFEDD5' />
      <path
        d='M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27'
        stroke='#FB923C'
        strokeWidth='2'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M18.804 30H29.1963L24.0001 21L18.804 30Z'
        stroke='#FDBA74'
        strokeWidth='2'
      />
    </svg>
  );
}

function IconThree() {
  return (
    <svg
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='48' height='48' rx='8' fill='#FFEDD5' />
      <rect x='13' y='32' width='2' height='4' fill='#FDBA74' />
      <rect x='17' y='28' width='2' height='8' fill='#FDBA74' />
      <rect x='21' y='24' width='2' height='12' fill='#FDBA74' />
      <rect x='25' y='20' width='2' height='16' fill='#FDBA74' />
      <rect x='29' y='16' width='2' height='20' fill='#FB923C' />
      <rect x='33' y='12' width='2' height='24' fill='#FB923C' />
    </svg>
  );
}
