import { TwQuickViewH2HSection } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { TwTitle } from '@/components/modules/football/tw-components';

import { SportEventDtoWithStat } from '@/constant/interface';
import { formatTimestamp } from '@/utils';

export const AboutMatchSection = ({
  i18n,
  matchData,
}: {
  i18n: any;
  matchData: SportEventDtoWithStat;
}) => {
  return (
    <div className='space-y-2'>
      <TwQuickViewH2HSection className='space-y-2 p-4 leading-7 dark:!bg-dark-sub-bg-main xl:rounded-xl'>
        <TwTitle className=''>{i18n.titles.about_match}</TwTitle>
        <p className='text-csm'>
          Bạn đang xem trực tiếp kết quả trận đấu {matchData.homeTeam.name} vs{' '}
          {matchData.awayTeam.name} ngày{' '}
          {formatTimestamp(matchData?.startTimestamp, 'dd/MM/Y')} Vào Lúc{' '}
          {formatTimestamp(matchData?.startTimestamp, 'HH:mm')} giờ, Trận đấu{' '}
          {matchData.roundInfo && matchData.roundInfo.round !== 0
            ? ` tại vòng ${matchData.roundInfo.round}`
            : ''}{' '}
          của giải đấu {matchData.tournament.name},
          {matchData.venue?.city?.name
            ? ` diễn ra trên sân. ${matchData.venue?.city?.name}`
            : ''}{' '}
          Sân nhà của {matchData.homeTeam.name}.
          {matchData.referee?.name
            ? ` Trọng tài điều khiển trận đấu là ông ${matchData.referee.name}`
            : ''}
        </p>
      </TwQuickViewH2HSection>
    </div>
  );
};
