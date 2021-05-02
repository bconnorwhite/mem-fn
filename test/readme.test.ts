import { test, expect } from "@jest/globals";
import mem from "../source";


test("basic", () => {
  let i = 0;
  const fn = () => {
    i+=1;
    return i;
  };
  const memFn = mem(fn);
  expect(memFn()).toBe(1);
  expect(memFn()).toBe(1);
});

test("maxAge", () => {
  let i = 0;
  function fn() {
    i += 1;
    return i;
  }
  const memFn = mem(fn, { maxAge: 100 }); // 100ms
  expect(memFn()).toBe(1);
  setTimeout(() => {
    expect(memFn()).toBe(2);
  }, 200);
});

test("object key order", () => {
  function add({ a, b }: { a: number, b: number }) {
    return a + b;
  }
  const memFn = mem(add);
  memFn.set({ b: 1, a: 3 })(5);
  expect(memFn({ a: 3, b: 1 })).toBe(5);
});
