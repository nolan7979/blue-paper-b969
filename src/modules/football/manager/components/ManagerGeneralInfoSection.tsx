import {
  Images,
  formatTimestamp,
  getAgeFromTimestamp,
  getImage,
  roundNumber,
} from '@/utils';
import { useState } from 'react';

import BirthSVG from '/public/svg/birth.svg';
import NationalitySVG from '/public/svg/nationality.svg';
import PositionSVG from '/public/svg/position.svg';
import TrophyStatsSVG from '/public/svg/trophy-stats.svg';
import WhistleStatsSVG from '/public/svg/whistle-stats.svg';
import GeneralInfo from '@/modules/football/manager/components/GeneralInfo';

export const ManagerGeneralInfoSection = ({ manager }: { manager: any }) => {
  const {
    teams = [],
    country = {},
    preferredFormation,
    performance = {},
    dateOfBirthTimestamp,
  } = manager || {};

  let team: any = {};
  const [isError, setIsError] = useState<boolean>(false);
  if (teams.length) {
    team = teams[0] || {};
  }

  const { name: teamName, slug: teamSlug, id: teamId } = team;
  const { name: countryName, slug: countrySlug, alpha2 = '' } = country;

  return (
    <>
      <div className=' flex-1 space-y-2.5'>
        <div className=''>
          <div className=' py-2'>
            <div className='dev2 plae flex items-center gap-4'>
              <img
                src={`${
                  isError
                    ? '/images/football/teams/unknown-team.png'
                    : `${getImage(Images.team, teamId)}`
                }`}
                alt='...'
                width={48}
                height={48}
                onError={() => setIsError(true)}
              ></img>
              <div>
                <div className='truncate text-base font-bold leading-5'>
                  {teamName}
                </div>
                {/* <div className='truncate text-xs font-normal leading-4 dark:text-dark-text'>
                Hợp đồng đến 30 tháng 06 năm 2025
              </div> */}
              </div>
            </div>
          </div>
          <div className=' flex py-2'>
            <GeneralInfo
              label='Quốc tịch'
              icon={
                <NationalitySVG className='inline-block h-5 w-5'></NationalitySVG>
              }
              subLabel={countryName}
              subLabelImgUrl={`${
                process.env.NEXT_PUBLIC_API_DOMAIN_IMAGE_URL_2
              }/${alpha2.toLowerCase()}.png`}
            ></GeneralInfo>

            <GeneralInfo
              label='Ngày sinh'
              icon={<BirthSVG className='inline-block h-5 w-5'></BirthSVG>}
              subLabel={`${formatTimestamp(
                dateOfBirthTimestamp,
                'yyyy-MM-dd'
              )} (${getAgeFromTimestamp(dateOfBirthTimestamp)} tuổi)`}
            ></GeneralInfo>
          </div>
          <div className=' flex py-2'>
            <GeneralInfo
              label='Đội hình ưa thích'
              icon={
                <PositionSVG className='inline-block h-5 w-5'></PositionSVG>
              }
              subLabel={preferredFormation}
            ></GeneralInfo>
            <GeneralInfo
              label='Số trận'
              icon={
                <WhistleStatsSVG className='inline-block h-5 w-5'></WhistleStatsSVG>
              }
              subLabel={performance?.total || 0}
            ></GeneralInfo>
          </div>
          <div className=' flex py-2'>
            <GeneralInfo
              label='Điểm mỗi trận'
              icon={
                <TrophyStatsSVG className='inline-block h-5 w-5 dark:text-dark-text'></TrophyStatsSVG>
              }
              subLabel={roundNumber(
                performance?.totalPoints / (performance?.total || 1) || 0,
                2
              )}
            ></GeneralInfo>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerGeneralInfoSection;
