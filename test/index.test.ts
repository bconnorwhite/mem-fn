import { test, expect } from "@jest/globals";
import mem from "../source";

const fn = (a: number, b = 0) => {
  return a + b;
};

const memFn = mem(fn);

test("basic", () => {
  expect(memFn(1, 5)).toBe(6);
  expect(memFn(1, 5)).toBe(6);
});

test("set", () => {
  memFn.set(1, 5)(5);
  expect(memFn(1, 5)).toBe(5);
});

test("clear", () => {
  memFn.set(1, 5)(5);
  memFn.clear(1, 5);
  expect(memFn(1, 5)).toBe(6);
});

test("clear all", () => {
  memFn.set(1, 5)(5);
  memFn.clearAll();
  expect(memFn(1, 5)).toBe(6);
});

