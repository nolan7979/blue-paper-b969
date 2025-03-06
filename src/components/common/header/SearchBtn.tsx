import { useState } from 'react';

import SearchModal from '@/components/search/SearchModal';

import SearchIcon from '/public/svg/fi-search.svg';

export const SearchBtn = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((x) => !x)}
        className='flex items-center rounded-full p-1 text-dark-default hover:brightness-125 sm:bg-neutral-alpha-04 lg:p-2.5'
        aria-label='Search button'
      >
        <SearchIcon className='h-4 w-4' />
      </button>
      <SearchModal open={open} setOpen={setOpen}></SearchModal>
    </>
  );
};
