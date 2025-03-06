/* eslint-disable @next/next/no-img-element */
import {useState} from 'react';

import CustomLink from '@/components/common/CustomizeLink';
import {BellOff, BellOn} from '@/components/icons';

import {useFollowStore} from '@/stores/follow-store';

function BellOnComponent({ onClick }: { onClick: () => void }) {
  // Define your BellOn component implementation here
  return (
    <div onClick={onClick} test-id='bell-on'>
      <BellOn />
    </div>
  );
}

function BellOffComponent({ onClick }: { onClick: () => void }) {
  // Define your BellOn component implementation here
  return (
    <div onClick={onClick} test-id='bell-off'>
      <BellOff className='h-4 w-4 cursor-pointer' />
    </div>
  );
}

function RowFollow({
  team,
  type,
  title,
  reverse,
}: {
  team: any;
  type: string;
  title: string;
  reverse?: boolean;
}) {
  const [err, setErr] = useState(false);
  const {
    removeTeam,
    removePlayer,
    removeTournament,
    addTeam,
    addTournament,
    addPlayer,
  } = useFollowStore();
  const urlLink =
    type === 'team'
      ? 'competitor'
      : type === 'player'
      ? 'player'
      : type === 'unique-tournament'
      ? 'football/competition'
      : '';

  const cancelFollow = () => {
    const item = { id: team?.id, name: team.name, slug: team.slug };
    if (type === 'team') {
      removeTeam(title.toLowerCase(), item);
    } else if (type === 'player') {
      removePlayer(title.toLowerCase(), item);
    } else if (type === 'unique-tournament') {
      removeTournament(title.toLowerCase(), item);
    }
  };
  const addFollow = () => {
    const item = { id: team?.id, name: team.name, slug: team.slug };
    if (type === 'team') {
      addTeam(title.toLowerCase(), item);
    } else if (type === 'player') {
      addPlayer(title.toLowerCase(), item);
    } else if (type === 'unique-tournament') {
      addTournament(title.toLowerCase(), item);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <CustomLink
          href={`/${urlLink}/${team.slug}/${team?.id}`}
          target='_parent'
        >
          <div className='flex items-center gap-2'>
            <div className='w-fit rounded-full'>
              <img
                src={
                  err && type === 'player'
                    ? '/images/football/players/unknown1.webp'
                    : err && type !== 'player'
                    ? '/images/football/teams/unknown-team.png'
                    : `https://api.sofascore.app/api/v1/${type}/${team?.id}/image`
                }
                alt=''
                className='h-8 w-8 rounded-full'
                onError={() => setErr(true)}
              />
            </div>
            <div className='flex flex-col'>
              <p className='text-ccsm'>{team.name}</p>
              <p className='text-msm'>
                <span className='text-msm text-logo-blue'>1M </span>Followers
              </p>
            </div>
          </div>
        </CustomLink>
        {reverse ? (
          <BellOffComponent onClick={() => addFollow()} />
        ) : (
          <BellOnComponent onClick={() => cancelFollow()} />
        )}
      </div>
    </div>
  );
}

export default RowFollow;
