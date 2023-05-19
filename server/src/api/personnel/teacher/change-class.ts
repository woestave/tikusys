import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { objOf } from 'ramda';

export default routePOST<API__Teacher.ChangeClassReq, API__Teacher.ChangeClassRes>((context) => {
  const body = context.request.body;

  if (typeof body.teacherId !== 'number' || typeof body.targetClassId !== 'number') {
    return getResponseStruct(ERR_CODES.reqBodyError, ERR_MESSAGES.reqBodyError, null);
  }

  return Tables
    .Teacher
    .update({ teacherClass: body.targetClassId, })
    .where(Tables.Teacher.getFieldName('teacherId'), '=', body.teacherId)
    .exec()
    .then((res) => ({ succ: 1, }));
});
