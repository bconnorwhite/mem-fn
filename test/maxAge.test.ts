import { test, expect } from "@jest/globals";
import mem from "../source";

const fn = (n = 0) => {
  return 5 + n;
};

const memFn = mem(fn, { maxAge: 100 });

test("set", (done) => {
  memFn.set(1)(5);
  setTimeout(() => {
    expect(memFn(1)).toBe(6);
    done?.();
  }, 200);
});


test("clear", () => {
  memFn.set(1)(5);
  memFn.clear(1);
  expect(memFn(1)).toBe(6);
});
