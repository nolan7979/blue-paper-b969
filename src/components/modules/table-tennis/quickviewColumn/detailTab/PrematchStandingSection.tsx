import clsx from 'clsx';

import { usePregameFormData } from '@/hooks/useFootball';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { FormBadgeWithHover } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { RatingBadge } from '@/components/modules/football/RatingBadge';
import {
  TwBorderLinearBox,
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';

import { SportEventDtoWithStat } from '@/constant/interface';
import { ShortForm } from '@/models/page/matchDetails';
import { isValEmpty } from '@/utils';

import vi from '~/lang/vi';
import { SPORT } from '@/constant/common';

const PrematchStandingSection = ({
  matchData,
  i18n = vi,
  setActiveTab,
}: {
  matchData: SportEventDtoWithStat;
  i18n?: any;
  setActiveTab?: (e: string) => void;
}) => {
  const {
    data: pregameForm,
    isLoading,
    isFetching,
  } = usePregameFormData(matchData?.id);

  const { homeTeam, awayTeam } = matchData || {};
  const { homeTeam: homeForm, awayTeam: awayForm } =
    pregameForm || ({} as ShortForm);

  if (isLoading || isFetching || !pregameForm) {
    return <div>Loading...</div>; // TODO skeleton
  }

  if (isValEmpty(homeForm) || isValEmpty(awayForm)) {
    return <></>;
  }
  if (isValEmpty(homeForm.form) || isValEmpty(awayForm.form)) {
    return <></>;
  }

  const { position: homePos = 0 } = homeForm;
  const { position: awayPos = 0 } = awayForm;

  let higherPosForm = homeForm;
  let lowerPosForm = awayForm;
  let higerTeam = homeTeam;
  let lowerTeam = awayTeam;

  if (Number(awayPos) < Number(homePos)) {
    higherPosForm = awayForm;
    lowerPosForm = homeForm;
    higerTeam = awayTeam;
    lowerTeam = homeTeam;
  }

  const onClickActive = (e: any) => {
    e.preventDefault();
    setActiveTab!('standings');
  };

  return (
    <TwMbQuickViewWrapper className='pb-4'>
      <TwQuickViewTitleV2 className=''>
        {i18n?.titles.prematch_standings}
      </TwQuickViewTitleV2>
      <div
        className={clsx({
          'hover:cursor-pointer': setActiveTab,
        })}
        onClick={onClickActive}
      >
        <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
          <TwQuickViewSection className='!rounded-md p-2.5 text-center '>
            <div className=' flex py-2 text-csm'>
              <div className='w-6'>#</div>
              <div className='w-10'>{i18n.qv.team}</div>
              <div className='flex-1'>{i18n.qv.latest}</div>
              <div className='w-16'>{i18n.qv.rating}</div>
              {/* <div className='w-10'>{label || 'Điểm'}</div> */}
              <div className='w-10'>{i18n.qv.points}</div>
            </div>

            <div className=' mb-2 flex text-sm' test-id='pre-matching-team1'>
              <div className=' flex w-6 items-center justify-center'>
                <span test-id='higher-pos'>{higherPosForm.position}</span>
              </div>
              <div className=' flex w-10 place-content-center items-center'>
                <CustomLink
                  href={`/competitor/${higerTeam.slug || higerTeam.name}/${
                    higerTeam?.id
                  }`}
                  target='_parent'
                >
                  <Avatar
                    id={higerTeam?.id}
                    type='team'
                    width={28}
                    height={28}
                    isBackground={false}
                    rounded={false}
                    isSmall
                  />
                </CustomLink>
              </div>
              <div className=' flex flex-1 items-center justify-center gap-1 pl-12 text-white'>
                {(higherPosForm.form || []).map(
                  (formLabel: string, idx: number) => {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={formLabel === 'W'}
                        isDraw={formLabel === 'D'}
                        isLoss={formLabel === 'L'}
                        isSmall={true}
                        matchData={higherPosForm?.event[idx]}
                        sport={SPORT.TENNIS}
                      ></FormBadgeWithHover>
                    );
                  }
                )}
              </div>
              <div className=' flex w-16 place-content-center items-center'>
                {lowerPosForm.avgRating > 0 ? (
                  <RatingBadge
                    point={higherPosForm.avgRating}
                    isSmall={false}
                  ></RatingBadge>
                ) : (
                  '-'
                )}
              </div>
              <div
                className=' flex w-10 items-center justify-center text-logo-blue'
                id='pts-id-team1'
              >
                {higherPosForm.value}
              </div>
            </div>

            <div className=' flex text-sm' test-id='pre-matching-row2'>
              <div className=' flex w-6 items-center justify-center'>
                <span>{lowerPosForm.position}</span>
              </div>
              <div className=' flex w-10 place-content-center items-center'>
                <CustomLink
                  href={`/competitor/${lowerTeam.slug || lowerTeam.name}/${
                    lowerTeam?.id
                  }`}
                  target='_parent'
                >
                  <Avatar
                    id={lowerTeam?.id}
                    type='team'
                    width={28}
                    height={28}
                    isBackground={false}
                    rounded={false}
                    isSmall
                  />
                </CustomLink>
              </div>
              <div className=' flex flex-1 items-center justify-center gap-1 pl-12 text-white'>
                {(lowerPosForm.form || []).map(
                  (formLabel: string, idx: number) => {
                    return (
                      <FormBadgeWithHover
                        key={idx}
                        isWin={formLabel === 'W'}
                        isDraw={formLabel === 'D'}
                        isLoss={formLabel === 'L'}
                        isSmall={true}
                        matchData={awayForm?.event[idx]}
                        sport={SPORT.TENNIS}
                      ></FormBadgeWithHover>
                    );
                  }
                )}
              </div>

              <div className=' flex w-16 place-content-center items-center'>
                {lowerPosForm.avgRating > 0 ? (
                  <RatingBadge
                    point={lowerPosForm.avgRating}
                    isSmall={false}
                  ></RatingBadge>
                ) : (
                  '-'
                )}
              </div>
              <div
                className=' flex w-10 items-center justify-center text-logo-blue'
                id='pts-id-team2'
              >
                {lowerPosForm.value}
              </div>
            </div>
          </TwQuickViewSection>
        </TwBorderLinearBox>
      </div>
    </TwMbQuickViewWrapper>
  );
};
export default PrematchStandingSection;
