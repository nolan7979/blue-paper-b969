import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { useMemo, useState } from 'react';
// Todo: refactor to common component
import { Option, SelectSeason } from '@/components/modules/basketball/selects';
import { isEmpty } from 'lodash';
import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';

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
    
    if(!isEmpty(season)) setSelectedSeason(season);
    setShowBottomSheet(false);
  };

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center justify-center gap-2 lg:justify-normal'>
        <Avatar
          isSmall
          id={uniqueTournament?.category?.id}
          type='country'
          width={20}
          height={20}
          isBackground={false}
          rounded={false}
          sport={SPORT.FOOTBALL}
        />
        <span className='font-primary text-xs font-bold text-white lg:text-black lg:dark:text-white'>
          {uniqueTournament?.category?.name}
        </span>
        {selectedSeason && !isMobile && (
          <SelectSeason options={options} valueGetter={mapSelectedSeason} />
        )}
        {isMobile && (
          <>
            <div
              className='flex cursor-pointer items-center justify-between rounded-md bg-primary-gradient p-2'
              onClick={() => setShowBottomSheet(true)}
            >
              <span className='font-primary text-sm font-bold text-white'>
                {selectedSeason?.year}
              </span>
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
