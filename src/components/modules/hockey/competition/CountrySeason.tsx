import { useMemo } from 'react';
import { SPORT } from '@/constant/common';
import Avatar from '@/components/common/Avatar';
import useTrans from '@/hooks/useTrans';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { Option, SelectSeason } from '@/components/modules/basketball/selects';

type CountrySeasonProps = {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
  setSelectedSeason: (season: SeasonDto) => void;
  selectedSeason: SeasonDto;
};

export const CountrySeason: React.FC<CountrySeasonProps> = ({
  uniqueTournament,
  seasons,
  selectedSeason,
  setSelectedSeason,
}) => {
  const i18n = useTrans();

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
  };

  return (
    <div className='flex flex-col gap-1'>
      <p className='font-primary text-xs text-white lg:text-black lg:dark:text-white'>{i18n.competitor.country}</p>
      <div className='flex items-center gap-2'>
        <Avatar
          isSmall
          id={uniqueTournament?.country?.id}
          type='country'
          width={20}
          height={20}
          rounded={false}
          isBackground={false}
          sport={SPORT.ICE_HOCKEY}
        />
        <span className='font-primary text-xs font-bold text-white lg:text-black lg:dark:text-white'>
          {uniqueTournament?.country?.name}
        </span>
        {selectedSeason && (
          <SelectSeason options={options} valueGetter={mapSelectedSeason} />
        )}
      </div>
    </div>
  );
};
