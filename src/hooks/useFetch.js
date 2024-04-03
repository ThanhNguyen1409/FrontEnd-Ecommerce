import { useEffect, useState } from 'react';
import makeRequest from '../request';
import { set } from 'date-fns';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await makeRequest.get(url);

      setData(res.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (data === null) {
      fetchData();
    }
  }, []);

  const updateData = (newData) => {
    setData(newData);
  };
  return { data, loading, error, fetchData, updateData };
};
export default useFetch;
