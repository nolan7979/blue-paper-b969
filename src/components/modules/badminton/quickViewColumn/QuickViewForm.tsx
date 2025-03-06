import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import TabsSlider from '@/components/common/tabsSlider';
import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { CompetitorDto, SportEventDto } from '@/constant/interface';
import { getSlug } from '@/utils';

interface IQuickViewForm {
  homeData: SportEventDto[];
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  awayData: SportEventDto[];
}

const QuickViewForm: React.FC<IQuickViewForm> = ({
  homeData,
  homeTeam,
  awayData,
  awayTeam,
}) => {
  const i18n = useTrans();
  if (homeData?.length === 0 || awayData?.length === 0) {
    return <></>;
  }

  return (
    <div>
      <TwQuickViewTitleV2>{i18n.filter.form}</TwQuickViewTitleV2>
      <div className='space-y-4'>
        <FormSecion team={homeTeam} data={homeData} />
        <FormSecion team={awayTeam} data={awayData} />
      </div>
    </div>
  );
};
export default QuickViewForm;

export const FormSecion: React.FC<{
  team: CompetitorDto;
  data: SportEventDto[];
}> = ({ team, data }) => {
  const winnerCodeStatus = (val: SportEventDto, teamId: string) => {
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
      default:
        score = 'D';
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

  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQuickViewSection className='space-y-3 !border-none p-4 !shadow-transparent'>
        <div className='flex items-center justify-between'>
          <p className='text-csm font-semibold'>{team?.shortName}</p>
          <div className='flex items-center justify-center gap-x-1'>
            {data?.map((item: SportEventDto) => {
              const winnerCode = winnerCodeStatus(item, team.id!);
              const { score, style } = renderScoreDisplay(winnerCode);

              return (
                <span
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      `/match/${getSlug(item.homeTeam.name)}-${getSlug(
                        item.awayTeam.name
                      )}/${item.id}`,
                      '_blank'
                    );
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
          <TabsSlider>
            {data?.map((item: SportEventDto) => (
              <div key={`tab-item-${item?.id}`} className='rounded-full'>
                <div
                  className='hover:cursor-pointer'
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      `/match/${getSlug(item.homeTeam.name)}-${getSlug(
                        item.awayTeam.name
                      )}/${item.id}`,
                      '_blank'
                    );
                  }}
                >
                  <TwBorderLinearBox className='border-linear-form !rounded-full'>
                    <div className='flex items-center justify-center gap-x-3 rounded-full  px-2.5 py-1'>
                      <Avatar
                        id={item.homeTeam.id}
                        type='team'
                        isBackground={false}
                        rounded={false}
                        height={17}
                        width={17}
                        isSmall
                      />
                      <div>
                        <span className='text-csm font-medium'>
                          {item.scores?.ft &&
                            `${item.scores?.ft[0]} - ${item.scores?.ft[1]}`}
                        </span>
                      </div>
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
            ))}
          </TabsSlider>
        </div>
      </TwQuickViewSection>
    </TwBorderLinearBox>
  );
};
