// import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { isValEmpty } from '@/utils';
import { useEffect, useState } from 'react';

import { TwQuickViewTitleV2 } from '@/components/modules/common';
import useTrans from '@/hooks/useTrans';

import MatchPerformanceAccordion from '@/components/modules/hockey/components/MatchPerformanceAccordion';
import { useFetchEventIncidents } from '@/hooks/useCommon/useEventData';
import { SPORT } from '@/constant/common';

const MatchPerfomanceSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const { id } = matchData || {};
  const status: StatusDto = matchData?.status;
  const { data } = useFetchEventIncidents(id, status?.code, SPORT.ICE_HOCKEY);
  const [perfomanceData, setPerfomanceData] = useState<any>([]);

  useEffect(() => {
    setPerfomanceData([]);
    if (!isValEmpty(data) && data?.incidents.length > 0) {
      setPerfomanceData(data.incidents.toReversed());
    }
  }, [data]);

  if (perfomanceData.length === 0) {
    return <></>;
  }
  return (
    <div>
      {perfomanceData.length > 0 && <TwQuickViewTitleV2>{i18n.match.matchPerformance}</TwQuickViewTitleV2>}
      <MatchPerformanceAccordion data={perfomanceData} />
    </div>
  );
};
export default MatchPerfomanceSection;
