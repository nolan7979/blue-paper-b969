import { SPORT } from '@/constant/common';
import { MatchRowIsolated } from '@/components/modules/cricket/match/MatchRowIsolated';
import useTrans from '@/hooks/useTrans';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useRouter } from 'next/navigation';
import { useSelectedMatchData } from '@/hooks/useCommon';

export const MatchItemCupTree = ({ eventId}:{eventId: string}) => {
  const i18n = useTrans();
  const router = useRouter();

  const { data } = useSelectedMatchData(
    eventId || '', SPORT.CRICKET
  );

  const handleClick = (match: SportEventDtoWithStat) => {
      router.push(`/${SPORT.CRICKET}/match/${match.slug}/${match.id}`);
  };

  if(!data) return <></>

  return (
    <MatchRowIsolated
      key={data?.id}
      match={data}
      i18n={i18n}
      onClick={handleClick}
      sport={SPORT.CRICKET}
      homeSound=''
    />
  );
};
