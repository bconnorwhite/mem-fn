import { test, expect } from "@jest/globals";
import mem from "../source";

const fn = (n: number) => new Promise<number>((resolve) => {
  setTimeout(() => {
    resolve(n + 1);
  }, 10);
});

const memFn = mem(fn);

test("basic", async () => {
  expect(await memFn(1)).toBe(2);
  expect(await memFn(1)).toBe(2);
});

test("set", async () => {
  memFn.set(1)(fn(2));
  expect(await memFn(1)).toBe(3);
});

test("clear", async () => {
  memFn.set(1)(fn(2));
  memFn.clear(1);
  expect(await memFn(1)).toBe(2);
});

test("clear all", async () => {
  memFn.set(1)(fn(2));
  memFn.clearAll();
  expect(await memFn(1)).toBe(2);
});
