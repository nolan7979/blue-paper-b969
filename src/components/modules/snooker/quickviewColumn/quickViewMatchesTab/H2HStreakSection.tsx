import useTrans from '@/hooks/useTrans';

import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import TeamStreakRow from '@/components/modules/football/quickviewColumn/quickViewMatchesTab/TeamStreakRow';

const H2HStreakSection = ({
  head2head = {},
  homeTeam = {},
  awayTeam = {},
}: {
  head2head: any;
  homeTeam: any;
  awayTeam: any;
}) => {
  const i18n = useTrans();
  if (
    head2head == undefined ||
    head2head == null ||
    Object.keys(head2head).length === 0
  ) {
    return <></>;
  }
  return (
    <TwMbQuickViewWrapper className='space-y-2 dark:bg-dark-card rounded-lg lg:p-4'>
      <TwQuickViewTitleV2 className='pl-2 uppercase lg:pl-0 pt-0'>
        {i18n.match.head2headStreak}
      </TwQuickViewTitleV2>

      <TwQuickViewSection className=''>
        <ul className='divide-list text-sm'>
          {head2head.map((item: any, index: number) => {
            const { team = 'Home' } = item || {};
            let team1: any = null;
            let team2: any = null;
            if (team === 'Home') {
              team1 = homeTeam;
            } else if (team === 'Away') {
              team1 = awayTeam;
            } else if (team === 'Both') {
              team1 = homeTeam;
              team2 = awayTeam;
            }

            return (
              <TeamStreakRow
                key={index}
                item={item}
                team1={team1}
                team2={team2}
              />
            );
          })}
        </ul>
      </TwQuickViewSection>
    </TwMbQuickViewWrapper>
  );
};
export default H2HStreakSection;
