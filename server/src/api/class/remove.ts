import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { responseStructPresets } from '#/utils/response-struct';

export default routePOST<API__Class.RemoveReq, API__Class.RemoveRes>((context) => {
  const body = context.request.body;

  if (typeof body.id !== 'number' || body.id === 0) {
    return responseStructPresets.reqBodyError;
  }

  const condition = Tables
    .Student
    .select(Tables.Student.getFieldName('studentName'))
    .where(Tables.Student.getFieldName('studentClass'), '=', body.id)
    .exec()
    .then((students) => {
      if (students.length) {
        return Promise.reject(getResponseStruct(ERR_CODES.classHasStudentCannotDelete, ERR_MESSAGES.classHasStudentCannotDelete, null));
      }
    });

  return condition.then(() => {
    return Tables
      .Class
      .delete()
      .where(Tables.Class.getFieldName('id'), '=', body.id)
      .exec()
      .then((res) => ({
        succ: res.affectedRows,
      }));
  });
});
