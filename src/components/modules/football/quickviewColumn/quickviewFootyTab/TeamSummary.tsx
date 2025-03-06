import clsx from 'clsx';
import { SPORT } from '@/constant/common';
import { CompetitorDto } from '@/constant/interface';
import Avatar from '@/components/common/Avatar';
import { genStatsPointColor, renderScoreDisplay } from '@/utils/footyUtils';

const TeamSummary = ({
  team,
  ppg,
  formRun,
  isAway = false,
}: {
  team: CompetitorDto;
  ppg: number;
  formRun: string[];
  isAway?: boolean;
}) => {
  const pointColor = genStatsPointColor(ppg);
  return (
    <div className='flex flex-col gap-[13px] flex-1'>
      <span
        className={clsx('font-bold dark:text-white', {
          'text-right': isAway,
        })}
      >
        {team?.shortName || team?.name}
      </span>
      <div
        className={clsx('flex gap-2 ', {
          'flex-row-reverse': isAway,
        })}
      >
        <Avatar
          type='team'
          id={team?.id}
          isBackground={false}
          isSmall
          width={48}
          height={48}
          sport={SPORT.FOOTBALL}
        />
        <div
          className={clsx('flex flex-col gap-2', {
            'items-end': isAway,
          })}
        >
          {Number(ppg) >= 0 && (
            <span
              className={`flex h-6 w-fit items-center rounded-sm px-2 text-center font-oswald text-[14px] font-semibold text-white ${pointColor}`}
            >
              {ppg}
            </span>
          )}
          {!!formRun?.length && (
            <div className='flex gap-1'>
              {formRun
                ?.slice(0, 5)
                ?.reverse()
                ?.map((item, index) => {
                  const { score, style } = renderScoreDisplay(item);
                  return (
                    <span
                      key={index}
                      className={`flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full font-oswald text-mxs font-semibold text-white ${style}`}
                    >
                      {score}
                    </span>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSummary;
