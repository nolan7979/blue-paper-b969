import clsx from 'clsx';

interface ICardsMbSectionProps {
  children?: React.ReactNode;
  className?: string;
  rounded?: boolean;
}

const CardsMbSection: React.FC<ICardsMbSectionProps> = ({
  children,
  className,
  rounded = true,
}) => {
  return (
    <div className='w-full dark:bg-dark-dark-blue lg:rounded-tl-md lg:rounded-tr-md'>
      <div
        className={clsx(
          className,
          `bg-gradient-to-r from-blue-200  to-pink-100 py-8 text-center dark:bg-none lg:py-0`,
          { 'lg:rounded-tl-md lg:rounded-tr-md': rounded }
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CardsMbSection;
