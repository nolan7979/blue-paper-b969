// import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { useFetchEventIncidents } from '@/hooks/useBasketball';
import { isValEmpty } from '@/utils';
import { useEffect, useState } from 'react';

import { TwQuickViewTitleV2 } from '@/components/modules/common';
import useTrans from '@/hooks/useTrans';

import MatchPerformanceAccordion from '@/components/modules/basketball/components/MatchPerformanceAccordion';

const MatchPerfomanceSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const { id } = matchData || {};
  const status: StatusDto = matchData?.status;
  const { data } = useFetchEventIncidents(id, status?.code);

  const handleGroupDataPerformance = (sourceArr: any[]) => {
    const arrKeyIndex = sourceArr.reduce((val: any, it: any, index) => {
      if (it.text !== '') {
        val = [
          ...val,
          {
            index,
            key: it.text,
          },
        ];
      }
      return val;
    }, []);

    const sliceData = arrKeyIndex.reduce(
      (val: any, it: any, idx: any, initArr: any) => {
        let arr = [];
        if (idx < arrKeyIndex.length) {
          if (idx === arrKeyIndex.length - 1) {
            arr = sourceArr.slice(initArr[idx].index);
          } else {
            arr = sourceArr.slice(initArr[idx].index, initArr[idx + 1].index);
          }
          val = {
            ...val,
            [it.key]: arr,
          };
        }
        return val;
      },
      {}
    );

    return sliceData;
  };

  const [keyOpen, setKeyOpen] = useState<string>('');
  const [perfomanceData, setPerfomanceData] = useState<any>({});

  useEffect(() => {
    setKeyOpen('');
    setPerfomanceData({});
    if (!isValEmpty(data) && data?.incidents.length > 0) {
      const groupDataPerformance = handleGroupDataPerformance(data.incidents);
      setPerfomanceData(groupDataPerformance);
      setKeyOpen(Object.keys(groupDataPerformance)[0]);
    }
  }, [data]);

  if (!Object.keys(perfomanceData)) {
    return <></>;
  }
  return (
    <div>
      {Object.keys(perfomanceData).length > 0 && <TwQuickViewTitleV2>{i18n.match.matchPerformance}</TwQuickViewTitleV2>}
      <MatchPerformanceAccordion data={perfomanceData} />
    </div>
  );
};
export default MatchPerfomanceSection;
