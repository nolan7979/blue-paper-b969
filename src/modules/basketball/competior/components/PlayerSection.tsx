import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { QvPlayer } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { TwFilterButton } from '@/components/modules/football/tw-components';
import { getSlug } from '@/utils';
import { SPORT } from '@/constant/common';

export const TeamPlayersSection = ({
  teamId,
  players = {},
  i18n,
  isMobile,
}: {
  teamId?: string;
  players: any;
  i18n: any;
  isMobile?: boolean;
}) => {
  const [viewType, setViewType] = useState<string>(() =>
    isMobile ? 'list_view' : 'box_view'
  );

  const { players: teamPlayers = [] } = players || {};

  useEffect(() => {
    if (isMobile) {
      setViewType('list_view');
    }
  }, [isMobile]);

  return (
    <div className='rounded-md bg-white dark:bg-dark-wrap-match p-4 space-y-4'>
      {!isMobile && (
        <div className='flex w-full gap-4'>
          <TwFilterButton
            isActive={viewType === 'box_view'}
            onClick={() => setViewType('box_view')}
          >
            {i18n.competitor.boxView}
          </TwFilterButton>
          <TwFilterButton
            isActive={viewType === 'list_view'}
            onClick={() => setViewType('list_view')}
          >
            {i18n.competitor.listView}
          </TwFilterButton>
        </div>
      )}
      <div>
        {viewType === 'box_view' && !isMobile && (
          <PlayersBoxView players={teamPlayers} />
        )}
        {viewType === 'list_view' && (
          <PlayersListView players={teamPlayers} i18n={i18n} />
        )}
      </div>
    </div>
  );
};

export const PlayersBoxView = ({ players }: { players: any[] }) => {
  console.log(players)
  return (
    <div className='space-y-4'>
      <TwPlayersGrid className=''>
        {players.map((playerData: any, idx: number) => {
          const player = playerData.player || {};

          return (
            <CustomLink
              href={`/basketball/player/${player.slug}/${player?.id}`}
              target='blank'
              key={`p-${idx}`}
            >
              <TwPlayerBox className='overflow-hidden border border-line-default dark:border-dark-gray bg-head-tab hover:border hover:border-logo-blue dark:bg-dark-main'>
                <div className='flex h-full flex-col place-content-center items-center justify-stretch space-y-1 overflow-hidden pt-2 dark:text-dark-text'>
                  <div className='relative'>
                    <Avatar id={player?.id} type='player' />
                    <span className=' absolute right-0 bottom-0 bg-dark-gray text-white text-csm rounded-full w-6 h-6 flex items-center justify-center'>
                      {player?.shirt_number || player?.shirtNumber || ''}
                    </span>
                  </div>
                  <div className='mt-4 flex h-full w-full flex-col items-center justify-center bg-white dark:bg-dark-gray'>
                    <div className='text-center text-ccsm font-medium leading-4 dark:text-dark-default'>
                      {player.name}
                    </div>
                    {(player.jerseyNumber || player.shirtNumber) && (
                      <div className='h-6'>
                        {player.jerseyNumber || player.shirtNumber || ''}
                      </div>
                    )}
                    {
                      player?.country && player?.country?.id != '' && (
                        <div className='flex items-center gap-1.5 text-xs text-dark-text'>
                          <Avatar
                            id={player?.country?.id}
                            type='country'
                            width={14}
                            height={14}
                            isBackground={false}
                            rounded={false}
                          />

                          {player.country?.name && (
                            <span className=' text-cxs uppercase leading-4'>
                              {player.country?.name}
                            </span>
                          )}
                        </div>
                      )
                    }
                  </div>
                </div>
              </TwPlayerBox>
            </CustomLink>
          );
        })}
      </TwPlayersGrid>
    </div>
  );
};

export const PlayersListView = ({
  players,
  i18n,
}: {
  players: any[];
  i18n: any;
}) => {
  return (
    <div className='space-y-4'>
      <ul className='divide-list'>
        {players.map((playerData: any, idx: number) => {
          const player = playerData.player || {};
          return (
            <li key={idx} className='item-hove py-3'>
              <CustomLink
                href={`/basketball/player/${player?.slug || getSlug(player?.name)}/${player?.id}`}
                target='blank'
              >
                {/* <QvPlayer
                  id={player?.id}
                  type='player'
                  name={player?.name}
                  shirtNo={player.shirtNumber}
                  playerData={playerData}
                  category={player.country?.name}
                  i18n={i18n}
                /> */}
                <div
                  className='relative flex cursor-pointer items-center gap-2'
                >
                  <Avatar id={player?.id} type='player' width={40} height={40} sport={SPORT.BASKETBALL} />
                  <div>
                    <h3 className='text-[13px] text-black dark:text-white'>{player?.name}</h3>
                    <div className='flex gap-2'>
                      <span className='text-[11px] text-black dark:text-white'>{player?.shirt_number}</span>
                      <span className='text-[11px] text-light-secondary'>
                        {player?.position}
                      </span>
                      {player?.country && (
                        <div className='flex items-center gap-1.5 text-xs text-dark-text'>
                          <Avatar
                            id={player?.country?.id}
                            type='country'
                            width={14}
                            height={14}
                            isBackground={false}
                            rounded={false}
                          />

                          {player.country?.name && (
                            <span className=' text-cxs uppercase leading-4'>
                              {player.country?.name}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CustomLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const TwPlayersGrid = tw.div`grid grid-cols-2 gap-1 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
export const TwPlayerBox = tw.div`aspect-h-1 aspect-w-1 flex items-center rounded-lg bg-light-match px-1 dark:bg-dark-match `;
