import { SeasonDto, TournamentDto } from '@/constant/interface';
import { formatDate } from '@/utils/dateUtils';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';

type ProgressBarLeaguesProps = {
  uniqueTournament: TournamentDto;
  selectedSeason: SeasonDto;
  isDesktop?: boolean;
};

export const ProgressBar: React.FC<ProgressBarLeaguesProps> = ({
  uniqueTournament,
  selectedSeason,
  isDesktop = false,
}) => {
  if (!selectedSeason) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);

  const totalDuration = selectedSeason.end_time - selectedSeason.start_time;

  const elapsedTime = currentTime - selectedSeason.start_time;

  const progressPercentage = Math.min((elapsedTime / totalDuration) * 100, 100);

  const formattedStartTime = formatDate(selectedSeason.start_time);
  const formattedEndTime = formatDate(selectedSeason.end_time);

  return (
    <>
      {!isDesktop && (
        <div className={`justify-left mb-3 flex items-center gap-3`}>
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={24}
            height={24}
            isBackground={false}
            rounded={false}
            sport={SPORT.AMERICAN_FOOTBALL}
            isSmall
          />
          <div className='flex flex-col'>
            <h3
              className={`text-1xl text-left font-oswald text-black dark:text-white`}
            >
              {uniqueTournament.name || uniqueTournament.short_name}
            </h3>
            <div className='flex items-center gap-1'>
                <Avatar
                  id={uniqueTournament?.category?.id}
                  type='country'
                  width={20}
                  height={20}
                  rounded={false}
                  isBackground={false}
                  sport={SPORT.AMERICAN_FOOTBALL}
                />
                <span className='font-primary text-xs font-bold text-black dark:text-white'>
                  {uniqueTournament?.category?.name}
                </span>
            </div>
          </div>
        </div>
      )}
      <div className='flex flex-col gap-1'>
        <div className='relative h-[0.315rem] w-full overflow-hidden rounded-full bg-primary-mask'>
          <div
            className='absolute left-0 h-full bg-dark-blue'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className='flex w-full justify-between font-primary text-xs'>
          <span>{formattedStartTime}</span>
          <span>{formattedEndTime}</span>
        </div>
      </div>
    </>
  );
};
