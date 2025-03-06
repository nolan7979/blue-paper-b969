import useTrans from '@/hooks/useTrans';

import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';

import TeamStreakRow from '@/components/modules/basketball/quickviewColumn/quickViewMatchesTab/TeamStreakRow';
import { CompetitorDto, ITeamStreaksItem } from '@/constant/interface';

const TeamStreakSection = ({
  general = [],
  homeTeam,
  awayTeam,
  showChecked,
}: {
  general: ITeamStreaksItem[];
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  showChecked?: boolean;
}) => {
  const i18n = useTrans();
  if (
    general == undefined ||
    general == null ||
    Object.keys(general).length === 0
  ) {
    return <></>;
  }
  return (
    <div className='space-y-2 pb-4'>
      <TwQuickViewTitleV2 className='pl-2 uppercase lg:pl-0'>
        {i18n.match.teamStreak}
      </TwQuickViewTitleV2>

      <TwQuickViewSection className='mx-2 rounded-md lg:mx-0 lg:p-0'>
        <ul className='text-sm'>
          {general.map((item: ITeamStreaksItem, index: number) => {
            const { team = 'Home' } = item || {};
            const competitor = team === 'Home' ? homeTeam : awayTeam;
            return (
              <TeamStreakRow key={index} item={item} team1={competitor} />
            );
          })}
        </ul>
      </TwQuickViewSection>
    </div>
  );
};

export default TeamStreakSection;
