import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { JWT_SECRET_TIKUSYS } from '#/utils/jwt';
import { crypto_md5 } from '#/utils/md5';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { CONST_COMMON } from 'common-packages/constants/common';
import jwt from 'jsonwebtoken';

export default routePOST<API__Teacher.LoginReq, API__Teacher.LoginRes>((context) => {
  const body = context.request.body;

  return Tables
    .Teacher
    .select()
    .where(Tables.Teacher.getFieldName('teacherName'), '=', body.username)
    .where(Tables.Teacher.getFieldName('teacherPwd'), '=', crypto_md5(body.password))
    .where(Tables.Teacher.getFieldName('teacherStatus'), '=', 0)
    .exec()
    .then((res) => {
      if (res.length === 1) {
        const temp = res[0];
        const userInfo: API__Teacher.GetUserInfoRes['userInfo'] = {
          teacherId: temp.teacherId,
          teacherName: temp.teacherName,
          teacherStatus: temp.teacherStatus,
          teacherClass: temp.teacherClass,
          teacherCreateTime: temp.teacherCreateTime,
          taecherRole: temp.teacherRole,
        };
        const token = jwt.sign(userInfo, JWT_SECRET_TIKUSYS, { expiresIn: '3d', });
        return {
          succ: 1,
          token,
        };
      }
      return getResponseStruct(ERR_CODES.loginIncorrect, ERR_MESSAGES.loginIncorrect, null);
    });
});
