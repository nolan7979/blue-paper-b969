import { memo, useEffect, useState } from 'react';

import { TwFilterTitle } from '@/components/modules/common';
import { AllLeaguesRep } from '@/components/modules/common/filters/AllLeaguesRep';
import { useCategoryData } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { useCategoriesStore } from '@/stores/categories-store';
import { isEqual } from 'lodash';

export const AllLeagues = memo(
  ({
    hrefPrefix = '/competition/basketball',
    sport,
    isHiddenAllLeages = false,
  }: {
    hrefPrefix?: string;
    sport: string;
    isHiddenAllLeages?: boolean;
  }) => {
    const i18n = useTrans();
    const [category, setCategory] = useState<string>('');
    const { data: allCates = [] } = useCategoryData(sport);
    const { categories, setCategories } = useCategoriesStore();

    useEffect(() => {
      if (isEqual(categories, allCates)) return;
      setCategories(allCates);
    }, [allCates]);

    if ((allCates && allCates.length == 0) || isHiddenAllLeages) {
      return <></>;
    }

    return (
      <div className='space-y-1 py-2'>
        <TwFilterTitle className='font-oswald'>
          {i18n.drawerMobile.tournaments}
        </TwFilterTitle>
        <AllLeaguesRep
          category={category}
          setCategory={setCategory}
          allCates={allCates}
          hrefPrefix={hrefPrefix}
          sport={sport}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.sport === nextProps.sport &&
      prevProps?.hrefPrefix === nextProps.hrefPrefix &&
      prevProps?.isHiddenAllLeages === nextProps.isHiddenAllLeages
    );
  }
);
