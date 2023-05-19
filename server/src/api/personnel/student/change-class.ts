import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { objOf } from 'ramda';

export default routePOST<API__Student.ChangeClassReq, API__Student.ChangeClassRes>((context) => {
  const body = context.request.body;

  if (typeof body.studentId !== 'number' || typeof body.targetClassId !== 'number') {
    return getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null);
  }

  return Tables
    .Student
    .update({ studentClass: body.targetClassId, })
    .where(Tables.Student.getTableFieldName('studentId'), '=', body.studentId)
    .exec()
    .then((res) => ({ succ: 1, }));
});
