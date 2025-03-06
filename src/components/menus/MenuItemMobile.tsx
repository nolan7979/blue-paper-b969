import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';

import CustomLink from '@/components/common/CustomizeLink';
import clsx from 'clsx';

interface TabProps {
  href: string;
  name: string;
  className?: string;
}

const MbMenuItem = ({ href, name, className }: TabProps) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    // TODO: use constants for domains

    if (currentPath == href) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [currentPath, href]);

  return (
    <li className=' whitespace-nowrap'>
      <CustomLink
        href={href}
        target='_parent'
        className={clsx(className, 'inline-block w-full text-csm uppercase')}
      >
        <MenuText selected={selected} name={name}></MenuText>
      </CustomLink>
    </li>
  );
};

export default MbMenuItem;

const MenuText = ({
  selected = false,
  name,
}: {
  selected: boolean;
  name: string;
}) => {
  return (
    <span
      css={[
        selected &&
          tw`bg-light-hd2-selected text-all-blue
          border border-[#3493E4]/30
          dark:(bg-all-blue text-dark-white)
          `,
        tw`m-2 inline-block p-1.5 px-3 rounded`,
        !selected &&
          tw`bg-light-match text-light-team
          dark:(bg-dark-hl-3 text-dark-text)
          border border-transparent
          `,
      ]}
    >
      {name}
    </span>
  );
};
