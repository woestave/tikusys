import { Tables } from '#/mysql/tables';
import { routePOST } from '#/routes/route';
import { ERR_CODES, ERR_MESSAGES, getResponseStruct } from '#/utils/response-struct';
import { responseStructPresets } from '#/utils/response-struct';

export default routePOST<API__Teacher.RemoveReq, API__Teacher.RemoveRes>((context) => {
  const body = context.request.body;

  if (typeof body.id !== 'number' || body.id === 0) {
    return responseStructPresets.reqBodyError;
  }


  return Tables
    .Teacher
    .delete()
    .where(Tables.Teacher.getFieldName('teacherId'), '=', body.id)
    .exec()
    .then((res) => ({
      succ: res.affectedRows,
    }));
});
