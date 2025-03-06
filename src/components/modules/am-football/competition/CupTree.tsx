import { SeasonDto } from '@/constant/interface';
import { useCupTree } from '@/hooks/useAmericanFootball';
import { Option, SelectTeam } from '@/components/modules/basketball/selects';
import { PlayoffsBracket } from '@/components/modules/am-football/competition';
import { useMemo, useState } from 'react';
import QuickViewFilterTabRounds from '@/components/modules/am-football/QuickViewFilterTabRounds';
import { useWindowSize } from '@/hooks/useWindowSize';
import clsx from 'clsx';
import { EmptyEvent } from '@/components/common/empty';
import useTrans from '@/hooks/useTrans';

type CupTreeProps = {
  selectedSeason: SeasonDto;
  isTeam?: Boolean;
};

export const CupTree: React.FC<CupTreeProps> = ({ selectedSeason, isTeam }) => {
  const i18n = useTrans();
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

  if (!isLoading && !data.length && !isMobile) return <></>;

  if (!isLoading && !data.length && isMobile)
    return <EmptyEvent title={i18n.common.nodata} content='' />;

  return (
    <div
      className={clsx(
        'flex flex-col gap-4 px-4',
        {
          'bg-white py-4 dark:bg-dark-container': !isMobile,
          'bg-transparent': isMobile,
        }
      )}
    >
      {isMobile && (
        <QuickViewFilterTabRounds
          selectedSeason={selectedSeason}
          cupTree={selectedData}
        />
      )}

      <div
        className={`flex justify-between ${(isTeam || isMobile) && 'hidden'}`}
      >
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
