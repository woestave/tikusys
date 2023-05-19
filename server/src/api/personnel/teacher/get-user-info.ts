import { routePOST } from '#/routes/route';
import { JWT_SECRET_TIKUSYS } from '#/utils/jwt';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { CONST_COMMON } from 'common-packages/constants/common';
import jwt from 'jsonwebtoken';

export default routePOST<{}, API__Examsys__User.GetUserInfoRes>((context) => {
  const authorization = context.request.header.authorization;
  const token = authorization?.split(' ')[1];
  if (!token) {
    return getResponseStruct(ERR_CODES.permissionDenied, ERR_MESSAGES.permissionDenied, null);
  }
  const jwtResult = jwt.verify(token, JWT_SECRET_TIKUSYS);

  return {
    token,
    userInfo: jwtResult as API__Examsys__User.GetUserInfoRes['userInfo'],
  };
});
