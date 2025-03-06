import { BellOff, BellOn } from '@/components/icons';

export const BellIcon = ({
  isBellOn,
  changeBellOn,
  additionalData, // New prop for additional data
}: {
  isBellOn: boolean;
  changeBellOn: (e: React.MouseEvent<HTMLDivElement>, additionalData?: any) => Promise<void> | void;
  additionalData?: any; // Type for additional data
}) => {
  return (
    <div onClick={(e) => changeBellOn(e, additionalData)}>
      {isBellOn ? (
        <BellOn classes='w-4 h-4' />
      ) : (
        <BellOff className='h-4 w-4 cursor-pointer' />
      )}
    </div>
  );
};
