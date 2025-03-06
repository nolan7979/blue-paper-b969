import { SeasonDto } from '@/constant/interface';
import { useCupTree } from '@/hooks/useBasketball';
import { Option, SelectTeam } from '@/components/modules/basketball/selects';
import { PlayoffsBracket } from '@/components/modules/basketball/competition';
import { useMemo, useState } from 'react';
import QuickViewFilterTabRounds from '@/components/modules/basketball/QuickViewFilterTabRounds';
import { useWindowSize } from '@/hooks/useWindowSize';
import clsx from 'clsx';
import { EmptyEvent } from '@/components/common/empty';
import useTrans from '@/hooks/useTrans';

type CupTreeProps = {
  selectedSeason: SeasonDto;
};

export const CupTree: React.FC<CupTreeProps> = ({ selectedSeason }) => {
  const [filterName, setFilterName] = useState<Option>({ id: '', name: '' });
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);
  const i18n = useTrans();

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

  if (!isLoading && !data.length && !isMobile) return <></>;

  if (isMobile && !isLoading && !data.length) return <EmptyEvent title={i18n.common.nodata} content={''} />;

  return (
    <div
      className={clsx('flex flex-col gap-4 px-4 pb-4 rounded-md', {
        'bg-transparent': isMobile,
        'bg-white pt-4 dark:bg-dark-container': !isMobile,
      })}
    >
      {isMobile && (
        <QuickViewFilterTabRounds
          selectedSeason={selectedSeason}
          cupTree={selectedData}
        />
      )}
      <div className={`flex justify-between ${isMobile && 'hidden'}`}>
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
