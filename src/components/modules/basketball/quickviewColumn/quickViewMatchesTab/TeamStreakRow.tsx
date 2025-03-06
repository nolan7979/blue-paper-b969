import { ITeamStreaksItem } from '@/constant/interface';

import CheckSVG from '/public/svg/check-green.svg';
import Avatar from '@/components/common/Avatar';
import { useStastLocale } from '@/hooks/useFootball/useStatsLocale';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { LOCAL_STORAGE } from '@/constant/common';
import { useLocaleStatsDetailHead } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

const TeamStreakRow = ({
  team1 = {},
  item,
  team2 = {},
}: {
  team1?: any;
  item?: ITeamStreaksItem;
  team2?: any;
}) => {
  // const statsInfo = useStastLocale();
  const i18n = useTrans();
  // const { name: streakName, value = '', continued, fields } = item || {};
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

  // const teamStreakLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  // const team_streak = JSON.parse(teamStreakLocale!);

  return (
    <li className='dev2 grid grid-cols-5 items-center px-4 py-2 lg:p-2'>
      <div className=''>
        <Avatar
          id={team1?.id}
          type='team'
          width={20}
          height={20}
          isBackground={false}
          rounded={false}
        />
      </div>

      <div className='dev2 col-span-3 text-center'>
        {(fields && statTrans[fields]) || fields}
      </div>

      <div className='dev2 flex items-center justify-end space-x-2'>
        <span>{value}</span>
        <span className='stroke-dark-green'>
          <CheckSVG></CheckSVG>
        </span>
      </div>
    </li>
  );
};
export default TeamStreakRow;
