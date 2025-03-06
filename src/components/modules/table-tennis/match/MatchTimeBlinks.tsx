import React from 'react';

// Define a type for the component props
interface MatchTimeBlinksProps {
  dateTimeZone: string;
  timeTimeZone: string | JSX.Element;
  isInprogress: boolean;
}

const MatchTimeBlinks: React.FC<MatchTimeBlinksProps> = ({
  dateTimeZone,
  timeTimeZone,
  isInprogress
}) => {

  return (
    <div dir='ltr' className='space-x-1 text-xs font-normal flex flex-wrap justify-center  gap-0.5'>
      {dateTimeZone && <span className='text-xs dark:text-dark-text'>{dateTimeZone}</span>}
      <span className={`${isInprogress ? 'dark:text-dark-green' : 'dark:text-white'}`}>
        {timeTimeZone}
      </span>
    </div>
  );
};

export default MatchTimeBlinks;
