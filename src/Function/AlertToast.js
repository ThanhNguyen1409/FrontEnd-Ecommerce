import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const alertToast = (title) => {
  const notify = () =>
    toast.success(title, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  notify();
};
