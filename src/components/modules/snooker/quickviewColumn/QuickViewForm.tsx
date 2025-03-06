import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import TabsSlider from '@/components/common/tabsSlider';
import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { CompetitorDto, SportEventDtoWithStat } from '@/constant/interface';
import { useWindowSize } from '@/hooks';
import { getSlug } from '@/utils';
import { useMemo, useRef } from 'react';

interface IQuickViewForm {
  homeData: SportEventDtoWithStat[];
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  awayData: SportEventDtoWithStat[];
  sport?: string;
}

const QuickViewForm: React.FC<IQuickViewForm> = ({
  homeData,
  homeTeam,
  awayData,
  awayTeam,
  sport,
}) => {
  const i18n = useTrans();
  const TabRef = useRef(null);
  if (homeData?.length === 0 && awayData?.length === 0) {
    return <></>;
  }

  return (
    <div>
      <TwQuickViewTitleV2>{i18n.filter.form}</TwQuickViewTitleV2>
      <div className='space-y-4' test-id='form'>
        {homeData?.length > 0 && (
        <FormSecion
          team={homeTeam}
          data={homeData}
          sport={sport}
          locale={i18n.language}
        />
        )}
        {awayData?.length > 0 && (
          <FormSecion
            team={awayTeam}
            data={awayData}
            sport={sport}
            locale={i18n.language}
          />
        )}
      </div>
    </div>
  );
};
export default QuickViewForm;

export const FormSecion: React.FC<{
  team: CompetitorDto;
  data: SportEventDtoWithStat[];
  sport?: string;
  locale?: string;
}> = ({ team, data, sport, locale }) => {
  const { width } = useWindowSize();

  const winnerCodeStatus = (val: SportEventDtoWithStat, teamId: string) => {
    if (val?.homeTeam?.id === teamId) {
      return val.winnerCode;
    } else {
      return val.winnerCode === 1
        ? 2
        : val.winnerCode === 2
        ? 1
        : val.winnerCode === 3
        ? 3
        : 0;
    }
  };
  const renderScoreDisplay = (winnerCode: number) => {
    let score: string;

    switch (winnerCode) {
      case 1:
        score = 'W';
        break;
      case 2:
        score = 'L';
        break;
      case 3:
        score = 'D';
        break;
      default:
        score = '-';
    }

    const style =
      score === 'D'
        ? 'bg-light-default'
        : score === 'W'
        ? 'bg-dark-win'
        : 'bg-dark-loss';

    return {
      style,
      score,
    };
  };

  const memoizedTwBorderLinearBox = useMemo(
    () => (
      <TwBorderLinearBox className='dark:border-linear-box border border-line-default bg-white dark:border-0 dark:bg-primary-gradient'>
        <TwQuickViewSection className='space-y-3 !border-none p-4 !shadow-transparent'>
          <div
            className='flex items-center justify-between'
            test-id='form-section'
          >
            <p className='text-csm font-semibold' test-id='home-form'>
              {team?.shortName || team?.name}
            </p>
            <div
              className='flex items-center justify-center gap-x-1'
              test-id='home-code'
            >
              {data?.map((item: SportEventDtoWithStat) => {
                const winnerCode = winnerCodeStatus(item, team.id!);
                const { score, style } = renderScoreDisplay(winnerCode);

                return (
                  <span
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      if (width < 1024) {
                        window.location.href = `/${locale}${
                          sport && '/' + sport
                        }/match/${getSlug(item.homeTeam.name)}-${getSlug(
                          item.awayTeam.name
                        )}/${item.id}`;
                      } else {
                        window.open(
                          `/${locale}${sport && '/' + sport}/match/${getSlug(
                            item.homeTeam.name
                          )}-${getSlug(item.awayTeam.name)}/${item.id}`,
                          '_blank'
                        );
                      }
                    }}
                    className={`flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full font-oswald text-mxs font-semibold text-white hover:cursor-pointer ${style}`}
                  >
                    {score}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <TabsSlider id={`football-${team?.id}`}>
              {data?.map((item: SportEventDtoWithStat) => {
                return (
                  <div key={`tab-item-${item?.id}`} className='rounded-full'>
                    <div
                      className='hover:cursor-pointer'
                      onClick={(e) => {
                        e.preventDefault();
                        if (width < 1024) {
                          window.location.href = `/${locale}${
                            sport && '/' + sport
                          }/match/${getSlug(item.homeTeam.name)}-${getSlug(
                            item.awayTeam.name
                          )}/${item.id}`;
                        } else {
                          window.open(
                            `/${locale}${sport && '/' + sport}/match/${getSlug(
                              item.homeTeam.name
                            )}-${getSlug(item.awayTeam.name)}/${item.id}`,
                            '_blank'
                          );
                        }
                      }}
                    >
                      <TwBorderLinearBox className='border-linear-form !rounded-full'>
                        <div
                          className='flex items-center justify-center gap-x-3 rounded-full  px-2.5 py-1'
                          test-id='match'
                        >
                          <Avatar
                            id={item.homeTeam.id}
                            type='team'
                            isBackground={false}
                            rounded={false}
                            height={17}
                            width={17}
                            isSmall
                          />
                          <span
                            className='text-csm font-medium dark:text-white'
                            test-id='home-form-score'
                          >{`${item.homeScore?.display || 0} - ${
                            item.awayScore?.display || 0
                          }`}</span>
                          <Avatar
                            id={item.awayTeam.id}
                            type='team'
                            isBackground={false}
                            rounded={false}
                            height={17}
                            width={17}
                            isSmall
                          />
                        </div>
                      </TwBorderLinearBox>
                    </div>
                  </div>
                );
              })}
            </TabsSlider>
          </div>
        </TwQuickViewSection>
      </TwBorderLinearBox>
    ),
    [team, data, sport, width, locale]
  );

  return <div test-id='list-match-form'>{memoizedTwBorderLinearBox}</div>;
};
