import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { JWT_SECRET_TIKUSYS } from '#/utils/jwt';
import { crypto_md5 } from '#/utils/md5';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { CONST_COMMON } from 'common-packages/constants/common';
import jwt from 'jsonwebtoken';

// export default routePOST<API__Examsys__User.LoginReq, API__Examsys__User.LoginRes>((context) => {
  
// });
