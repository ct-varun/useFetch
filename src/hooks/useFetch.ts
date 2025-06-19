import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

type props = {
  url: string;
  isAutoFetch: boolean;
  axiosOptions?: AxiosRequestConfig;
  transformResponse: (dataResponse: any) => any;
  onSuccess?: () => void;
  onError?: () => void;
};

export function useFetch({
  url,
  isAutoFetch = true,
  axiosOptions = {},
  transformResponse,
  onSuccess,
  onError,
}: props) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const api = axios.create();

  api.interceptors.response.use(
    (response: any) => {
      const transformedData = transformResponse(response);
      return transformedData;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get(url, {
        ...axiosOptions,
      });
      setData(response?.data?.todos);

      onSuccess?.();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      } else {
        setError(error.message);
      }
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAutoFetch) {
      fetchData();
    }
  }, [isAutoFetch]);

  return { data, isLoading, error, refetch: fetchData };
}
