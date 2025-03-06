import clsx from 'clsx';
import { genBorderColors, getSlug } from '@/utils';
import CustomLink from '@/components/common/CustomizeLink';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { RankBadge } from '@/components/modules/hockey/competition/RankBadge';
import { useMemo } from 'react';
import { MatchRowIsolated as HockeyMatchRowIsolated } from '@/components/modules/hockey/match';
import useTrans from '@/hooks/useTrans';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/stores';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useRouter } from 'next/navigation';
import { useSelectedMatchData } from '@/hooks/useCommon';

export const MatchItemCupTree = ({ eventId}:{eventId: string}) => {
  const i18n = useTrans();
  const { resolvedTheme } = useTheme();
  const { homeSound } = useSettingsStore();
  const router = useRouter();

  const { data } = useSelectedMatchData(
    eventId || '', SPORT.ICE_HOCKEY
  );

  const handleClick = (match: SportEventDtoWithStat) => {
      router.push(`/${SPORT.ICE_HOCKEY}/match/${match.slug}/${match.id}`);
  };

  if(!data) return <></>

  return (
    <HockeyMatchRowIsolated
      key={data?.id}
      isDetail={false}
      match={data}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      onClick={handleClick}
      sport={SPORT.ICE_HOCKEY}
    />
  );
};
