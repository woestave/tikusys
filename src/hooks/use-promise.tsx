/* eslint-disable */
/**
 * ```tsx
 * ...
 * const divRef = ref<HTMLDivElement>();
 * const [ aniPromise, aniResolve ] = usePromise<Animation>();
 * 
 * aniPromise.then((ani) => {
 *   ...
 *   ani.addEventListener('finish', onFinish);
 *   console.log(ani.currentTime);
 *   ...
 * });
 * 
 * onMounted(() => {
 *   aniResolve(
 *     divRef.value!.animate(keyframes, 1000)
 *   );
 * });
 * 
 * return (
 *   <div ref={divRef}></div>
 * );
 * ...
 * ```
 * 它不涉及vueInstance， 可以在组件外部使用
 * ```tsx
 * // Provider.tsx
 * export const [ xPromise, xResolve ] = usePromise<X>();
 * 
 * const Provider = defineComponent(() => {
 * 
 *   const [ x, _xPromise, xStatus ] = useRequest(request.post.x(params));
 *   xResolve(_xPromise); // 或者 _xPromise.then(xResolve);
 * 
 *   return () => (
 *     </>
 *   );
 * });
 * 
 * // B.tsx
 * import { xPromise } from 'Provider';
 * ...
 * xPromise.then((x) => ...);
 * ...
 * ```
 */
export function usePromise<T> (): [Promise<T>, (value: T | PromiseLike<T>) => void] {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const p = new Promise<T>((_resolve) => {
    resolve = _resolve;
  });

  return [p, resolve];
}
