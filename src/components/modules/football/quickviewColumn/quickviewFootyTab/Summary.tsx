import { FC, useMemo } from 'react';
import { CompetitorDto } from '@/constant/interface';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';
import CornerSVG from '/public/svg/corner.svg';
import YellowCardSVG from '/public/svg/yellow-card.svg';
import TeamSummary from '@/components/modules/football/quickviewColumn/quickviewFootyTab/TeamSummary';
import Average from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Average';
import useTrans from '@/hooks/useTrans';

export type SummaryData = {
  homePPG: number | undefined;
  awayPPG: number | undefined;
  formRunHome: string[];
  formRunAway: string[];
  o25Potential: number | undefined;
  seasonOver25PercentageOverall: number | undefined;
  o15Potential: number | undefined;
  seasonOver15PercentageOverall: number | undefined;
  bttsPotential: number | undefined;
  seasonBTTSPercentage: number | undefined;
  avgPotential: number | undefined;
  seasonAVGOverall: number | undefined;
  cardsPotential: number | undefined;
  cardsAVGOverall: number | undefined;
  cornersPotential: number | undefined;
  cornersAVGOverall: number | undefined;
};

type SummaryProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: SummaryData;
};
const Summary: FC<SummaryProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();
  const formattedAverage = useMemo(() => {
    return [
      {
        title: i18n.footy_stats.over_25,
        titleValue: data?.o25Potential || 0,
        leagueAverage: data?.seasonOver25PercentageOverall
          ? `${data?.seasonOver25PercentageOverall}%`
          : '',
      },
      {
        title: i18n.footy_stats.over_15,
        titleValue: data?.o15Potential || 0,
        leagueAverage: data?.seasonOver15PercentageOverall
          ? `League Average: ${data?.seasonOver15PercentageOverall}%`
          : '',
      },
      {
        title: i18n.footy_stats.btts,
        titleValue: data?.bttsPotential || 0,
        leagueAverage: data?.seasonBTTSPercentage
          ? `League Average: ${data?.seasonBTTSPercentage}%`
          : '',
      },
      {
        title: i18n.footy_stats.goals_per_match,
        titleValue: data?.avgPotential || 0,
        leagueAverage: data?.seasonAVGOverall
          ? `League Average: ${data?.seasonAVGOverall}%`
          : '',
      },
      {
        title: i18n.footy_stats.cards,
        titleValue: data?.cardsPotential || 0,
        leagueAverage: data?.cardsAVGOverall
          ? `League Average: ${data?.cardsAVGOverall}`
          : '',
        icon: <YellowCardSVG />,
      },
      {
        title: i18n.statsLabel.corners,
        titleValue: data?.cornersPotential || 0,
        leagueAverage: data?.cornersAVGOverall
          ? `League Average: ${data?.cornersAVGOverall}`
          : '',
        icon: <CornerSVG />,
      },
    ];
  }, [data, i18n]);

  const hiddenPercent = [
    i18n.statsLabel.corners,
    i18n.footy_stats.goals_per_match,
    i18n.footy_stats.cards,
  ];

  return (
    <div className='flex flex-col gap-4'>
      <WrapperBorderLinearBox className='flex items-center justify-between p-3'>
        <TeamSummary
          team={homeTeam}
          ppg={data?.homePPG || 0}
          formRun={data?.formRunHome}
        />
        <span className='font-bold dark:text-white'>{i18n.footy_stats.vs}</span>
        <TeamSummary
          team={awayTeam}
          ppg={data?.awayPPG || 0}
          formRun={data?.formRunAway}
          isAway
        />
      </WrapperBorderLinearBox>
      <div className='grid grid-cols-2 gap-2'>
        {formattedAverage.map((item, index) => (
          <Average
            key={index}
            title={item.title}
            titleValue={item.titleValue}
            leagueAverage={item.leagueAverage}
            icon={item.icon}
            isShowedPercent={!hiddenPercent.includes(item.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default Summary;
