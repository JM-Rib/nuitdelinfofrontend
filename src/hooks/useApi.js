import { useState } from "react";

export default (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    try {
      const response = await apiFunc(...args);
      // if (process.env.NODE_ENV === 'development') {  console.log(response); }
      if (response?.status !== 200) {
        throw response;
      } else {
        setData(response.data);
        return response;
      }
    } catch (err) {
      setError(err.message || "Unexpected Error!");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    request
  };
};