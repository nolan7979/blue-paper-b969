import { Footer } from '@/components/common/footer/FooterDesktop';
import { Header } from '@/components/common/header';
import { PageContainer } from '@/components/layout/MainLayout';

export function BasicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <Header />

      <main className='flex-1'>{children}</main>

      <Footer />
    </PageContainer>
  );
}
