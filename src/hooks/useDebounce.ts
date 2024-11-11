import { useCallback, useState } from "react";

type AnyFunction = (...args: any[]) => any;

export default function useDebounce<T extends AnyFunction>(
  func: T,
  delay: number
): T extends (...args: any[]) => Promise<any>
  ? (...args: Parameters<T>) => Promise<ReturnType<T>>
  : (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      return new Promise((resolve, reject) => {
        const newTimeoutId = setTimeout(async () => {
          try {
            const result = await func(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
        setTimeoutId(newTimeoutId);
      });
    },
    [timeoutId, func, delay]
  );

  return debouncedFn as any;
}
