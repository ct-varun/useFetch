import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

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
  const controllerRef = useRef(null);

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
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get(url, {
        ...axiosOptions,
        signal: controllerRef.current.signal,
      });
      setData(response?.data);

      onSuccess?.();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      } else {
        setError(error?.message || "something went wrong");
      }
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    controllerRef.current?.abort();
  };

  useEffect(() => {
    if (isAutoFetch) {
      fetchData();
    }

    return () => controllerRef.current?.abort();
  }, [isAutoFetch]);

  return { data, isLoading, error, refetch: fetchData, cancel: handleCancel };
}
