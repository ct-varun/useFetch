import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

type props = {
  url: string;
  isAutoFetch: boolean;
  axiosOptions?: AxiosRequestConfig;
  onSuccess?: () => void;
  onError?: () => void;
};

export function useFetch({
  url,
  isAutoFetch = true,
  axiosOptions = {},
  onSuccess,
  onError,
}: props) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(url, {
        ...axiosOptions,
      });
      setData(response.data.todos);

      onSuccess?.();
    } catch (error: any) {
      setError(error.message);
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
