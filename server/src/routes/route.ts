import type Koa from 'koa';
import { ERR_CODES, ERR_MESSAGES, ResponseStruct, getResponseStruct } from '../utils/response-struct';
export type RouteContext = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>;
// export type RouteContextWithMethods = RouteContext & {
//   setStatus: (status: number) => void;
// };

type OrPromise<T> = T | Promise<T>;

function routeFactory (method: 'all' | 'get' | 'post') {
  return function<RequestQuery, ResponseBody> (
    fn: (
      context: RouteContext & {
        query: RequestQuery;
        request: RouteContext['request'] & {
          body: RequestQuery;
        };
      },
      next: () => Promise<any>
    ) => OrPromise<ResponseBody | ResponseStruct<unknown>>,
  ) {
    const __ = (...args: Parameters<typeof fn>) => {
      return method === 'all'
        ? fn(...args)
        : args[0].request.method.toLowerCase() === method
          ? fn(...args)
          : getResponseStruct(ERR_CODES.notFound, ERR_MESSAGES.apiNotFound, null);
    };

    return __;
  }
}

export const routeGET = routeFactory('get');
export const routePOST = routeFactory('post');
export const routeALL = routeFactory('all');
