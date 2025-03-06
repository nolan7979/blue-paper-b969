import { SeasonDto } from '@/constant/interface';
import { useCupTree } from '@/hooks/useCricket';
import { Option, SelectTeam } from '@/components/modules/basketball/selects';
import { PlayoffsBracket } from '@/components/modules/cricket/competition';
import { useMemo, useState } from 'react';
import QuickViewFilterTabRounds from '@/components/modules/cricket/QuickViewFilterTabRounds';
import { useWindowSize } from '@/hooks/useWindowSize';

type CupTreeProps = {
  selectedSeason: SeasonDto;
  isTeam?: Boolean;
};

export const CupTree: React.FC<CupTreeProps> = ({ selectedSeason, isTeam }) => {
  const [filterName, setFilterName] = useState<Option>({ id: '', name: '' });

  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);

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
      {isMobile && <QuickViewFilterTabRounds selectedSeason={selectedSeason} cupTree={selectedData} />}
      
      <div className={`flex justify-between ${(isTeam || isMobile) && 'hidden'}`}>
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
      {!isMobile && <PlayoffsBracket cupTree={selectedData} />}
    </div>
  );
};
