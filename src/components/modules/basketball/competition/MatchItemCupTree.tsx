import { SPORT } from '@/constant/common';
import { MatchRowIsolated as BkbMatchRowIsolated } from '@/components/modules/basketball/match';
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
    eventId || '', SPORT.BASKETBALL
  );

  const handleClick = (match: SportEventDtoWithStat) => {
      router.push(`/${SPORT.BASKETBALL}/match/${match.slug}/${match.id}`);
  };

  if(!data) return <></>

  return (
    <BkbMatchRowIsolated
      key={data?.id}
      isDetail={false}
      match={data}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      onClick={handleClick}
      sport={SPORT.BASKETBALL}
    />
  );
};
