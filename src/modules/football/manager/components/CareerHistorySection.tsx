import { Divider } from '@/components/modules/football/tw-components/TwPlayer';

import CareerPointGraphSection from '@/modules/football/manager/components/CareerPointGraphSection';
import ClubHistorySection from '@/modules/football/manager/components/ClubHistorySection';

const CareerHistorySection = ({
  managerDetails,
  managerCareerHistory,
}: {
  managerDetails: any;
  managerCareerHistory: any;
}) => {
  return (
    <>
      <CareerPointGraphSection
        managerDetails={managerDetails}
        managerCareerHistory={managerCareerHistory}
      ></CareerPointGraphSection>
      <div className='block px-2.5 lg:hidden'>
        <Divider></Divider>
      </div>
      <div className=' flex-1 p-2.5'>
        <ClubHistorySection
          // managerDetails={managerDetails}
          managerCareerHistory={managerCareerHistory}
        ></ClubHistorySection>
      </div>
    </>
  );
};
export default CareerHistorySection;
