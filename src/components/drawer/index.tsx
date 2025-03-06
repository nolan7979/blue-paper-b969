import { useState } from 'react';

export function Drawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        className='bg-blue-500 px-4 py-2 text-white'
        onClick={() => setIsOpen(!isOpen)}
      >
        Toggle Drawer
      </button>

      <div
        className={`fixed left-0 top-0 h-full transform transition-all duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 overflow-auto bg-gray-100 p-4`}
      >
        <h2 className='mb-4 text-xl font-bold'>Drawer Title</h2>
        <ul>
          <li className='mb-2'>Item 1</li>
          <li className='mb-2'>Item 2</li>
          <li className='mb-2'>Item 3</li>
          {/* Add more items as needed */}
        </ul>
      </div>
    </div>
  );
}
