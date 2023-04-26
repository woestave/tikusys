/**
 * 提供一些Promise操作符. 简化操作
 * jiangyantao@zuoyebang.com
 */
import { complement, isNil, identity } from 'ramda';


/**
 * 过滤操作符
 * filterP通过判断函数返回值是否为truthy，来决定代码是否向下流动。当阻止流动时，filterP返回一个rejected的promise。
 * ```tsx
 * Promise
 *  .resolve(11)
 *  .then(x => x + 1) // -> 12
 *  .then(filterP(R.equals(5)))
 *  .then(x => x + 1)  // -> 12不等于5， filterP条件不满足， 这个then不会执行
 *  .catch((x) => 'reject') // -> 如果filterP不成立时， catch会执行
 *  .then(console.log) // -> 'reject'
 *
 * Promise
 *  .resolve(11)
 *  .then(x => x + 1) // -> 12
 *  .then(filterP(x => x === 12))
 *  .then(x => x + 1) // -> 13
 * ```
 */
export function filterP<T> (filterFn: (x: T) => any, onCatch?: (x: T) => void): {
  (): void;
  <X extends T>(x: T): X;
} {
  return function<Y extends T> (x?: Y): Y | Promise<Y> {
    const condition = filterFn(x!);
    !condition && onCatch && onCatch(x!);
    return (condition ? x! : Promise.reject(x!));
  };
}

/**
 * Promise操作符： 由另一个Promise的状态，决定filter的结果
 * ```tsx
 * const p1 = Promise.reject();
 * Promise
 *   .resolve(1)
 *   .then(filterFromP(p1))
 *   .then(console.log); // -> 不会执行
 *   .catch(() => console.log('p1 is reject')); // -> 打印出p1 is reject
 *
 * const p2 = Promise.resolve();
 * Promise
 *   .resolve(1)
 *   .then(filterFromP(p2))
 *   .then(console.log); // -> 打印出1
 *   .catch(() => console.log('p1 is reject')); // -> 不会执行
 * ```
 * @param p 另一个Promise.
 * @param onCatch? 不通过时的回调
 */
export function filterFromP<X> (p: Promise<unknown>, onCatch?: (x: X) => void) {
  return function (x: X): Promise<X> {
    return p.then(() => x).catch(() => {
      onCatch && onCatch(x);
      return Promise.reject(x);
    });
  };
}

// window.addEventListener('unhandledrejection', function browserRejectionHandler (event) {
//   return event && event.preventDefault();
// });

/**
 * 如果Promise的值是undefined或null，则阻止继续向下流动。
 * ```tsx
 * Promise
 *  .resolve(1)
 *  .then(filterNilP())
 *  .then(console.log) // -> 1
 *
 * Promise
 *  .resolve(null)
 *  .then(filterNilP())
 *  .then(console.log)
 *  .catch(() => console.error('catch.')) // -> catch.
 * ```
 */
export function filterNilP (onCatch?: (x: unknown) => void) {
  return filterP(complement(isNil), onCatch) as <Y>(x: Y) => Public.NonNullableWithVoid<Y> | Promise<never>;
}




/**
 * 也同时获取另一promise的值
 * ```tsx
 * const p1 = Promise.resolve(1);
 *
 * Promise
 *  .resolve(2)
 *  .then(withLatestFromP(p1))
 *  .then(([n, p1Value]) => {
 *    console.log(n, p1Value); // -> 2, 1
 *  });
 * ```
 */
export function withLatestFromP<T> (p: Promise<T>) {
  return async function<X> (x: X): Promise<[X, T]> {
    return [x, await p];
  };
}

/**
 * 直到一个promise获取到值, 就停止程序向下运行
 * ```tsx
 * const p = sleep(1000);
 * Promise
 *   .resolve()
 *   .then(takeUntilP(p))
 *   .then(() => console.log('x')); // -> x
 *
 * setTimeout(() => {
 *   Promise
 *     .resolve()
 *     .then(takeUntilP(p))
 *     .then(() => console.log('x')); // 不会执行，p已经resolved
 * }, 1200);
 * ```
 */
// export function takeUntilP<T> (p: Promise<T>) {
//   let on = false;
//   return function <X> (x: X) {
//     p.then(() => on = true);

//     return on ? new Promise(R.F) : Promise.resolve(x);
//   };
// }

/**
 * 如果一个Promise是resolve状态， 则阻止流动， 否则如果是reject状态， 则可以向下流动
 */
export function notFromP<T, X> (p: Promise<T>) {
  return function (x: X) {
    return new Promise<X>((resolve, reject) => {
      p.then(() => reject(x)).catch(identity);
      p.catch(() => resolve(x));
    });
  };
}





/**
 * 柯里化requestAnimationFrame
 * 像sleepCurrying
 * ```tsx
 * pipeWithPromise(
 *   () => 1
 *   requestAnimationFrameP(),
 *   (n) => console.log('下一帧', n),
 *   requestAnimationFrameP(),
 *   () => console.log('又下一帧'),
 *   pipeWithPromise(
 *     requestAnimationFrameP(),
 *     requestAnimationFrameP(),
 *     requestAnimationFrameP(),
 *     requestAnimationFrameP(),
 *     requestAnimationFrameP(),
 *   ),
 *   consoleLogCurried('五帧后'),
 * );
 * ```
 * 
 * ```tsx
 * Promise.resolve('hello')
 *   .then(requestAnimationFrameP()) // 等待一帧
 *   .then(str => str + ' world') // requestAnimationFrameP和它的兄弟们一样不会污染返回值链
 *   .then(console.log) -> 'hello world'
 * ```
 */
export function requestAnimationFrameP<A> (): {
  (): Promise<void>;
  (x: A): Promise<A>;
} {
  return function Lambda<X> (x?: X) {
    // return sleep(time);
    return new Promise<X>((resolve, reject) => {
      requestAnimationFrame(() => resolve(x!));
    });
  };
}




/**c
 * 节流操作符
 * ```
 * const onScroll = pipeWithPromise(
 *   throttleP(500),
 *   consoleLogCurried('滚动事件...'),
 * );
 * <div class="scroll-view" onScroll={onScroll}></div>
 * ```
 */
export function throttleP<X> (time: number, options?: {}): {
  (): Promise<void>;
  <Y extends X>(x: Y): Promise<Y>;
  clear:() => void;
} {
  // 兼容浏览器|nodejs环境
  let timer: number | NodeJS.Timeout | null = null;

  let prevV: X;

  function lambda<Y extends X> (x?: Y) {
    prevV = x!;
    if (timer === null) {
      return new Promise<Y>((res) => {
        timer = setTimeout(() => {
          res(prevV as Y);
          timer = null;
        }, time);
      });
    } else {
      return Promise.reject(x);
    }
  };

  lambda.clear = () => {
    if (timer !== null) {
      clearTimeout(timer as number);
      timer = null;
    }
  };

  return lambda;
}



/**
 * 防抖操作符
 * @see throttleP
 * ```tsx
 * ```
 */
export function debounceP<X> (time: number): {
  (): Promise<void>;
  (x: X): Promise<X>;
  clear: () => void;
} {
  let timer: number | NodeJS.Timeout | null = null;

  const result = function lambda<Y extends X> (x?: Y) {
    if (timer !== null) {
      clearTimeout(timer as number);
      timer = null;
    }
    return new Promise<Y>((resolve) => {
      timer = setTimeout(() => {
        resolve(x!);
        timer = null;
      }, time);
    });
  };

  result.clear = () => {
    timer !== null && clearTimeout(timer as number);
    timer = null;
  };

  return result;
}

