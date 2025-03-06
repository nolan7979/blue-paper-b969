import { useState } from 'react';

import { useCategoryData } from '@/hooks/useSportData';

import { AllLeaguesRep } from '@/components/modules/badminton/filters/AllLeaguesRep';
import React from 'react';
import { SPORT } from '@/constant/common';

export const AllLeagues = ({
  hrefPrefix = '/badminton/competition/',
}: {
  hrefPrefix?: string;
}) => {
  const [category, setCategory] = useState<string>('');
  const { data: allCates, isLoading, isFetching } = useCategoryData(SPORT.BADMINTON);

  if (isLoading || !allCates || isFetching) {
    return <></>;
  }

  return (
    <AllLeaguesRep
      category={category}
      setCategory={setCategory}
      allCates={allCates}
      hrefPrefix={hrefPrefix}
    />
  );
};
