/**
 * 序列化函数并执行， @see pipe(), @see pipeP()
 * 
 * 异步版的pipe
 *
 * 如果某个函数的返回值为Promise，则等待该Promise完成后取到Promise的值，再当做参数调用下一个函数
 *
 * @author jiangyantao@zuoyebang.com
 */

import { AtLeastOneFunctionsFlow, pipeWith } from 'ramda';

type OrPromise<T> = T | Promise<T>;



type F<A, R> = (x: A) => OrPromise<R>;
type FV<R> = () => OrPromise<R>;
// tslint:disable:max-line-length
/**
 * Performs left-to-right composition of one or more Promise-returning functions.
 * All functions need to be unary.
 */
interface PipeP {
  <V0, T1>(fn0: FV<T1>): () => Promise<T1>;
  <V0, T1>(fn0: F<V0, T1>): (x0: V0) => Promise<T1>;
  <V0, T1, T2>(fn0: FV<T1>, fn1: F<T1, T2>): () => Promise<T2>;
  <V0, T1, T2>(fn0: F<V0, T1>, fn1: F<T1, T2>): (x0: V0) => Promise<T2>;
  <V0, T1, T2, T3>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>): () => Promise<T3>;
  <V0, T1, T2, T3>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>): (x: V0) => Promise<T3>;
  <V0, T1, T2, T3, T4>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>): () => Promise<T4>;
  <V0, T1, T2, T3, T4>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>): (x: V0) => Promise<T4>;
  <V0, T1, T2, T3, T4, T5>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>): () => Promise<T5>;
  <V0, T1, T2, T3, T4, T5>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>): (x: V0) => Promise<T5>;
  <V0, T1, T2, T3, T4, T5, T6>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>): () => Promise<T6>;
  <V0, T1, T2, T3, T4, T5, T6>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>): (x: V0) => Promise<T6>;
  <V0, T1, T2, T3, T4, T5, T6, T7>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn: F<T6, T7>): () => Promise<T7>;
  <V0, T1, T2, T3, T4, T5, T6, T7>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn: F<T6, T7>): (x: V0) => Promise<T7>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn: F<T7, T8>): () => Promise<T8>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn: F<T7, T8>): (x: V0) => Promise<T8>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>): () => Promise<T9>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>): (x0: V0) => Promise<T9>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>): () => Promise<T10>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>): (x0: V0) => Promise<T10>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>): () => Promise<T11>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>): (x0: V0) => Promise<T11>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>): () => Promise<T12>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>): (x0: V0) => Promise<T12>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>): () => Promise<T13>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>): (x0: V0) => Promise<T13>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>): () => Promise<T14>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>): (x0: V0) => Promise<T14>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>): () => Promise<T15>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>): (x0: V0) => Promise<T15>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>): () => Promise<T16>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>): (x0: V0) => Promise<T16>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>, fn16: F<T16, T17>): () => Promise<T17>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>, fn16: F<T16, T17>): (x0: V0) => Promise<T17>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>, fn16: F<T16, T17>, fn17: F<T17, T18>): () => Promise<T18>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>, fn16: F<T16, T17>, fn17: F<T17, T18>): (x0: V0) => Promise<T18>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19>(fn0: FV<T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>, fn16: F<T16, T17>, fn17: F<T17, T18>, fn18: F<T18, T19>): () => Promise<T19>;
  <V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19>(fn0: F<V0, T1>, fn1: F<T1, T2>, fn2: F<T2, T3>, fn3: F<T3, T4>, fn4: F<T4, T5>, fn5: F<T5, T6>, fn6: F<T6, T7>, fn7: F<T7, T8>, fn8: F<T8, T9>, fn9: F<T9, T10>, fn10: F<T10, T11>, fn11: F<T11, T12>, fn12: F<T12, T13>, fn13: F<T13, T14>, fn14: F<T14, T15>, fn15: F<T15, T16>, fn16: F<T16, T17>, fn17: F<T17, T18>, fn18: F<T18, T19>): (x0: V0) => Promise<T19>;
  /**
   * 当前最多可容纳18个函数，不够可以再加
   */
}

/**
 * ```tsx
 * pipeWithPromise(
 *   () => 1,
 *   (n) => 2,
 *   (n) => Promise.resolve('a,s,d'.repeat(n)), // -> "a,s,da,s,d"
 *   (s) => s.split(','), // -> ["a", "s", "da", "s", "d"]
 *   (arr) => arr.map(x => x.toUpperCase()), // -> ["A", "S", "DA", "S", "D"]
 *   sleepCurrying(1000), // 停止一秒
 *   tap<string[]>(console.log), // -> 打印 ["A", "S", "DA", "S", "D"]
 *   (arr) => arr.join(''), // -> "ASDASD"
 *   alert
 * )();
  // -> 一秒后， alert('ASDASD')
 * ```
 */
const pipeWithPromise = (
  <X>(...fns: AtLeastOneFunctionsFlow<[X], []>) => {
    const fn = pipeWith(
      (f, r) => r instanceof Promise ? r.then(f) : f(r)
    )(fns);

    /**
     * 2021/11/28
     * 之所以包装一层return function而不直接返回fn是为了温和的处理rejected状态的promise
     * 某些被reject的Promise有目的且无害，如filterP、throttleP等工具函数都是通过reject来阻止函数继续向下流动。
     */
    return function (arg: X) {
      const res = Promise.resolve(fn(arg));

      return res.catch(e => e);
      // if (res instanceof Promise) {
      //   return res.catch(e => e);
      // }

      // return res;
    };
  }
) as PipeP;

// if (typeof window !== 'undefined') {
//   // eslint-disable-next-line
//   (window as any).pipeWithPromise = pipeWithPromise;
// }

export { pipeWithPromise };
