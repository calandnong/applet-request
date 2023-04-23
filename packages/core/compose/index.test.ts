import assert from 'assert';
import { describe, it, expect } from 'vitest';
import type { Middleware } from '..';
import { compose } from '..';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms || 1));
}

function isPromise <T>(x: Promise<T>) {
  return x && typeof x.then === 'function';
}

describe('Request Compose', () => {
  it('should work', async () => {
    const arr: number[] = [];
    const stack: Middleware<unknown>[] = [];

    stack.push(async (_, next) => {
      arr.push(1);
      await wait(1);
      await next();
      await wait(1);
      arr.push(6);
    });

    stack.push(async (_, next) => {
      arr.push(2);
      await wait(1);
      await next();
      await wait(1);
      arr.push(5);
    });

    stack.push(async (_, next) => {
      arr.push(3);
      await wait(1);
      await next();
      await wait(1);
      arr.push(4);
    });

    await compose(stack)({});
    expect(arr).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6]));
  });

  it('should be able to be called twice', () => {
    const stack: Middleware<{
      arr: number[];
    }>[] = [];

    stack.push(async (context, next) => {
      context.arr.push(1);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(6);
    });

    stack.push(async (context, next) => {
      context.arr.push(2);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(5);
    });

    stack.push(async (context, next) => {
      context.arr.push(3);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(4);
    });

    const fn = compose(stack);
    const ctx1 = { arr: [] };
    const ctx2 = { arr: [] };
    const out = [1, 2, 3, 4, 5, 6];

    return fn(ctx1).then(() => {
      assert.deepEqual(out, ctx1.arr);
      return fn(ctx2);
    }).then(() => {
      assert.deepEqual(out, ctx2.arr);
    });
  });

  it('should only accept an array', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => compose()).toThrow(TypeError);
  });

  it('should create next functions that return a Promise', () => {
    const stack: Middleware<unknown>[] = [];
    const arr: unknown[] = [];
    for (let i = 0; i < 5; i++) {
      stack.push((_, next) => {
        arr.push(next());
      });
    }

    compose(stack)({});

    for (const next of arr)
      assert(isPromise(next as Promise<unknown>), 'one of the functions next is not a Promise');
  });

  it('should work with 0 middleware', () => {
    return compose([])({});
  });

  it('should only accept middleware as functions', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => compose([{}])).toThrow(TypeError);
  });

  it('should work when yielding at the end of the stack', async () => {
    const stack: Middleware<unknown>[] = [];
    let called = false;

    stack.push(async (_, next) => {
      await next();
      called = true;
    });

    await compose(stack)({});
    assert(called);
  });

  it('should reject on errors in middleware', () => {
    const stack: Middleware<unknown>[] = [];

    stack.push(() => {
      throw new Error();
    });

    return compose(stack)({})
      .then(() => {
        throw new Error('promise was not rejected');
      }, (e) => {
        expect(e).toBeInstanceOf(Error);
      });
  });

  it('should keep the context', () => {
    const ctx = {};

    const stack: Middleware<unknown>[] = [];

    stack.push(async (ctx2, next) => {
      await next();
      expect(ctx2).toEqual(ctx);
    });

    stack.push(async (ctx2, next) => {
      await next();
      expect(ctx2).toEqual(ctx);
    });

    stack.push(async (ctx2, next) => {
      await next();
      expect(ctx2).toEqual(ctx);
    });

    return compose(stack)(ctx);
  });

  it('should catch downstream errors', async () => {
    const arr: number[] = [];
    const stack: Middleware<unknown>[] = [];

    stack.push(async (_, next) => {
      arr.push(1);
      try {
        arr.push(6);
        await next();
        arr.push(7);
      }
      catch (err) {
        arr.push(2);
      }
      arr.push(3);
    });

    stack.push(async () => {
      arr.push(4);
      throw new Error();
    });

    await compose(stack)({});
    expect(arr).toEqual([1, 6, 4, 2, 3]);
  });

  it('should compose w/ next', () => {
    let called = false;

    return compose([])({}, async () => {
      called = true;
    }).then(() => {
      assert(called);
    });
  });

  it('should handle errors in wrapped non-async functions', () => {
    const stack: Middleware<unknown>[] = [];

    stack.push(() => {
      throw new Error();
    });

    return compose(stack)({}).then(() => {
      throw new Error('promise was not rejected');
    }, (e) => {
      expect(e).toBeInstanceOf(Error);
    });
  });

  // https://github.com/koajs/compose/pull/27#issuecomment-143109739
  it('should compose w/ other compositions', () => {
    const called: number[] = [];

    return compose([
      compose([
        (_, next) => {
          called.push(1);
          return next();
        },
        (_, next) => {
          called.push(2);
          return next();
        },
      ]),
      (_, next) => {
        called.push(3);
        return next();
      },
    ])({}).then(() => assert.deepEqual(called, [1, 2, 3]));
  });

  it('should throw if next() is called multiple times', () => {
    return compose([
      async (_, next) => {
        await next();
        await next();
      },
    ])({}).then(() => {
      throw new Error('boom');
    }, (err) => {
      assert(/multiple times/.test(err.message));
    });
  });

  it('should return a valid middleware', () => {
    let val = 0;
    return compose([
      compose([
        (_, next) => {
          val++;
          return next();
        },
        (_, next) => {
          val++;
          return next();
        },
      ]),
      (_, next) => {
        val++;
        return next();
      },
    ])({}).then(() => {
      expect(val).toEqual(3);
    });
  });

  it('should return last return value', () => {
    const stack: Middleware<unknown>[] = [];

    stack.push(async (_, next) => {
      const val = await next();
      expect(val).toEqual(2);
      return 1;
    });

    stack.push(async (_, next) => {
      const val = await next();
      expect(val).toEqual(0);
      return 2;
    });

    const next = () => 0;
    return compose(stack)({}, next).then((val) => {
      expect(val).toEqual(1);
    });
  });

  it('should not affect the original middleware array', () => {
    const middleware: Middleware<unknown>[] = [];
    const fn1: Middleware<unknown> = (_, next) => {
      return next();
    };
    middleware.push(fn1);

    for (const fn of middleware)
      assert.equal(fn, fn1);

    compose(middleware);

    for (const fn of middleware)
      assert.equal(fn, fn1);
  });

  it('should not get stuck on the passed in next', () => {
    interface MiddlewareContext {
      middleware: number;
      next: number;
    }
    const middleware: Middleware<MiddlewareContext>[] = [(ctx, next) => {
      ctx.middleware++;
      return next();
    }];
    const ctx = {
      middleware: 0,
      next: 0,
    };

    return compose(middleware)(ctx, (ctx, next) => {
      ctx.next++;
      return next();
    }).then(() => {
      expect(ctx).toEqual({ middleware: 1, next: 1 });
    });
  });
});
