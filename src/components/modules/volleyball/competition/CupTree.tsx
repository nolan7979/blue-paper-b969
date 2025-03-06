import { SeasonDto } from '@/constant/interface';
import { useCupTree } from '@/hooks/useVolleyball';
import { Option, SelectTeam } from '@/components/modules/basketball/selects';
import { PlayoffsBracket } from '@/components/modules/volleyball/competition';
import { useMemo, useState } from 'react';

type CupTreeProps = {
  selectedSeason: SeasonDto;
};

export const CupTree: React.FC<CupTreeProps> = ({ selectedSeason }) => {
  const [filterName, setFilterName] = useState<Option>({ id: '', name: '' });

  const { data, isLoading } = useCupTree(selectedSeason?.id);

  const filters = useMemo(
    () =>
      data?.map((item) => ({
        id: item.name.replace(/\s+/g, ''),
        name: item.name,
      })) || [{ id: 'loading', name: 'loading' }],
    [data]
  );

  const selectedData = useMemo(() => {
    if (!data || !filterName) return undefined;

    return data.find((item) => item.name === filterName.name);
  }, [data, filterName]);

  if (isLoading || !data) return <></>;

  if (!isLoading && !data.length) return <></>;

  return (
    <div className='flex flex-col gap-4 bg-white dark:bg-dark-container p-4'>
      <div className='flex justify-between'>
        <h3 className='font-primary font-bold text-white'>
          {filterName?.name}
        </h3>
        <SelectTeam
          options={filters}
          valueGetter={setFilterName}
          size='md'
          isDisplayLogo={false}
        />
      </div>
      <PlayoffsBracket cupTree={selectedData} />
    </div>
  );
};
