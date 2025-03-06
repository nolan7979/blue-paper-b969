import ArrowLeft from '/public/svg/arrow-left.svg';
import ArrowRight from '/public/svg/arrow-right.svg';

function ButtonPagination({ previous }: { previous: boolean }) {
  return (
    <button className='rounded-lg border border-solid border-[#555] p-2 dark:bg-dark-stroke'>
      {previous ? <ArrowLeft /> : <ArrowRight />}
    </button>
  );
}

export default ButtonPagination;
