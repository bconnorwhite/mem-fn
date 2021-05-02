import { test, expect } from "@jest/globals";
import mem from "../source";

const fn = (a = 0) => {
  return a + 5;
};

const memFn = mem(fn);

test("undefined", () => {
  expect(memFn()).toBe(5);
});

test("undefined set", () => {
  memFn.set()(1);
  expect(memFn()).toBe(1);
});

test("undefined clear", () => {
  memFn.set()(1);
  memFn.clear();
  expect(memFn()).toBe(5);
});
