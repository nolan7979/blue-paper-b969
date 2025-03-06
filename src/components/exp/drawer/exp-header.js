import { FaHamburger } from 'react-icons/fa';

export default function HeaderDrawer({ setIsOpen }) {
  return (
    <div className='bddev items-center] flex'>
      <button
        onClick={() => setIsOpen(true)}
        className='text-primary-700 hover:bg-primary-100 rounded-full border bg-transparent p-2'
        aria-label='Name'
      >
        <FaHamburger size={20} />
      </button>
    </div>
  );
}
