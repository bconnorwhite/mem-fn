<div align="center">
  <h1>mem-fn</h1>
  <a href="https://npmjs.com/package/mem-fn">
    <img alt="NPM" src="https://img.shields.io/npm/v/mem-fn.svg">
  </a>
  <a href="https://github.com/bconnorwhite/mem-fn">
    <img alt="TypeScript" src="https://img.shields.io/github/languages/top/bconnorwhite/mem-fn.svg">
  </a>
  <a href="https://coveralls.io/github/bconnorwhite/mem-fn?branch=master">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/bconnorwhite/mem-fn/badge.svg?branch=master">
  </a>
  <a href="https://github.com/bconnorwhite/mem-fn">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/bconnorwhite/mem-fn?label=Stars%20Appreciated%21&style=social">
  </a>
  <a href="https://twitter.com/bconnorwhite">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/bconnorwhite.svg?label=%40bconnorwhite&style=social">
  </a>
</div>

<br />

> Memoize functions.
Similar to [mem](https://www.npmjs.com/package/mem), but with the ability to set and clear individual keys, all arguments accounted for in the default cache key function, cache key function arguments are passed normally rather than as an array.

## Installation

```sh
yarn add mem-fn
```

```sh
npm install mem-fn
```

## Usage
### mem
```ts
import mem from "mem-fn";

let i = 0;

function fn() {
  i += 1;
  return i;
}

const memFn = mem(fn);

memFn(); // 1

memFn(); // 1

```
### maxAge
```ts
import mem from "mem-fn";

let i = 0;

function fn() {
  i += 1;
  return i;
}

const memFn = mem(fn, { maxAge: 100 }); // 100ms

memFn(); // 1
setTimeout(() => {
  memFn(); // 2
}, 200);

```
### cacheKeyFn
By default, [alpha-stringify](https://www.npmjs.com/package/alpha-stringify) is used when more than one argument is present. All arguments are included, and object property order does not matter:
```ts
import mem from "mem-fn";

function add({ a, b }: { a: number, b: number }) {
  return a + b;
}

const memAdd = mem(add);

memAdd({ a: 1, b: 2 }); // 3
memAdd({ a: 1, b: 2 }); // cache hit - 3
memAdd({ b: 2, a: 1 }); // cache hit - 3

```

When creating a custom cacheKeyFn, arguments are passed normally rather than as an array:
```ts
import mem from "mem-fn";

function add(a: number, b: number) {
  return a + b;
}

const memAdd = mem(add, {
  cacheKeyFn: (a: number, b: number) => `${a}+${b}`
});

```
### clear and set
```ts
import mem from "mem-fn";

function add(a: number, b: number) {
  return a + b;
}

const memAdd = mem(add);

memAdd.set(1, 2)(4);  // set cache for arguments (1, 2) to 4
memAdd(1, 2);         // 4
memAdd.clear(1, 2);   // clear cache corresponding to these arguments
memAdd(1, 2);         // 3
memAdd.clearAll();    // clear entire cache

```

### onSet
A hook is also provided for when set is called:
```ts
import mem from "mem-fn";

function add(a: number, b: number) {
  return a + b;
}

const memAdd = mem(add, {
  onSet: ([a, b]: [number, number], result: number) => console.log(`Set: ${a} + ${b} = ${number}`);
});

memAdd.set(1, 2)(4);  // Set: 1 + 2 = 4

```
## Types
```ts
import mem, { Options, Fn, MemFn } from "mem-fn";

function mem<F extends Fn<A, T>, A extends any[], T>(
  fn: Fn<A, T>,
  options?: Options<A, T>
): MemFn<A, T>;

type Fn<A extends any[], T> = (...args: A) => T;

type Options<A extends any[], T> = {
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

type MemFn<F extends Fn<A, T>, A extends any[], T> = F & {
  clear(...args: A): void;
  clearAll(): void;
  set(...args: A): (value: T) => T;
};
```

<br />

<h2>Dependencies<img align="right" alt="dependencies" src="https://img.shields.io/david/bconnorwhite/mem-fn.svg"></h2>

- [alpha-stringify](https://www.npmjs.com/package/alpha-stringify): Serialize anything, and sort keys for equality comparison

<br />

<h2>Dev Dependencies<img align="right" alt="David" src="https://img.shields.io/david/dev/bconnorwhite/mem-fn.svg"></h2>

- [@bconnorwhite/bob](https://www.npmjs.com/package/@bconnorwhite/bob): Bob is a toolkit for TypeScript projects

<br />

<h2>License <img align="right" alt="license" src="https://img.shields.io/npm/l/mem-fn.svg"></h2>

[MIT](https://opensource.org/licenses/MIT)
