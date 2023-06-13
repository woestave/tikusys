import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { JWT_SECRET_TIKUSYS } from '#/utils/jwt';
import { crypto_md5 } from '#/utils/md5';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { CONST_COMMON } from 'common-packages/constants/common';
import jwt from 'jsonwebtoken';

export default routePOST<API__Examsys__User.UpdatePasswordReq, API__Examsys__User.UpdatePasswordRes>((context) => {
  const userInfo = context.state.user as API__Examsys__User.GetUserInfoRes['userInfo'];
  const body = context.request.body;

  return Tables
    .Student
    .select()
    .where(Tables.Student.getFieldName('studentId'), '=', userInfo.studentId)
    .exec()
    .then(([me]) => {
      return Tables
        .Student
        .update({
          studentPwd: crypto_md5(me.studentIdCard),
        })
        .where(Tables.Student.getFieldName('studentId'), '=', userInfo.studentId)
        // .where(Tables.Student.getFieldName('studentPwd'), '=', crypto_md5(body.oldPwd))
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
});

