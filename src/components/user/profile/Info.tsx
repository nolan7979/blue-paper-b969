// import EditIcon from '/public/svg/edit-icon.svg';
// import FacebookIcon from '/public/svg/facebook-icon.svg';
// import LogoutIcon from '/public/svg/log-out.svg';

// function Info({ data }: { data: IUserInfo }) {
//   return (
//     <div className='space-y-3 rounded-lg bg-white px-3 py-4 dark:border-black dark:bg-light-black '>
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center gap-2'>
//           <div>
//             {/* <img
//               src={data?.user?.image}
//               alt=''
//               className='h-12 w-12 rounded-full'
//             /> */}
//           </div>
//           <p className='text-csm font-bold dark:text-logo-blue'>
//             {data.displayName}
//           </p>
//         </div>
//         <EditIcon />
//       </div>
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center gap-2'>
//           <div className='rounded-full border border-solid border-[#ECF1F5] p-1 dark:bg-white'>
//             <FacebookIcon />
//           </div>
//           <div className='flex flex-col'>
//             <p className='text-ccsm dark:text-dark-text '>{data.email}</p>
//             <p className='text-[10px] text-gray-700 dark:text-dark-text'>
//               Login by google
//             </p>
//           </div>
//         </div>
//         <div>
//           <LogoutIcon />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Info;

/* eslint-disable @next/next/no-img-element */
import EditIcon from '/public/svg/edit-icon.svg';
import FacebookIcon from '/public/svg/facebook-icon.svg';
import LogoutIcon from '/public/svg/log-out.svg';

function Info({ data }: { data: any }) {
  return (
    <div className='space-y-3 rounded-lg bg-white px-3 py-4 dark:border-black dark:bg-light-black '>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div>
            <img
              src={data.user.image}
              alt=''
              className='h-12 w-12 rounded-full'
            />
          </div>
          <p className='text-csm font-bold dark:text-logo-blue'>
            {data.user.name}
          </p>
        </div>
        <EditIcon />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='rounded-full border border-solid border-[#ECF1F5] p-1 dark:bg-white'>
            <FacebookIcon />
          </div>
          <div className='flex flex-col'>
            <p className='text-ccsm dark:text-dark-text '>{data.user.email}</p>
            <p className='text-[10px] text-gray-700 dark:text-dark-text'>
              Login by google
            </p>
          </div>
        </div>
        <div>
          <LogoutIcon />
        </div>
      </div>
    </div>
  );
}

export default Info;
