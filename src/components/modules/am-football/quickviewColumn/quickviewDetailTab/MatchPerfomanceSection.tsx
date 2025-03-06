import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { useFetchEventIncidents } from '@/hooks/useAmericanFootball';
import { formatSecondToHourView, isValEmpty } from '@/utils';
import { useMemo } from 'react';

import IconPoint from '/public/svg/amf-point.svg';
import IconPointExtra from '/public/svg/amf-point-extra.svg';
import IconAMFootball from '/public/svg/sport/am-football.svg';

import { TwQuickViewTitleV2 } from '@/components/modules/common';
import useTrans from '@/hooks/useTrans';
import { handleIncidentDataAMF } from '@/utils/americanFootballUtils';

const MatchPerformanceSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const { id } = matchData || {};
  const status: StatusDto = matchData?.status;
  const { data } = useFetchEventIncidents(id, status?.code);

  // handle array for UI
  const incidentData: any = useMemo(() => {
    if (!isValEmpty(data) && data?.incidents.length > 0)
      return handleIncidentDataAMF(data.incidents);
    return {};
  }, [data]);

  if (isValEmpty(incidentData)) {
    return <></>;
  }
  return (
    <div>
      <TwQuickViewTitleV2>{i18n.match.matchPerformance}</TwQuickViewTitleV2>
      <div className='space-y-2 rounded-md p-4 dark:bg-dark-card'>
        {Object.keys(incidentData).length > 0 &&
          Object.keys(incidentData).map((it: any, idx: number) => (
            <div key={it + idx} className='w-full'>
              {incidentData[it].map((row: any, index: any) => {
                let showScoreIncident: any = [];
                if (incidentData[it].length == 1) {
                  if (row.extra == 1) {
                    showScoreIncident = Object.values(incidentData)[idx];
                  } else if (row.type == 1 && row.extra == 1) {
                    showScoreIncident = [
                      ...incidentData['bg'],
                      { homeScore: 0, awayScore: 0 },
                    ];
                  } else {
                    showScoreIncident = Object.values(incidentData)[idx + 1];
                  }
                } else {
                  showScoreIncident = incidentData[it];
                }
                return (
                  <RowPerformanceItem
                    key={it + idx + index}
                    content={row}
                    totalScore={showScoreIncident?.[1]}
                  />
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};
export default MatchPerformanceSection;

const renderIconPoint = (code: number) => {
  switch (code) {
    case 7:
      return <IconPointExtra style={{ with: 22 }} />;
    case 8:
      return <IconPoint style={{ with: 22 }} />;
    case 9:
      return <IconAMFootball style={{ with: 22 }} />;
    default:
      return '';
  }
};

const renderByExtraCode = (code: number) => {
  switch (code) {
    case 105:
      return 'OVERTIME ENDS';
    case 100:
      return 'FT';
    case 6:
      return 'SAFETY';
    case 0:
      return 'UNKNOWN';
    case 1:
    case 2:
    case 3:
    case 4:
      return `Q${code}`;
    case 10:
      return 'TWO POINT CONVERSION';
    default:
      return '';
  }
};

const RowPerformanceItem = ({ content, totalScore }: any) => (
  <li
    className={`mb-2 flex w-full items-center gap-1 last:mb-0 ${
      content.position === 2 ? 'justify-end' : ''
    }`}
  >
    {content?.type == 2 ? (
      <>
        <RowPerformanceItemV2
          content={content}
          totalScore={totalScore}
          position={1}
        />
        <div className='w-[50px] text-center text-csm text-light-secondary'>
          {formatSecondToHourView(content?.second)}
        </div>
        <RowPerformanceItemV2
          content={content}
          totalScore={totalScore}
          position={2}
        />
      </>
    ) : (
      content?.type != 7 && (
        <div
          className={`h-8 w-full rounded-md bg-white text-center text-[13px] uppercase leading-8 text-black dark:bg-dark-card dark:text-white`}
        >
          {content?.extra == 100
            ? `${renderByExtraCode(content?.extra)} ${content?.homeScore} - ${
                content?.awayScore
              }`
            : `${renderByExtraCode(content?.extra)} ${
                totalScore?.homeScore
              } - ${totalScore?.awayScore}`}{' '}
        </div>
      )
    )}
  </li>
);

const RowPerformanceItemV2 = ({ content, totalScore, position }: any) => {
  return (
    <div className='h-[40px] min-w-[170px]'>
      {position === content.position && (
        <div
          className={`flex ${
            content?.position == 2 && 'flex-row-reverse'
          }  items-center justify-between border-t-2 bg-line-default dark:bg-dark-stadium ${
            content?.position == 2
              ? 'border-light-detail-away'
              : 'border-logo-blue'
          } gap-2 p-[11px] text-black dark:text-white`}
        >
          {}
          {renderIconPoint(content?.extra)}
          <div
            className={`flex-1 text-[8px] ${
              content?.position == 2 && 'text-right'
            }`}
          >
            <div>{content?.player?.name}</div>
          </div>
          <div className='whitespace-nowrap font-oswald text-[15px] font-bold text-light-green dark:text-dark-green'>
            {`${content?.homeScore} - ${content?.awayScore}`}
          </div>
        </div>
      )}
    </div>
  );
};
