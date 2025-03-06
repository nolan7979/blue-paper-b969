import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export function LeftArrowBtn({ onClick }: { onClick: any }) {
  return (
    <button
      onClick={onClick}
      className='dev6 item-hover border-quick-view rounded-md bg-white p-2 dark:bg-dark-hl-1 dark:brightness-110'
    >
      <HiOutlineChevronLeft></HiOutlineChevronLeft>
    </button>
  );
}

export function RightArrowBtn({ onClick }: { onClick: any }) {
  return (
    <button
      onClick={onClick}
      className=' item-hover border-quick-view rounded-md bg-white p-2 dark:bg-dark-hl-1 dark:brightness-110'
    >
      <HiOutlineChevronRight></HiOutlineChevronRight>
    </button>
  );
}
