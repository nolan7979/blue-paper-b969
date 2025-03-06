import { TransfersSection } from '@/components/modules/football/players/TransfersSection';

const PlayerTransfer = ({
  playerDetail,
  transfers
}: {
  playerDetail: any;
  transfers: any[];
}) => {
  return (
    <div className='bg-white dark:bg-dark-card lg:rounded-lg block lg:flex'>
      <TransfersSection
        player={playerDetail}
        transfers={[...transfers]}
        proposedMarketValueRaw={playerDetail?.proposedMarketValueRaw}
      ></TransfersSection>
    </div>
  );
};

export default PlayerTransfer;