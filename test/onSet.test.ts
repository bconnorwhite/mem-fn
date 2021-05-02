import { test, expect } from "@jest/globals";
import mem from "../source";

const fn = (n = 0) => {
  return 5 + n;
};

const setValues: {
  [index: number]: number;
} = {};

const memFn = mem(fn, {
  onSet: ([n]: [number], data: number) => {
    setValues[n] = data;
  }
});

test("set", () => {
  memFn.set(1)(5);
  expect(setValues[1]).toBe(5);
});
