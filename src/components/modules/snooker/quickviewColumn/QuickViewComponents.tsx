/* eslint-disable @next/next/no-img-element */
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import Link from 'next/link';
import { use, useCallback, useMemo, useState } from 'react';
import tw from 'twin.macro';

import 'tippy.js/dist/tippy.css'; // optional

import useRenderOptional from '@/hooks/useFootball/useFootballOptionTag';
import { useStastLocale } from '@/hooks/useFootball/useStatsLocale';
import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import { Match } from '@/components/modules/football/quickviewColumn/QuickViewStandingsTab';
import { RatingBadge } from '@/components/modules/football/RatingBadge';

import { LINEUPS_TAB, SPORT } from '@/constant/common';
import { CompetitorDto, SportEventDto } from '@/constant/interface';
import { formatTimestamp, getAgeFromTimestamp, getSlug, Images } from '@/utils';

import AssistSVG from '/public/svg/assist.svg';
import GoalBlueSVG from '/public/svg/goal-blue.svg';
import OwnGoalSVG from '/public/svg/goal-own.svg';
import GoalPenSVG from '/public/svg/goal-pen.svg';
import GoalPenMissSVG from '/public/svg/goal-pen-miss.svg';
import SubstituteSVG from '/public/svg/substitute.svg';
import YellowRedCardSVG from '/public/svg/yellow-red-card.svg';
import vi from '~/lang/vi';
import { useRouter } from 'next/router';
import { teal } from '@mui/material/colors';
import CustomizeLink from '@/components/common/CustomizeLink';

// import RedCrossSVG from '/public/svg/red-cross.svg';
// import StadiumSVG from '/public/svg/stadium.svg';
// import SubLineUpSVG from '/public/svg/sub-line-up.svg';

export const TwPlayerRow = tw.li`py-2 border-none`;
export const TwUnvailablePlayerRow = tw.li`px-4 py-2 lg:px-0 flex justify-between items-center`;

export interface QvManagerProps {
  name: string;
  imgUrl: string;
  rating?: number;
  shirtNo?: number;
}

export const QvManager = ({ name, imgUrl }: QvManagerProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const i18n = useTrans();

  return (
    <div className=' flex items-center gap-3'>
      <div className='h-12 w-12'>
        <img
          src={isError ? '/images/football/players/unknown1.webp' : imgUrl}
          onError={() => {
            setIsError(true);
          }}
          alt=''
          className='w-full rounded-full object-contain'
        ></img>
      </div>
      <div className=''>
        <p className='text-semibold'>{name}</p>
        <p className='text-xs text-dark-text'>{i18n.qv.manager}</p>
      </div>
    </div>
  );
};

export interface QvPlayerProps {
  name: string;
  imgUrl?: string;
  rating?: number;
  shirtNo?: number;
  imgSize?: number;
  playerData?: any;
  isHome?: boolean;
  category?: string;
  i18n?: any;
  type?: keyof typeof Images;
  id?: string;
  activeTab?: keyof typeof LINEUPS_TAB;
  height?: number;
  coutry?: string;
  teamId?: string;
  birthday?: number;
  isNationality?: boolean;
  slug?: string;
}

