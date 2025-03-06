import clsx from 'clsx';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { TwQuickViewSection } from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { CompetitorDto } from '@/constant/interface';
import { getSlug, Images } from '@/utils';

import vi from '~/lang/vi';

export interface IInfoHomeAndAwayTeam {
  type: keyof typeof Images;
  infoHome: CompetitorDto;
  infoAway: CompetitorDto;
  content: {
    start: React.ReactNode;
    middle?: React.ReactNode;
    end: React.ReactNode;
  };
  className?: string;
  isH2H?: boolean;
  i18n?: any;
}

export const InfoHomeAndAwayTeam: React.FC<IInfoHomeAndAwayTeam> = ({
  content,
  infoAway,
  infoHome,
  type,
  className,
  isH2H,
  i18n = vi,
}) => {
  const renderValue = useMemo(() => {
    if (isH2H) {
      const total =
        parseInt((content?.start as string) || '0') +
        parseInt((content?.middle as string) || '0') +
        parseInt((content?.end as string) || '0');

      const homeWin = Math.round(
        (parseInt((content?.start as string) || '0') / total) * 100
      );
      const awayWin = Math.round(
        (parseInt((content?.end as string) || '0') / total) * 100
      );
      const draw = 100 - homeWin - awayWin;
      return (
        <>
          <div className='flex h-1.5 w-full rounded-full'>
            <div
              className='h-full rounded-l-full bg-line-dark-blue'
              style={{ width: `${homeWin}%` }}
            ></div>
            <div
              className={clsx(`h-full bg-dark-draw`, {
                'rounded-l-full': homeWin === 0,
                'rounded-r-full': awayWin === 0,
              })}
              style={{ width: `${draw}%` }}
            ></div>
            <div
              className='h-full rounded-r-full bg-light-detail-away'
              test-id='away-win'
              style={{ width: `${awayWin}%` }}
            ></div>
          </div>
          <div className='flex items-center justify-between'>
            <div
              className='flex flex-col text-csm dark:text-white'
              test-id='home-win'
            >
              <span className='text-all-blue' test-id='win'>
                {content?.start || 0} {i18n.qv.win}
              </span>
              <span>{homeWin}%</span>
            </div>
            <div
              className='flex flex-col text-csm dark:text-white'
              test-id='home-draw'
            >
              <span test-id='draw'>
                {content?.middle || 0} {i18n.qv.draw}
              </span>
              <span test-id='draw-percent'>{draw}%</span>
            </div>
            <div
              className='flex flex-col text-csm dark:text-white'
              test-id='away-win'
            >
              <span className='text-light-detail-away'>
                {content?.end || 0} {i18n.qv.win}
              </span>
              <span test-id='away-win-percent'>{awayWin}%</span>
            </div>
          </div>
        </>
      );
    }
  }, [isH2H, content]);
  return (
    <TwBorderLinearBox
      className={`dark:boder-linear-box ${isH2H && 'dark:bg-primary-gradient'}`}
    >
      {(isH2H && (
        <div className='space-y-3.5 p-2.5'>
          <div className='flex items-center justify-between' test-id='logo-row'>
            <CustomLink
              href={`/snooker/${type}/${
                infoHome?.slug || getSlug(infoHome?.name) || 'slug'
              }/${infoHome?.id}`}
              target='blank'
            >
              <Avatar
                id={infoHome?.id}
                type={type}
                width={24}
                height={24}
                isBackground={type === 'player'}
                rounded={type === 'player'}
                isSmall
              />
            </CustomLink>

            <span className='text-msm' test-id='total-match'>
              {i18n.qv.total_matches} (
              {parseInt(content?.start as string) +
                parseInt(content?.middle as string) +
                parseInt(content?.end as string)}
              )
            </span>

            <CustomLink
              href={`/snooker/${type}/${
                infoAway?.slug || getSlug(infoAway.name) || 'slug'
              }/${infoAway?.id}`}
              target='blank'
            >
              <Avatar
                id={infoAway?.id}
                type={type}
                width={24}
                height={24}
                isBackground={type === 'player'}
                rounded={type === 'player'}
                isSmall
              />
            </CustomLink>
          </div>
          {renderValue}
        </div>
      )) || (
        <TwQuickViewSection className={twMerge(`my-4 !rounded-md`, className)}>
          <div className='flex gap-2 p-2.5'>
            <div className='flex place-content-center items-center'>
              <div className='rounded-full'>
                <CustomLink
                  href={`/football/${type}/${
                    infoHome?.slug || getSlug(infoHome?.name) || 'slug'
                  }/${infoHome?.id}`}
                  target='blank'
                >
                  <Avatar
                    id={infoHome?.id}
                    type={type}
                    width={44}
                    height={44}
                    isBackground={type === 'player'}
                    rounded={type === 'player'}
                    isSmall
                  />
                </CustomLink>
              </div>
            </div>
            <div className='flex-1 space-y-0.5'>
              <div className='flex justify-between'>
                {content.start}
                <div className='flex w-full place-content-center justify-center text-center'>
                  {content.middle}
                </div>
                {content.end}
              </div>
              <div className='flex justify-between text-csm'>
                <CustomLink
                  href={`/football/${type}/${
                    infoHome?.slug || getSlug(infoHome?.name) || 'slug'
                  }/${infoHome?.id}`}
                  target='blank'
                  className='w-26 truncate whitespace-nowrap dark:text-white'
                >
                  <span>{infoHome.name}</span>
                </CustomLink>
                <CustomLink
                  href={`/football/${type}/${infoAway.slug}/${infoAway?.id}`}
                  target='blank'
                  className='w-26 truncate whitespace-nowrap text-right dark:text-white'
                >
                  <span>{infoAway.name}</span>
                </CustomLink>
              </div>
            </div>
            <div className='flex place-content-center items-center'>
              <div className='rounded-full'>
                <CustomLink
                  href={`/football/${type}/${
                    infoAway.slug || getSlug(infoAway?.name) || 'slug'
                  } /${infoAway?.id}`}
                  target='blank'
                >
                  <Avatar
                    id={infoAway?.id}
                    type={type}
                    width={44}
                    height={44}
                    isBackground={type === 'player'}
                    rounded={type === 'player'}
                    isSmall
                  />
                </CustomLink>
              </div>
            </div>
          </div>
        </TwQuickViewSection>
      )}
    </TwBorderLinearBox>
  );
};
