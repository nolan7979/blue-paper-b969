import { SPORT } from '@/constant/common';
import { MatchRowIsolated } from '@/components/modules/table-tennis';
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
    eventId || '', SPORT.TABLE_TENNIS
  );

  const handleClick = (match: SportEventDtoWithStat) => {
      router.push(`/${SPORT.TABLE_TENNIS}/match/${match.slug}/${match.id}`);
  };

  if(!data) return <></>

  return (
    <MatchRowIsolated
      key={data?.id}
      isDetail={false}
      match={data}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      handleClick={handleClick}
      sport={SPORT.TABLE_TENNIS}
    />
  );
};
