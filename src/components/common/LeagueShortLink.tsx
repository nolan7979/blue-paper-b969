import { memo, useMemo } from 'react';

import CustomLink from '@/components/common/CustomizeLink';
import ArrowRight from '~/svg/arrow-right.svg';
import Avatar from '@/components/common/Avatar';
import { useWindowSize } from '@/hooks/useWindowSize';
import { extractCompetitionId, getSlug } from '@/utils';
import useTrans from '@/hooks/useTrans';
import Rectangle from '@/components/common/skeleton/Rectangle';
import Circle from '@/components/common/skeleton/Circle';
import { cn } from '@/utils/tailwindUtils';

export const LeagueShortLink = memo(
  ({
    tournament,
    sport,
    isDetail,
    roundInfo,
    isSubPage,
  }: {
    tournament: any;
    sport: string;
    isDetail?: boolean;
    roundInfo?: any;
    isSubPage?: boolean;
  }) => {
    const { width } = useWindowSize();
    const isMobile = useMemo(() => width < 1024, [width]);
    const i18n = useTrans();

    return (
      <div className='w-full'>
        <div className='mb-2 h-[1px] w-full bg-bkg-border-gradient'></div>
        {(!tournament && (
          <div className='px-4 pb-2 lg:pb-0'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Circle classes='h-6 w-6' />
                <Rectangle classes='h-6 w-60' fullWidth />
              </div>
            </div>
          </div>
        )) || (
          <div className='px-4 pb-2 lg:pb-0' test-id='league-in-detail'>
            <CustomLink
              href={`/${sport}/competition/${
                tournament?.slug || getSlug(tournament?.name)
              }/${extractCompetitionId(tournament?.id)}`}
              target='_parent'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Avatar
                    id={extractCompetitionId(tournament?.id)}
                    type='competition'
                    width={isMobile ? 20 : 24}
                    height={isMobile ? 20 : 24}
                    rounded={false}
                    isBackground={false}
                    sport={sport}
                  />
                  <span
                    className={cn('text-sm dark:text-white lg:text-black', {
                      'text-white': !isSubPage,
                    })}
                    test-id='tournament-name'
                  >
                    {tournament?.name}{' '}
                    {roundInfo &&
                    roundInfo?.round > 0 &&
                    Object.values(roundInfo).length > 0
                      ? `, ${i18n.football.round} ${roundInfo?.round}`
                      : ''}
                  </span>
                </div>
                <ArrowRight className='h-4 w-4 text-white lg:text-black lg:dark:text-white' />
              </div>
            </CustomLink>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.tournament?.id === nextProps?.tournament?.id &&
      prevProps.sport === nextProps.sport &&
      prevProps.isSubPage === nextProps.isSubPage
    );
  }
);
