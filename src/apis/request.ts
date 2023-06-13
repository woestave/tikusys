import ky, { Options as KyOptions } from 'ky';
import { createDiscreteApi } from 'naive-ui';

export const tokens = (function () {
  let localTokenKey = 'RSD_SYS_TOKEN';
  let token = '';

  let toLogin = () => {
    //
  };

  return {
    getToken: () => token,
    setToken: (t: string) => {
      token = t;
      localStorage.setItem(localTokenKey, t);
    },
    removeToken: () => localStorage.removeItem(localTokenKey),
    setTokenConfig: (config: {
      toLoginMethod: () => void;
      localTokenKey: string;
    }) => {
      toLogin = config.toLoginMethod;
      localTokenKey = config.localTokenKey;
      token = localStorage.getItem(localTokenKey) || '';
    },
    toLogin () {
      toLogin();
    },
  };
})();

const discreteMessage = createDiscreteApi(['message'], {
  messageProviderProps: {
    keepAliveOnHover: true,
  },
}).message;
/**
 * 根据后端接口返回的数据格式， 提供一个高阶函数， 这个高阶函数接收
 * 的两个参数是两个函数， 分别是successFn、 failedFn。
 *
 * 返回值函数如果接收到的errNo为0时， 执行successFn函数， 否则执行failedFn。
 * @param successFn 接口返回数据的errNo为0时， 该函数会被调用。
 * @param failedFn 接口返回数据的errNo不为0时， 该函数会被调用。
 * @author jiangyantao@zuoyebang.com
 */
export function withResponseType<D, R1, R2> (
  successFn: (x: TikuServer.ResponseType<D>) => R1,
  failedFn: (x: TikuServer.ResponseType<D>) => R2
) {

  return function (zybResponse: TikuServer.ResponseType<D>) {

    return zybResponse.errNo === 0 ? successFn(zybResponse) : failedFn(zybResponse);
  };
}



export const request = ky.extend({
  prefixUrl: '/api',
  hooks: {
    beforeRequest: [
      async (request, options) => {
        // const auth = await getAuth()
        // if (auth == null) return
        // request.headers.set('Authorization', auth)
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // if (response.status !== 401) return
        // // refresh token if 401
        // const auth = await refreshAuth()
        // if (auth == null) return
        // request.headers.set('Authorization', auth)
        // return await ky(request, options)
      }
    ]
  }
});

export function requestOptionsFactory (option: KyOptions & { method: NonNullable<KyOptions['method']>; }) {


  return function<Req extends object | null, Res extends object | null> (url: string): Req extends null
    ? () => Promise<TikuServer.ResponseType<Res>>
    : (reqBody: Req) => Promise<TikuServer.ResponseType<Res>>
  {

    return function (reqBody?: Req) {
      return request(
        url,
        {
          headers: {
            'content-type':'application/json',
            Authorization: 'Bearer ' + tokens.getToken(),
          },
          ...option,
          ...option.method === 'post' ? { body: JSON.stringify(reqBody), } : {},
        },
      ).then((res) => res.json()).then((res) => {
        if (res.errNo === 401) {
          tokens.toLogin();
          return Promise.reject(res);
        } else if (res.errNo !== 0) {
          // 其他逻辑
          return Promise.reject(res);
        }
        return res;
      }).catch((err) => {
        console.warn(err);
        if (err?.errNo) {
          if (err?.errNo !== 401) {
            discreteMessage.error(err.errMsg || '服务器错误');
          }
        } else {
          discreteMessage.error('服务器错误::' + err?.toString());
        }
        return Promise.reject(err);
      });
    } as (Req extends null
      ? () => Promise<TikuServer.ResponseType<Res>>
      : (reqBody: Req) => Promise<TikuServer.ResponseType<Res>>);
  }
}

/**
 * ```tsx
 * const apiIndex = requestGetFactory<null, { msg: 'heloworld' }>('index')
 * apiIndex().then(x => console.log(x)); // -> TikuServer.ResponseType<{ msg: 'heloworld' }>;
 * 
 * const apiLogin = requestGetFactory<{ uname: string; pwd: string; }, { msg: 'heloworld' }>('login')
 * apiLogin({ uname: '111', pwd: '222', }).then(x => console.log(x)); // -> TikuServer.ResponseType<{ msg: 'heloworld' }>;
 * ```
 */
export const requestGetFactory = requestOptionsFactory({ method: 'get' });
export const requestPostFactory = requestOptionsFactory({ method: 'post' });
