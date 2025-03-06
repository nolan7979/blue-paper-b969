import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface IDrawer {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
  position?: 'left' | 'right';
  className?: string;
  classNameContainer?: string;
}

const Drawer: React.FC<IDrawer> = ({
  children,
  isOpen,
  setIsOpen,
  position = 'right',
  className,
  classNameContainer,
}) => {
  return (
    <main
      className={clsx(
        twMerge(
          'fixed inset-0 z-40 transform overflow-hidden bg-[#151820] bg-opacity-0 ease-in-out',
          classNameContainer
        ),
        {
          'translate-x-0 opacity-100 transition-opacity duration-500':
            isOpen && position === 'right',
          'translate-x-full opacity-0 transition-all delay-500':
            !isOpen && position === 'right',
          '-translate-x-0 opacity-100 transition-opacity duration-500':
            isOpen && position === 'left',
          '-translate-x-full opacity-0 transition-all delay-500':
            !isOpen && position === 'left',
        }
      )}
    >
      <div
        className={clsx(
          twMerge(
            'dark:bg-dark z-40 absolute h-full w-full max-w-5xl transform overflow-y-auto bg-white shadow-xl transition-all delay-200 duration-500 ease-in-out scrollbar dark:bg-[#151820]',
            className
          ),
          {
            'translate-x-full': !isOpen && position === 'right',
            'translate-x-0': isOpen && position === 'right',
            '-translate-x-0': isOpen && position === 'left',
            '-translate-x-full': !isOpen && position === 'left',
            'left-0': position === 'left',
            'right-0': position === 'right',
          }
        )}
      >
        <article className='relative flex h-full w-full max-w-5xl flex-col  pb-0 '>
          {children}
        </article>
      </div>
      <div
        className=' h-full w-screen cursor-pointer '
        onClick={() => {
          setIsOpen(false);
        }}
      ></div>
    </main>
  );
};
export default Drawer;
