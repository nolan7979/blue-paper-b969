import { create } from 'zustand';
import Cookies from 'js-cookie';

// interface AuthStore {
//   userInfo: IUserInfo | null;
//   setUserInfo: (info: IUserInfo | null) => void;
// }

export const useAuthStore = create<any>(() => {
  // const initialUserInfo: IUserInfo | null =
  //   typeof window !== 'undefined'
  //     ? JSON.parse(Cookies.get('user_info') || 'null')
  //     : null;

  return {
    //   userInfo: initialUserInfo,
    //   setUserInfo: (info: IUserInfo | null) => {
    //     if (info === null) {
    //       set({ userInfo: null });
    //     } else {
    //       set({ userInfo: info });
    //     }
    //   },
    // };
  };
});
