import { Select } from '@/components/common';

type StandingStableProps = {
  filterLabel: string[];
  standingFilter: string;
  setStandingFilter: (value: string) => void;
};

export const StandingFilter: React.FC<StandingStableProps> = ({
  filterLabel = [],
  standingFilter,
  setStandingFilter,
}) => {
  const renderOption = filterLabel.map((it:any) => ({id: it, name: it}))
  return (
    <Select
      options={renderOption}
      label='name'
      classes='!w-32'
      valueGetter={setStandingFilter}
    ></Select>
  );
};
