export type MiddlewareNext = () => Promise<unknown> | unknown;

export type Middleware<Context> = (
  context: Context,
  next: MiddlewareNext
) => Promise<unknown> | unknown;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param middleware
 * @return
 */
export function compose<Context>(middleware: Middleware<Context>[]) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');


  for (const fn of middleware) 
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  

  return (context: Context, next?: Middleware<Context>) => {
    // last called middleware #
    let index = -1;
    function dispatch(i: number): Promise<unknown> {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn: Middleware<Context> | undefined = middleware[i];
      if (i === middleware?.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      }
      catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}
