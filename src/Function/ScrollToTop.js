import { useEffect } from 'react';

export const GoTop = () => {
  useEffect(() => {
    // Đặt vị trí cuộn của trình duyệt lên đầu trang
    window.scrollTo(0, 0);
  }, []);
};
