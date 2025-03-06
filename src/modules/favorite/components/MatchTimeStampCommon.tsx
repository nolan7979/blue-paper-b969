import MatchTimeStampFootball from '@/components/modules/football/match/MatchTimeStamp';
import MatchTimestampBasketball from '@/components/modules/basketball/match/MatchTimeStamp';
import MatchTimestampBaseball from '@/components/modules/baseball/match/MatchTimeStamp';
import MatchTimestampBadminton from '@/components/modules/badminton/match/MatchTimeStamp';
import MatchTimestampVolleyball from '@/components/modules/volleyball/match/MatchTimeStamp';
import MatchTimestampAMFootball from '@/components/modules/am-football/match/MatchTimeStamp';
import MatchTimestampHockey from '@/components/modules/hockey/match/MatchTimeStamp';
import MatchTimestampCricket from '@/components/modules/cricket/match/MatchTimeStamp';
import {
  MatchTimeStamp as MatchTimestampTTennis,
} from '@/components/modules/table-tennis';
import {
  MatchTimeStamp as MatchTimestampTennis,
} from '@/components/modules/tennis';
import useTrans from '@/hooks/useTrans';
import { SPORT } from '@/constant/common';

const MatchTimeStampCommon = ({match, sport}:any) => {
  const i18n = useTrans()
  const {
    startTimestamp = 0,
    id,
    time,
    status,
  } = match || {};
  const tournament = match?.tournament ? match?.tournament : match?.uniqueTournament
  const currentPeriodStartTimestamp = match?.time?.currentPeriodStartTimestamp ? match?.time?.currentPeriodStartTimestamp : 0;
  const remainTime = match?.time?.remainTime ? match?.time?.remainTime : 0;
  const runSeconds = match?.time?.runSeconds ? match?.time?.runSeconds : 0;
  const countDown = match?.time?.countDown ? match?.time?.countDown : 0;
  return(
    <>
      {
        sport == SPORT.FOOTBALL && <MatchTimeStampFootball
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          competition={tournament}
          showTime={false}
          sport={sport}
        />
      }

      {
        sport == SPORT.BASKETBALL && <MatchTimestampBasketball
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={tournament}
          showTime={false}
          runSeconds={runSeconds}
          countDown={countDown}
        />
      }

      {
        sport == SPORT.BASEBALL && <MatchTimestampBaseball
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={tournament}
          showTime={false}
        />
      }

      {
        sport == SPORT.BADMINTON && <MatchTimestampBadminton
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={tournament}
          showTime={false}
        />
      }

      {
        sport == SPORT.ICE_HOCKEY && <MatchTimestampHockey
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={tournament}
          showTime={false}
          runSeconds={runSeconds}
          countDown={countDown}
        />
      }

      {
        sport == SPORT.CRICKET && <MatchTimestampCricket
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={tournament}
          showTime={false}
        />
      }

      {
        sport == SPORT.VOLLEYBALL && <MatchTimestampVolleyball
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={tournament}
          showTime={false}
        />
      }

      {
        sport == SPORT.TABLE_TENNIS && <MatchTimestampTTennis
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          competition={tournament}
          showTime={false}
        />
      }

      {
        sport == SPORT.TENNIS && <MatchTimestampTennis
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          competition={tournament}
          showTime={false}
        />
      }

      {
        sport == SPORT.AMERICAN_FOOTBALL && <MatchTimestampAMFootball
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={tournament}
          showTime={false}
        />
      }
    </>
  )
}

export default MatchTimeStampCommon;