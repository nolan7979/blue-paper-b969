import { useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export const SwitchLeftButton = () => {
  return (
    <button className='item-hover rounded-lg p-2.5'>
      <HiOutlineChevronLeft className='h-6 w-6'></HiOutlineChevronLeft>
    </button>
  );
};

export const SwitchRightButton = () => {
  return (
    <button className='item-hover rounded-lg p-2.5'>
      <HiOutlineChevronRight className='h-6 w-6'></HiOutlineChevronRight>
    </button>
  );
};

// export default function Switcher({
//   onChange,
// }: {
//   onChange?: (enabled: boolean) => void;
// }) {
//   const [enabled, setEnabled] = useState(false);

//   return (
//     <div className=''>
//       <Switch
//         checked={enabled}
//         onChange={() => {
//           setEnabled(!enabled);
//           if (onChange) {
//             onChange(!enabled);
//           }
//         }}
//         className={`${
//           enabled ? 'bg-logo-blue' : 'bg-light-match dark:bg-dark-match'
//         }
//           relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full  border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
//       >
//         {/* <span className='sr-only'>Use setting</span> */}
//         <span
//           aria-hidden='true'
//           className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
//             pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
//         />
//       </Switch>
//     </div>
//   );
// }
// checked={sortedByLeague}
// onChange={(e) => setSortedByLeague(e.target.checked)}
export const Switcher = ({
  onChange,
}: {
  onChange?: (enabled: boolean) => void;
}) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className='flex gap-2'>
      {/* <span className=' my-auto text-csm'>Odds</span> */}
      <div className='mr-1 flex flex-1 items-center md:mr-0'>
        <label className='relative inline-flex cursor-pointer items-center'>
          <input
            type='checkbox'
            className='peer sr-only'
            onChange={() => {
              setEnabled(!enabled);
              if (onChange) {
                onChange(!enabled);
              }
            }}
            aria-label='switchButton'
          />
          <div className="peer-focus:ring-none peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-logo-blue peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
        </label>
      </div>
    </div>
  );
};
