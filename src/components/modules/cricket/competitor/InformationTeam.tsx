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

type InformationTeamProps = {
  manager: Partial<Manager>;
  foundationDate?: number;
  country: Partial<Country>;
  venue: Partial<Venue>;
  uniqueTournaments: Partial<UniqueTournament>[];
  teamTransfers: TeamTransfers;
};

export const InformationTeam: React.FC<InformationTeamProps> = ({
  manager,
  foundationDate,
  country,
  venue,
  uniqueTournaments,
  teamTransfers,
}) => {
  const i18n = useTrans();
  const { transfersIn = [], transfersOut = [] } = teamTransfers || {};

  return (
    <div className='flex flex-col lg:flex-row'>
      <div className='border-r-1 flex flex-1 flex-col gap-4 bg-dark-container p-4'>
        <div>
          <h3 className='font-primary text-sm font-bold uppercase text-white'>
            {/* // Todo: update translate later */}
            {i18n.competitor.informationTem}
          </h3>
          <div className='flex justify-between border-b border-dashed border-light-darkGray py-3'>
            <span className='text-csm'>{i18n.competitor.coach}</span>
            <CustomLink
              href={`/cricket/manager/${manager?.id}`}
              target='_parent'
            >
              <span className='flex items-center gap-0.5 text-csm leading-4 text-logo-blue'>
                {manager?.name}
                <HiOutlineChevronRight />
              </span>
            </CustomLink>
          </div>
          <div className='flex justify-between border-b border-dashed  border-light-darkGray py-3'>
            <span className='text-csm'>{i18n.competitor.foundationDate}</span>
            <span className='text-csm text-white'>{foundationDate}</span>
          </div>
          <div className='flex justify-between py-3'>
            <span className='text-csm'>{i18n.competitor.country}</span>
            <span className='text-csm text-white'>{country?.name}</span>
          </div>
        </div>
        <div>
          <h3 className='font-primary text-sm font-bold uppercase text-white'>
            {i18n.titles.venue}
          </h3>
          <div className='flex justify-between border-b border-dashed border-light-darkGray py-3'>
            <span className='text-csm'>{i18n.titles.venue}</span>
            <span className='text-csm text-white'>{venue?.stadium?.name}</span>
          </div>
          <div className='flex justify-between border-b border-dashed  border-light-darkGray py-3'>
            <span className='text-csm'>{i18n.qv.location}</span>
            <span className='text-csm text-white'>{venue?.city?.name}</span>
          </div>
          <div className='flex justify-between py-3'>
            <span className='text-csm'>{i18n.competitor.capacity}</span>
            <span className='text-csm text-white'>
              {venue?.stadium?.capacity}
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-primary text-sm font-bold uppercase text-white'>
            {i18n.drawerMobile.tournaments}
          </h3>
          <div className='grid grid-cols-3 gap-3'>
            {uniqueTournaments?.map((item: any) => (
              <Tournament key={item?.id} id={item?.id} name={item?.name} />
            ))}
          </div>
        </div>
      </div>
      <div className='flex flex-1 flex-col  gap-3 bg-dark-container p-4'>
        <h3 className='font-primary text-sm font-bold uppercase text-white'>
          {/* // Todo: update translate later */}
          {i18n.competitor.transfer}
        </h3>
        <div>
          <div className='flex h-fit items-center justify-between pr-2'>
            <h4 className='font-primary text-csm font-medium text-all-blue'>
              {i18n.titles.latestArrivals}
            </h4>
            <HiOutlineChevronRight className='text-all-blue' />
          </div>
          {transfersIn.slice(0, 5)?.map((item, idx) => (
            <TransferRow key={idx} data={item} transferType='arrival' />
          ))}
        </div>
        <div>
          <div className='flex h-fit items-center justify-between pr-2'>
            <h4 className='font-primary text-csm font-medium text-all-red'>
              {i18n.titles.latestDepartures}
            </h4>
            <HiOutlineChevronRight className='text-all-red' />
          </div>
          {transfersOut.slice(0, 5)?.map((item, idx) => (
            <TransferRow key={idx} data={item} transferType='departure' />
          ))}
        </div>
      </div>
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
      <p className='text-center text-msm text-white'>{name}</p>
    </div>
  );
};

const TransferRow: React.FC<{
  data: Transfer;
  transferType: string;
}> = ({ data, transferType }) => {
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
    transferFeeDescription
  );

  const teamId = transferType === 'arrival' ? transferFrom.id : transferTo.id;

  return (
    <CustomLink href={`/cricket/player/${player?.id}`} target='_parent'>
      <div className='flex justify-between p-2 hover:bg-dark-hover'>
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
            <span className='text-csm text-white'>{player.name}</span>
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
  );
};
