import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';

import { LOCAL_STORAGE } from '@/constant/common';
import { ITeamStreaksItem } from '@/constant/interface';
import { Images, getImage, isValEmpty } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

import CheckSVG from '/public/svg/check.svg';
import CloseSVG from '/public/svg/close.svg';
import { useLocaleStatsDetailHead } from '@/hooks/useFootball';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import vi from '~/lang/vi';
import en from '~/lang/en';

const TeamStreakRow = ({
  team1 = {},
  item,
  team2 = {},
  i18n = en
}: {
  team1: any;
  item: ITeamStreaksItem;
  team2?: any;
  i18n?: any;
}) => {
  const { locale } = useRouter();

  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    [locale]
  );
  const { name: streakName, value = '', continued, fields } = item || {};

  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);

  const { data: statsDetailData, refetch } = useLocaleStatsDetailHead(i18n.language);

  const stat = (statsLocale && JSON.parse(statsLocale)) || {};
  const [statTrans, setStatTrans] = useState(stat);

  useEffect(() => {
    const parseLocale = currentLocale && JSON.parse(currentLocale);
    if (parseLocale !== locale) {
      setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(locale));
      refetch();
    }
  }, [locale]);

  useEffect(() => {
    if (
      statsDetailData &&
      JSON.stringify(statsDetailData).length !== statsLocale?.length
    ) {
      setItem(LOCAL_STORAGE.statsLocaleDetail, JSON.stringify(statsDetailData));
      setStatTrans(statsDetailData);
    }
  }, [statsDetailData, statsLocale]);

  return (
    <li className='dev2 grid grid-cols-5 items-center px-4 py-2 lg:p-2'>
      <div className='dev2 col-span-3'>
        {fields && statTrans ? statTrans[fields] : streakName}
      </div>

      {isValEmpty(team2) && (
        <div className=''>
          <SoccerTeam
            logoUrl={`${getImage(Images.team, team1?.id)}`}
            name={team1.name}
            team={team1}
            showName={false}
          ></SoccerTeam>
        </div>
      )}
      {!isValEmpty(team2) && (
        <div className='flex  items-center gap-1'>
          <SoccerTeam
            logoUrl={`${getImage(Images.team, team1?.id)}`}
            name={team1.name}
            team={team1}
            showName={false}
          ></SoccerTeam>
          <SoccerTeam
            logoUrl={`${getImage(Images.team, team2?.id)}`}
            name={team2.name}
            team={team2}
            showName={false}
          ></SoccerTeam>
        </div>
      )}

      <div className='dev2 flex items-center justify-end space-x-2'>
        <span>{value}</span>
        <span>
          {continued == 1 && <CheckSVG></CheckSVG>}
          {continued == 0 && <CloseSVG></CloseSVG>}
        </span>
      </div>
    </li>
  );
};
export default TeamStreakRow;
