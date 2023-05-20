import Koa from 'koa';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from './response-struct';

export function status401 (context: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>, next: Koa.Next) {
  return next().catch(err => {
    if (err.status === 401) {
      context.body = getResponseStruct(ERR_CODES.permissionDenied, ERR_MESSAGES.permissionDenied, null);
    } else {
      throw err;
    }
  });
}

export const JWT_SECRET_EXAMSYS = 'examsys-secret-examsys';
export const JWT_SECRET_TIKUSYS = 'examsys-secret-tikusys';
export const JWT_SECRETS = [JWT_SECRET_EXAMSYS, JWT_SECRET_TIKUSYS];


export const jwtUnless = [
  /\/examsys\/login/,
  /\/personnel\/teacher\/login/,
  /\/shell\/*/,
  // /\/examsys\/get-user-info/,
];
