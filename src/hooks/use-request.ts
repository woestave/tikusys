import { withResponseType } from '@/apis/request';
import { useStateP } from '@/utils/functional-component';

/**
 * 例子：
 * ```tsx
 * import { useRequest } from '@/hooks/useRequest';
 * import { request } from '@/api';
 * ...
 * const [ getNextSection, promise, promiseStatus ] = useRequest(request.post.getNextSectionFirst({ unitId }));
 * // getNextSection -> Ref<Readonly<English.Types.GetNextSection> | undefined>
 * // promise        -> Promise<English.Types.GetNextSection | undefined>
 * // promiseStatus  -> Ref<'pending' | 'fulfilled' | 'rejected'>
 * 
 * return (
 *   <If condition={getNextSection.value}>环节类型：{getNextSection.value!.sectionType}</If>
 * );
 * ...
 * ```
 * 考虑数据的不可变性， 不提供setState的方法， state.value是Readonly状态
 * @param p Promise.
 */
export function useRequest<T> (p: Promise<TikuServer.ResponseType<T>>) {
  const [ state, promise, promiseStatus ] = useStateP(
    p.then(withResponseType(
      x => x.data,
      err => Promise.reject(err),
    ))
  );


  return [
    state,
    promise,
    promiseStatus
  ] as [
    import('vue').Ref<Public.NonNullableWithVoid<Readonly<T>> | undefined>,
    typeof promise,
    typeof promiseStatus
  ];
}

