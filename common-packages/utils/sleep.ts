/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * 😴😴😴😴😴😴😴😴睡觉函数
 * ```tsx
 * import sleep from '@/utils/sleep';
 *
 * async function exec () {
 *   console.log(1);
 *   await sleep(1000); // 等待1秒
 *   console.log(2); // 等待1秒后执行
 * }
 *
 * exec();
 * ```
 * jiangyantao@zuoyebang.com
 */

/* eslint space-before-function-paren: "error" */
/* eslint padded-blocks: 'off' */
/* eslint @typescript-eslint/no-non-null-assertion: 'off' */

export function sleep (time = 0) {

  return new Promise<void>((resolve, reject) => setTimeout(resolve, time));
}

/**
 * 柯里化sleep
 *
 * 不会污染返回值链
 * ```tsx
 * pipeWithPromise(
 *   () => 1
 *   sleepCurrying(1000),
 *   (n) => console.log('一秒后', n),
 *   sleepCurrying(1000),
 *   () => console.log('又一秒后'),
 * );
 * ```
 */
export function sleepCurrying<A> (time = 0): {
  (): Promise<void>;
  (x: A): Promise<A>;
} {
  return function Lambda<X> (x?: X) {
    // return sleep(time);
    return new Promise<X>((resolve, reject) => {
      setTimeout(() => resolve(x!), time);
    });
  };
}
