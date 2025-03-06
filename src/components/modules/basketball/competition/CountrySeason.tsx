import { useMemo, useState } from 'react';
import { SPORT } from '@/constant/common';
import Avatar from '@/components/common/Avatar';
import useTrans from '@/hooks/useTrans';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { Option, SelectSeason } from '@/components/modules/basketball/selects';
import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import ArrowSVG from 'public/svg/arrow-down-line.svg';

type CountrySeasonProps = {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
  setSelectedSeason: (season: SeasonDto) => void;
  selectedSeason: SeasonDto;
  isMobile?: boolean;
};

export const CountrySeason: React.FC<CountrySeasonProps> = ({
  isMobile = false,
  uniqueTournament,
  seasons,
  selectedSeason,
  setSelectedSeason,
}) => {
  const i18n = useTrans();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const options: Option[] = useMemo(
    () =>
      seasons?.map((season) => ({
        id: season.id,
        name: season.year,
      })) || [],
    [seasons]
  );

  const mapSelectedSeason = (seltedOption: Option) => {
    const season =
      seasons?.find((season) => season.id === seltedOption.id) ||
      ({} as SeasonDto);
    setSelectedSeason(season);
    setShowBottomSheet(false);

  };

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <Avatar
          id={uniqueTournament?.country?.id}
          type='country'
          width={20}
          height={20}
          isBackground={false}
          rounded={false}
          sport={SPORT.BASKETBALL}
        />
        <span className='font-primary text-xs font-bold text-white lg:text-black lg:dark:text-white uppercase'>
          {uniqueTournament?.country?.name}
        </span>
        {selectedSeason && !isMobile && (
          <SelectSeason options={options} valueGetter={mapSelectedSeason} />
        )}
        {isMobile && (
          <>
            <div
              className='flex gap-1 cursor-pointer items-center justify-between rounded-md bg-primary-gradient p-2'
              onClick={() => setShowBottomSheet(true)}
            >
              <span className='font-primary text-sm font-bold text-white'>
                {selectedSeason?.year}
              </span>
              <ArrowSVG className='h-4 w-4 text-gray-400' aria-hidden='true' />
            </div>

            <BottomSheetComponent
              open={showBottomSheet}
              onClose={() => setShowBottomSheet(false)}
            >
              <div className='flex flex-col p-4'>
                <h3 className='mb-4 text-center text-black dark:text-white'>
                  {i18n.titles.season}
                </h3>
                <div className='max-h-[370px] overflow-y-scroll'>
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`cursor-pointer rounded-md text-start p-3 ${
                        option.id === selectedSeason?.id ? 'bg-[#333]' : ''
                      }`}
                      onClick={() => mapSelectedSeason(option)}
                    >
                      <span
                        className={`${
                          option.id === selectedSeason?.id
                            ? 'text-white'
                            : 'text-black'
                        } dark:text-white`}
                      >
                        {option.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </BottomSheetComponent>
          </>
        )}
      </div>
    </div>
  );
};
