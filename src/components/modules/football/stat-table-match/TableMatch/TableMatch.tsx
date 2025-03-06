import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import columns from '@/constant/table-stat/Group';

import BodyTable from '../BodyTable/BodyTable';
import Headertable from '../HeaderTable/Headertable';
function TableMatch({ statistic, team }: { statistic: any; team: any }) {
  const [group, setGroup] = useState(columns[0].id);
  const [selectTeam, setSelectteam] = useState('total');
  const [data, setData] = useState<any[]>([]);
  const [sorted, setSorted] = useState('statistics.rating');
  const { resolvedTheme } = useTheme();

  const handleChangeSelectTeam = (value: string) => {
    setSelectteam(value);
  };
  const handleChangeSorted = (value: string) => {
    if (sorted === value) {
      setSorted('-' + value);
    } else {
      setSorted(value);
    }
  };
  const sortData = (data: any[], sortingKey: string) => {
    return data.sort((a: any, b: any) => {
      const getValue = (obj: any, path: string) => {
        if (path[0] === '-') {
          path = path.substring(1);
        }
        const properties = path.split('.');
        if (properties[properties.length - 1] === 'duelLost') {
          return (obj.statistics.duelLost || 0) + (obj.statistics.duelWon || 0);
        }
        // arial duel won
        if (properties[properties.length - 1] === 'aerialLost') {
          return (
            (obj.statistics.aerialLost || 0) + (obj.statistics.aerialWon || 0)
          );
        }
        // duel ground
        if (properties[properties.length - 1] === 'aerialWon') {
          return (
            -(obj.statistics.aerialLost || 0) -
            (obj.statistics.aerialWon || 0) +
            (obj.statistics.duelLost || 0) +
            (obj.statistics.duelWon || 0)
          );
        }
        if (properties[properties.length - 1] === 'position') {
          switch (obj.player.position) {
            case 'F':
              return 4;
            case 'M':
              return 3;
            case 'D':
              return 2;
            case 'G':
              return 1;
          }
        }
        let value = obj;
        for (const prop of properties) {
          value = value?.[prop];
          if (value === undefined) break;
        }
        return value ?? 0;
      };
      const aValue = getValue(a, sortingKey);
      const bValue = getValue(b, sortingKey);
      return sortingKey[0] === '-' ? aValue - bValue : bValue - aValue; // Sort in descending order
    });
  };
  const homePlayersWithId = statistic.home.players
    .map((player: any) => ({
      ...player,
      player: {
        ...player.player,
        idOfTeam: team.homeTeam.id,
        teamCheck: 'home',
      },
    }))
    .filter((item: any) => item?.statistics?.rating !== undefined);
  const homeGoalKeeper = statistic.home.players
    .map((player: any) => ({
      ...player,
      player: {
        ...player.player,
        idOfTeam: team.homeTeam.id,
        teamCheck: 'home',
      },
    }))
    .filter(
      (item: any) =>
        item?.player?.position === 'G' && item?.statistics?.rating !== undefined
    );
  const awayPlayersWithId = statistic.away.players
    .map((player: any) => ({
      ...player,
      player: {
        ...player.player,
        idOfTeam: team.awayTeam.id,
        teamCheck: 'away',
      },
    }))
    .filter((item: any) => item?.statistics?.rating !== undefined);
  const awayGoalKeeper = statistic.away.players
    .map((player: any) => ({
      ...player,
      player: {
        ...player.player,
        idOfTeam: team.awayTeam.id,
        teamCheck: 'away',
      },
    }))
    .filter(
      (item: any) =>
        item?.player?.position === 'G' && item?.statistics?.rating !== undefined
    );
  const handleGroupClick = (id: number) => {
    setGroup(id);
    setSorted('statistics.rating');
  };
  useEffect(() => {
    if (selectTeam === 'total') {
      setData([...homePlayersWithId, ...awayPlayersWithId]);
    }
    if (selectTeam === 'home') {
      setData([...homePlayersWithId]);
    }
    if (selectTeam === 'away') {
      setData([...awayPlayersWithId]);
    }

    if (group === 5) {
      if (selectTeam === 'total') {
        setData([...homeGoalKeeper, ...awayGoalKeeper]);
      } else if (selectTeam === 'home') {
        setData([...homeGoalKeeper]);
      } else {
        setData([...awayGoalKeeper]);
      }
    }
    if (sorted) {
      setData((prevData) => sortData(prevData, sorted));
    }
  }, [selectTeam, sorted, group]);
  if (!statistic || !team) return <></>;

  return (
    <div>
      <div className='flex items-center gap-4 pb-3.5'>
        {columns.map((item) => (
          <button
            key={item.id}
            className={`text-sm ${
              group === item.id && resolvedTheme === 'dark'
                ? 'button-active-dark'
                : group === item.id && resolvedTheme !== 'dark'
                ? 'button-active'
                : group !== item.id && resolvedTheme === 'dark'
                ? 'button-dark'
                : 'button'
            }`}
            onClick={() => handleGroupClick(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <table className='w-full'>
        <Headertable
          columns={columns[group].data}
          home={team.homeTeam}
          away={team.awayTeam}
          selectTeam={selectTeam}
          sorted={sorted}
          onChange={handleChangeSelectTeam}
          onChangeSorted={handleChangeSorted}
        />
        <BodyTable data={data} columns={columns[group].data} />
      </table>
    </div>
  );
}

export default TableMatch;
