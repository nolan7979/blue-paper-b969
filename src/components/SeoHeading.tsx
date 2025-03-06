import React from 'react';

function SeoHeading({ title = 'Title' }: { title?: string }) {
  return (
    <div className='layout margin mb-3 ml-3 mt-3 hidden'>
      <h1 className='text-csm font-bold leading-3 tracking-wide text-slate-700 dark:text-dark-text'>
        {title}
      </h1>
    </div>
  );
}

export default SeoHeading;
