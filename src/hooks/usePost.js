import { useState } from 'react';
import makeRequest from '../request';

const usePostRequest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const postRequest = async (url, postData, config = {}) => {
    try {
      setLoading(true);
      const response = await makeRequest.post(url, postData, config);
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error.response.data || 'Something went wrong');
      console.error(error.response.data || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, postRequest };
};

export default usePostRequest;
