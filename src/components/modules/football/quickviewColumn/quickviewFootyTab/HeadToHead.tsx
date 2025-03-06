import { FC, useMemo } from 'react';
import { CompetitorDto } from '@/constant/interface';
import { InfoHomeAndAwayTeam } from '@/components/modules/football/quickviewColumn/QuickViewInfoHomeAndAwayTeam';
import useTrans from '@/hooks/useTrans';
import Average from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Average';

export type HeadToHeadData = {
  totalMatches: number;
  teamAWins: number;
  draw: number;
  teamBWins: number;
  over15Percentage: number;
  over15: number;
  over25Percentage: number;
  over25: number;
  over35Percentage: number;
  over35: number;
  bttsPercentage: number;
  btts: number;
  clubACSPercentage: number;
  clubBCSPercentage: number;
};

type HeadToHeadProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: HeadToHeadData;
};

const HeadToHead: FC<HeadToHeadProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();

  const formattedAverage = useMemo(() => {
    return [
      {
        title: i18n.footy_stats.over_15,
        titleValue: data?.over15Percentage || 0,
        leagueAverage: `${data.over15}/${data?.totalMatches} ${i18n.statsLabel.matches}`,
      },
      {
        title: i18n.footy_stats.over_25,
        titleValue: data?.over25Percentage || 0,
        leagueAverage: `${data.over25}/${data?.totalMatches} ${i18n.statsLabel.matches}`,
      },
      {
        title: i18n.footy_stats.over_35,
        titleValue: data?.over35Percentage || 0,
        leagueAverage: `${data.over35}/${data?.totalMatches} ${i18n.statsLabel.matches}`,
      },
      {
        title: i18n.footy_stats.btts,
        titleValue: data?.bttsPercentage || 0,
        leagueAverage: `${data.btts}/${data?.totalMatches} ${i18n.statsLabel.matches}`,
      },
      {
        title: i18n.statsLabel.cleanSheets,
        titleValue: data?.teamAWins || 0,
        leagueAverage: homeTeam?.shortName || homeTeam?.name || '',
      },
      {
        title: i18n.statsLabel.cleanSheets,
        titleValue: data?.teamBWins || 0,
        leagueAverage: awayTeam?.shortName || awayTeam?.name || '',
      }
    ];
  }, [data, i18n]);

  return (
    <div className='flex flex-col gap-[10px]'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.head_to_head_stats}
      </h4>
      <InfoHomeAndAwayTeam
        i18n={i18n}
        isH2H
        infoAway={awayTeam}
        infoHome={homeTeam}
        content={{
          start: data.teamAWins,
          middle: data.draw,
          end: data.teamBWins,
        }}
        type='team'
      />
      <div className='grid grid-cols-2 gap-2'>
        {formattedAverage.map((item, index) => (
          <Average
            key={index}
            title={item.title}
            titleValue={item.titleValue}
            leagueAverage={item.leagueAverage}
          />
        ))}
      </div>
    </div>
  );
};

export default HeadToHead;
