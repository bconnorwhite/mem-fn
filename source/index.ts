import stringify from "alpha-stringify";

export type Fn<A extends any[], T> = (...args: A) => T;

export type Options<A extends any[], T> = {
  /**
   * Milliseconds until the cache expires. Default: `Infinity`
   */
  maxAge?: number;
  /**
   * Determines cache key to use. Default: `(...args) => stringify(args)`
   */
  cacheKeyFn?: (...args: A) => string;
  /**
   * Hook to run after .set() function is called.
   */
  onSet?: (args: A, data: T) => void;
};

export type MemFn<A extends any[], T> = Fn<A, T> & {
  clear(...args: A): void;
  clearAll(): void;
  set(...args: A): (value: T) => T;
};

const defaultCacheKey = <A extends any[]>(...args: A) => {
  let string = "";
  for(let a=0; a<args.length; a+=1) {
    if(string) {
      string += ",";
    }
    string += stringify(args[a]);
  }
  return string;
};

export default function mem<A extends any[], T>(fn: Fn<A, T>, options: Options<A, T> = {}): MemFn<A, T> {
  const cache = new Map<string, T>();
  const cacheKeyFn = options.cacheKeyFn ?? defaultCacheKey;
  const timeouts = new Map<string, NodeJS.Timeout>();
  function removeTimeout(key: string) {
    const timeout = timeouts.get(key);
    if(timeout) {
      clearTimeout(timeout);
    }
    timeouts.delete(key);
  }
  function set(key: string, value: T) {
    cache.set(key, value);
    if(options.maxAge) {
      const timeout = setTimeout(() => {
        cache.delete(key);
      }, options.maxAge);
      timeouts.set(key, timeout);
    }
    return value;
  }
  const memFn = (...args: A) => {
    const key = cacheKeyFn(...args);
    if(cache.has(key)) {
      return cache.get(key) as T;
    } else {
      return set(key, fn(...args));
    }
  };
  memFn.clear = (...args: A) => {
    const key = cacheKeyFn(...args);
    cache.delete(key);
    removeTimeout(key);
  };
  memFn.clearAll = () => {
    cache.clear();
    timeouts.clear();
  };
  memFn.set = (...args: A) => {
    const key = cacheKeyFn(...args);
    return (data: T) => {
      removeTimeout(key);
      set(key, data);
      options.onSet?.(args, data);
      return data;
    };
  };
  return memFn;
}
