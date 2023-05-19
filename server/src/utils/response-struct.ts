import chalk from 'chalk';

function createGenCode (start: number) {
  let __start = start;

  return function () {
    return __start++;
  };
}

const genReqErrorCode = createGenCode(20000);
const genLoginErrorCode = createGenCode(80000);

export const ERR_CODES = {
  noError: 0,
  permissionDenied: 401,
  notFound: 404,
  forbidden: 403,
  canNotEmpty: 100078,
  fatal: 500,
  loginIncorrect: genLoginErrorCode(),
  reqBodyError: genReqErrorCode(),
} as const;


const codes = Object.values(ERR_CODES);
const dup = codes.find((x, i) => codes.some((sx, si) => i !== si && sx === x));
if (dup) {
  setTimeout(() => {
    throw Error(chalk.bgRed(`ERR_CODE::The code \`${dup}\` is duplicated.`));
  });
}

export const ERR_MESSAGES = {
  apiNotFound: 'api url not found.',
  apiNotAFunction: `api path is not a function`,
  canNotEmpty: 'The \`response body\` cannot be empty.',
  reqBodyError: '参数校验不通过',
  permissionDenied: 'Permission denied',
  loginIncorrect: '用户名或密码错误',
} as const;



export class ResponseStruct<D> implements TikuServer.ResponseType<D> {
  public constructor (
    public errNo: typeof ERR_CODES[keyof typeof ERR_CODES],
    public errMsg: string,
    public data: D,
  ) {
    if (data instanceof ResponseStruct) {
      this.errNo = data.errNo;
      this.errMsg = data.errMsg;
      this.data = data.data;
    }
  }
}




export function getResponseStruct <D>(
  errNo: typeof ERR_CODES[keyof typeof ERR_CODES],
  errMsg: string,
  data: D,
): ResponseStruct<D> {
  return new ResponseStruct(errNo, errMsg, data);
}



export const responseStructPresets = {
  permissionDenied: getResponseStruct(ERR_CODES.permissionDenied, ERR_MESSAGES.permissionDenied, null),
  reqBodyError: getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null),
} as const;
