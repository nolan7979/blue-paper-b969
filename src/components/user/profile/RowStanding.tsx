function RowStanding({ border }: { border?: boolean }) {
  return (
    <tr
      className={`border-b bg-white ${
        border ? 'dark:border-light-black' : 'dark:border-gray-700'
      } dark:bg-light-black`}
    >
      <th
        scope='row'
        className='w-[35%]  whitespace-nowrap font-medium text-gray-900 dark:text-white'
      >
        <div className='flex items-center gap-3 px-3 py-4'>
          <p>1</p>
          <div className='h-8 w-8 rounded-full bg-gray-400'></div>
          <p className='font-bold'>Loc Vu</p>
        </div>
      </th>
      <td className='text-center'>1400</td>
      <td className='text-center'>70%</td>
      <td className='px-3'>
        <div className='flex flex-col items-end justify-end'>
          <p className='text-[#DA6900]'>+170</p>
          <p className='text-logo-blue'>1.6</p>
        </div>
      </td>
    </tr>
  );
}

export default RowStanding;
