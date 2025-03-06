import { TournamentDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { format } from 'date-fns';
import { useMemo } from 'react';
import tw from 'twin.macro';

const TournamentInfo: React.FC<{
  tournament?: TournamentDto;
  startTimestamp: number;
  roundInfo: Record<string, any>;
}> = ({ startTimestamp, tournament, roundInfo }) => {
  const i18n = useTrans();
  const formattedDate = useMemo(() => {
    try {
      return format(new Date(startTimestamp * 1000), 'MMMM dd, yyyy • HH:mm');
    } catch (error) {
      return '';
    }
  }, [startTimestamp]);

  return (
    <div className='flex flex-col justify-between'>
      <TwContentVenue className='text-black dark:!text-white'>
        {tournament?.name}
        {roundInfo && roundInfo?.round > 0 && Object.values(roundInfo).length > 0
          ? `, ${i18n.football.round} ${roundInfo.round}`
          : ''}
      </TwContentVenue>
      <div className='text-csm dark:text-dark-text' test-id='match-info-date'>{formattedDate}</div>
    </div>
  );
};

export default TournamentInfo;

export const TwContentVenue = tw.span`text-csm dark:text-dark-text`;
