import ky from 'ky'
import { get, set, remove } from './storage'

interface TokenResult {
  token_type: string
  access_token: string
  refresh_token: string
  expires_in: number
}

interface Token {
  type: string
  access: string
  refresh: string
  expires: number
}

const prefixUrl = import.meta.env.VITE_API_BASE as string

let task: Promise<string | undefined> | null = null

const createTask = async (): Promise<string | undefined> => {
  return Promise.resolve('');
  // try {
  //   // console.log('token refreshing')
  //   const token = get<Token>('token')
  //   if (token?.refresh == null) throw new Error('no refresh_token available')
  //   const options = { prefixUrl, method: 'post', json: { grant_type: 'refresh_token', refresh_token: token.refresh } }
  //   // eslint-disable-next-line @typescript-eslint/naming-convention
  //   const { token_type, access_token, refresh_token, expires_in } = await ky('auth/token', options).json<TokenResult>()
  //   // console.log('settoken1-' +  Date.now() + expires_in * 1000);
  //   set('token', { type: token_type, access: access_token, refresh: refresh_token, expires: Date.now() + expires_in * 1000 })
  //   return `${token_type} ${access_token}`
  // } catch {
  //   remove('token')
  //   await router.replace({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  // } finally {
  //   // console.log('refresh end')
  //   task = null
  // }
}

export const refreshAuth = async (): Promise<string | undefined> => {
  // avoid multiple refresh
  return await (task ?? (task = createTask()))
}

export const getAuth = async (): Promise<string | undefined> => {
  const token = get<Token>('token')
  if (token == null) return
  if (token.expires > Date.now()) return `${token.type} ${token.access}`
  return await refreshAuth()
}

// authorize
export const authenticate = async (username: string, password: string): Promise<Token> => {
  const options = { prefixUrl, method: 'post', json: { grant_type: 'password', username, password } }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { token_type, access_token, refresh_token, expires_in } = await ky('auth/token', options).json<TokenResult>()
  const token = {
    type: token_type,
    access: access_token,
    refresh: refresh_token,
    expires: Date.now() + expires_in * 1000
  }
  // console.log('settoken2-' +  token.expires);
  set('token', token)
  return token
}

export const revoke = async (): Promise<void> => {
  const token = get<Token>('token')
  if (token?.refresh == null) return
  await ky('auth/token', { prefixUrl, method: 'delete', json: { token: token.refresh } })
  remove('token')
}





const api = ky.extend({
  prefixUrl: import.meta.env.VITE_API_BASE as string,
  hooks: {
    beforeRequest: [
      async (request, options) => {
        const auth = await getAuth()
        if (auth == null) return
        request.headers.set('Authorization', auth)
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) return
        // refresh token if 401
        const auth = await refreshAuth()
        if (auth == null) return
        request.headers.set('Authorization', auth)
        return await ky(request, options)
      }
    ]
  }
})

export default api
