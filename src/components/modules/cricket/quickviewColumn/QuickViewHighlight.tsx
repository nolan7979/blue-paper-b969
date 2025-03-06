import EmptyDataSVG from 'public/svg/empty_data.svg';
import PlayIconSVG from 'public/svg/play.svg';

import { IHighlight } from '@/models';

const QuickViewHighlight = ({ highlights }: { highlights: IHighlight[] }) => {
  return (
    <div className='flex flex-col gap-3 px-[10px]'>
      {highlights.map((highlight, index) => (
        <Highlight
          key={highlight.url + index}
          thumbnailUrl={highlight.thumbnail_url || ''}
          title={highlight.title || ''}
          url={highlight.url || ''}
          time={highlight.time || ''}
        />
      ))}
      {highlights.length === 0 && <EmptyHighlight />}
    </div>
  );
};
export default QuickViewHighlight;

const EmptyHighlight = () => {
  return (
    <div className='flex w-full flex-col items-center'>
      <EmptyDataSVG className='h-20 w-20' />
      Data not available
    </div>
  );
};

interface HighlightProps {
  thumbnailUrl: string;
  title: string;
  url: string;
  time?: string;
}

const Highlight: React.FC<HighlightProps> = ({
  thumbnailUrl = '',
  title = '',
  url = '',
  time = '',
}) => {
  return (
    <a href={url} target='_blank' className='flex gap-3'>
      <div className='relative h-24 w-[169px] flex-shrink-0 overflow-hidden rounded-lg'>
        <Thumbnail
          src={thumbnailUrl}
          alt='highlight'
          className='h-24 w-[169px] object-cover'
        />
        <span className='absolute inset-0 flex items-center justify-center rounded-full hover:opacity-80'>
          <PlayIconSVG className='h-10 w-10' />
        </span>
      </div>
      <div className='flex flex-col justify-around'>
        <p className='line-clamp-3 text-sm font-bold text-white'>{title}</p>
        <div className='flex items-center gap-1'>
          <p className='max-w text-[11px]'>youtube.com</p>
          {/* {time && (
            <>
              •<p className='text-[11px]'>1 day ago</p>
            </>
          )} */}
          •<p className='text-[11px]'>1 day ago</p>
        </div>
      </div>
    </a>
  );
};

interface ThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ src, alt, className }) => {
  if (!src) {
    return (
      <img
        src='https://i.ytimg.com/vi/1Q2g5j4b4vA/hqdefault.jpg'
        alt={alt}
        className={className}
        loading='lazy'
      />
    );
  }

  return <img src={src} alt={alt} className={className} loading='lazy' />;
};
