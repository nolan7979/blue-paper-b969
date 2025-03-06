import {
  TwAboutText,
  TwSection,
  TwTitle,
} from '@/components/modules/football/tw-components';

const AboutManagerSection = () => {
  return (
    <div className='space-y-2'>
      <TwSection className='space-y-2 p-4 leading-7 xl:rounded-xl'>
        <TwTitle className=''>Về Erik Tenhag</TwTitle>
        <TwAboutText>
          Etiam libero augue, tincidunt scelerisque blandit eu, suscipit cursus
          dolor. Integer aliquet, lectus quis suscipit dignissim, lorem est
          convallis orci, nec semper tellus est ut sem. Aliquam semper sit amet
          tellus quis tempus.
        </TwAboutText>
        <TwAboutText>
          Suspendisse sollicitudin, justo at rhoncus viverra, lectus sapien
          posuere enim, eu consectetur tortor nibh a turpis. Mauris sed est sit
          amet eros aliquet commodo. Nullam molestie ligula ut fermentum
          consequat. Praesent congue tristique maximus. Sed pretium mi sed
          facilisis rutrum. Ut vulputate eros pulvinar, interdum libero non,
          viverra nulla. Mauris at dignissim leo.
        </TwAboutText>
      </TwSection>
    </div>
  );
};
export default AboutManagerSection;
