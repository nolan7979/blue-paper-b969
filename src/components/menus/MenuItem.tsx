import CustomLink from '@/components/common/CustomizeLink';
import { useFilterStore, useMatchStore } from '@/stores';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

interface TabProps {
  href: string;
  name?: string;
  onClick: () => void;
  className?: string;
  icon?: any;
  sport?: string;
}

const MenuItem = ({
  href,
  name,
  onClick,
  icon,
  className,
  sport,
}: TabProps) => {
  const { asPath: currentPath } = useRouter();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const isFixture = href.includes('fixtures');
  useEffect(() => {
    let shouldSelect = false;

    if (currentPath === '/') {
      shouldSelect = href === '/football' || href === '/';
    } else {
      const startsWithHref = href === currentPath;
      shouldSelect = startsWithHref;
    }

    setIsSelected(shouldSelect);
  }, [currentPath, href]);
  const Icon = icon || null;

  return (
    <li
      test-id={name}
      key={href}
      className={`${
        isSelected && 'bg-gradient-to-r from-[#48F197] to-[#0B7BFF]'
      } h-9 w-fit cursor-pointer rounded-[5.438rem] hover:brightness-125 lg:p-[0.063rem] ${className}`}
      onClick={onClick}
    >
      <CustomLink href={href} className='!inline h-full' disabledOnClick>
        <div
          className={clsx(
            isSelected &&
              'bg-gradient-to-r from-[#1553EF] to-[#0C1A4C] dark:from-[#1F3396] dark:to-[#1B36C4]',
            'flex h-full max-w-full cursor-pointer items-center gap-1 overflow-hidden truncate overflow-ellipsis rounded-[5.438rem] px-2.5 py-1 xl:gap-1.5'
          )}
        >
          {icon && (
            <span
              className={clsx(
                isSelected ? 'text-white' : 'text-[#0038E0] dark:text-white',
                isFixture && '-ml-1'
              )}
            >
              <Icon className='h-6 w-6' />
            </span>
          )}
          <span
            className={clsx(
              'bg-gradient-to-r bg-clip-text font-primary text-ccsm font-semibold normal-case text-transparent',
              isSelected
                ? 'text-white'
                : 'from-[#0C3089] to-[#0C1A4C] dark:from-[#FFFFFF] dark:to-[#70B3FF]'
            )}
          >
            {name}
          </span>
        </div>
      </CustomLink>
    </li>
  );
};

export const MenuItemMobile = ({
  href,
  name,
  onClick,
  icon,
  className,
}: TabProps) => {
  const { asPath: currentPath } = useRouter();
  const menuRef = useRef<string | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { resetMatchFilter, matchTypeFilterMobile, setMatchFilterMobile } =
    useFilterStore();
  const Icon = icon;

  useEffect(() => {
    const startsWithHref = href === matchTypeFilterMobile;
    const shouldSelect =
      currentPath === '/' && matchTypeFilterMobile === 'all'
        ? href === matchTypeFilterMobile
        : startsWithHref;

    if (menuRef.current !== matchTypeFilterMobile) {
      setIsSelected(shouldSelect);
    }
  }, [currentPath, href, matchTypeFilterMobile]);

  return (
    <li
      test-id={name}
      key={href}
      className={`${
        isSelected && 'bg-gradient-to-r from-[#48F197] to-[#0B7BFF]'
      } h-7 w-fit cursor-pointer rounded-[5.438rem] p-[0.063rem] hover:brightness-125 ${className}`}
      onClick={() => {
        resetMatchFilter();
        setMatchFilterMobile(href);
      }}
    >
      {/* <CustomLink href={href} target='_parent' className='!inline h-full'> */}
      <div
        className={clsx(
          'flex h-full max-w-full cursor-pointer items-center overflow-hidden truncate overflow-ellipsis rounded-[5.438rem] px-3 py-1.5',
          {
            'bg-gradient-to-r from-[#1553EF] to-[#0C1A4C] dark:from-[#1F3396] dark:to-[#1B36C4]':
              isSelected,
            'px-2.5': href === '/',
          }
        )}
      >
        {icon && (
          <span
            className={clsx(
              isSelected ? 'text-white' : 'text-[#0038E0] dark:text-white'
            )}
          >
            <Icon className='h-5 w-5' />
          </span>
        )}
        {name && (
          <span
            className={clsx(
              'font-primary text-ccsm font-semibold normal-case text-white dark:bg-gradient-to-r dark:bg-clip-text dark:text-transparent',
              isSelected
                ? 'from-white to-white dark:from-[#45F194] dark:to-[#ACF0FF]'
                : 'from-[#0C3089] to-[#0C1A4C] dark:from-[#FFFFFF] dark:to-[#70B3FF]'
            )}
          >
            {name}
          </span>
        )}
      </div>
      {/* </CustomLink> */}
    </li>
  );
};

export default MenuItem;
