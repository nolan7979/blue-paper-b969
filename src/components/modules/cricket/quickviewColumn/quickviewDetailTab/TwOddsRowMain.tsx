import { useEffect, useRef } from 'react';

import {
  OddsCell,
  OddsTitle,
  TwOddsRow,
} from '@/components/modules/football/quickviewColumn/quickviewDetailTab';

import { convertOdds } from '@/utils';

interface ITwOddsRowMainProps {
  name: string;
  odd1: string;
  odd2: string;
  odd3: string;
  oddsType: string;
  marketId: string;
  label: {
    label1: string;
    label2: string;
    label3: string;
  };
}

const TwOddsRowMain = ({
  name,
  odd1,
  odd2,
  odd3,
  label,
  marketId,
  oddsType,
}: ITwOddsRowMainProps) => {
  const prevOddsRef = useRef<any>();
  const { label1, label2, label3 } = label;

  const isChange = (odd: string, idx = 1): boolean | null => {
    const OddValues = odd !== '-' && parseFloat(odd);

    if (OddValues && prevOddsRef.current) {
      if (OddValues > prevOddsRef.current[`odd${idx}`]) {
        return true;
      }
      if (OddValues < prevOddsRef.current[`odd${idx}`]) {
        return false;
      }
    }
    return null;
  };

  useEffect(() => {
    const newOdds = {
      odd1: +odd1,
      odd2: +odd2,
      odd3: +odd3,
    };

    prevOddsRef.current = newOdds;
  }, [odd1, odd2, odd3]);
  return (
    <div className='p-1.5'>
      <OddsTitle>{name}</OddsTitle>

      <TwOddsRow className=''>
        <OddsCell
          label={label1}
          isHome={true}
          rate={convertOdds(odd1, marketId, oddsType, 1)}
          isUp={isChange(odd1, 1)}
        ></OddsCell>

        <OddsCell
          label={label2}
          rate={convertOdds(odd2, marketId, oddsType, 2)}
          isUp={isChange(odd2, 2)}
        ></OddsCell>

        <OddsCell
          label={label3}
          rate={convertOdds(odd3, marketId, oddsType, 3)}
          isHome={false}
          isUp={isChange(odd3, 3)}
        ></OddsCell>
      </TwOddsRow>
    </div>
  );
};
export default TwOddsRowMain;