export const QvPlayer = ({
  name,
  rating = 0,
  shirtNo = 0,
  imgSize = 32,
  playerData = {},
  isHome = true,
  category = '',
  i18n = vi,
  id,
  activeTab,
  height,
  coutry,
  teamId,
  birthday,
  isNationality,
}: QvPlayerProps) => {
  const {
    yellow,
    redCard,
    yellowRed,
    regularGoals,
    numAssists,
    ownGoals,
    penGoals,
    missedPens,
    subIn,
    subEvent = {},
  } = playerData || {};

  const { playerOut = {}, time = 0, addedTime = 0 } = subEvent || {};
  const renderOptional = useRenderOptional({
    activeTab: activeTab as string,
    birthday,
    height,
    country: coutry,
    teamId,
    isNationality,
    getAgeFromTimestamp,
  });

  return (
    <div
      className=' relative flex items-center gap-2'
      test-id='player-line-up-info'
    >
      <Avatar id={id} type='player' width={imgSize} height={imgSize} isSmall />
      {activeTab && (
        <div
          className='absolute -top-4 left-3  h-min'
          test-id='optional-no-data'
        >
          {renderOptional}
        </div>
      )}
      <div className='flex flex-1 justify-between'>
        <div className=''>
          <div className='flex flex-col'>
            {category && (
              <div className='text-xs text-dark-text'>
                <span>{category}</span>
              </div>
            )}
            <div
              className=' text-light-defaul flex items-center gap-x-2 text-csm font-normal'
              test-id='player-shirtNo'
            >
              {shirtNo > 0 ? `${shirtNo}`.padStart(2, '0') + ' - ' : ''}
              <div
                className='flex  justify-start gap-y-1 text-xss font-normal text-light-default dark:text-white'
                test-id='player-shirtNo-name'
              >
                {name}
              </div>

              {regularGoals > 0 && (
                <span className=''>
                  <GoalBlueSVG className='inline-block h-4 w-4'></GoalBlueSVG>
                  {regularGoals > 1 && <sub>{`x${regularGoals}`}</sub>}
                </span>
              )}
              {penGoals > 0 && (
                <span className=''>
                  {isHome ? (
                    <GoalPenSVG className='inline-block h-5 w-5 text-logo-blue'></GoalPenSVG>
                  ) : (
                    <GoalPenSVG className='inline-block h-5 w-5  text-logo-yellow'></GoalPenSVG>
                  )}
                  {penGoals > 1 && <sub>{`x${penGoals}`}</sub>}
                </span>
              )}
              {missedPens > 0 && (
                <span className=''>
                  <GoalPenMissSVG className='inline-block h-5 w-5 text-dark-loss'></GoalPenMissSVG>
                  {missedPens > 1 && <sub>{`x${missedPens}`}</sub>}
                </span>
              )}
              {ownGoals > 0 && (
                <span className=''>
                  <OwnGoalSVG className='inline-block h-5 w-5 text-dark-loss'></OwnGoalSVG>

                  {ownGoals > 1 && <sub>{`x${ownGoals}`}</sub>}
                </span>
              )}
              {numAssists > 0 && (
                <span className=''>
                  {isHome ? (
                    <AssistSVG className='inline-block h-5 w-5 text-logo-blue'></AssistSVG>
                  ) : (
                    <AssistSVG className='inline-block h-5 w-5  text-logo-yellow'></AssistSVG>
                  )}
                  {numAssists > 1 && <sub>{`x${numAssists}`}</sub>}
                </span>
              )}
              {yellow > 0 && (
                <span>
                  <YellowCard size='xs'></YellowCard>
                </span>
              )}
              {redCard > 0 && (
                <span>
                  <RedCard size='xs'></RedCard>
                </span>
              )}
              {yellowRed > 0 && (
                <span>
                  <YellowRedCardSVG className='h-5 w-5'></YellowRedCardSVG>
                </span>
              )}
            </div>
          </div>

          {/* TODO out player */}
          {subIn && (
            <div
              test-id='out-player'
              className='flex items-center gap-2 text-xs font-normal text-light-default dark:text-dark-text'
            >
              <SubstituteSVG className='h-4 w-4' />
              <span>
                {i18n.timeline.out}: {playerOut?.name}
              </span>
            </div>
          )}
        </div>
        {rating > 0 && (
          <div className='flex items-center' test-id='player-out-point'>
            <RatingBadge point={rating}></RatingBadge>
          </div>
        )}
      </div>
    </div>
  );
};

