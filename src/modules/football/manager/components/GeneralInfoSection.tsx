import { ArrowDownIcon, ArrowUpIcon, CurrenyIcon } from '@/components/icons';
import { TwQuickViewSection } from '@/components/modules/football/tw-components';
import useTrans from '@/hooks/useTrans';
import GeneralInfo from '@/modules/football/manager/components/GeneralInfo';
import Image from 'next/image';
import BirthSVG from '/public/svg/birth.svg';
import HeightSVG from '/public/svg/height.svg';
import MarketValueSVG from '/public/svg/market-value.svg';
import NationalitySVG from '/public/svg/nationality.svg';
import PositionSVG from '/public/svg/position.svg';
import RwSVG from '/public/svg/rw.svg';
import ShirtNoSVG from '/public/svg/shirt-no.svg';
import StSVG from '/public/svg/st.svg';
import StrongFootSVG from '/public/svg/strong-foot.svg';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';

const GeneralInfoSection = () => {
  const i18n = useTrans();
  return (
    <div className=' flex-1 space-y-2.5'>
      <div className=''>
        <div className=' py-2'>
          <div className='dev2 plae flex items-center gap-4'>
            <Image
              unoptimized={true}
              src='/images/football/teams/ars.png'
              alt='man-utd'
              width={48}
              height={48}
            ></Image>
            <div>
              <div className='truncate text-base font-bold leading-5'>
                Manchester United
              </div>
              <div className='truncate text-xs font-normal leading-4 dark:text-dark-text'>
                Hợp đồng đến 30 tháng 06 năm 2025
              </div>
            </div>
          </div>
        </div>
        <div className=' flex py-2'>
          <GeneralInfo
            label='Quốc tịch'
            icon={
              <NationalitySVG className='inline-block h-5 w-5'></NationalitySVG>
            }
            subLabel='ENG'
            subLabelImgUrl='/images/countries/england.png'
          ></GeneralInfo>

          <GeneralInfo
            label='Ngày sinh'
            icon={<BirthSVG className='inline-block h-5 w-5'></BirthSVG>}
            subLabel='31/10/1997 (25 tuổi)'
          ></GeneralInfo>
        </div>
        <div className=' flex py-2'>
          <GeneralInfo
            label='Chiều cao'
            icon={<HeightSVG className='inline-block h-5 w-5'></HeightSVG>}
            subLabel='186cm'
          ></GeneralInfo>
          <GeneralInfo
            label='Thuận chân'
            icon={
              <StrongFootSVG className='inline-block h-5 w-5'></StrongFootSVG>
            }
            subLabel='Phải'
          ></GeneralInfo>
        </div>
        <div className=' flex py-2'>
          <GeneralInfo
            label='Vị trí'
            icon={<PositionSVG className='inline-block h-5 w-5'></PositionSVG>}
            subLabel='ST'
          ></GeneralInfo>
          <GeneralInfo
            label='Số áo'
            icon={<ShirtNoSVG className='inline-block h-5 w-5'></ShirtNoSVG>}
            subLabel='3'
          ></GeneralInfo>
        </div>
      </div>
      <TwQuickViewSection className=''>
        <div className='flex place-content-center items-center gap-x-4 p-2.5'>
          <div>
            <MarketValueSVG className='h-10 w-10'></MarketValueSVG>
          </div>
          <div>
            <span className='text-sm uppercase dark:text-dark-text'>
              Giá trị
            </span>{' '}
            <span className=' font-bold text-logo-blue'>63M €</span>
          </div>
        </div>
        <Divider></Divider>
        <div className='flex justify-between p-2.5 text-sm'>
          <div>{i18n.player.isCrease}</div>
          <div className='flex space-x-2'>
            <button className=' rounded-md bg-white p-2 text-center'>
              <ArrowUpIcon className='mx-auto text-dark-win'></ArrowUpIcon>
              <CurrenyIcon className='w-6'></CurrenyIcon>
            </button>
            <button className=' rounded-md bg-white p-2'>
              <CurrenyIcon className='w-6 '></CurrenyIcon>
              <ArrowDownIcon className=' mx-auto text-dark-loss'></ArrowDownIcon>
            </button>
          </div>
        </div>
      </TwQuickViewSection>
      <div className=' flex justify-between rounded-md bg-[#3D9F53] p-2'>
        <div className='flex w-1/2 flex-col place-content-center gap-3 text-csm leading-4'>
          <div>
            <p className='text-strength'>Điểm mạnh</p>
            <p>Passing Anchor play</p>
          </div>
          <div>
            <p className='text-csm text-weekness'>Điểm yếu</p>
            <p>No outstanding weekness</p>
          </div>
        </div>
        <div className=' relative'>
          {/* <div
            className='  aspect-w-1 h-20 bg-cover bg-no-repeat '
            style={{
              backgroundImage: `url('/images/football/general/stadium-small.png')`,
            }}
          >
          </div> */}
          <RwSVG className='absolute left-10 top-5 h-6 w-5'></RwSVG>
          <StSVG className='absolute left-5 top-11 h-6 w-5'></StSVG>
          <Image
            unoptimized={true}
            src='/images/football/general/stadium-small.png'
            height={28}
            width={196}
            alt='stadium'
            className=' '
          ></Image>
        </div>
      </div>
    </div>
  );
};
export default GeneralInfoSection;
