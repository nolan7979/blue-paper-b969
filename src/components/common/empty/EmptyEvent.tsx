import EmptyEventSVG from '/public/svg/empty-event.svg';

type EmptyEventProps = { title?: string; content: string };

export const EmptyEvent: React.FC<EmptyEventProps> = ({ title, content }) => {
  return (
    <div className='flex flex-col items-center justify-center text-center'>
      <EmptyEventSVG className='h-20 w-20 dark:fill-light-black' />
      {title && <span className='font-primary text-base font-semibold text-black dark:text-white'>
        {title}
      </span>}
      <span className='mt-2 text-csm'>{content}</span>
    </div>
  );
};
