import { ERR_CODES, ERR_MESSAGES, ResponseStruct, getResponseStruct } from "../utils/response-struct";
import { RouteContext } from "./route";
import chalk from 'chalk';
import path from 'path';


function getErrorStr (err: any) {
  if (err instanceof ResponseStruct) {
    return err.errMsg;
  }
  return (err?.toString?.() || err?.message || err) || err?.toString();
  // return (err?.toString?.() || err?.message || err)?.split('Require stack:')?.[0] || err?.toString();
}


export function createRouter (config = {
  rootPath: '/api',
}) {

  return function (ctx: RouteContext, next: () => Promise<any>) {
    if (!ctx.path.startsWith(config.rootPath || '/api')) {
      return next();
    }

    // const sendBody = (function () {
    //   let sended = false;
    //   return function (body: any) {
    //     if (!sended) {
    //       ctx.body = body;
    //       sended = true;
    //     }
    //   };
    // })();
    function sendBody (body: any, status = 200) {
      ctx.status = status;
      ctx.body = body;
    }

    return import(path.resolve(__dirname, '../' + ctx.path))
      .then((res) => {
        if (!res.default || typeof res.default !== 'function') {
          sendBody(getResponseStruct(ERR_CODES.fatal, ERR_MESSAGES.apiNotAFunction, null), 500);
        } else {
          return Promise
            .resolve(new Promise((resolve, reject) => {
              try {
                resolve(res.default(ctx, next));
              } catch (e) {
                reject(e);
              }
            }))
            .then((res) => {
              // if (!res) {
              //   return sendBody(getResponseStruct(ERR_CODES.canNotEmpty, ERR_MESSAGES.canNotEmpty, null));
              // }

              sendBody(getResponseStruct(ERR_CODES.noError, 'success', res || null));
            })
            .catch((err) => {
              const errStr = getErrorStr(err);
              console.error(chalk.yellow('create-router::exec-err', errStr));
              sendBody(getResponseStruct(ERR_CODES.fatal, errStr, null), /**500*/ 200);
            });
        }
      })
      .catch((err) => {
        const errStr = getErrorStr(err);
        console.error(chalk.red('create-router::import-err', errStr));
        sendBody(getResponseStruct(ERR_CODES.fatal, errStr, null), 500);
      });
  }
}