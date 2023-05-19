import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { TeacherRole } from 'common-packages/constants/teacher-role';
import { objOf } from 'ramda';

export default routePOST<API__Teacher.ChangeRoleReq, API__Teacher.ChangeRoleRes>((context) => {
  const body = context.request.body;

  if (typeof body.teacherId !== 'number' || typeof body.targetRoleId !== 'number') {
    return getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null);
  }

  return Tables
    .Teacher
    .update({ teacherRole: body.targetRoleId, ...(body.targetRoleId === TeacherRole.teacher ? {} : { teacherClass: null, }) })
    .where(Tables.Teacher.getFieldName('teacherId'), '=', body.teacherId)
    .exec()
    .then((res) => ({ succ: 1, }));
});
