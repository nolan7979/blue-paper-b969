// components/Toast.tsx
import React from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className='fixed bottom-14 right-4 animate-fadeIn rounded bg-all-blue p-4 text-white opacity-0 shadow-lg transition-opacity duration-100 ease-in-out lg:bottom-auto lg:right-4 lg:top-18'>
      <div className='flex items-center'>
        <span className='text-csm'>{message}</span>
        <button onClick={onClose} className='ml-4 font-bold text-white'>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
