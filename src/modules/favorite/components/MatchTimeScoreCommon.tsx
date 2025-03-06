import MatchTimeScoreFootball from '@/components/modules/football/match/MatchTimeScore';
import MatchTimeScoreBasketball from '@/components/modules/basketball/match/MatchTimeScore';
import MatchTimeScoreBaseball from '@/components/modules/baseball/match/MatchTimeScore';
import { MatchTimeScore  as MatchTimeScoreBadminton} from '@/components/modules/badminton/match';
import MatchTimeScoreVolleyball from '@/components/modules/volleyball/match/MatchTimeScore';
import MatchTimeScoreAMFootball from '@/components/modules/am-football/match/MatchTimeScore';
import MatchTimeScoreHockey from '@/components/modules/hockey/match/MatchTimeScore';
import MatchTimeScoreCricket from '@/components/modules/cricket/match/MatchTimeScore';
import MatchTimeScoreTTennis from '@/components/modules/table-tennis/match/MatchTimeScore';
import MatchTimeScoreTennis from '@/components/modules/tennis/match/MatchTimeScore';
import useTrans from '@/hooks/useTrans';
import { SPORT } from '@/constant/common';
import { useEffect, useState } from 'react';
import { getScores } from '@/components/modules/hockey/match';
import { useMatchScores } from '@/hooks/useHockey/useMatchScores';

const MatchTimeScoreCommon = ({match, sport}:any) => {
  const i18n = useTrans()
  const homeScore = match?.homeScore;
  const awayScore = match?.awayScore;
  // console.log(match?.scores ? match?.scores : {ft:[0,0]})
  const scores = match?.scores && Object.keys(match?.scores).length > 0 ? match?.scores : {ft:[0,0]}

  let isScoreNotAvailable = false

  // score hockey
  const { scores: scoreH } = getScores(match?.scores);
  const [homeScoreH, setHomeScoreH] = useState<number | string>(scores[0]);
  const [awayScoreH, setAwayScoreH] = useState<number | string>(scores[1]);

  const matchScores = useMatchScores(match) as { [key: string]: any };

  useEffect(() => {
    if (Object.keys(matchScores).length === 0) return
    setHomeScoreH(matchScores.ft[0]);
    setAwayScoreH(matchScores.ft[1]);
  }, [matchScores]);

  if(!match) return <></>

  return(
    <>
      {
        sport == SPORT.FOOTBALL && <MatchTimeScoreFootball
          match={match}
          homeScore={homeScore}
          status={match.status}
          awayScore={awayScore}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }

      {
        sport == SPORT.BASKETBALL && <MatchTimeScoreBasketball
          match={match}
          homeScore={homeScore}
          status={match.status}
          awayScore={awayScore}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }

      {
        sport == SPORT.BASEBALL && <MatchTimeScoreBaseball
          match={match}
          status={match.status}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }

      {
        sport == SPORT.BADMINTON && <MatchTimeScoreBadminton
          match={match}
          scores={scores}
          status={match.status}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }

      {
        sport == SPORT.ICE_HOCKEY && <MatchTimeScoreHockey
          match={match}
          homeScore={homeScoreH}
          awayScore={awayScoreH}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }

      {
        sport == SPORT.CRICKET && <MatchTimeScoreCricket match={match} status={match.status} i18n={i18n} />
      }

      {
        sport == SPORT.VOLLEYBALL && <MatchTimeScoreVolleyball
          match={match}
          status={match.status}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }

      {
        sport == SPORT.TABLE_TENNIS && <MatchTimeScoreTTennis
          match={match}
          homeScore={homeScore}
          status={match.status}
          awayScore={awayScore}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }

      {
        sport == SPORT.TENNIS && <MatchTimeScoreTennis match={match} status={match.status} i18n={i18n} />
      }

      {
        sport == SPORT.AMERICAN_FOOTBALL && <MatchTimeScoreAMFootball
          match={match}
          scores={scores}
          status={match.status}
          isScoreNotAvailable={isScoreNotAvailable}
          i18n={i18n}
        />
      }
    </>
  )
}

export default MatchTimeScoreCommon;