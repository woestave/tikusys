// import { pipe, tap } from 'ramda';
import { defineComponent, SetupContext, EmitsOptions, VNodeChild, reactive, toRefs, ref, Ref } from 'vue';

export interface FunctionalComponentInternal {
  context: SetupContext<EmitsOptions>;
}

/**
 * ```tsx
 * interface ListViewProps {
 *   list: Item[];
 * }
 * const ListView = functionalComponent<ListViewProps>((props) => {
 * 
 *   const [ toggle, setToggle, setTogglePartial ] = useState(false);
 * 
 *   return () => (
 *     <>
 *       <button onClick={() => setToggle(!toggle.value)}>Click me plz!</button>
 *       <button onClick={setTogglePartial(!toggle.value)}>Click me too!</button> // 这两个按钮效果相同。
 *       {props.list.map(x => <ItemView {...x} />)}
*      </>
 *   );
 * });
 * ```
 */
export function functionalComponent<P extends Readonly<object>> (
  View: (props: P & FunctionalComponentInternal) => () => VNodeChild,
): (props: Readonly<P>) => JSX.Element {
  return defineComponent<P>({
    name: View.name,
    inheritAttrs: false,
    setup (p, context) {

      const props = reactive({
        ...toRefs(reactive(context.attrs)),
        context
      });
      // const props = context.attrs;

      return View(props as P & FunctionalComponentInternal);
    }
  // eslint-disable-next-line
  }) as any;
}







export type SetStateAction<S> = S | ((prevState: S) => S);
// this technically does accept a second argument, but it's already under a deprecation warning
// and it's not even released so probably better to not define it.
type Dispatch<A> = (value: A) => void;

type DispatchCurried<A> = <T>(value: A) => {
  (): void;
  (x: T): T;
};

interface UseState {
  <S>(initialState: S | (() => S)): [Ref<S>, Dispatch<SetStateAction<S>>, DispatchCurried<SetStateAction<S>>];
  <S = undefined>(): [Ref<S | undefined>, Dispatch<SetStateAction<S | undefined>>, DispatchCurried<SetStateAction<S | undefined>>];
}

/**
 * ```tsx
 * import { add } from 'ramda';
 * const [ num, setNum, setNumCurried ] = useState(2);
 * console.log(num.value); // -> 2;
 * const square = setNumCurried((x) => x * x); // 点击获取当前值得平方
 * const addition5 = setNumCurried(add(5)); // 加5
 * const sqrt = setNumCurried(Math.sqrt); // 开平方
 * ...
 * <div onClick={square}>平方</div>
 * <div onClick={addition5}>相加</div>
 * <div onClick={sqrt}>平方根</div>
 * ...
 * ```
 */
export const useState: UseState = function (initial) {

  const state = ref(initial);

  const dispatch = (newV: unknown) => {
    // eslint-disable-next-line
    state.value = typeof newV === 'function' ? (newV as any)(state.value) : newV;
  };

  const dispatchCurried: DispatchCurried<any> = (v) => <T>(x?: T) => {
    dispatch(v);
    return x;
  };

  return [state, dispatch, dispatchCurried];
} as UseState;




/**
 * ```tsx
 * ...
 * const [ user, promise, promiseStatus ] = useStateP(
 *   request
 *     .post
 *     .getUser()
 *     .then(R.prop('data'))
 *     .then(filterNilP()) // 刨除undefined的或null的情况
 * );
 *
 *
 * return (
 *   <div>你好，{user.value?.name}</div>
 * );
 * ...
 * ```
 * @param p Promise.
 */
export function useStateP<T> (p: Promise<T>) {

  const [ status, , setStatusC ] = useState<'pending' | 'fulfilled' | 'rejected'>('pending');

  const [state, setState] = useState<T | null>(null);

  p.then(setState).then(setStatusC('fulfilled')).catch(setStatusC('rejected'));

  return [state, p, status] as [Ref<Readonly<T> | null>, typeof p, typeof status];
}








/**
 * ```tsx
 * import { responseGeneral } from 'sub-modules/utils/response-general';
 * import { pipeWithPromise } from 'sub-modules/utils/pipe-with-promise';
 * import { request } from '@/api/';
 * // ...
 * const View = functionalComponent<ViewProps>((props) => {
 *   const [ subject, getSubject, status ] = useCallbackP(
 *     () => request
 *      .post
 *      .getSubject({ subjectId: props.subjectId })
 *      .then(responseGeneral())
 *   );
 * 
 *   return () => (
 *     <div>
 *       <div vShow={status.value === 'pending'}>请求中...</div>
 *       <div vShow={status.value === 'fulfilled'}>学科：{subject.value}</div>
 *       <div vShow={status.value === 'rejected'}>请求失败</div>
 *       <button onClick={getSubject}>获取学科</button>
 *     </div>
 *   );
 * });
 * // ...
 * ```
 * 搭配pipeWithPromise
 * ```
 * const View = functionalComponent<ViewProps>((props) => {
 *   // 点击画布获取坐标，一秒后做展示
 *   const [ pos, getPos, status ] = useCallbackP(pipeWithPromise(
 *     (e: MouseEvent) => `x:${e.pageX}-y:${e.pageY}`, // 计算得到结果
 *     sleepCurrying(1000), // 等待一秒后
 *   ));
 * 
 *   return () => (
 *     <div>
 *       <div vShow={status.value === 'idle'}>空闲中</div>
 *       <div vShow={status.value === 'pending'}>计算中...</div>
 *       <div vShow={status.value === 'fulfilled'}>结果：{pos.value}</div>
 *       <div vShow={status.value === 'rejected'}>计算出错</div>
 *       <div class="area" onClick={getPos}>点我计算坐标</div>
 *     </div>
 *   );
 * });
 * ```
 */
export function useCallbackP<T, A extends Array<unknown>> (fn: (...args: A) => Promise<T>) {

  const [state, setState] = useState<null | T>(null);

  const [ status, setStatus, setStatusC ] = useState<'idle' | 'pending' | 'fulfilled' | 'rejected'>('idle');

  function lambda (...args: A) {
    setStatus('pending');
    const pro = fn(...args);
    pro.then(setState).then(setStatusC('fulfilled'));
    pro.catch(setStatusC('rejected'));
    pro.catch((e) => console.error(`useCallbackP->catch::`, e, fn, pro));
    return pro;
  }

  return [state, lambda, status] as [typeof state, typeof lambda, typeof status];
}










