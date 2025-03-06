import { SeasonDto, SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';
import { useMatchLeague } from '@/hooks/useAmericanFootball';
import MatchRowLeague from '@/components/modules/am-football/competition/MatchRowLeague';
import { SPORT } from '@/constant/common';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useDetectDeviceClient } from '@/hooks';

type MatchesProps = {
  selectedSeason: SeasonDto;
};

export const Matches: React.FC<any> = ({ seasonId, isShowedHeader = true }) => {
  const i18n = useTrans();
  const { isMobile } = useDetectDeviceClient();
  const { push } = useRouter();

  const { data: matchDataLast = [], isLoading: isMatchLoadingLast } =
    useMatchLeague(seasonId, 'last');
  const { data: matchDataNext = [], isLoading: isMatchLoadingNext } =
    useMatchLeague(seasonId, 'next');

  const matchData = [...matchDataLast, ...matchDataNext];

  const onClick = (match: SportEventDtoWithStat) => {
    push(`/${SPORT.AMERICAN_FOOTBALL}/match/${match.slug}/${match.id}`);
  };

  if (isMatchLoadingNext || isMatchLoadingLast) {
    return (
      <div
        className={clsx(
          'flex flex-col gap-4 px-4',
          {
            'bg-white py-4 dark:bg-dark-container': !isMobile,
            'bg-transparent': isMobile,
          }
        )}
      >
        {isShowedHeader && (
          <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.titles.matches}
          </h3>
        )}
        {/* {renderFilter()} */}
        <MatchSkeleton />
      </div>
    );
  }

  if (isMatchLoadingNext || (isMatchLoadingLast && !matchData?.length)) {
    return (
      <div
        className={clsx(
          'flex flex-col gap-4 px-4',
          {
            'bg-white py-4 dark:bg-dark-container': !isMobile,
            'bg-transparent': isMobile,
          }
        )}
      >
        {isShowedHeader && (
          <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.titles.matches}
          </h3>
        )}
        <EmptyEvent title={i18n.common.nodata} content={''} />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-col gap-4  px-4',
        {
          'bg-white py-4 dark:bg-dark-container': !isMobile,
          'bg-transparent': isMobile,
        }
      )}
    >
      {isShowedHeader && (
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
      )}
      {/* {renderFilter()} */}
      <div>
        <RenderIf isTrue={!matchData?.length}>
          <EmptyEvent title={i18n.common.nodata} content='' />
        </RenderIf>
        {matchData?.map((match: any) => {
          return (
            <MatchRowLeague
              key={match?.id}
              match={match}
              i18n={i18n}
              onClick={onClick}
              sport={SPORT.AMERICAN_FOOTBALL}
            />
          );
        })}
      </div>
    </div>
  );
};
