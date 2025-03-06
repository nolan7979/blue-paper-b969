import useTrans from '@/hooks/useTrans';
import { formatMarketValue } from '@/utils';
// icon
import PlayerAttributeOverviewGraph from '@/components/modules/football/players/PlayerAttributeOverviewGraph';
import { PlayerCharcteristicsSection } from '@/pages/football/player/[...playerParams]';

const PlayerMoreDetail = ({
  playerDetail
}: {
  playerDetail: any;
}) => {
  const i18n = useTrans();

  const { value: marketValue, currency } = playerDetail?.proposedMarketValueRaw;
  return (
    <div className='bg-white dark:bg-dark-card lg:rounded-lg block lg:flex'>
      <div className="w-full lg:w-1/2 border-r border-line-default dark:border-dark-time-tennis p-4">
        <div className='flex bg-white dark:bg-dark-head-tab border border-line-default dark:border-transparent rounded-md mb-6'>
          <div className='flex items-center'>
            <div className='place-content-center items-center gap-x-4 text-center px-2.5 border-r border-line-default dark:border-dark-time-tennis'>
              <span className='block text-[11px] uppercase dark:text-dark-text'>
                {i18n.player.values}
              </span>{' '}
              <span className='font-bold text-logo-blue text-csm whitespace-nowrap'>
                {`${formatMarketValue(marketValue)} ${currency}`}
              </span>
            </div>
          </div>
          <div className='flex justify-between p-2.5 text-sm w-full'>
            <span className='flex-[0_1_50%] text-xs dark:text-dark-text'>
              {i18n.player.isCrease}
            </span>
            {/* <div className='flex space-x-2'>
              <button className='flex h-9 w-9 flex-col items-end justify-center rounded-md border border-light-stroke dark:border-gray-light dark:bg-dark-stroke'>
                <ArrowUpIcon className='mx-auto w-2 text-all-blue' />
                <CurrenyIcon className='mx-auto w-5' />
              </button>
              <button className='flex h-9 w-9 flex-col items-end justify-center rounded-md border border-light-stroke dark:border-gray-light dark:bg-dark-stroke'>
                <CurrenyIcon className='mx-auto w-5' />
                <ArrowDownIcon className='mx-auto w-2 text-light-detail-away' />
              </button>
            </div> */}
          </div>
        </div>
        <PlayerCharcteristicsSection player={playerDetail} />
      </div>
      <div className="w-full lg:w-1/2 p-4">
        <PlayerAttributeOverviewGraph player={playerDetail} />
      </div>
    </div>
  );
};

export default PlayerMoreDetail;