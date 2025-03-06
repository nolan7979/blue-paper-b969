import { CSSInterpolation } from '@emotion/serialize';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HTMLAttributeAnchorTarget } from 'react';

interface CustomizeLinkProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  prefetch?: boolean | null;
  target?: HTMLAttributeAnchorTarget;
  css?: CSSInterpolation | any;
  style?: any;
  disabledOnClick?: boolean;
}

function CustomLink(props: CustomizeLinkProps) {
  const {
    href,
    className,
    disabled,
    css,
    target = '_self',
    prefetch = false,
    disabledOnClick = false,
    style
  } = props;
  const router = useRouter();
  const onClickToPage = (e: any) => {
    if (disabledOnClick) return;

    e.preventDefault();
    if (!disabled && href) {
      router.push(href);
    }
  };
  if (disabled) {
    return (
      <span
        className={clsx(
          { 'hover:cursor-not-allowed hover:text-inherit': !!disabled },
          className
        )}
      >
        {props.children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      css={css}
      onClick={onClickToPage}
      target={target}
      passHref
      prefetch={prefetch as boolean}
      className={className}
      style={style}
    >
      {props.children}
    </Link>
  );
}

export default React.memo(CustomLink, (prevProps, nextProps) => {
  return (
    prevProps?.href === nextProps.href &&
    prevProps?.disabled === nextProps.disabled &&
    prevProps?.disabledOnClick === nextProps.disabledOnClick &&
    prevProps?.className === nextProps.className && 
    prevProps?.target === nextProps.target &&
    prevProps?.prefetch === nextProps.prefetch &&
    prevProps?.css === nextProps.css &&
    prevProps?.children === nextProps.children
  );
});
