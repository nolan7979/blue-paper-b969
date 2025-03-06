import CustomLink from '@/components/common/CustomizeLink';
import { TwCard, TwMainCol } from '@/components/modules/football/tw-components';
import useTrans from '@/hooks/useTrans';
import { RxDoubleArrowLeft } from 'react-icons/rx';

const EmptyData: React.FC = () => {
  const i18n = useTrans();
  return (
    <TwMainCol className='h-full'>
      <TwCard className='h-full rounded-md p-4 text-center'>
        <p className='pb-4'>{i18n.article.noArticle}</p>
        <CustomLink
          className='rounded-md bg-dark-dark-blue px-4 py-2 md:text-lg'
          href='/'
          target='_parent'
        >
          <button className='space-x-2 text-logo-yellow'>
            <RxDoubleArrowLeft className='inline-block'></RxDoubleArrowLeft>
            <span className='text-xs'>{i18n.article.goBack}</span>
          </button>
        </CustomLink>
      </TwCard>
    </TwMainCol>
  );
};

export default EmptyData;
