import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { JWT_SECRET_TIKUSYS } from '#/utils/jwt';
import { crypto_md5 } from '#/utils/md5';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { CONST_COMMON } from 'common-packages/constants/common';
import jwt from 'jsonwebtoken';

export default routePOST<API__Examsys__User.LoginReq, API__Examsys__User.LoginRes>((context) => {
  const body = context.request.body;
  return Tables
    .Student
    .select()
    .where(Tables.Student.getFieldName('studentName'), '=', body.username)
    .where(Tables.Student.getFieldName('studentPwd'), '=', crypto_md5(body.password))
    .where(Tables.Student.getFieldName('studentStatus'), '=', 0)
    .exec()
    .then((res) => {
      if (res.length === 1) {
        const temp = res[0];
        const userInfo: API__Examsys__User.GetUserInfoRes['userInfo'] = {
          studentId: temp.studentId,
          studentName: temp.studentName,
          studentStatus: temp.studentStatus,
          studentClass: temp.studentClass,
          studentCreateTime: temp.studentCreateTime,
        };
        const token = jwt.sign(userInfo, JWT_SECRET_TIKUSYS, { expiresIn: '2d', });
        return {
          succ: 1,
          token,
        };
      }
      return getResponseStruct(ERR_CODES.loginIncorrect, ERR_MESSAGES.loginIncorrect, null);
    });
});
