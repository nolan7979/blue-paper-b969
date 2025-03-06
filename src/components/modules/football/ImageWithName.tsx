import Image from 'next/image';

// interface for ImgWithName
interface ImgWithNameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  name: string;
}

export const ImgWithName = ({
  src,
  alt,
  width,
  height,
  name,
}: ImgWithNameProps) => (
  <>
    <Image
      unoptimized={true}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className=''
    ></Image>
    <div className='text-xs'>{name}</div>
  </>
);
