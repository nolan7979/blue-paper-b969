import { useSelectedMatchAllData } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { AddFavorite } from '@/modules/favorite';
import CheckIconSport from '@/modules/favorite/components/CheckIconSport';
import LeagueRowCommon from '@/modules/favorite/components/LeagueRowCommon';

import MatchRowIsolateCommon, {
  IMatchFavorite,
} from '@/modules/favorite/components/MatchRowIsolateCommon';
import { groupByDate } from '@/utils/matchFilter';
import { ISelectedFavorite, useMatchStore } from '@/stores/match-store';
import { isMatchEndAllSport } from '@/utils';
import { GroupByLeague, GroupBySport } from '@/utils/matchFilter';
import { memo, useEffect, useMemo, useState } from 'react';
import { TwBorderLinearBox } from '@/components/modules/common';

const MatchFavoriteTab: React.FC<{
  favoriteMatchData: any[];
  setOpen: () => void;
}> = ({ favoriteMatchData, setOpen }) => {
  const i18n = useTrans();
  const { selectedFavorite, setSelectedFavorite } = useMatchStore();
  const [matchesWithStatus, setMatchesWitchStatus] = useState<any>([]);
  const [matchesUpcoming, setMatchesUpcoming] = useState<any>([]);
  const [matchesFinished, setMatchesFinished] = useState<any>([]);
  const [filter, setFilter] = useState<string>('upcoming');
  const params =
    favoriteMatchData?.map((item: any) => ({
      id: item?.matchId || '',
      sport: item?.sport,
    })) || [];
  const { data } = useSelectedMatchAllData(params);

  useEffect(() => {
    if (!data) return;
    const matches = favoriteMatchData?.map((item: any) => {
      const match = data?.find((match: any) => match?.id === item?.matchId);
      return { ...item, ...match };
    });
    setMatchesWitchStatus(matches);
  }, [favoriteMatchData, data]);

  useEffect(() => {
    if (matchesWithStatus.length === 0 || favoriteMatchData.length === 0) {
      setMatchesUpcoming([]);
      setMatchesFinished([]);
      return;
    }

    const [upcoming, finished] = matchesWithStatus.reduce(
      (result: any[], item: any) => {
        const isFinished = isMatchEndAllSport(item?.status?.code, item?.sport);
        if (isFinished) {
          result[1].push(item);
        } else {
          result[0].push(item);
        }
        return result;
      },
      [[], []]
    );

    setMatchesUpcoming(groupByDate(upcoming, 'asc'));
    setMatchesFinished(groupByDate(finished, 'asc'));
    if(upcoming.length > 0 && finished.length == 0) {
      setFilter('upcoming')
    }
    if(finished.length > 0 && upcoming.length == 0) {
      setFilter('finished')
    }
  }, [
    matchesWithStatus,
    favoriteMatchData,
    setMatchesUpcoming,
    setMatchesFinished,
  ]);

  const HandleChangeQuickview = () => {
    if(!favoriteMatchData.some((item: IMatchFavorite) => item.matchId === selectedFavorite?.id)) {
      if (favoriteMatchData.length == 0) {
        const selectedData: ISelectedFavorite = {
          id: '',
          sport: '',
          type: 'match',
        };
        setSelectedFavorite(selectedData);
      }
      if (favoriteMatchData.length > 0) {
        const selectedData: ISelectedFavorite = {
          id: favoriteMatchData[0]?.matchId,
          sport: favoriteMatchData[0]?.sport,
          type: 'match',
        };
        setSelectedFavorite(selectedData);
      }
    }
  }

  useEffect(() => {
    if (favoriteMatchData.length == 0 && selectedFavorite?.id != '') {
      const selectedData: ISelectedFavorite = {
        id: '',
        sport: '',
        type: 'match',
      };
      setSelectedFavorite(selectedData);
    }
    if (favoriteMatchData.length > 0 && selectedFavorite?.id == '') {
      const selectedData: ISelectedFavorite = {
        id: favoriteMatchData[0]?.matchId,
        sport: favoriteMatchData[0]?.sport,
        type: 'match',
      };
      setSelectedFavorite(selectedData);
    }
    HandleChangeQuickview();
  }, [favoriteMatchData]);

  const matchesShow = useMemo(() => {
    if (filter === 'upcoming') return matchesUpcoming;
    if (filter === 'finished') return matchesFinished;
    return [];
  }, [filter, matchesUpcoming, matchesFinished]);

  if (matchesShow.length == 0)
    return (
      <>
        <FilterMatchMemoized filter={filter} setFilter={setFilter} />
        <AddFavorite
          setOpen={setOpen}
          type='match'
          textTitle={i18n.favorite.titleMatch}
          textDesc='Events of your favourite teams and competitions will show up here.'
        />
      </>
    );

  return (
    <>
      <FilterMatchMemoized filter={filter} setFilter={setFilter} />
      {matchesShow.length > 0 &&
        matchesShow.map((groupDate: any) => (
          <GroupDate groupDate={groupDate} key={groupDate.date} />
        ))}
    </>
  );
};
export default MatchFavoriteTab;

