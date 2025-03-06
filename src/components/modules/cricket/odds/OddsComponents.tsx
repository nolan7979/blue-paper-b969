import SingleSelect from '@/components/common/selects/SingleSelect';
import SingleSelectBookMaker from '@/components/common/selects/SingleSelectBookMaker';

import { useFilterStore, useOddsStore } from '@/stores';

const bookmakers = [
  {
    id: 8,
    name: 'Bet 365',
    euCompId: 281,
  },
  {
    id: 31,
    name: 'Sbobet',
    euCompId: 474,
  },
  {
    id: 23,
    name: '188bet',
    euCompId: 499,
  },
  {
    id: 24,
    name: '12bet',
    euCompId: 18,
  },
  {
    id: 49,
    name: 'Bwin',
    euCompId: 255,
  },
  {
    id: 3,
    name: 'Crown',
    euCompId: 545,
  },
];

export const BookmakerFiltersFB = ({
  isPassive = false,
}: {
  isPassive: boolean;
}) => {
  const { selectedBookMaker, setSelectedBookMaker } = useOddsStore();
  // const { data, isFetching } = useBookmakersData();

  return (
    <div className=''>
      <SingleSelectBookMaker
        setWidth={true}
        callback={setSelectedBookMaker}
        shownValue={isPassive ? selectedBookMaker : null}
        options={bookmakers}
      ></SingleSelectBookMaker>
    </div>
  );
};

export const BookmakerFiltersQV = ({
  isPassive = false,
}: {
  isPassive: boolean;
}) => {
  const { selectedBookMakerQV, setSelectedBookMakerQV } = useOddsStore();
  // const { data, isFetching } = useBookmakersData();

  return (
    <div className=''>
      <SingleSelectBookMaker
        setWidth={true}
        callback={setSelectedBookMakerQV}
        shownValue={isPassive ? selectedBookMakerQV : null}
        options={bookmakers}
      ></SingleSelectBookMaker>
    </div>
  );
};

export const MarketsFilters = () => {
  // use Odds store
  const { setMarket } = useOddsStore();
  // const i18n = useTrans();

  // const { data, isFetching } = useBookmakersData();
  // if (isFetching || !data) return <></>;

  return (
    <div className=' '>
      <SingleSelect
        setWidth={true}
        callback={setMarket}
        // options={data?.bookmakers || []}
        options={[
          {
            id: 1,
            value: 'hdp',
            name: 'Asian HDP',
          },
          {
            id: 2,
            value: 'std1x2',
            name: '1x2',
          },
          {
            id: 3,
            value: 'tx',
            name: 'T/X',
          },
        ]}
      ></SingleSelect>
    </div>
  );
};
