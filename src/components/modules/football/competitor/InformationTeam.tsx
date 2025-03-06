import CustomLink from '@/components/common/CustomizeLink';
import useTrans from '@/hooks/useTrans';
import { HiOutlineChevronRight } from 'react-icons/hi';

import Avatar from '@/components/common/Avatar';
import {
  Country,
  Manager,
  TeamTransfers,
  Transfer,
  UniqueTournament,
  Venue,
} from '@/models/interface';
import { formatTimestamp, genTransferTexts } from '@/utils';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { cn } from '@/utils/tailwindUtils';
import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';

type InformationTeamProps = {
  manager: Partial<Manager>;
  foundationDate?: number;
  country: Partial<Country>;
  venue: Partial<Venue>;
  uniqueTournaments: Partial<UniqueTournament>[];
  teamTransfers: TeamTransfers;
  isDesktop?: boolean;
};

export const InformationTeam: React.FC<InformationTeamProps> = ({
  manager,
  foundationDate,
  country,
  venue,
  uniqueTournaments,
  teamTransfers,
  isDesktop,
}) => {
  const i18n = useTrans();
  const { transfersIn = [], transfersOut = [] } = teamTransfers || {};
  const [visiblePlayers, setVisiblePlayers] = useState<{
    arrivals: boolean;
    departures: boolean;
  }>({ arrivals: false, departures: false });

  const transfersInMemo = useMemo(
    () =>
      !!visiblePlayers.arrivals && isDesktop
        ? transfersIn
        : transfersIn.slice(0, 5),
    [transfersIn, visiblePlayers.arrivals, isDesktop]
  );
  const transfersOutMemo = useMemo(
    () =>
      !!visiblePlayers.departures && isDesktop
        ? transfersOut
        : transfersOut.slice(0, 5),
    [transfersOut, visiblePlayers.departures, isDesktop]
  );
  return (
    <div className='flex flex-col lg:flex-row'>
      <div className='border-r-1 flex flex-1 flex-col gap-4 bg-transparent p-3 lg:bg-white lg:p-4 lg:dark:bg-dark-container'>
        <div>
          <h3 className='mb-3 font-primary text-sm font-bold uppercase text-black dark:text-white lg:mb-0'>
            {/* // Todo: update translate later */}
            {i18n.competitor.informationTem}
          </h3>
          <div
            className={clsx('px-3 lg:rounded-md lg:p-0', {
              'dark:border-linear-box bg-white dark:bg-primary-gradient lg:border-0 lg:bg-transparent lg:dark:bg-transparent':
                !isDesktop,
            })}
          >
            <div className='flex justify-between border-b border-dashed border-light-darkGray py-3'>
              <span className='text-csm'>{i18n.competitor.coach}</span>
              {/* <CustomLink
                href={`/football/manager/${manager?.id}`}
                target='_parent'
              > */}
              <span className='flex items-center gap-0.5 text-csm leading-4 text-logo-blue'>
                {manager?.name}
                <HiOutlineChevronRight />
              </span>
              {/* </CustomLink> */}
            </div>
            <div className='flex justify-between border-b border-dashed  border-light-darkGray py-3'>
              <span className='text-csm'>{i18n.competitor.foundationDate}</span>
              <span className='text-csm text-black dark:text-white'>
                {foundationDate}
              </span>
            </div>
            <div className='flex justify-between py-3'>
              <span className='text-csm'>{i18n.competitor.country}</span>
              <span className='text-csm text-black dark:text-white'>
                {country?.name}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className='mb-3 font-primary text-sm font-bold uppercase text-black  dark:text-white lg:mb-0'>
            {i18n.qv.location}
          </h3>
          <div
            className={clsx('px-3 lg:rounded-md lg:p-0', {
              'dark:border-linear-box bg-white dark:bg-primary-gradient lg:bg-transparent lg:dark:bg-transparent':
                !isDesktop,
            })}
          >
            <div className='flex justify-between border-b border-dashed border-light-darkGray py-3'>
              <span className='text-csm'>{i18n.titles.venue}</span>
              <span className='text-csm text-black dark:text-white'>
                {venue?.stadium?.name}
              </span>
            </div>
            <div className='flex justify-between border-b border-dashed  border-light-darkGray py-3'>
              <span className='text-csm'>{i18n.qv.location}</span>
              <span className='text-csm text-black dark:text-white'>
                {venue?.city?.name}
              </span>
            </div>
            <div className='flex justify-between py-3'>
              <span className='text-csm'>{i18n.competitor.capacity}</span>
              <span className='text-csm text-black dark:text-white'>
                {venue?.stadium?.capacity}
              </span>
            </div>
          </div>
        </div>
        {/* feature match */}
        <div className='flex flex-col gap-3'>
          <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white'>
            {i18n.drawerMobile.tournaments}
          </h3>
          <div
            className={clsx('grid grid-cols-3 gap-3 p-3 lg:rounded-md lg:p-0', {
              'dark:border-linear-box bg-white dark:bg-primary-gradient lg:bg-transparent lg:dark:bg-transparent':
                !isDesktop,
            })}
          >
            {uniqueTournaments?.map((item: any) => (
              <Tournament key={item?.id} id={item?.id} name={item?.name} />
            ))}
          </div>
        </div>
      </div>
      <div className='flex flex-1 flex-col  gap-3 bg-transparent p-4 lg:bg-white lg:dark:bg-dark-container'>
        <h3 className='font-primary text-sm font-bold uppercase text-black dark:text-white'>
          {i18n.competitor.transfer}
        </h3>
        <div
          className={clsx('p-3 lg:rounded-md lg:p-0', {
            'dark:border-linear-box bg-white dark:bg-primary-gradient lg:bg-transparent lg:dark:bg-transparent':
              !isDesktop,
          })}
        >
          <div
            className='flex h-fit items-center justify-between pr-2 lg:cursor-pointer'
            onClick={() =>
              transfersIn?.length > 5 &&
              setVisiblePlayers((prev) => ({
                ...prev,
                arrivals: !visiblePlayers.arrivals,
              }))
            }
          >
            <h4 className='font-primary text-csm font-medium text-all-blue'>
              {i18n.titles.latestArrivals}
            </h4>
            <HiOutlineChevronRight
              className={cn(
                'text-all-blue',
                visiblePlayers.arrivals ? 'lg:rotate-90' : ''
              )}
            />
          </div>
          {transfersInMemo?.map((item, idx) => (
            <TransferRow key={idx} data={item} transferType='arrival' i18n={i18n} />
          ))}
        </div>
        <div
          className={clsx('p-3 lg:rounded-md lg:p-0', {
            'dark:border-linear-box bg-white dark:bg-primary-gradient lg:bg-transparent lg:dark:bg-transparent':
              !isDesktop,
          })}
        >
          <div
            className='flex h-fit items-center justify-between pr-2  lg:cursor-pointer'
            onClick={() =>
              transfersOut?.length > 5 &&
              setVisiblePlayers((prev) => ({
                ...prev,
                departures: !visiblePlayers.departures,
              }))
            }
          >
            <h4 className='font-primary text-csm font-medium text-all-red'>
              {i18n.titles.latestDepartures}
            </h4>
            <HiOutlineChevronRight
              className={cn(
                'text-all-red',
                visiblePlayers.departures ? 'lg:rotate-90' : ''
              )}
            />
          </div>
          {transfersOutMemo?.map((item, idx) => (
            <TransferRow key={idx} data={item} transferType='departure' i18n={i18n} />
          ))}
        </div>
      </div>
      <BottomSheetComponent
        open={(visiblePlayers.arrivals || visiblePlayers.departures) && !isDesktop}
        onClose={() =>
          setVisiblePlayers({ arrivals: false, departures: false })
        }
      >
        {visiblePlayers.arrivals && (
          <div className='p-3'>
            <h4 className='sticky top-0 border-b border-gray-300 dark:border-gray-700 p-2 font-primary text-csm font-medium text-all-blue dark:bg-dark-gray bg-white'>
              {i18n.titles.latestArrivals}
            </h4>
            <Divider />
            {transfersIn?.map((item, idx) => (
              <TransferRow key={idx} data={item} transferType='arrival' i18n={i18n} />
            ))}
          </div>
        )}
        {visiblePlayers.departures && (
          <div className=''>
            <h4 className='sticky top-0 border-b border-gray-300 dark:border-gray-700 p-2 font-primary text-csm font-medium text-all-red dark:bg-dark-gray bg-white'>
              {i18n.titles.latestDepartures}
            </h4>
            <div className='[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:dark:border-gray-700 [&>*:not(:last-child)]:border-gray-300'>
              {transfersOut?.map((item, idx) => (
                <TransferRow key={idx} data={item} transferType='departure' i18n={i18n} />
              ))}
            </div>
          </div>
        )}
      </BottomSheetComponent>
    </div>
  );
};

