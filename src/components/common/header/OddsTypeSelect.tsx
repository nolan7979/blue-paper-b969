import SingleSelect from '@/components/common/selects/SingleSelect';
import useTrans from '@/hooks/useTrans';

import { useOddsStore } from '@/stores';

export const OddsTypeSelect = () => {
  const { setOddsType } = useOddsStore();
  const i18n = useTrans();

  return (
    <>
      <SingleSelect
        i18n={i18n}
        options={[
          { name: 'malayOdds', id: 5, value: '5' },
          { name: 'decimalOdds', id: 4, value: '4' },
          { name: 'hongkongOdds', id: 1, value: '1' },
          { name: 'indonesiaOdds', id: 2, value: '2' },
          { name: 'americanOdds', id: 3, value: '3' },
        ]}
        callback={setOddsType}
        setWidth={true}
        lowContrast={true}
      />
    </>
  );
};
