import useTrans from '@/hooks/useTrans';
import React from 'react';

interface PopupProps {
  show: boolean;
  onClose: () => void;
  url?: string;
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ show, onClose, url, children }) => {
  if (!show) return null;
  const i18n = useTrans();
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative h-full w-full rotate-90 transform bg-white md:rotate-0'>
        <button
          onClick={onClose}
          className='absolute right-0 top-0 m-4 text-black'
        >
          {i18n.common.close}
        </button>
        {children || (
          <iframe
            src={url}
            className='h-full w-full border-none'
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default Popup;
