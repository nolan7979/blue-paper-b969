// import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { useFetchEventIncidents } from '@/hooks/useBasketball';
import { formatSecondToHourView, isValEmpty } from '@/utils';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';

import ArrowDown from '/public/svg/arrow-down.svg';

const MatchPerfomanceSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {

  const { id } = matchData || {};
  const status: StatusDto = matchData?.status;
  const { data } = useFetchEventIncidents(
    id,
    status?.code
  );

  const handleGroupDataPerformance = (sourceArr: any[]) => {
    const arrKeyIndex = sourceArr.reduce((val:any, it: any, index) => {
      if(it.text !== "") {
        val = [...val, {
          index,
          key: it.text
        }]
      }
      return val
    }, [])
  
    const sliceData = arrKeyIndex.reduce((val:any, it: any, idx:any, initArr:any) => {
      let arr = [];
      if (idx < arrKeyIndex.length) {
        if(idx === arrKeyIndex.length - 1) {
          arr = sourceArr.slice(initArr[idx].index);
        } else {
          arr = sourceArr.slice(initArr[idx].index, initArr[idx+1].index);
        }
        val = {
          ...val,
          [it.key]: arr
        }
      }
      return val
    }, {})

    return sliceData
  }

  const [keyOpen, setKeyOpen] = useState<string>('')
  const [perfomanceData, setPerfomanceData] = useState<any>({})

  useEffect(() => {
    setKeyOpen('')
    setPerfomanceData({})
    if (!isValEmpty(data) && data?.incidents.length > 0) {
      const groupDataPerformance = handleGroupDataPerformance(data.incidents)
      setPerfomanceData(groupDataPerformance)
      setKeyOpen(Object.keys(groupDataPerformance)[0])
    }
  }, [data])

  // const { homeTeam, awayTeam, awayScore = {} as any, homeScore = {} as any } = matchData || {};

  if (isValEmpty(data)) {
    return <></>;
  }
  return (
    <div>
      {
        Object.keys(perfomanceData).length > 0 && Object.keys(perfomanceData).map((pItem:any) => (
          <div className="bg-dark-card mb-2" key={pItem}>
            <HeadAccordion className='dark:bg-primary-gradient cursor-pointer' onClick={() => setKeyOpen(pItem)}>
              <span className='inline-block mr-2'>{`${pItem} ${perfomanceData[pItem][0].homeScore} - ${perfomanceData[pItem][0].awayScore}`}</span>
              <ArrowDown />
            </HeadAccordion>
            <BodyAccordion>
              {
                keyOpen === pItem && (
                  <ul className='w-full mt-3'>
                    {
                      perfomanceData[pItem].map((item:any, index:any) => 
                        {
                          if(item.text === '') {
                            return (
                              <RowPerfomanceItem content={item} key={index} />
                            )
                          }
                        }
                      )
                    }
                  </ul>
                )
              }
            </BodyAccordion>
          </div>
        ))
      }
    </div>
  );
};
export default MatchPerfomanceSection;

const HeadAccordion = tw.div`flex items-center justify-center text-csm uppercase text-white w-full h-[32px] rounded-md`;
const BodyAccordion = tw.div`w-full`;

const RowPerfomanceItem = ({content}:any) => (
  <li className={`flex w-full items-center mb-4 ${!content.isHome && 'flex-row-reverse'} last:mb-0`}>
    <div className={`flex ${!content.isHome && 'flex-row-reverse'} items-center justify-end w-[calc(50%-25px)] bg-dark-stadium h-[40px] border-t-2 ${!content.isHome ? 'border-light-detail-away' : 'border-logo-blue'} text-white gap-2 p-[11px]`}>
      <div className='text-[8px]'>
        <div>{`${content.homeScore} - ${content.awayScore}`}</div>
        <div className='text-light-secondary'>J.Hardy</div>
      </div>
      <div className='font-bold text-xl text-dark-green'>{content.incidentScore}</div>
    </div>
    <div className='w-[50px] text-center text-csm text-light-secondary'>{formatSecondToHourView(content.timeSeconds)}</div>
  </li>
)