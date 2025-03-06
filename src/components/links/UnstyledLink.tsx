import { LinkProps } from 'next/link';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import CustomLink from '@/components/common/CustomizeLink';

export type UnstyledLinkProps = {
  href: string;
  children: React.ReactNode;
  openNewTab?: boolean;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
  prefetch?: boolean;
} & React.ComponentPropsWithRef<'a'>;

const UnstyledLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ children, href, openNewTab, className, nextLinkProps, ...rest }, ref) => {
    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith('/') && !href.startsWith('#');

    if (!isNewTab) {
      return (
        <CustomLink
          href={href}
          className={className}
          {...rest}
          {...(nextLinkProps && { ...nextLinkProps, prefetch: nextLinkProps.prefetch ?? undefined })}
          target='_parent'
          prefetch={false}
        >
          {children}
        </CustomLink>
      );
    }

    return (
      <a
        ref={ref}
        target='_blank'
        rel='noopener noreferrer'
        href={href}
        {...rest}
        className={clsxm('cursor-newtab', className)}
        aria-label={`icon ${href}`}
      >
        {children}
      </a>
    );
  }
);

export default UnstyledLink;
