import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { JWT_SECRET_TIKUSYS } from '#/utils/jwt';
import { crypto_md5 } from '#/utils/md5';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { CONST_COMMON } from 'common-packages/constants/common';
import jwt from 'jsonwebtoken';

export default routePOST<API__Teacher.TeacherUpdatePasswordReq, API__Teacher.TeacherUpdatePasswordRes>((context) => {
  const userInfo = context.state.user as API__Teacher.GetUserInfoRes['userInfo'];
  const body = context.request.body;


  return Tables
    .Teacher
    .update({
      teacherPwd: crypto_md5(body.newPwd),
    })
    .where(Tables.Teacher.getFieldName('teacherId'), '=', userInfo.teacherId)
    .where(Tables.Teacher.getFieldName('teacherPwd'), '=', crypto_md5(body.oldPwd))
    .exec()
    .then((res) => {
      if (res.affectedRows === 1) {
        return {
          succ: 1,
        };
      }
      return getResponseStruct(ERR_CODES.oldPwdWrong, ERR_MESSAGES.oldPwdWrong, null);
    });
});

