// src/utils/localStorageUtils.ts
// Check if localStorage is available
export const isLocalStorageAvailable =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const setItem = (key: string, value: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem(key, value);
  }
};

export const getItem = (key: string): string | null => {
  if (isLocalStorageAvailable) {
    return localStorage.getItem(key);
  }
  return null;
};

export const removeItem = (key: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.removeItem(key);
  }
};

export const getItemSession = (key: string): string | null => {
  if (isLocalStorageAvailable) {
    return sessionStorage.getItem(key);
  }
  return null;
}

export const setItemSession = (key: string, value: string): void => {
  if (isLocalStorageAvailable) {
    sessionStorage.setItem(key, value);
  }
}

export const removeItemSession = (key: string): void => {
  if (isLocalStorageAvailable) {
    sessionStorage.removeItem(key);
  }
}

export const setItemByTimestamp = (key: string,data: any): void => {
  // Lưu dữ liệu vào cache theo URL
  setItem(key, JSON.stringify(data || ''));
  setItem(`${key}-timestamp`, Date.now().toString());
};

export const getItemByTimestamp = (key: string,duration:number): string | null => {
  const storageSize = getLocalStorageSize();
  
  if(Number(storageSize) >= 5 ){
    localStorage.clear();
  }
  // Kiểm tra cache nếu dữ liệu đã có và còn trong thời gian lưu trữ
  const cachedData = getItem(key); // Lấy dữ liệu từ cache theo key
  const cachedTimestamp = getItem(`${key}-timestamp`); // Lấy timestamp lưu trữ theo key
  const CACHE_DURATION = duration * 60 * 1000;
  if (cachedData && cachedTimestamp && Date.now() - parseInt(cachedTimestamp) <= CACHE_DURATION) {
    // Nếu dữ liệu trong cache còn hiệu lực, trả về dữ liệu từ cache
    return JSON.parse(cachedData);
  }else{
    if(cachedTimestamp){
      removeItem(`${key}-timestamp`);
    }
    if(cachedData){
      removeItem(key);
    }
    return null;
  }
};

function getLocalStorageSize() {
  let total = 0;
  // Lặp qua tất cả các mục trong localStorage và tính toán tổng dung lượng
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || '';  // Lấy key
    const value = localStorage.getItem(key);  // Lấy giá trị
    if(value){
      total += (key.length + value.length) * 2;  // Tổng kích thước của key và value
    }
  }
  // Chuyển từ byte sang megabyte (MB)
  const totalMB = total / (1024 * 1024);
  return totalMB.toFixed(0);  // Trả về tổng kích thước (đơn vị là ký tự)
}