const Tournament: React.FC<{ id?: string; name?: string }> = ({ id, name }) => {
  return (
    <div key={id} className='flex flex-col items-center gap-2'>
      <Avatar
        id={id}
        isBackground={false}
        type='competition'
        width={40}
        height={40}
        rounded={false}
      />
      <p className='text-center text-msm text-black dark:text-white'>{name}</p>
    </div>
  );
};

const TransferRow: React.FC<{
  data: Transfer;
  transferType: string;
  i18n?: any;
}> = ({ data, transferType, i18n }) => {
  const {
    player = {},
    transferFrom = {},
    transferTo = {},
    transferDateTimestamp,
    type,
    transferFeeDescription,
  } = data; 
  const [transferDesc, transferFeeText] = genTransferTexts(
    type,
    transferFeeDescription,
    i18n
  );

  const teamId = transferType === 'arrival' ? transferFrom.id : transferTo.id;

  return (
    <div>
      <CustomLink href={`/football/player/${player?.id}`} target='_parent'>
        <div className='flex justify-between p-2 hover:lg:dark:bg-dark-hover'>
          <div className='flex items-center gap-2'>
            <Avatar
              id={player?.id}
              isBackground={false}
              type='player'
              width={40}
              height={40}
              rounded={false}
            />
            <div className='flex flex-col'>
              <span className='text-csm text-black dark:text-white'>
                {player.name}
              </span>
              <div className='flex items-center gap-1.5 text-xs text-dark-text'>
                {transferDesc}
                <span className='text-xs font-normal leading-4 text-dark-win'>
                  {transferFeeText}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end justify-center'>
            <Avatar
              id={teamId}
              isBackground={false}
              type='team'
              width={20}
              height={20}
              rounded={false}
            />
            <p className='flex items-center gap-1.5 text-xs text-dark-text'>
              {formatTimestamp(transferDateTimestamp, 'yyyy-MM-dd')}
            </p>
          </div>
        </div>
      </CustomLink>
    </div>
  );
};
