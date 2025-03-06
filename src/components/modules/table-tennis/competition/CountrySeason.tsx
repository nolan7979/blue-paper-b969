import { Option, SelectSeason } from '@/components/modules/tennis/selects';
import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { useMemo, useState } from 'react';
import ArrowSVG from 'public/svg/arrow-down-line.svg';

type CountrySeasonProps = {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
  setSelectedSeason: (season: SeasonDto) => void;
  selectedSeason: SeasonDto;
  isMobile?: boolean;
};

export const CountrySeason: React.FC<CountrySeasonProps> = ({
  uniqueTournament,
  seasons,
  selectedSeason,
  setSelectedSeason,
  isMobile = false,
}) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const options: Option[] = useMemo(
    () =>
      seasons?.map((season) => ({
        id: season.id,
        name: season.year,
      })) || [],
    [seasons]
  );
  const mapSelectedSeason = (selectedOption: Option) => {
    const season =
      seasons?.find((season) => season.id === selectedOption?.id) ||
      ({} as SeasonDto);
    setSelectedSeason(season);
    setShowBottomSheet(false);
  };

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center justify-center gap-2 lg:justify-normal'>
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
                <h3 className='mb-4 text-center text-black dark:text-white'>Seasons</h3>
                <div className='max-h-[300px] overflow-y-scroll'>
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`cursor-pointer rounded-md p-3 ${
                        option.id === selectedSeason?.id ? 'bg-[#333]' : ''
                      }`}
                      onClick={() => mapSelectedSeason(option)}
                    >
                      <span className={`${option.id === selectedSeason?.id ? 'text-white' : 'text-black'} dark:text-white`}>{option.name}</span>
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