export const QvPlayerV2 = ({
  name,
  imgSize = 36,
  slug,
  id,
  isHome,
  typeReason,
}: QvPlayerProps & { typeReason?: string }) => {
  const statsInfo = useStastLocale();
  return (
    <div
      className={clsx('flex items-center gap-2', {
        'flex-row-reverse': isHome,
      })}
    >
      <Avatar id={id} type='player' width={imgSize} height={imgSize} isSmall />
      <div className='flex flex-1 justify-between'>
        <div className=''>
          <div
            className={clsx('flex flex-col gap-x-2 text-sm', {
              'text-right': isHome,
            })}
          >
            <p className='text-xs dark:text-white'>{name}</p>
            <p className='text-cxs dark:text-dark-text'>
              {(slug && statsInfo[slug]) || typeReason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QvPlayerReverse = ({
  name,
  rating = 0,
  shirtNo = 0,
  imgSize = 48,
  id,
  type,
}: QvPlayerProps) => {
  return (
    <div className=' flex items-center justify-end gap-2'>
      <div test-id='player-shirtNo-name2' className='min-w-24 text-end'>
        {rating > 0 && (
          <div className='h-6 w-fit'>
            <RatingBadge point={rating}></RatingBadge>
          </div>
        )}
        <p className='truncate whitespace-nowrap text-mxs text-dark-text-full lg:text-xs'>
          {shirtNo > 0 ? `${shirtNo}`.padStart(2, '0') + ' - ' : ''}
          {name}
        </p>
      </div>
      <Avatar
        id={id}
        type={type || 'player'}
        width={imgSize}
        height={imgSize}
        isSmall
      />
    </div>
  );
};

export const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div className=' rounded-sm bg-all-blue px-0 text-center text-white'>
      {score}
    </div>
  );
};

export const TwQuickViewH2HSection = tw.div`
  rounded-md
  // bg-light-match
  // bg-light-main
  bg-light
  // bg-red-300
  dark:bg-transparent
`;

export const FormBadge = ({
  isWin = false,
  isDraw = false,
  isLoss = false,
  isSmall = false,
}: {
  isWin?: boolean;
  isDraw?: boolean;
  isLoss?: boolean;
  isSmall?: boolean;
}) => {
  return (
    <span
      css={[
        tw`rounded-full text-mxs text-white flex justify-center items-center font-semibold`,
        isWin && tw`bg-dark-win`,
        isDraw && tw`bg-light-default`,
        isLoss && tw`bg-dark-loss`,
        isSmall && tw`w-4 h-4`,
        !isSmall && tw`w-6 h-6`,
      ]}
    >
      {isWin && 'W'}
      {isDraw && 'D'}
      {isLoss && 'L'}
    </span>
  );
};

export const FormBadgeWithHover = ({
  isWin = false,
  isDraw = false,
  isLoss = false,
  isSmall = false,
  matchData,
  team,
  disabled,
  sport = SPORT.FOOTBALL,
}: {
  isWin?: boolean;
  isDraw?: boolean;
  isLoss?: boolean;
  isSmall?: boolean;
  matchData?: SportEventDto | undefined;
  team?: CompetitorDto;
  disabled?: boolean;
  sport?: SPORT;
}) => {
  const { locale } = useRouter();

  // if (!matchData) return <></>;
  const { id, startTimestamp, homeTeam, awayTeam, homeScore, awayScore } =
    matchData || {};

  const matchUrl = useMemo(() => {
    if (team) {
      if (locale === 'en')
        return `/${sport}/match/${team.slug}/${team?.id}`;

      return `/${locale}/${sport}/match/${team.slug}/${team?.id}`;
    }

    if (matchData) {
      if (locale === 'en')
        return `/${sport}/match/${getSlug(homeTeam?.name)}-${getSlug(
          awayTeam?.name
        )}/${id}`;

      return `/${locale}/${sport}/match/${getSlug(homeTeam?.name)}-${getSlug(
        awayTeam?.name
      )}/${id}`;
    }
    if (locale === 'en')
      return `/${sport}/match/${getSlug(homeTeam?.name)}-${getSlug(awayTeam?.name)}/${id}`;

    return `/${locale}/${sport}/match/${getSlug(homeTeam?.name)}-${getSlug(awayTeam?.name)}/${id}`;
  }, [homeTeam?.name, awayTeam?.name, id, locale]);

  const startDt = startTimestamp
    ? formatTimestamp(startTimestamp, 'dd/MM')
    : '';
  const score = useMemo(() => {
    if (!homeScore || !awayScore) return '';
    return `${homeScore.display}:${awayScore.display}`;
  }
    , [homeScore, awayScore]);

  const title: any = `${startDt && startDt + ':'} ${score}, ${homeTeam?.shortName || homeTeam?.name
    } - ${awayTeam?.shortName || awayTeam?.name}`;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        !disabled && window.open(matchUrl, '_blank');
      }}
      className={clsx(
        'mr-1 flex cursor-pointer items-center justify-center rounded-full text-xs text-white',
        {
          'h-[1.125rem] w-[1.125rem]': isSmall,
          'h-6 w-6': !isSmall,
          'bg-dark-win': isWin,
          'bg-light-default': isDraw,
          'bg-dark-loss': isLoss,
        }
      )}
    >
      <Tippy content={title} disabled={!matchData}>
        <span
          className='font-oswald text-mxs font-semibold'
          test-id='result-match'
        >
          {isWin && 'W'}
          {isDraw && 'D'}
          {isLoss && 'L'}
        </span>
      </Tippy>
    </div>
  );
};

export interface Team {
  id: string;
  logo: string;
  name: string;
  short_name?: string;
  slug?: string;
}

