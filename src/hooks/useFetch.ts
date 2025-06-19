import { useEffect, useRef, useState } from "react";
import type { AxiosRequestConfig } from "axios";

import api from "@/services/api.service";
import { useDebounce } from "./useDebounce";

type Props = {
  url: string;
  isAutoFetch: boolean;
  axiosOptions?: AxiosRequestConfig;
  transformer?: (dataResponse: any) => any;
  onSuccess?: () => void;
  onError?: () => void;
  loaderCloseDelay?: number;
  pollDelay?: number;
};

export function useFetch({
  url,
  isAutoFetch = true,
  axiosOptions = {},
  transformer,
  onSuccess,
  onError,
  loaderCloseDelay = 200,
  pollDelay = 0,
}: Props) {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(
    isAutoFetch ? true : false
  );
  const [error, setError] = useState<string>("");
  const debouncedIsLoading = useDebounce(isLoading, loaderCloseDelay);
  const controllerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchData = async () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }

    if (controllerRef.current) {
      controllerRef.current?.abort();
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

      if (pollDelay > 0) {
        timeoutRef.current = setTimeout(fetchData, pollDelay);
      }
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
    isLoading: debouncedIsLoading,
    error,
    refetch: fetchData,
    cancel: handleCancel,
  };
}
