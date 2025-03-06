export const CheckBox = ({
  val,
  setVal,
  label,
}: {
  val: boolean;
  setVal: any;
  label?: string;
}) => {
  return (
    <div className='flex items-center space-x-2 hover:cursor-pointer'>
      <input
        type='checkbox'
        id={label}
        name='checkGroup1'
        className=' !h-5 !w-5 !rounded-sm !border-[#2187E5] !bg-transparent checked:!border-none checked:!bg-all-blue hover:cursor-pointer focus:!border-dark-button focus:no-underline focus:!outline-none focus:!outline-offset-0 focus:!ring-transparent focus:!ring-offset-0'
        checked={val}
        onChange={() => setVal((v: boolean) => !v)}
      />
      <label
        htmlFor={label}
        onChange={() => setVal((v: boolean) => !v)}
        className='!mx-2 flex w-full text-csm hover:cursor-pointer  dark:text-white'
      >
        {label}
      </label>
    </div>
  );
};
