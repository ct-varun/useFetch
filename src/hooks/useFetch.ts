import { useEffect, useRef, useState } from "react";
import type { AxiosRequestConfig } from "axios";

import { api } from "@/service/apiService";

type Props = {
  url: string;
  isAutoFetch: boolean;
  axiosOptions?: AxiosRequestConfig;
  transformer?: (dataResponse: any) => any;
  onSuccess?: () => void;
  onError?: () => void;
};

export function useFetch({
  url,
  isAutoFetch = true,
  axiosOptions = {},
  transformer,
  onSuccess,
  onError,
}: Props) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(
    isAutoFetch ? true : false
  );
  const [error, setError] = useState<string>("");
  const [debouncedLoader, setDebouncedLoader] = useState<boolean>(false);
  const controllerRef = useRef(null);

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
      const transformedData = transformer?.(response);
      if (transformedData) {
        setData(transformedData);
      } else {
        setData(response?.data);
      }

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

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    cancel: handleCancel,
  };
}
