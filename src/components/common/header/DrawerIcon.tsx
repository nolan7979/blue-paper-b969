import HambergerIcon from '/public/svg/hamberger.svg';

interface HeaderDrawerProps {
  setIsOpen: (isOpen: boolean) => void;
}

export function HeaderDrawer({ setIsOpen }: HeaderDrawerProps) {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className='rounded-full p-1 text-dark-default md:bg-transparent lg:hidden'
      aria-label='Name'
    >
      <HambergerIcon className='h-5 w-5' />
    </button>
  );
}
