import { useState } from 'react';
import makeRequest from '../request';
import { alertToast } from '../Function/AlertToast';

const usePutRequest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const putRequest = async (url, putData, config = {}) => {
    try {
      setLoading(true);
      const response = await makeRequest.put(url, putData, config);
      setData(response.data);
      alertToast('Cập nhật thành công');
      console.log(response);
      return response.data;
    } catch (error) {
      setError(error.message || 'Something went wrong');
      console.error(error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, putRequest };
};

export default usePutRequest;
