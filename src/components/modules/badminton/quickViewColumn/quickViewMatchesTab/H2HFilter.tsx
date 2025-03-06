import clsx from 'clsx';

import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';


import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import { useSportName } from '@/hooks';

export const H2HFilter = ({
  h2HFilter,
  setH2HFilter,
  matchData,
  i18n,
}: {
  h2HFilter?: string;
  setH2HFilter?: any;
  matchData?: any;
  i18n?: any;
}) => {
  const sport = useSportName();
  const { homeTeam = {}, awayTeam = {} } = matchData || {};
  return (
    <TwTabHead>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'home' ? 'border-linear-form' : ''
        }`}
      >
        <div
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full hover:cursor-pointer',
            h2HFilter === 'home' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('home')}
        >
          <HandleGroupAvatar team={homeTeam} size={24} sport={sport} onlyImage />
        </div>
      </TwBorderLinearBox>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'away' ? 'border-linear-form' : ''
        }`}
      >
        <div
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full hover:cursor-pointer',
            h2HFilter === 'away' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('away')}
        >
          <HandleGroupAvatar team={awayTeam} size={24} sport={sport} onlyImage/>
        </div>
      </TwBorderLinearBox>
    </TwTabHead>
  );
};
