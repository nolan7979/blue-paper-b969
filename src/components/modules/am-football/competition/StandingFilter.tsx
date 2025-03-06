import { Select } from '@/components/common';
import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import isEmpty from 'lodash/isEmpty';
import { useState } from 'react';
import { Option } from '@/components/modules/basketball/selects';
import useTrans from '@/hooks/useTrans';

type StandingStableProps = {
  filterLabel: string[];
  standingFilter: string;
  setStandingFilter: (value: any) => void;
};

export const StandingFilter: React.FC<StandingStableProps> = ({
  filterLabel = [],
  standingFilter,
  setStandingFilter,
}) => {
  const i18n = useTrans();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { isMobile } = useDetectDeviceClient();

  const renderOption = filterLabel.map((it: any) => ({ id: it, name: it }));

  const mapSelectedSeason = (seltedOption: Option) => {
    const season =
      renderOption?.find((season) => season.id === seltedOption.id) || '';

    if (!isEmpty(season)) setStandingFilter(season);
    setShowBottomSheet(false);
  };

  return (
    <>
      {!isMobile && (
        <Select
          options={renderOption}
          label='name'
          classes='!w-32'
          valueGetter={setStandingFilter}
        />
      )}
      {isMobile && (
        <>
          <div
            className='flex cursor-pointer items-center justify-between rounded-md bg-primary-gradient p-2'
            onClick={() => setShowBottomSheet(true)}
          >
            <span className='font-primary text-sm font-bold text-white'>
              {standingFilter}
            </span>
          </div>

          <BottomSheetComponent
            open={showBottomSheet}
            onClose={() => setShowBottomSheet(false)}
          >
            <div className='flex flex-col p-4'>
              <h3 className='mb-4 text-center text-black dark:text-white'>
                {i18n.competition.round}
              </h3>
              <div className='max-h-[370px] overflow-y-scroll'>
                {renderOption.map((option) => (
                  <div
                    key={option.id}
                    className={`cursor-pointer text-start rounded-md p-3 ${
                      option.id === standingFilter ? 'bg-[#333]' : ''
                    }`}
                    onClick={() => mapSelectedSeason(option)}
                  >
                    <span
                      className={`${
                        option.id === standingFilter
                          ? 'text-white'
                          : 'text-black'
                      } dark:text-white`}
                    >
                      {option.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BottomSheetComponent>
        </>
      )}
    </>
  );
};
