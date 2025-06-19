import { useEffect, useState } from "react";

export function useDebounce(value: boolean, delay: number) {
  const [debouncedLoader, setDebouncedLoader] = useState<boolean>(value);

  useEffect(() => {
    let timeoutId;
    if (value) {
      setDebouncedLoader(true);
    } else {
      timeoutId = setTimeout(() => {
        setDebouncedLoader(false);
      }, delay);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedLoader;
}
