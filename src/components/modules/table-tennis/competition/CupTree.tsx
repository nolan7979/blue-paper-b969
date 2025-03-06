import { SeasonDto } from '@/constant/interface';
import { useCupTree } from '@/hooks/useTableTennis';
import { Option, SelectTeam } from '@/components/modules/table-tennis/selects';
import { CupTreeMobile, PlayoffsBracket } from '@/components/modules/table-tennis/competition';
import { useMemo, useState } from 'react';
import React from 'react';
import QuickViewFilterTabRounds from '@/components/modules/table-tennis/QuickViewFilterTabRounds';
import { EmptyEvent } from '@/components/common/empty';
import useTrans from '@/hooks/useTrans';

type CupTreeProps = {
  selectedSeason: SeasonDto;
  isMobile?: boolean;
};

export const CupTree: React.FC<CupTreeProps> = ({ selectedSeason, isMobile = false }) => {
  const [filterName, setFilterName] = useState<Option>({ id: '', name: '' });
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

  if (!isLoading && !data.length) return (
    <div className='flex flex-col gap-4 bg-white dark:bg-dark-container p-4'>
      <EmptyEvent title={i18n.common.nodata} content={''} />
    </div>
  );
  return (
    <>
      {isMobile && selectedData ? (
        <>
          <QuickViewFilterTabRounds selectedSeason={selectedSeason} cupTree={selectedData} />
          {/* <CupTreeMobile cupTree={selectedData} /> */}
        </>
      ) : (
        <div className='flex flex-col gap-4 bg-white dark:bg-dark-container p-4'>
          <div className='flex justify-between'>
            <h3 className='font-primary font-bold text-black dark:text-white'>
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
      )}
    </>
  );
};