interface SoccerTeamProps {
  logoUrl?: string;
  name?: string;
  team?: CompetitorDto;
  isVertical?: boolean;
  showLiveScore?: boolean;
  logoSize?: number;
  showName?: boolean;
  desc?: string;
  isReverse?: boolean;
  isLink?: boolean;
  teamPlaying?: boolean;
  showIcon?: boolean;
  homeScore?: number;
  awayScore?: number;
  match?: Match;
  customUrl?: string;
}

export const SoccerTeam = ({
  match,
  team,
  isVertical = false,
  logoSize = 24,
  showName = true,
  isReverse = false,
  isLink = true,
  teamPlaying = false,
  showIcon = true,
  showLiveScore = false,
  customUrl = '',
}: SoccerTeamProps) => {
  const { homeTeam, awayTeam, homeScore, awayScore } = match ?? {};

  const scoreDisplay = useMemo(() => {
    if (
      !homeTeam ||
      !awayTeam ||
      homeScore == null ||
      awayScore == null ||
      team == null
    ) {
      return; // Or any other placeholder for incomplete data
    }

    const homeDisplayScore = homeScore.display;
    const awayDisplayScore = awayScore.display;

    const isHomeTeam = team.id === homeTeam.id;
    const winningColor = '#26B783';
    const drawColor = '#555555';
    const losingColor = '#AF2929';

    let backgroundColor = drawColor; // Default to draw
    const scoreText = isHomeTeam
      ? `${homeDisplayScore}:${awayDisplayScore}`
      : `${awayDisplayScore}:${homeDisplayScore}`;

    if (
      (isHomeTeam && homeDisplayScore > awayDisplayScore) ||
      (!isHomeTeam && awayDisplayScore > homeDisplayScore)
    ) {
      backgroundColor = winningColor;
    } else if (
      (isHomeTeam && homeDisplayScore < awayDisplayScore) ||
      (!isHomeTeam && awayDisplayScore < homeDisplayScore)
    ) {
      backgroundColor = losingColor;
    }

    return (
      <div
        className='rounded p-1 px-1.5 text-white'
        style={{ background: backgroundColor }}
      >
        <span className='text-msm font-medium'>{scoreText}</span>
      </div>
    );
  }, [
    team?.id,
    homeTeam?.id,
    awayTeam?.id,
    homeScore?.display,
    awayScore?.display,
  ]);

  return (
    <div
      className='flex items-center gap-x-2'
      css={[
        isVertical && !isReverse && tw`flex-col`,
        isVertical && isReverse && tw`flex-col-reverse`,
        !isVertical && !isReverse && tw`flex-row`,
        !isVertical && isReverse && tw`flex-row-reverse`,
      ]}
    >
      {showIcon &&
        (isLink ? (
          <div onClick={(e) => e.stopPropagation()}>
            <CustomizeLink
              href={
                customUrl ||
                `/football/competitor/${team?.slug || team?.name}/${team?.id}`
              }
            >
              <Avatar
                id={team?.id}
                type='team'
                width={logoSize}
                height={logoSize}
                isBackground={false}
                rounded={false}
                isSmall
              />
            </CustomizeLink>
          </div>
        ) : (
          <Avatar
            id={team?.id}
            type='team'
            width={logoSize}
            height={logoSize}
            isBackground={false}
            rounded={false}
            isSmall
          />
        ))}
      {showName && (
        <>
          <div
            test-id='team-name'
            className={`flex w-full items-center font-primary text-csm font-normal dark:text-white ${teamPlaying ? 'text-red-500' : ''
              }`}
          >
            {team?.name}
          </div>
          {teamPlaying && scoreDisplay}
        </>
      )}
      <>{showLiveScore && scoreDisplay}</>
    </div>
  );
};

