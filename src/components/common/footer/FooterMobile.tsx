import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import CustomLink from '@/components/common/CustomizeLink';
import {
  ContactSection,
  LogoSection,
} from '@/components/common/footer/FooterDesktop';

export function MbFooter() {
  const i18n = useTrans();

  return (
    <footer className='bg-dark-dark-blue text-dark-default'>
      <div className='layout space-y-3 p-3'>
        <LogoSection />
        <ContactSection i18n={i18n} />
        <InfoSection i18n={i18n} />
      </div>
    </footer>
  );
}

const InfoSection = ({ i18n }: { i18n?: any }) => {
  return (
    <>
      <div className='flex flex-wrap place-content-center divide-x divide-dark-text text-center text-xs text-dark-text'>
        <InfoLine>
          <CustomLink href='/' target='_parent'>
            {i18n.footer.about}
          </CustomLink>
        </InfoLine>
        <InfoLine>
          <CustomLink href='/' target='_parent'>
            {i18n.footer.disclaimer}
          </CustomLink>
        </InfoLine>
        <InfoLine>
          <CustomLink href='/' target='_parent'>
            {i18n.footer.terms_of_service}
          </CustomLink>
        </InfoLine>
        <InfoLine>
          <CustomLink href='/' target='_parent'>
            {i18n.footer.faq}
          </CustomLink>
        </InfoLine>
        <InfoLine>
          <CustomLink href='/' target='_parent'>
            {i18n.footer.privacy_policy}
          </CustomLink>
        </InfoLine>
        <InfoLine>
          <CustomLink href='/' target='_parent'>
            {i18n.footer.copyright}
          </CustomLink>
        </InfoLine>
        <InfoLine>
          <CustomLink href='/' target='_parent'>
            {i18n.footer.contact}
          </CustomLink>
        </InfoLine>
      </div>
    </>
  );
};

const InfoLine = tw.div`px-3`;
