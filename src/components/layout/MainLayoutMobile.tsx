// TODO lighter
import tw from 'twin.macro';

import { MbFooter } from '@/components/common/footer/FooterMobile';
import { MbHeader } from '@/components/common/header';
import { TwCard } from '@/components/modules/football/tw-components/TwFootball';

import { LayoutProps } from '@/models';

export function MbMainLayout({ children }: LayoutProps) {
  return (
    <PageContainer>
      <MbHeader />

      <TwMainContentSection>{children}</TwMainContentSection>

      {/* <TwIntroSection /> */}

      <MbFooter />
    </PageContainer>
  );
}

export const PageContainer = tw.div`
  // max-w-md
  flex
  min-h-screen
  flex-col
  bg-light-main
  dark:bg-dark-main
`;
export const TwMainContentSection = tw.main`flex-1`;

const TwIntroSection = () => (
  <div className='layout my-4'>
    <TwCard className=''>
      Different Intro Section for Mobile
      {/* <Tabs.Group // TODO tab header background color
        aria-label='Tabs with icons'
        style='underline'
        className=' text-sm font-normal leading-6 text-light-default'
      >
        <Tabs.Item active={true} title='ABC LÀ GÌ?'>
          <div className='space-y-3'>
            <p>
              Uniscore là địa chỉ cung cấp cho bạn những thông tin về bóng đá
              một cách chính xác và đầy đủ nhất. Thêm vào đó, bạn còn nhận được
              rất nhiều thông tin quan trọng, giúp cho việc soi kèo nhà cái, đọc
              tỷ số trực tuyến hôm nay của bạn trở nên chuẩn xác hơn.
            </p>
            <p>
              Bóng đá chính là bộ môn thể thao vua hiện nay, khi mà số lượng
              người hâm mộ cực kỳ lớn. Tại Việt Nam thì đây cũng là môn thể thao
              được yêu thích nhất. Chính vì thế, nhu cầu xem tin tức, kết quả,
              bảng kèo hay là ty số trực tuyến khá là cao. Tuy nhiên không có
              quá nhiều trang web đáp ứng được nhu cầu của mọi người. Chính vì
              lý do này mà trang web Uniscore đã được ra đời.
            </p>
            <p>
              Ngay từ ngày đầu xây dựng thì chúng tôi đã có mục tiêu trở thành
              trang web bóng đá trực tuyến hàng đầu Việt Nam. Bạn có thể nhìn
              vào tốc độ phát triển của Uniscore để thấy được điều này. Khi mà
              chúng tôi đã phát triển không ngừng nghỉ trong thời gian vừa qua.
            </p>
            <p>
              Ngay từ ngày đầu xây dựng thì chúng tôi đã có mục tiêu trở thành
              trang web bóng đá trực tuyến hàng đầu Việt Nam. Bạn có thể nhìn
              vào tốc độ phát triển của Uniscore để thấy được điều này. Khi mà
              chúng tôi đã phát triển không ngừng nghỉ trong thời gian vừa qua.
            </p>
          </div>
        </Tabs.Item>
        <Tabs.Item title='MỤC TIÊU PHÁT TRIỂN'> content</Tabs.Item>
        <Tabs.Item title='CHỨC NĂNG TẠI WEB'> content</Tabs.Item>
        <Tabs.Item title='CẬP NHẬT TIN TỨC BÓNG ĐÁ MỚI NHẤT'>content</Tabs.Item>
        <Tabs.Item title='CẬP NHẬT TÌNH HÌNH BÓNG ĐÁ MỚI NHẤT'>
          content
        </Tabs.Item>
      </Tabs.Group> */}
    </TwCard>
  </div>
);