const FilterMatch = ({ filter, setFilter }: any) => {
  const i18n = useTrans();

  return (
    <div className='flex space-x-2'>
      {[
        { label: `${i18n.filter.upcoming} / ${i18n.filter.live}`, value: 'upcoming' },
        { label: i18n.filter.finished, value: 'finished' },
      ].map((item) => {
        return (
          <TwBorderLinearBox
            key={item.value}
            className={`h-full w-fit !rounded-full border border-line-default dark:border-0 dark:bg-primary-gradient ${
              filter === item.value ? 'dark:border-linear-form' : ''
            }`}
          >
            <button
              test-id={`btn-type-${item.value}`}
              onClick={() => setFilter(item.value)}
              className={`text-csm font-medium flex h-full w-full items-center justify-center gap-x-1 !rounded-full px-3 py-1.5 capitalize transition-colors  duration-300 ${
                filter === item.value
                  ? 'dark:bg-button-gradient bg-dark-button text-white dark:text-white'
                  : ''
              }`}
            >
              {item.label}
            </button>
          </TwBorderLinearBox>
        );
      })}
    </div>
  );
};

const FilterMatchMemoized = memo(FilterMatch, (prevProps, nextProps) => {
  return prevProps?.filter === nextProps?.filter;
});

const GroupDate = ({ groupDate }: any) => {
  return (
    <div className='space-y-3'>
      <h3 className='text-csm text-black dark:text-dark-default'>
        {groupDate?.date}
      </h3>
      <GroupSport groupSport={groupDate.matches} key={groupDate.date} />
    </div>
  );
};

const GroupSport = ({ groupSport }: any) => {
  const groupBySport: any = GroupBySport(groupSport);
  return (
    <div className='space-y-2'>
      {groupBySport &&
        groupBySport.length > 0 &&
        groupBySport.map((gLeague: any) => (
          <GroupLeague groupLeague={gLeague} key={gLeague.sport} />
        ))}
    </div>
  );
};

const GroupLeague = ({ groupLeague }: any) => {
  const groupByLeague: any = GroupByLeague(groupLeague?.matches);
  return (
    <div className='space-y-2'>
      {groupByLeague &&
        groupByLeague.length > 0 &&
        groupByLeague.map((match: any) => (
          <GroupMatch groupMatch={match} key={match.tournament} />
        ))}
    </div>
  );
};

const GroupMatch = ({ groupMatch }: any) => {
  const infoLeague: any = {
    id: groupMatch.tournament,
    sport: groupMatch.sport,
  };
  return (
    <div className='space-y-3'>
      <div className='dark:border-linear-box custom-bg-white relative rounded-md p-3 dark:bg-primary-gradient'>
        <div className='mb-2 flex items-center justify-between'>
          <LeagueRowCommon league={infoLeague} />
          <div className='text-white'>
            <CheckIconSport sport={groupMatch?.sport} />
          </div>
        </div>
        <div className='space-y-2'>
          {groupMatch?.matches &&
            groupMatch?.matches.length > 0 &&
            groupMatch?.matches?.map((match: any) => (
              <MatchRowIsolateCommon match={match} key={match.matchId} />
            ))}
        </div>
      </div>
    </div>
  );
};
