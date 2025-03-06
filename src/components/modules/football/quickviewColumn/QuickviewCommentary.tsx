import Avatar from '@/components/common/Avatar';
import { EmptyEvent } from '@/components/common/empty';
import { TwBorderLinearBox } from '@/components/modules/common';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useCommentaryData } from '@/hooks/useCommon/useEventData';
import useTrans from '@/hooks/useTrans';
import { Commentary } from '@/models/interface';
import { getLocaleSEOContext, isMatchLive } from '@/utils';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import en from '~/lang/en';

const IMAGE_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const QuickViewCommentary = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const [filter, setFilter] = useState('all');
  const { homeTeam, awayTeam } = matchData;
  const locale = getLocaleSEOContext(i18n.language);
  const [commentaryDisplay, setCommentaryDisplay] = useState<Commentary[]>([]);
  const {
    data: commentaryData,
    isLoading,
    refetch,
  } = useCommentaryData(matchData.id, SPORT.FOOTBALL,locale);

  const memoizedCommentaryData = useMemo(() => {
    return commentaryData?.comments
      ? [...commentaryData.comments].reverse()
      : [];
  }, [commentaryData]);

  useEffect(() => {
    if (isMatchLive(matchData.status?.code)) {
      const intervalId = setInterval(() => {
        refetch();
      }, 15 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [matchData]);

  useEffect(() => {
    if (filter === 'all') {
      setCommentaryDisplay(memoizedCommentaryData);
    } else {
      setCommentaryDisplay(
        memoizedCommentaryData.filter((comment) => !!comment.incidentType)
      );
    }
  }, [memoizedCommentaryData, filter]);

  if (!isLoading && commentaryData?.comments?.length === 0) {
    return <EmptyEvent content={i18n.common.nodata} />;
  }

  return (
    <div className='p-2.5'>
      <FilterButton filter={filter} setFilter={setFilter} i18n={i18n} />
      <div>
        <div className='space-y-3 dark:text-white'>
          {commentaryDisplay.map((comment, index) => {

            // todo: need to refactor use CND for images ${IMAGE_CDN_URL}/public/svg/
            const iconUrl = comment?.incidentType
              ? `/images/${comment?.incidentType}${
                  comment.incidentClass ? `-${comment?.incidentClass}` : ''
                }.svg`
              : '';
                

            let label = comment?.incidentType?.includes('var')
              ? 'var'
              : comment?.incidentClass || comment?.incidentType
              ?  `${comment?.incidentClass ? comment?.incidentClass + '_' : ''}${comment?.incidentType}`
              : '';
            if (comment?.incidentType === 'goal') {
              label = `${comment?.incidentType}`;
            }
            const teamId =
              comment.position == 1
                ? homeTeam?.id
                : comment?.position === 2
                ? awayTeam?.id
                : '';
            const playerId = comment?.player?.id || '';
            return (
              <div
                key={index}
                className='rounded-lg bg-white p-3 dark:bg-[#151820]'
              >
                <div className='flex gap-x-2 text-sm font-medium'>
                  <span className='min-w-12 text-center whitespace-nowrap'>{comment.time || (comment.incidentType === 'period' || (index === 0  && !comment.time)? i18n.common.FT : "0'")}</span>
                  <div className='flex w-full flex-col gap-2'>
                    {comment.incidentType !== 'substitution' ? (
                      <IncidentCommentary
                        label={label}
                        iconUrl={comment.incidentType !== 'period' && iconUrl ? iconUrl : ''}
                        teamId={teamId}
                        playerId={playerId}
                        content={comment.text?.replace(comment?.time, '')}
                      />
                    ) : (
                      <SubstituteCommentary comment={comment} teamId={teamId} i18n={i18n} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickViewCommentary;

export const PlayerName = ({
  nameIn,
  nameOut,
  idIn,
  idOut,
  i18n,
}: {
  nameIn: string | undefined;
  nameOut: string | undefined;
  idIn: string | undefined;
  idOut: string | undefined;
  i18n: any;
}) => {
  return (
    <>
      <div className='flex items-center gap-x-2'>
        <Avatar id={idIn} type='player' width={24} height={24} isSmall />
        <span>{nameIn}</span>
        <span className='text-xs text-blue-600'>({i18n.incident.in})</span>
      </div>
      <div className='flex items-center gap-x-2'>
        <Avatar id={idOut} type='player' width={24} height={24} isSmall />
        <span>{nameOut}</span>
        <span className='text-xs text-red-600'>({i18n.incident.out})</span>
      </div>
    </>
  );
};

const IncidentCommentary = ({
  label,
  iconUrl,
  teamId,
  playerId,
  content,
}: {
  label: string;
  iconUrl: string | undefined;
  teamId: string;
  playerId: string;
  content: string;
}) => {
  const i18n = useTrans();
  return (
    <div className='flex w-full items-start justify-start gap-2'>
      <span className='mt-[2px] min-h-4 min-w-4'>
        {iconUrl && (
          <img src={iconUrl} alt='type' loading='lazy' className='size-4' />
        )}
      </span>
      <div className='w-full flex-1'>
        <div className='flex w-full flex-1 justify-between'>
          <div className='flex gap-x-2'>
            {label && (
              <span className='min-w-fit font-semibold'>
                {i18n.incident[label as keyof typeof i18n.incident]}
              </span>
            )}
          </div>
          {playerId && (
            <div className='relative'>
              <Avatar
                id={playerId}
                type='player'
                width={24}
                height={24}
                isSmall
              />
              <Avatar
                className='absolute right-[10px] top-[15px]'
                id={teamId}
                type='team'
                width={16}
                height={16}
                isSmall
                isBackground={false}
              />
            </div>
          )}
        </div>
        {content && <span>{content}</span>}
      </div>
    </div>
  );
};

const SubstituteCommentary = ({
  comment,
  teamId,
  i18n = en,
}: {
  comment: Commentary;
  teamId: string;
  i18n: any;
}) => {
  const { playerIn, playerOut } = comment;
  return (
    <div className='flex w-full items-start justify-start gap-2'>
      <span className='mt-[2px] min-h-4 min-w-4'>
        {comment.position > 0 && (
          <img
            src={`${IMAGE_CDN_URL}/public/svg/sub.svg`}
            alt='substitute'
            loading='lazy'
            className='size-4'
          />
        )}
      </span>
      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex gap-2'>
            <span className='text-base font-semibold dark:text-white'>
              {i18n.incident[comment?.incidentType as keyof typeof i18n.incident]}
            </span>
          </div>
          <Avatar
            id={teamId}
            type='team'
            width={24}
            height={24}
            isSmall
            isBackground={false}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <PlayerName
            nameIn={playerIn?.name}
            nameOut={playerOut?.name}
            idIn={playerIn?.id}
            idOut={playerOut?.id}
            i18n={i18n}
          />
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({
  filter,
  setFilter,
  i18n
}: {
  filter: string;
  setFilter: (filter: string) => void;
  i18n: any;
}) => {
  const filterItems = [
    { label: i18n.filter.all, value: 'all' },
    { label: i18n.filter.highlights, value: 'highlight' },
  ];

  return (
    <div className='mb-4 flex gap-2'>
      {filterItems.map((item, index) => (
        <TwBorderLinearBox
          key={item.value}
          className={`h-full min-h-[35px] w-fit !rounded-full  ${
            filter === item.value ? 'border-linear-form' : ''
          }`}
        >
          <div
            className={clsx(
              'flex h-full min-h-[35px] w-full items-center justify-center rounded-full px-3 font-medium hover:cursor-pointer dark:text-white',
              filter === item.value
                ? 'dark:bg-button-gradient bg-dark-button text-white'
                : ''
            )}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </div>
        </TwBorderLinearBox>
      ))}
    </div>
  );
};

export const incidentCommentaryType: Record<number, string> = {
  1: 'Goal',
  2: 'Corner',
  3: 'YellowCard',
  4: 'RedCard',
  5: 'Offside',
  6: 'FreeKick',
  7: 'GoalKick',
  8: 'Penalty',
  9: 'Substitution',
  10: 'Start',
  11: 'Midfield',
  12: 'End',
  13: 'HalftimeScore',
  15: 'CardUpgradeConfirmed',
  16: 'PenaltyMissed',
  17: 'OwnGoal',
  19: 'InjuryTime',
  21: 'ShotsOnTarget',
  22: 'ShotsOffTarget',
  23: 'Attacks',
  24: 'DangerousAttack',
  25: 'BallPossession',
  26: 'OvertimeIsOver',
  27: 'PenaltyKickEnded',
  28: 'VAR',
  29: 'PenaltyShootOut',
  30: 'PenaltyMissedShootOut',
};