export const League = ({
  logoUrl,
  name,
  isVertical = false,
  logoSize = 24,
  showName = true,
  desc = '',
}: SoccerTeamProps) => {
  const [err, setErr] = useState(false);
  return (
    <div
      className={`dev2 flex ${isVertical && 'flex-col'}  items-center gap-1`}
    >
      <img
        src={`${err ? '/images/football/teams/unknown-team.png' : logoUrl}`}
        alt=''
        width={logoSize}
        height={logoSize}
        onError={() => setErr(true)}
      ></img>
      {showName && (
        <>
          <div className='w-full truncate text-csm font-normal not-italic leading-5 xl:inline-block'>
            {name}
          </div>
          {desc !== '' && (
            <div className='truncate text-xs font-normal not-italic leading-5'>
              {desc}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const QvLineupsPlayerReverse = ({
  name,
  rating = 0,
  shirtNo = 0,
  imgSize = 36,
  playerData = {},
  isHome = true,
  category = '',
  i18n = vi,
  id,
  activeTab,
  height,
  coutry,
  teamId,
  birthday,
  isNationality,
}: QvPlayerProps) => {
  const {
    yellow,
    redCard,
    yellowRed,
    regularGoals,
    numAssists,
    ownGoals,
    penGoals,
    missedPens,
    subIn,
    subEvent = {},
  } = playerData || {};
  const { playerOut = {}, time = 0, addedTime = 0 } = subEvent || {};
  const renderOptional = useRenderOptional({
    activeTab: activeTab as string,
    birthday,
    height,
    country: coutry,
    teamId,
    isNationality,
    getAgeFromTimestamp,
  });

  return (
    <div className=' relative flex flex-row-reverse items-center gap-2'>
      <Avatar id={id} type='player' width={imgSize} height={imgSize} isSmall />
      {activeTab && (
        <div className='absolute -right-3 -top-4  h-min' test-id='optional'>
          {renderOptional}
        </div>
      )}
      <div className='flex flex-1 flex-row-reverse justify-between' test-id=''>
        <div className=''>
          <div className='flex flex-col'>
            {category && (
              <div className='text-xs text-dark-text'>
                <span>{category}</span>
              </div>
            )}
            <div className=' text-light-defaul flex flex-row-reverse items-center gap-x-2 text-csm font-normal'>
              {shirtNo > 0 ? (
                <span>{`${' - ' + `${shirtNo}`.padStart(2, '0')}`}</span>
              ) : (
                ''
              )}
              <div className='flex gap-y-1 text-right text-ccsm font-normal text-light-default dark:text-white'>
                {name}
              </div>

              {regularGoals > 0 && (
                <span className=''>
                  <GoalBlueSVG className='inline-block h-4 w-4'></GoalBlueSVG>
                  {regularGoals > 1 && <sub>{`x${regularGoals}`}</sub>}
                </span>
              )}
              {penGoals > 0 && (
                <span className=''>
                  {isHome ? (
                    <GoalPenSVG className='inline-block h-5 w-5 text-logo-blue'></GoalPenSVG>
                  ) : (
                    <GoalPenSVG className='inline-block h-5 w-5  text-logo-yellow'></GoalPenSVG>
                  )}
                  {penGoals > 1 && <sub>{`x${penGoals}`}</sub>}
                </span>
              )}
              {missedPens > 0 && (
                <span className=''>
                  <GoalPenMissSVG className='inline-block h-5 w-5 text-dark-loss'></GoalPenMissSVG>
                  {missedPens > 1 && <sub>{`x${missedPens}`}</sub>}
                </span>
              )}
              {ownGoals > 0 && (
                <span className=''>
                  <OwnGoalSVG className='inline-block h-5 w-5 text-dark-loss'></OwnGoalSVG>

                  {ownGoals > 1 && <sub>{`x${ownGoals}`}</sub>}
                </span>
              )}
              {numAssists > 0 && (
                <span className=''>
                  {isHome ? (
                    <AssistSVG className='inline-block h-5 w-5 text-logo-blue'></AssistSVG>
                  ) : (
                    <AssistSVG className='inline-block h-5 w-5  text-logo-yellow'></AssistSVG>
                  )}
                  {numAssists > 1 && <sub>{`x${numAssists}`}</sub>}
                </span>
              )}
              {yellow > 0 && (
                <span>
                  <YellowCard size='xs'></YellowCard>
                </span>
              )}
              {redCard > 0 && (
                <span>
                  <RedCard size='xs'></RedCard>
                </span>
              )}
              {yellowRed > 0 && (
                <span>
                  <YellowRedCardSVG className='h-5 w-5'></YellowRedCardSVG>
                </span>
              )}
            </div>
          </div>

          {/* TODO out player */}
          {subIn && (
            <div className='flex flex-row-reverse items-center gap-2 font-normal text-light-default dark:text-dark-text'>
              <SubstituteSVG className='h-4 w-4' />
              <span className='text-right text-cxs'>
                {i18n.timeline.out}: {playerOut?.name}
              </span>
            </div>
          )}
        </div>
        {rating > 0 && (
          <div className='flex items-center'>
            <RatingBadge point={rating}></RatingBadge>
          </div>
        )}
      </div>
    </div>
  );
};
