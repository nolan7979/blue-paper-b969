import ArrowLeft from '/public/svg/arrow-left.svg';
import ArrowRight from '/public/svg/arrow-right.svg';
function ButtonPaginationWithTitle({
  title,
  previous,
  today,
  setToday,
  value,
}: {
  title: string;
  previous: boolean;
  today: number;
  setToday: any;
  value: number;
}) {
  return (
    <button
      className={`rounded-lg border border-solid border-light-line-stroke-cd px-4 py-2 ${
        today === value ? 'hidden' : 'block'
      }`}
      onClick={setToday}
    >
      <div
        className={`flex items-center gap-x-2 ${
          previous ? 'flex-row-reverse' : ''
        }`}
      >
        <p>{title}</p>
        {previous ? <ArrowLeft /> : <ArrowRight />}
      </div>
    </button>
  );
}

export default ButtonPaginationWithTitle;
