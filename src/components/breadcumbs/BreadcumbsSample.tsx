import CustomLink from '@/components/common/CustomizeLink';

export const BreadCumbs = () => {
  return (
    <div>
      <nav
        className='bddev text-dark hover:text-primary-700 focus:text-primary-700 relative flex w-full flex-wrap items-center justify-between py-2 lg:flex-wrap lg:justify-start'
        data-te-navbar-ref
      >
        <div className='flex w-full flex-wrap items-center justify-between px-2'>
          <nav
            className='bg-grey-light w-full rounded-md'
            aria-label='breadcrumb'
          >
            <ol className='list-reset flex'>
              <li>
                <CustomLink
                  href='/'
                  className='text-dark dark:text-white'
                  target='_parent'
                >
                  Trang chủ
                </CustomLink>
              </li>
              <li>
                <span className='text-dark mx-2 dark:text-white'>/</span>
              </li>
              <li>
                <CustomLink
                  href='/football'
                  className='text-dark hover:text-dark dark:text-white'
                  target='_parent'
                >
                  Bóng đá
                </CustomLink>
              </li>
              <li>
                <span className='text-dark mx-2 dark:text-white'>/</span>
              </li>
              <li>
                <CustomLink
                  href='/football/ty-so-truc-tuyen'
                  className='text-dark hover:text-dark dark:text-white'
                  target='_parent'
                >
                  Tỉ số trực tuyến
                </CustomLink>
              </li>
            </ol>
          </nav>
        </div>
      </nav>
    </div>
  );
};
